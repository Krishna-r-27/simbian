namespace SimbianSystems.Server.Application.Interfaces;

public interface IEmailService
{
    Task SendAsync(string to, string subject, string htmlBody, CancellationToken cancellationToken = default);

    /// <summary>
    /// Emails configured ExceptionSmtp recipients about an unhandled exception.
    /// Returns true when at least one email was sent successfully.
    /// No-ops (returns false) when ExceptionSmtp Host/Password or ToEmail are not configured.
    /// </summary>
    Task<bool> SendExceptionAlertAsync(
        Exception exception,
        string? requestMethod,
        string? requestPath,
        string? queryString,
        string? userId,
        string? userEmail,
        string? ipAddress,
        CancellationToken cancellationToken = default);
}
