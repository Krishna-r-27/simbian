using SimbianSystems.Server.Domain.Enums;

namespace SimbianSystems.Server.Application.DTOs.Products;

public class ProductListItemDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string? Brand { get; set; }
    public string? ModelNumber { get; set; }
    public string? FeaturedImage { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsPublished { get; set; }
    public DateTime CreatedOn { get; set; }
    public DateTime? UpdatedOn { get; set; }
}

public class ProductDetailDto : ProductListItemDto
{
    public string? ShortDescription { get; set; }
    public string? Description { get; set; }
    public string? Brochure { get; set; }
    public string? Warranty { get; set; }
    public string? SeoTitle { get; set; }
    public string? SeoKeywords { get; set; }
    public string? SeoDescription { get; set; }
    public List<string> GalleryImages { get; set; } = new();
    public List<ProductSpecValueDto> Specifications { get; set; } = new();
}

public class ProductSpecValueDto
{
    public int SpecificationDefinitionId { get; set; }
    public string? Value { get; set; }
    public string? DefinitionName { get; set; }
    public string? GroupName { get; set; }
    public ControlType ControlType { get; set; }
}

public class ProductUpsertDto
{
    public int CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? ShortDescription { get; set; }
    public string? Description { get; set; }
    public string? FeaturedImage { get; set; }
    public string? Brochure { get; set; }
    public string? Brand { get; set; }
    public string? ModelNumber { get; set; }
    public string? Warranty { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsPublished { get; set; }
    public string? SeoTitle { get; set; }
    public string? SeoKeywords { get; set; }
    public string? SeoDescription { get; set; }
    public List<string> GalleryImages { get; set; } = new();
    public List<ProductSpecValueDto> Specifications { get; set; } = new();
}

public class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int DisplayOrder { get; set; }
}
