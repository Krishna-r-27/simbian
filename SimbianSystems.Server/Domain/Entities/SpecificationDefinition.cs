using System.ComponentModel.DataAnnotations;
using SimbianSystems.Server.Domain.Enums;

namespace SimbianSystems.Server.Domain.Entities;

public class SpecificationDefinition
{
    [Key]
    public int Id { get; set; }

    public int CategoryId { get; set; }

    public Category Category { get; set; } = null!;

    public int SpecificationGroupId { get; set; }

    public SpecificationGroup SpecificationGroup { get; set; } = null!;

    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    public int DisplayOrder { get; set; }

    public ControlType ControlType { get; set; }

    public bool IsRequired { get; set; }

    /// <summary>JSON array of options for Dropdown control type, e.g. ["8GB","16GB"].</summary>
    public string? OptionsJson { get; set; }

    public ICollection<ProductSpecification> ProductSpecifications { get; set; } = new List<ProductSpecification>();
}
