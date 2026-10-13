namespace SimbianSystems.Server.Application.Interfaces;

public interface IAuditService
{
    Task LogAsync(string entity, string? entityId, string action, string? details = null, CancellationToken cancellationToken = default);
}
