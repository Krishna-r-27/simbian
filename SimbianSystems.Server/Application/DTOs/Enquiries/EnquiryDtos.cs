using SimbianSystems.Server.Domain.Enums;

namespace SimbianSystems.Server.Application.DTOs.Enquiries;

public class EnquiryListItemDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? CompanyName { get; set; }
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? ServiceRequired { get; set; }
    public string? Message { get; set; }
    public EnquiryStatus Status { get; set; }
    public DateTime CreatedOn { get; set; }
}

public class EnquiryCreateDto
{
    public string Name { get; set; } = string.Empty;
    public string? CompanyName { get; set; }
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? ServiceRequired { get; set; }
    public string? Message { get; set; }
}

public class EnquiryStatusUpdateDto
{
    public EnquiryStatus Status { get; set; }
}

public class ProductQuoteListItemDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Company { get; set; }
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string? Message { get; set; }
    public int? Quantity { get; set; }
    public string? PreferredBrand { get; set; }
    public string? City { get; set; }
    public string? AttachmentPath { get; set; }
    public EnquiryStatus Status { get; set; }
    public DateTime CreatedOn { get; set; }
}

public class ProductQuoteCreateDto
{
    public string Name { get; set; } = string.Empty;
    public string? Company { get; set; }
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int ProductId { get; set; }
    public string? Message { get; set; }
    public int? Quantity { get; set; }
    public string? PreferredBrand { get; set; }
    public string? City { get; set; }
    public string? AttachmentPath { get; set; }
}
