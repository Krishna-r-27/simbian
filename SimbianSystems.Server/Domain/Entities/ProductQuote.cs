using System.ComponentModel.DataAnnotations;
using SimbianSystems.Server.Domain.Enums;

namespace SimbianSystems.Server.Domain.Entities;

public class ProductQuote
{
    [Key]
    public int Id { get; set; }

    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(150)]
    public string? Company { get; set; }

    [MaxLength(30)]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    public int ProductId { get; set; }

    public Product Product { get; set; } = null!;

    public string? Message { get; set; }

    public int? Quantity { get; set; }

    [MaxLength(100)]
    public string? PreferredBrand { get; set; }

    [MaxLength(100)]
    public string? City { get; set; }

    [MaxLength(500)]
    public string? AttachmentPath { get; set; }

    public EnquiryStatus Status { get; set; } = EnquiryStatus.Unread;

    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
}
