using Microsoft.EntityFrameworkCore;
using SimbianSystems.Server.Application.Common;
using SimbianSystems.Server.Application.DTOs.Enquiries;
using SimbianSystems.Server.Application.Interfaces;
using SimbianSystems.Server.Application.Interfaces.Services;
using SimbianSystems.Server.Domain.Entities;
using SimbianSystems.Server.Domain.Enums;
using SimbianSystems.Server.Persistence.Context;

namespace SimbianSystems.Server.Application.Services;

public class EnquiryService : IEnquiryService
{
    private readonly AppDbContext _db;
    private readonly IExportService _exports;
    private readonly IAuditService _audit;

    public EnquiryService(AppDbContext db, IExportService exports, IAuditService audit)
    {
        _db = db;
        _exports = exports;
        _audit = audit;
    }

    public async Task<PagedResult<EnquiryListItemDto>> GetPagedAsync(PaginationQuery query, CancellationToken ct = default)
    {
        var q = _db.Enquiries.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var s = query.Search.Trim();
            q = q.Where(x => x.Name.Contains(s) || x.Email.Contains(s) || (x.CompanyName ?? "").Contains(s) || x.Phone.Contains(s));
        }

        if (query.Filters != null && query.Filters.TryGetValue("status", out var status) &&
            Enum.TryParse<EnquiryStatus>(status, true, out var st))
        {
            q = q.Where(x => x.Status == st);
        }

        q = q.OrderByDescending(x => x.CreatedOn);
        var total = await q.CountAsync(ct);
        var items = await q.Skip((query.Page - 1) * query.PageSize).Take(query.PageSize)
            .Select(x => Map(x)).ToListAsync(ct);
        return PagedResult<EnquiryListItemDto>.Create(items, query.Page, query.PageSize, total);
    }

    public async Task<EnquiryListItemDto> GetAsync(int id, CancellationToken ct = default)
    {
        var e = await _db.Enquiries.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, ct)
            ?? throw AppException.NotFound("Enquiry not found.");
        return Map(e);
    }

    public async Task<EnquiryListItemDto> CreateAsync(EnquiryCreateDto dto, CancellationToken ct = default)
    {
        var entity = new Enquiry
        {
            Name = dto.Name.Trim(),
            CompanyName = dto.CompanyName?.Trim(),
            Phone = dto.Phone.Trim(),
            Email = dto.Email.Trim(),
            ServiceRequired = dto.ServiceRequired?.Trim(),
            Message = dto.Message,
            Status = EnquiryStatus.Unread,
            CreatedOn = DateTime.UtcNow
        };
        _db.Enquiries.Add(entity);
        await _db.SaveChangesAsync(ct);
        return Map(entity);
    }

    public async Task UpdateStatusAsync(int id, EnquiryStatusUpdateDto dto, CancellationToken ct = default)
    {
        var e = await _db.Enquiries.FirstOrDefaultAsync(x => x.Id == id, ct)
            ?? throw AppException.NotFound("Enquiry not found.");
        e.Status = dto.Status;
        await _db.SaveChangesAsync(ct);
        await _audit.LogAsync("Enquiry", id.ToString(), "Status", dto.Status.ToString(), ct);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var e = await _db.Enquiries.FirstOrDefaultAsync(x => x.Id == id, ct)
            ?? throw AppException.NotFound("Enquiry not found.");
        _db.Enquiries.Remove(e);
        await _db.SaveChangesAsync(ct);
        await _audit.LogAsync("Enquiry", id.ToString(), "Delete", e.Email, ct);
    }

    public async Task BulkDeleteAsync(IEnumerable<int> ids, CancellationToken ct = default)
    {
        var list = await _db.Enquiries.Where(x => ids.Contains(x.Id)).ToListAsync(ct);
        _db.Enquiries.RemoveRange(list);
        await _db.SaveChangesAsync(ct);
    }

    public async Task<byte[]> ExportAsync(bool excel, CancellationToken ct = default)
    {
        var data = await _db.Enquiries.AsNoTracking().OrderByDescending(x => x.CreatedOn).Select(x => Map(x)).ToListAsync(ct);
        var cols = new (string, Func<EnquiryListItemDto, object?>)[]
        {
            ("Name", x => x.Name),
            ("Company", x => x.CompanyName),
            ("Phone", x => x.Phone),
            ("Email", x => x.Email),
            ("Service", x => x.ServiceRequired),
            ("Status", x => x.Status),
            ("Created", x => x.CreatedOn)
        };
        return excel ? _exports.ExportToExcel(data, cols, "Enquiries") : _exports.ExportToCsv(data, cols);
    }

    private static EnquiryListItemDto Map(Enquiry x) => new()
    {
        Id = x.Id,
        Name = x.Name,
        CompanyName = x.CompanyName,
        Phone = x.Phone,
        Email = x.Email,
        ServiceRequired = x.ServiceRequired,
        Message = x.Message,
        Status = x.Status,
        CreatedOn = x.CreatedOn
    };
}
