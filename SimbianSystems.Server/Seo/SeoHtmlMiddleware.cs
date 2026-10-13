using System.Text;
using System.Xml.Linq;
using SimbianSystems.Server.Application.Common;
using SimbianSystems.Server.Application.DTOs.Products;
using SimbianSystems.Server.Application.Interfaces.Services;

namespace SimbianSystems.Server.Seo;

public sealed class SeoHtmlMiddleware
{
    private readonly RequestDelegate _next;
    private readonly SeoRouteCatalog _catalog;
    private readonly IConfiguration _configuration;
    private readonly IServiceScopeFactory _scopes;
    private readonly ILogger<SeoHtmlMiddleware> _logger;

    public SeoHtmlMiddleware(
        RequestDelegate next,
        SeoRouteCatalog catalog,
        IConfiguration configuration,
        IServiceScopeFactory scopes,
        ILogger<SeoHtmlMiddleware> logger)
    {
        _next = next;
        _catalog = catalog;
        _configuration = configuration;
        _scopes = scopes;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (!HttpMethods.IsGet(context.Request.Method) && !HttpMethods.IsHead(context.Request.Method))
        {
            await _next(context);
            return;
        }

        var path = Normalize(context.Request.Path.Value);
        if (path.Contains("..", StringComparison.Ordinal) || path.Contains('\\'))
        {
            await _next(context);
            return;
        }

        if (IsSkipped(path))
        {
            await _next(context);
            return;
        }

        try
        {
            if (path.Equals("/sitemap.xml", StringComparison.OrdinalIgnoreCase))
            {
                await WriteSitemapAsync(context, context.RequestAborted);
                return;
            }

            if (HasNonHtmlExtension(path))
            {
                await _next(context);
                return;
            }

            var shell = _catalog.ReadShell();
            var routes = _catalog.Load();
            if (shell == null || routes == null)
            {
                await _next(context);
                return;
            }

            var origin = ResolveOrigin(context.Request);
            if (IsAdmin(path))
            {
                var admin = PageMetaInjector.Apply(shell, new SeoDocument(
                    "Simbian Systems Admin",
                    "Simbian Systems administration.",
                    "Simbian Systems",
                    $"{origin}{path}",
                    "",
                    "",
                    Robots: "noindex, nofollow"), ensureBody: false);
                await WriteHtmlAsync(context, 200, admin);
                return;
            }

            var catalogRoute = routes.Routes.FirstOrDefault(route =>
                string.Equals(route.Path, path, StringComparison.OrdinalIgnoreCase));
            if (catalogRoute != null)
            {
                if (catalogRoute.Path.Equals("/products", StringComparison.OrdinalIgnoreCase)
                    || catalogRoute.Path.Equals("/sitemap", StringComparison.OrdinalIgnoreCase))
                {
                    await WriteDirectoryPageAsync(context, origin, shell, routes, catalogRoute, context.RequestAborted);
                    return;
                }

                var prerendered = catalogRoute.Prerender ? _catalog.ReadPrerendered(catalogRoute.Path) : null;
                var source = prerendered ?? shell;
                var html = PageMetaInjector.Apply(source, ToDocument(catalogRoute, origin), ensureBody: prerendered == null);
                await WriteHtmlAsync(context, 200, html);
                return;
            }

            if (TryParseProductPath(path, out var categorySlug, out var productSlug))
            {
                await WriteCatalogPageAsync(context, origin, shell, routes, categorySlug, productSlug, context.RequestAborted);
                return;
            }

            await WriteNotFoundAsync(context, origin, shell, routes, path);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to write SEO HTML for {Path}", path);
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            context.Response.ContentType = "text/html; charset=utf-8";
            await context.Response.WriteAsync("The page could not be prepared.");
        }
    }

