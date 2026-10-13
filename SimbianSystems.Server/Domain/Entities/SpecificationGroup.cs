using System.ComponentModel.DataAnnotations;

namespace SimbianSystems.Server.Domain.Entities;

public class SpecificationGroup
{
    [Key]
    public int Id { get; set; }

    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public int DisplayOrder { get; set; }

    public bool IsActive { get; set; } = true;

    public ICollection<SpecificationDefinition> Definitions { get; set; } = new List<SpecificationDefinition>();
}
