using System.ComponentModel.DataAnnotations;

namespace SimbianSystems.Server.Domain.Entities;

public class AuditLog
{
    [Key]
    public int Id { get; set; }

    public int? UserId { get; set; }

    [MaxLength(100)]
    public string? Username { get; set; }

    [MaxLength(100)]
    public string Entity { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? EntityId { get; set; }

    [MaxLength(50)]
    public string Action { get; set; } = string.Empty;

    public string? Details { get; set; }

    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
}
