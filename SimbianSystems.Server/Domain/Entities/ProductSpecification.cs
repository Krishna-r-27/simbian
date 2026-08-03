using System.ComponentModel.DataAnnotations;

namespace SimbianSystems.Server.Domain.Entities;

public class ProductSpecification
{
    [Key]
    public int Id { get; set; }

    public int ProductId { get; set; }

    public Product Product { get; set; } = null!;

    public int SpecificationDefinitionId { get; set; }

    public SpecificationDefinition SpecificationDefinition { get; set; } = null!;

    public string? Value { get; set; }
}
