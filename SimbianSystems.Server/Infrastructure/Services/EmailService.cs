using System.Net;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using SimbianSystems.Server.Application.Interfaces;

namespace SimbianSystems.Server.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendAsync(string to, string subject, string htmlBody, CancellationToken cancellationToken = default)
    {
        var settings = ReadSmtpSettings("Smtp");
        if (string.IsNullOrWhiteSpace(settings.Host))
        {
            _logger.LogWarning(
                "SMTP not configured. Email to {To} | Subject: {Subject} | Body: {Body}",
                to, subject, htmlBody);
            return;
        }

        await SendWithSettingsAsync(settings, to, subject, htmlBody, cancellationToken);
    }

    public async Task<bool> SendExceptionAlertAsync(
        Exception exception,
        string? requestMethod,
        string? requestPath,
        string? queryString,
        string? userId,
        string? userEmail,
        string? ipAddress,
        CancellationToken cancellationToken = default)
    {
        var settings = ReadSmtpSettings("ExceptionSmtp");
        if (string.IsNullOrWhiteSpace(settings.Host) || string.IsNullOrWhiteSpace(settings.Password))
        {
            _logger.LogWarning(
                "ExceptionSmtp Host/Password not configured. Skipping exception alert email.");
            return false;
        }

        var recipients = GetExceptionRecipients();
        if (recipients.Count == 0)
        {
            _logger.LogDebug("Exception notification email skipped: no recipients configured.");
            return false;
        }

        var environment = _configuration["ASPNETCORE_ENVIRONMENT"]
            ?? Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")
            ?? "Unknown";
        var siteUrl = (_configuration["App:FrontendBaseUrl"] ?? "https://www.simbiansystems.com").TrimEnd('/');
        var utcNow = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss") + " UTC";
        var subject = $"[Simbian Systems] Unhandled exception — {exception.GetType().Name}";

        var html = BuildExceptionHtml(
            exception,
            environment,
            siteUrl,
            utcNow,
            requestMethod,
            requestPath,
            queryString,
            userId,
            userEmail,
            ipAddress);

        var anySent = false;
        foreach (var to in recipients)
        {
            try
            {
                await SendWithSettingsAsync(settings, to, subject, html, cancellationToken);
                anySent = true;
            }
            catch (Exception sendEx)
            {
                _logger.LogError(sendEx, "Failed to send exception alert email to {To}", to);
            }
        }

        return anySent;
    }

    private async Task SendWithSettingsAsync(
        SmtpSettings settings,
        string to,
        string subject,
        string htmlBody,
        CancellationToken cancellationToken)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(settings.FromName, settings.FromEmail));
        message.To.Add(MailboxAddress.Parse(to));
        message.Subject = subject;
        message.Body = new BodyBuilder { HtmlBody = htmlBody }.ToMessageBody();

        var socketOptions = settings.EnableSsl
            ? SecureSocketOptions.StartTls
            : SecureSocketOptions.None;

        using var client = new SmtpClient();
        await client.ConnectAsync(settings.Host, settings.Port, socketOptions, cancellationToken);
        if (!string.IsNullOrWhiteSpace(settings.Username))
            await client.AuthenticateAsync(settings.Username, settings.Password, cancellationToken);
        await client.SendAsync(message, cancellationToken);
        await client.DisconnectAsync(true, cancellationToken);
    }

    private SmtpSettings ReadSmtpSettings(string section)
    {
        var host = _configuration[$"{section}:Host"] ?? string.Empty;
        var port = int.TryParse(_configuration[$"{section}:Port"], out var p) ? p : 587;
        var username = _configuration[$"{section}:Username"];
        var password = _configuration[$"{section}:Password"];
        var fromEmail = _configuration[$"{section}:FromEmail"]
            ?? username
            ?? "noreply@simbiansystems.com";
        var fromName = _configuration[$"{section}:FromName"] ?? "Simbian Systems";
        var enableSsl = !string.Equals(
            _configuration[$"{section}:EnableSsl"],
            "false",
            StringComparison.OrdinalIgnoreCase);

        return new SmtpSettings(host, port, username, password, fromEmail, fromName, enableSsl);
    }

    private List<string> GetExceptionRecipients()
    {
        var raw = _configuration["ExceptionSmtp:ToEmail"] ?? string.Empty;

        return raw
            .Split([',', ';'], StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Where(x => x.Contains('@', StringComparison.Ordinal))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();
    }

    private static string BuildExceptionHtml(
        Exception exception,
        string environment,
        string siteUrl,
        string utcNow,
        string? requestMethod,
        string? requestPath,
        string? queryString,
        string? userId,
        string? userEmail,
        string? ipAddress)
    {
        var sb = new StringBuilder();
        sb.Append("<html><body style='font-family:Segoe UI,Arial,sans-serif;color:#1a1a1a;'>");
        sb.Append("<h2 style='color:#b91c1c;'>Unhandled Exception</h2>");
        sb.Append("<table style='border-collapse:collapse;width:100%;max-width:720px;'>");
        AppendRow(sb, "Site", siteUrl);
        AppendRow(sb, "Environment", environment);
        AppendRow(sb, "Time (UTC)", utcNow);
        AppendRow(sb, "Request", $"{requestMethod} {requestPath}{queryString}");
        AppendRow(sb, "User", string.IsNullOrWhiteSpace(userId) && string.IsNullOrWhiteSpace(userEmail)
            ? "Anonymous"
            : $"{userEmail ?? "—"} (Id: {userId ?? "—"})");
        AppendRow(sb, "IP", ipAddress ?? "—");
        AppendRow(sb, "Exception", exception.GetType().FullName ?? exception.GetType().Name);
        AppendRow(sb, "Message", exception.Message);

        var inner = exception.InnerException;
        if (inner is not null)
        {
            AppendRow(sb, "Inner", $"{inner.GetType().Name}: {inner.Message}");
        }

        sb.Append("</table>");
        sb.Append("<h3>Stack Trace</h3>");
        sb.Append("<pre style='background:#f4f4f5;padding:12px;overflow:auto;font-size:12px;'>");
        sb.Append(WebUtility.HtmlEncode(exception.ToString()));
        sb.Append("</pre>");
        sb.Append("<p style='color:#71717a;font-size:12px;'>This alert was sent automatically by Simbian Systems API.</p>");
        sb.Append("</body></html>");
        return sb.ToString();
    }

    private static void AppendRow(StringBuilder sb, string label, string value)
    {
        sb.Append("<tr>");
        sb.Append($"<td style='padding:6px 10px;border:1px solid #e4e4e7;font-weight:600;width:140px;vertical-align:top;'>{WebUtility.HtmlEncode(label)}</td>");
        sb.Append($"<td style='padding:6px 10px;border:1px solid #e4e4e7;vertical-align:top;'>{WebUtility.HtmlEncode(value)}</td>");
        sb.Append("</tr>");
    }

    private sealed record SmtpSettings(
        string Host,
        int Port,
        string? Username,
        string? Password,
        string FromEmail,
        string FromName,
        bool EnableSsl);
}
