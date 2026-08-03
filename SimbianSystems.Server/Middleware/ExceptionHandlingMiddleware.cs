using System.Collections.Concurrent;
using FluentValidation;
using SimbianSystems.Server.Application.Common;
using SimbianSystems.Server.Application.Interfaces;
using SimbianSystems.Server.Domain.Entities;

namespace SimbianSystems.Server.Middleware;

public sealed class ExceptionHandlingMiddleware(
    RequestDelegate next,
    ILogger<ExceptionHandlingMiddleware> logger,
    IServiceScopeFactory scopeFactory)
{
    private static readonly ConcurrentDictionary<string, DateTime> LastAlertByKey = new();
    private static readonly TimeSpan AlertCooldown = TimeSpan.FromMinutes(5);

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (AppException ex)
        {
            await Write(context, ex.StatusCode, ex.Message);
        }
        catch (ValidationException ex)
        {
            var errors = ex.Errors
                .GroupBy(x => x.PropertyName)
                .ToDictionary(x => x.Key, x => x.Select(y => y.ErrorMessage).ToArray());
            await Write(context, StatusCodes.Status400BadRequest, "Validation failed.", errors);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception for {Method} {Path}", context.Request.Method, context.Request.Path);
            await PersistAndMaybeEmailAsync(context, ex);
            await Write(context, StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
        }
    }

    private async Task PersistAndMaybeEmailAsync(HttpContext context, Exception ex)
    {
        var emailSent = false;

        try
        {
            await using var scope = scopeFactory.CreateAsyncScope();
            var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
            var uow = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
            var currentUser = scope.ServiceProvider.GetService<ICurrentUserService>();
            var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();

            var requestMethod = context.Request.Method;
            var requestPath = context.Request.Path.Value;
            var queryString = context.Request.QueryString.HasValue ? context.Request.QueryString.Value : null;
            var userId = currentUser?.UserId;
            var userEmail = currentUser?.Email;
            var ipAddress = currentUser?.IpAddress ?? context.Connection.RemoteIpAddress?.ToString();
            var environment = configuration["ASPNETCORE_ENVIRONMENT"]
                ?? Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")
                ?? "Unknown";

            var shouldEmail = ShouldSendEmailAlert(ex, requestPath);
            if (shouldEmail)
            {
                try
                {
                    emailSent = await emailService.SendExceptionAlertAsync(
                        ex,
                        requestMethod,
                        requestPath,
                        queryString,
                        userId,
                        userEmail,
                        ipAddress,
                        context.RequestAborted);
                }
                catch (Exception notifyEx)
                {
                    logger.LogError(notifyEx, "Failed to send exception notification email");
                }
            }

            var inner = ex.InnerException;
            await uow.ExceptionLogs.AddAsync(new ExceptionLog
            {
                Environment = environment,
                ExceptionType = ex.GetType().FullName ?? ex.GetType().Name,
                Message = ex.Message,
                StackTrace = ex.ToString(),
                InnerException = inner is null ? null : $"{inner.GetType().FullName}: {inner.Message}\n{inner}",
                RequestMethod = requestMethod,
                RequestPath = requestPath,
                QueryString = queryString,
                UserId = userId,
                UserEmail = userEmail,
                IpAddress = ipAddress,
                EmailSent = emailSent,
                CreatedOn = DateTime.UtcNow
            }, context.RequestAborted);

            await uow.SaveChangesAsync(context.RequestAborted);
        }
        catch (Exception persistEx)
        {
            logger.LogError(persistEx, "Failed to persist exception log / send notification");
        }
    }

    private bool ShouldSendEmailAlert(Exception ex, string? requestPath)
    {
        var key = $"{ex.GetType().FullName}|{ex.Message}|{requestPath}";
        var now = DateTime.UtcNow;
        if (LastAlertByKey.TryGetValue(key, out var last) && now - last < AlertCooldown)
        {
            logger.LogDebug("Skipping duplicate exception alert within cooldown for {Key}", key);
            return false;
        }

        LastAlertByKey[key] = now;
        CleanupStaleAlertKeys(now);
        return true;
    }

    private static void CleanupStaleAlertKeys(DateTime now)
    {
        if (LastAlertByKey.Count < 200)
            return;

        foreach (var pair in LastAlertByKey)
        {
            if (now - pair.Value > AlertCooldown)
                LastAlertByKey.TryRemove(pair.Key, out _);
        }
    }

    private static async Task Write(
        HttpContext context,
        int status,
        string message,
        Dictionary<string, string[]>? errors = null)
    {
        if (context.Response.HasStarted)
            return;

        context.Response.StatusCode = status;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(ApiResponse.Fail(message, errors));
    }
}
