using System.ComponentModel.DataAnnotations;

namespace SimbianSystems.Server.Domain.Entities;

public class ExceptionLog
{
    [Key]
    public int Id { get; set; }

    [MaxLength(50)]
    public string Environment { get; set; } = string.Empty;

    [MaxLength(300)]
    public string ExceptionType { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    public string StackTrace { get; set; } = string.Empty;

    public string? InnerException { get; set; }

    [MaxLength(10)]
    public string? RequestMethod { get; set; }

    [MaxLength(500)]
    public string? RequestPath { get; set; }

    [MaxLength(2000)]
    public string? QueryString { get; set; }

    [MaxLength(50)]
    public string? UserId { get; set; }

    [MaxLength(150)]
    public string? UserEmail { get; set; }

    [MaxLength(100)]
    public string? IpAddress { get; set; }

    public bool EmailSent { get; set; }

    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
}
