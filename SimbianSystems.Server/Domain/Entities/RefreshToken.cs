using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SimbianSystems.Server.Domain.Entities;

public class RefreshToken
{
    [Key]
    public int Id { get; set; }

    [MaxLength(50)]
    public string UserId { get; set; } = null!;

    [MaxLength(500)]
    public string Token { get; set; } = null!;

    public DateTime ExpiresAt { get; set; }

    public DateTime CreatedAt { get; set; }

    [MaxLength(100)]
    public string? CreatedByIp { get; set; }

    public DateTime? RevokedAt { get; set; }

    [MaxLength(100)]
    public string? RevokedByIp { get; set; }

    [MaxLength(500)]
    public string? ReplacedByToken { get; set; }

    [MaxLength(250)]
    public string? ReasonRevoked { get; set; }

    [NotMapped]
    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;

    [NotMapped]
    public bool IsRevoked => RevokedAt != null;

    [NotMapped]
    public bool IsActive => !IsRevoked && !IsExpired;
}