    private async Task WriteCatalogPageAsync(
        HttpContext context,
        string origin,
        string shell,
        SeoRouteFile routes,
        string categorySlug,
        string? productSlug,
        CancellationToken cancellationToken)
    {
        try
        {
            await using var scope = _scopes.CreateAsyncScope();
            var catalog = scope.ServiceProvider.GetRequiredService<IPublicCatalogService>();

            if (string.IsNullOrEmpty(productSlug))
            {
                var categories = await catalog.GetCategoriesAsync(cancellationToken);
                var category = categories.FirstOrDefault(item =>
                    string.Equals(item.Slug, categorySlug, StringComparison.OrdinalIgnoreCase));
                if (category == null)
                {
                    await WriteNotFoundAsync(context, origin, shell, routes, $"/products/{categorySlug}");
                    return;
                }

                var products = await LoadAllProductsAsync(catalog, category.Slug, cancellationToken);
                var description = string.IsNullOrWhiteSpace(category.Description)
                    ? $"Browse {category.Name} from Simbian Systems, with published models available for enterprise quote."
                    : category.Description.Trim();
                var summary = products.Count == 0
                    ? $"{description} This {category.Name} category is part of the Simbian Systems product catalog."
                    : $"{description} {products.Count} published {category.Name} models are listed below.";
                var document = new SeoDocument(
                    $"{category.Name} | Simbian Systems",
                    description,
                    $"{category.Name}, Simbian Systems, enterprise IT products",
                    $"{origin}/products/{category.Slug}",
                    category.Name,
                    summary);
                var html = PageMetaInjector.Apply(shell, document, ensureBody: true);
                html = PageMetaInjector.SetCrawlerContent(
                    html,
                    category.Name,
                    SeoCatalogHtml.GroupedProducts(summary, new List<CategoryDto> { category }, products));
                await WriteHtmlAsync(context, 200, html);
                return;
            }

            var product = await catalog.GetPublishedProductBySlugAsync(productSlug, cancellationToken);
            if (!string.Equals(product.CategorySlug, categorySlug, StringComparison.OrdinalIgnoreCase))
            {
                context.Response.Redirect($"{origin}/products/{product.CategorySlug}/{product.Slug}", permanent: true);
                return;
            }

            var title = string.IsNullOrWhiteSpace(product.SeoTitle) ? product.Name : product.SeoTitle.Trim();
            var productDescription = FirstText(
                product.SeoDescription,
                product.ShortDescription,
                PageMetaInjector.StripHtml(product.Description),
                $"Learn more about {product.Name} from Simbian Systems.");
            var brandModel = string.Join(" ", new[] { product.Brand, product.ModelNumber }.Where(part => !string.IsNullOrWhiteSpace(part)));
            var productSummary = string.IsNullOrWhiteSpace(brandModel)
                ? $"{product.Name}. {productDescription} Category: {product.CategoryName}."
                : $"{product.Name} ({brandModel}). {productDescription} Category: {product.CategoryName}.";
            var image = ToImageUrl(origin, product.FeaturedImage);
            var documentProduct = new SeoDocument(
                $"{title} | Simbian Systems",
                productDescription,
                string.IsNullOrWhiteSpace(product.SeoKeywords)
                    ? $"{product.Name}, {product.CategoryName}, Simbian Systems"
                    : product.SeoKeywords.Trim(),
                $"{origin}/products/{product.CategorySlug}/{product.Slug}",
                product.Name,
                productSummary,
                "product",
                image);
            await WriteHtmlAsync(context, 200, PageMetaInjector.Apply(shell, documentProduct, ensureBody: true));
        }
        catch (AppException ex) when (ex.StatusCode == StatusCodes.Status404NotFound)
        {
            var missing = string.IsNullOrEmpty(productSlug)
                ? $"/products/{categorySlug}"
                : $"/products/{categorySlug}/{productSlug}";
            await WriteNotFoundAsync(context, origin, shell, routes, missing);
        }
    }

