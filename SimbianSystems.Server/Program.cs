using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Serilog;
using SimbianSystems.Server.Application;
using SimbianSystems.Server.Infrastructure;
using SimbianSystems.Server.Middleware;
using SimbianSystems.Server.Persistence;
using SimbianSystems.Server.Persistence.Context;
using SimbianSystems.Server.Persistence.Seed;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day)
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    // Same mail settings on localhost and production. The password stays out of git.
    builder.Configuration.AddJsonFile("appsettings.Local.json", optional: true, reloadOnChange: true);

    builder.Host.UseSerilog((context, services, configuration) => configuration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext()
        .WriteTo.Console()
        .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day));

    builder.Services.AddApplication();
    builder.Services.AddPersistence(builder.Configuration);
    builder.Services.AddInfrastructure(builder.Configuration);

    builder.Services.AddControllers(options => options.Filters.Add<ValidationFilter>())
        .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        });
    builder.Services.AddScoped<ValidationFilter>();

    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(options =>
    {
        options.SwaggerDoc("v1", new OpenApiInfo
        {
            Title = "Simbian Systems API",
            Version = "v1",
            Description = "Enterprise IT Solutions CMS API"
        });
        options.CustomSchemaIds(type => type.FullName?.Replace("+", ".") ?? type.Name);
        options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "Enter JWT Bearer token"
        });
        options.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
                },
                Array.Empty<string>()
            }
        });

        var xml = Path.Combine(AppContext.BaseDirectory, "SimbianSystems.Server.xml");
        if (File.Exists(xml))
            options.IncludeXmlComments(xml);
    });

    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowReact", policy =>
        {
            policy
                .WithOrigins(
                    "https://localhost:60679",
                    "http://localhost:5173",
                    "http://simbiansystems.com",
                    "http://www.simbiansystems.com",
                    "https://simbiansystems.com",
                    "https://www.simbiansystems.com")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
    });

    builder.Services.AddSingleton<SimbianSystems.Server.Seo.SeoRouteCatalog>();

    builder.Services.AddRateLimiter(options =>
    {
        options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
        options.AddFixedWindowLimiter("auth", opt =>
        {
            opt.Window = TimeSpan.FromMinutes(1);
            opt.PermitLimit = 20;
            opt.QueueLimit = 0;
        });
        options.AddFixedWindowLimiter("public-post", opt =>
        {
            opt.Window = TimeSpan.FromMinutes(1);
            opt.PermitLimit = 30;
            opt.QueueLimit = 0;
        });
    });

    var app = builder.Build();

    app.UseMiddleware<ExceptionHandlingMiddleware>();
    app.UseSerilogRequestLogging();
    app.UseMiddleware<SimbianSystems.Server.Seo.SeoHtmlMiddleware>();

    app.UseDefaultFiles();
    app.UseStaticFiles();

    var webRoot = app.Environment.WebRootPath ?? Path.Combine(app.Environment.ContentRootPath, "wwwroot");
    var uploadsPath = Path.Combine(webRoot, "uploads");
    Directory.CreateDirectory(uploadsPath);
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(uploadsPath),
        RequestPath = "/uploads"
    });

    var spaRoot = app.Services.GetRequiredService<SimbianSystems.Server.Seo.SeoRouteCatalog>().FindSpaRoot();
    if (spaRoot != null
        && !string.Equals(Path.GetFullPath(spaRoot), Path.GetFullPath(webRoot), StringComparison.OrdinalIgnoreCase))
    {
        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(spaRoot)
        });
    }

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();
    app.UseCors("AllowReact");
    app.UseRateLimiter();
    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers();
    app.MapFallback(async context =>
    {
        if (context.Request.Path.StartsWithSegments("/api")
            || context.Request.Path.StartsWithSegments("/swagger"))
        {
            context.Response.StatusCode = StatusCodes.Status404NotFound;
            return;
        }

        var catalog = context.RequestServices.GetRequiredService<SimbianSystems.Server.Seo.SeoRouteCatalog>();
        var shell = catalog.ReadShell();
        var routes = catalog.Load();
        context.Response.StatusCode = StatusCodes.Status404NotFound;
        context.Response.ContentType = "text/html; charset=utf-8";
        if (shell == null || routes == null)
            return;

        var configured = context.RequestServices.GetRequiredService<IConfiguration>()["App:FrontendBaseUrl"]?.Trim().TrimEnd('/');
        var origin = !string.IsNullOrWhiteSpace(configured)
            && Uri.TryCreate(configured, UriKind.Absolute, out var uri)
            && !uri.Host.Contains("localhost", StringComparison.OrdinalIgnoreCase)
            && uri.Host != "127.0.0.1"
                ? configured
                : $"{context.Request.Scheme}://{context.Request.Host.Value}".TrimEnd('/');
        var path = context.Request.Path.Value ?? "/";
        var missing = routes.NotFound;
        var html = SimbianSystems.Server.Seo.PageMetaInjector.Apply(shell, new SimbianSystems.Server.Seo.SeoDocument(
            string.IsNullOrWhiteSpace(missing.Title) ? "Page Not Found | Simbian Systems" : missing.Title,
            missing.Description,
            missing.Keywords,
            $"{origin}{path}",
            string.IsNullOrWhiteSpace(missing.Heading) ? "Page not found" : missing.Heading,
            missing.Summary,
            Robots: "noindex"), ensureBody: true);
        await context.Response.WriteAsync(html);
    });

    Console.WriteLine("Starting database migrate/seed...");
    using (var scope = app.Services.CreateScope())
    {
        try
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            await db.Database.MigrateAsync();
            await DbSeeder.SeedAsync(db);
            Console.WriteLine("Database migrate/seed completed.");
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Database migrate/seed failed. API will start without ensuring schema.");
            Console.WriteLine($"Database migrate/seed failed: {ex.Message}");
        }
    }

    Console.WriteLine("Starting web host...");
    await app.RunAsync();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    await Log.CloseAndFlushAsync();
}
