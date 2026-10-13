using SimbianSystems.Server.Application.Interfaces;
using SimbianSystems.Server.Domain.Entities;

namespace SimbianSystems.Server.Infrastructure.Services;

public class AuditService : IAuditService
{
    private readonly IUnitOfWork _uow;
    private readonly ICurrentUserService _currentUser;

    public AuditService(IUnitOfWork uow, ICurrentUserService currentUser)
    {
        _uow = uow;
        _currentUser = currentUser;
    }

    public async Task LogAsync(string entity, string? entityId, string action, string? details = null, CancellationToken cancellationToken = default)
    {
        int? userId = null;
        if (int.TryParse(_currentUser.UserId, out var id))
            userId = id;

        await _uow.AuditLogs.AddAsync(new AuditLog
        {
            UserId = userId,
            Username = _currentUser.UserName,
            Entity = entity,
            EntityId = entityId,
            Action = action,
            Details = details,
            CreatedOn = DateTime.UtcNow
        }, cancellationToken);

        await _uow.SaveChangesAsync(cancellationToken);
    }
}