    private async Task WriteSitemapAsync(HttpContext context, CancellationToken cancellationToken)
    {
        var routes = _catalog.Load();
        var origin = ResolveOrigin(context.Request);
        var locations = new List<(string Loc, DateTime? LastMod)>();
        if (routes != null)
        {
            foreach (var route in routes.Routes.Where(route => route.Sitemap))
            {
                var path = string.IsNullOrWhiteSpace(route.Path) ? "/" : route.Path;
                locations.Add(($"{origin}{(path == "/" ? "/" : path)}", null));
            }
        }

        try
        {
            await using var scope = _scopes.CreateAsyncScope();
            var catalog = scope.ServiceProvider.GetRequiredService<IPublicCatalogService>();
            var categories = await catalog.GetCategoriesAsync(cancellationToken);
            foreach (var category in categories)
                locations.Add(($"{origin}/products/{category.Slug}", null));

            var page = 1;
            while (true)
            {
                var batch = await catalog.GetPublishedProductsAsync(
                    new PaginationQuery { Page = page, PageSize = 200 },
                    null,
                    null,
                    cancellationToken);
                foreach (var product in batch.Items)
                {
                    locations.Add((
                        $"{origin}/products/{product.CategorySlug}/{product.Slug}",
                        product.UpdatedOn ?? product.CreatedOn));
                }

                if (batch.Items.Count == 0 || page >= batch.TotalPages)
                    break;
                page++;
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Sitemap product URLs were omitted because the catalog could not be read.");
        }

        var urlset = new XElement(XName.Get("urlset", "http://www.sitemaps.org/schemas/sitemap/0.9"));
        foreach (var location in locations.DistinctBy(item => item.Loc, StringComparer.OrdinalIgnoreCase))
        {
            var url = new XElement(XName.Get("url", "http://www.sitemaps.org/schemas/sitemap/0.9"),
                new XElement(XName.Get("loc", "http://www.sitemaps.org/schemas/sitemap/0.9"), location.Loc));
            if (location.LastMod.HasValue)
            {
                url.Add(new XElement(
                    XName.Get("lastmod", "http://www.sitemaps.org/schemas/sitemap/0.9"),
                    location.LastMod.Value.ToUniversalTime().ToString("yyyy-MM-dd")));
            }
            urlset.Add(url);
        }

        var document = new XDocument(new XDeclaration("1.0", "UTF-8", null), urlset);
        await using var buffer = new MemoryStream();
        document.Save(buffer);
        context.Response.StatusCode = StatusCodes.Status200OK;
        context.Response.ContentType = "application/xml; charset=utf-8";
        buffer.Position = 0;
        await buffer.CopyToAsync(context.Response.Body, cancellationToken);
    }

    private async Task WriteDirectoryPageAsync(
        HttpContext context,
        string origin,
        string shell,
        SeoRouteFile routes,
        SeoRouteEntry catalogRoute,
        CancellationToken cancellationToken)
    {
        var prerendered = catalogRoute.Prerender ? _catalog.ReadPrerendered(catalogRoute.Path) : null;
        var html = PageMetaInjector.Apply(prerendered ?? shell, ToDocument(catalogRoute, origin), ensureBody: prerendered == null);
        try
        {
            await using var scope = _scopes.CreateAsyncScope();
            var catalog = scope.ServiceProvider.GetRequiredService<IPublicCatalogService>();
            var categories = await catalog.GetCategoriesAsync(cancellationToken);
            var products = await LoadAllProductsAsync(catalog, null, cancellationToken);
            if (products.Count > 0)
            {
                var inner = catalogRoute.Path.Equals("/sitemap", StringComparison.OrdinalIgnoreCase)
                    ? SeoCatalogHtml.Sitemap(routes.Routes, categories, products)
                    : SeoCatalogHtml.GroupedProducts(catalogRoute.Summary, categories, products);
                html = PageMetaInjector.SetCrawlerContent(html, catalogRoute.Heading, inner);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Published products were omitted from {Path}", catalogRoute.Path);
        }

        await WriteHtmlAsync(context, 200, html);
    }

    private static async Task<List<ProductListItemDto>> LoadAllProductsAsync(
        IPublicCatalogService catalog,
        string? categorySlug,
        CancellationToken cancellationToken)
    {
        var all = new List<ProductListItemDto>();
        var page = 1;
        while (true)
        {
            var batch = await catalog.GetPublishedProductsAsync(
                new PaginationQuery { Page = page, PageSize = 200 },
                categorySlug,
                null,
                cancellationToken);
            all.AddRange(batch.Items);
            if (batch.Items.Count == 0 || page >= batch.TotalPages)
                break;
            page++;
        }

        return all;
    }

    private static SeoDocument ToDocument(SeoRouteEntry route, string origin)
    {
        var path = string.IsNullOrWhiteSpace(route.Path) ? "/" : route.Path;
        return new SeoDocument(
            route.Title,
            route.Description,
            route.Keywords,
            $"{origin}{(path == "/" ? "/" : path)}",
            route.Heading,
            route.Summary);
    }

    private async Task WriteNotFoundAsync(HttpContext context, string origin, string shell, SeoRouteFile routes, string path)
    {
        var missing = routes.NotFound ?? new SeoRouteEntry();
        var document = new SeoDocument(
            string.IsNullOrWhiteSpace(missing.Title) ? "Page Not Found | Simbian Systems" : missing.Title,
            missing.Description,
            missing.Keywords,
            $"{origin}{path}",
            string.IsNullOrWhiteSpace(missing.Heading) ? "Page not found" : missing.Heading,
            missing.Summary,
            Robots: "noindex");
        await WriteHtmlAsync(context, StatusCodes.Status404NotFound, PageMetaInjector.Apply(shell, document, ensureBody: true));
    }

    private string ResolveOrigin(HttpRequest request)
    {
        var configured = _configuration["App:FrontendBaseUrl"]?.Trim().TrimEnd('/');
        if (!string.IsNullOrWhiteSpace(configured)
            && Uri.TryCreate(configured, UriKind.Absolute, out var uri)
            && !uri.Host.Contains("localhost", StringComparison.OrdinalIgnoreCase)
            && uri.Host != "127.0.0.1")
        {
            return configured;
        }

        return $"{request.Scheme}://{request.Host.Value}".TrimEnd('/');
    }

    private static async Task WriteHtmlAsync(HttpContext context, int statusCode, string html)
    {
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "text/html; charset=utf-8";
        context.Response.Headers.CacheControl = "no-cache";
        await context.Response.WriteAsync(html, Encoding.UTF8);
    }

    private static string Normalize(string? path)
    {
        var value = string.IsNullOrWhiteSpace(path) ? "/" : path;
        if (value.Length > 1 && value.EndsWith('/'))
            value = value.TrimEnd('/');
        return value;
    }

    private static bool IsSkipped(string path) =>
        path.StartsWith("/api", StringComparison.OrdinalIgnoreCase)
        || path.StartsWith("/swagger", StringComparison.OrdinalIgnoreCase)
        || path.StartsWith("/uploads", StringComparison.OrdinalIgnoreCase);

    private static bool IsAdmin(string path) =>
        path.Equals("/poweradmin", StringComparison.OrdinalIgnoreCase)
        || path.StartsWith("/poweradmin/", StringComparison.OrdinalIgnoreCase)
        || path.Equals("/under-construction", StringComparison.OrdinalIgnoreCase);

    private static bool HasNonHtmlExtension(string path)
    {
        var extension = Path.GetExtension(path);
        return !string.IsNullOrEmpty(extension)
            && !extension.Equals(".html", StringComparison.OrdinalIgnoreCase);
    }

    private static bool TryParseProductPath(string path, out string categorySlug, out string? productSlug)
    {
        categorySlug = "";
        productSlug = null;
        var parts = path.Split('/', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length is < 2 or > 3 || !parts[0].Equals("products", StringComparison.OrdinalIgnoreCase))
            return false;
        categorySlug = parts[1];
        if (parts.Length == 3)
            productSlug = parts[2];
        return true;
    }

    private static string FirstText(params string?[] values)
    {
        foreach (var value in values)
        {
            var text = PageMetaInjector.StripHtml(value);
            if (!string.IsNullOrWhiteSpace(text))
                return text;
        }

        return "";
    }

    private static string? ToImageUrl(string origin, string? featured)
    {
        if (string.IsNullOrWhiteSpace(featured))
            return null;
        if (featured.StartsWith("http://", StringComparison.OrdinalIgnoreCase)
            || featured.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
            return featured;

        var imagePath = featured.StartsWith('/') ? featured : "/" + featured;
        if (!imagePath.EndsWith(".webp", StringComparison.OrdinalIgnoreCase)
            && !imagePath.EndsWith(".png", StringComparison.OrdinalIgnoreCase)
            && !imagePath.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase)
            && !imagePath.EndsWith(".jpeg", StringComparison.OrdinalIgnoreCase))
        {
            imagePath += ".webp";
        }

        return origin + imagePath;
    }
}
