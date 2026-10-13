using System.ComponentModel.DataAnnotations;

namespace SimbianSystems.Server.Domain.Entities;

public class Product
{
    [Key]
    public int Id { get; set; }

    public int CategoryId { get; set; }

    public Category Category { get; set; } = null!;

    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(220)]
    public string Slug { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string? ShortDescription { get; set; }

    public string? Description { get; set; }

    [MaxLength(500)]
    public string? FeaturedImage { get; set; }

    [MaxLength(500)]
    public string? Brochure { get; set; }

    [MaxLength(100)]
    public string? Brand { get; set; }

    [MaxLength(100)]
    public string? ModelNumber { get; set; }

    [MaxLength(100)]
    public string? Warranty { get; set; }

    public int DisplayOrder { get; set; }

    public bool IsPublished { get; set; }

    [MaxLength(200)]
    public string? SeoTitle { get; set; }

    [MaxLength(500)]
    public string? SeoKeywords { get; set; }

    [MaxLength(500)]
    public string? SeoDescription { get; set; }

    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedOn { get; set; }

    public ICollection<ProductGalleryImage> GalleryImages { get; set; } = new List<ProductGalleryImage>();
    public ICollection<ProductSpecification> Specifications { get; set; } = new List<ProductSpecification>();
    public ICollection<ProductQuote> Quotes { get; set; } = new List<ProductQuote>();
}
