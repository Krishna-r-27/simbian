using SimbianSystems.Server.Application.Common;
using SimbianSystems.Server.Application.DTOs.Enquiries;
namespace SimbianSystems.Server.Application.Interfaces.Services;
public interface IProductQuoteService {
 Task<PagedResult<ProductQuoteListItemDto>> GetPagedAsync(PaginationQuery query,CancellationToken ct=default);
 Task<ProductQuoteListItemDto> GetAsync(int id,CancellationToken ct=default);
 Task<ProductQuoteListItemDto> CreateAsync(ProductQuoteCreateDto dto,CancellationToken ct=default);
 Task UpdateStatusAsync(int id, EnquiryStatusUpdateDto dto,CancellationToken ct=default);
 Task DeleteAsync(int id,CancellationToken ct=default); Task BulkDeleteAsync(IEnumerable<int> ids,CancellationToken ct=default);
 Task<byte[]> ExportAsync(bool excel,CancellationToken ct=default);
}
