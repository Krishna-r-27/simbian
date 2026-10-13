using SimbianSystems.Server.Application.Common;
using SimbianSystems.Server.Application.DTOs.Enquiries;
namespace SimbianSystems.Server.Application.Interfaces.Services;
public interface IEnquiryService {
 Task<PagedResult<EnquiryListItemDto>> GetPagedAsync(PaginationQuery query,CancellationToken ct=default);
 Task<EnquiryListItemDto> GetAsync(int id,CancellationToken ct=default);
 Task<EnquiryListItemDto> CreateAsync(EnquiryCreateDto dto,CancellationToken ct=default);
 Task UpdateStatusAsync(int id, EnquiryStatusUpdateDto dto,CancellationToken ct=default);
 Task DeleteAsync(int id,CancellationToken ct=default); Task BulkDeleteAsync(IEnumerable<int> ids,CancellationToken ct=default);
 Task<byte[]> ExportAsync(bool excel,CancellationToken ct=default);
}
