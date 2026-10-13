using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SimbianSystems.Server.Domain.Entities;

public class Admin
{
    [Key]
    public int Id { get; set; }

    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(255)]
    public string PasswordHash { get; set; } = string.Empty;

    [MaxLength(255)]
    public string? ResetToken { get; set; }

    public DateTime? ResetTokenExpires { get; set; }

    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedOn { get; set; }

    [NotMapped]
    public string DisplayName =>
        !string.IsNullOrWhiteSpace(Username) ? Username : Email;
}
