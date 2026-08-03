using SimbianSystems.Server.Application.Common;
using SimbianSystems.Server.Application.DTOs.Products;
namespace SimbianSystems.Server.Application.Interfaces.Services;
public interface IPublicCatalogService {
 Task<PagedResult<ProductListItemDto>> GetPublishedProductsAsync(PaginationQuery query,string? categorySlug=null,int? categoryId=null,CancellationToken ct=default);
 Task<ProductDetailDto> GetPublishedProductBySlugAsync(string slug,CancellationToken ct=default);
}
