using System.ComponentModel.DataAnnotations;

namespace SimbianSystems.Server.Domain.Entities;

public class ProductGalleryImage
{
    [Key]
    public int Id { get; set; }

    public int ProductId { get; set; }

    public Product Product { get; set; } = null!;

    [MaxLength(500)]
    public string ImageBasePath { get; set; } = string.Empty;

    public int DisplayOrder { get; set; }
}
