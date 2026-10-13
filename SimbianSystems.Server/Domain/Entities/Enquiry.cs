using System.ComponentModel.DataAnnotations;
using SimbianSystems.Server.Domain.Enums;

namespace SimbianSystems.Server.Domain.Entities;

public class Enquiry
{
    [Key]
    public int Id { get; set; }

    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(150)]
    public string? CompanyName { get; set; }

    [MaxLength(30)]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(150)]
    public string? ServiceRequired { get; set; }

    public string? Message { get; set; }

    public EnquiryStatus Status { get; set; } = EnquiryStatus.Unread;

    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
}
