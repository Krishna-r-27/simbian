using SimbianSystems.Server.Application.Common;
using SimbianSystems.Server.Application.DTOs.Products;

namespace SimbianSystems.Server.Application.Interfaces.Services;
public interface IProductService
{
    Task<PagedResult<ProductListItemDto>> GetPagedAsync(PaginationQuery query, int? categoryId = null, bool? isPublished = null, CancellationToken ct = default);
    Task<ProductDetailDto> GetByIdAsync(int id, CancellationToken ct = default);
    Task<ProductDetailDto> CreateAsync(ProductUpsertDto dto, CancellationToken ct = default);
    Task<ProductDetailDto> UpdateAsync(int id, ProductUpsertDto dto, CancellationToken ct = default);
    Task<ProductDetailDto> ReorderGalleryAsync(int id, ProductGalleryOrderDto dto, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
    Task<ProductDetailDto> DuplicateAsync(int id, CancellationToken ct = default);
    Task BulkDeleteAsync(IEnumerable<int> ids, CancellationToken ct = default);
    Task BulkPublishAsync(IEnumerable<int> ids, bool published, CancellationToken ct = default);
    Task<List<CategoryDto>> GetCategoriesAsync(CancellationToken ct = default);
    Task<byte[]> ExportAsync(bool excel, CancellationToken ct = default);
}
