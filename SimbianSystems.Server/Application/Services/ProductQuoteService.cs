using Microsoft.EntityFrameworkCore;
using SimbianSystems.Server.Application.Common;
using SimbianSystems.Server.Application.DTOs.Enquiries;
using SimbianSystems.Server.Application.Interfaces;
using SimbianSystems.Server.Application.Interfaces.Services;
using SimbianSystems.Server.Domain.Entities;
using SimbianSystems.Server.Domain.Enums;
using SimbianSystems.Server.Persistence.Context;

namespace SimbianSystems.Server.Application.Services;

public class ProductQuoteService : IProductQuoteService
{
    private readonly AppDbContext _db;
    private readonly IExportService _exports;
    private readonly IAuditService _audit;
    private readonly IFileStorageService _files;

    public ProductQuoteService(AppDbContext db, IExportService exports, IAuditService audit, IFileStorageService files)
    {
        _db = db;
        _exports = exports;
        _audit = audit;
        _files = files;
    }

    public async Task<PagedResult<ProductQuoteListItemDto>> GetPagedAsync(PaginationQuery query, CancellationToken ct = default)
    {
        var q = _db.ProductQuotes.AsNoTracking().Include(x => x.Product);
        IQueryable<ProductQuote> filtered = q;

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var s = query.Search.Trim();
            filtered = filtered.Where(x => x.Name.Contains(s) || x.Email.Contains(s) || x.Product.Name.Contains(s) || x.Phone.Contains(s));
        }

        if (query.Filters != null && query.Filters.TryGetValue("status", out var status) &&
            Enum.TryParse<EnquiryStatus>(status, true, out var st))
        {
            filtered = filtered.Where(x => x.Status == st);
        }

        if (query.Filters != null && query.Filters.TryGetValue("productId", out var pid) && int.TryParse(pid, out var productId))
            filtered = filtered.Where(x => x.ProductId == productId);

        filtered = filtered.OrderByDescending(x => x.CreatedOn);
        var total = await filtered.CountAsync(ct);
        var rows = await filtered.Skip((query.Page - 1) * query.PageSize).Take(query.PageSize).ToListAsync(ct);
        return PagedResult<ProductQuoteListItemDto>.Create(rows.Select(Map).ToList(), query.Page, query.PageSize, total);
    }

    public async Task<ProductQuoteListItemDto> GetAsync(int id, CancellationToken ct = default)
    {
        var e = await _db.ProductQuotes.AsNoTracking().Include(x => x.Product).FirstOrDefaultAsync(x => x.Id == id, ct)
            ?? throw AppException.NotFound("Product quote not found.");
        return Map(e);
    }

    public async Task<ProductQuoteListItemDto> CreateAsync(ProductQuoteCreateDto dto, CancellationToken ct = default)
    {
        if (!await _db.Products.AnyAsync(x => x.Id == dto.ProductId && x.IsPublished, ct))
            throw AppException.BadRequest("Invalid product.");

        var entity = new ProductQuote
        {
            Name = dto.Name.Trim(),
            Company = dto.Company?.Trim(),
            Phone = dto.Phone.Trim(),
            Email = dto.Email.Trim(),
            ProductId = dto.ProductId,
            Message = dto.Message,
            Quantity = dto.Quantity,
            PreferredBrand = dto.PreferredBrand?.Trim(),
            City = dto.City?.Trim(),
            AttachmentPath = dto.AttachmentPath,
            Status = EnquiryStatus.Unread,
            CreatedOn = DateTime.UtcNow
        };
        _db.ProductQuotes.Add(entity);
        await _db.SaveChangesAsync(ct);
        entity = await _db.ProductQuotes.Include(x => x.Product).FirstAsync(x => x.Id == entity.Id, ct);
        return Map(entity);
    }

    public async Task UpdateStatusAsync(int id, EnquiryStatusUpdateDto dto, CancellationToken ct = default)
    {
        var e = await _db.ProductQuotes.FirstOrDefaultAsync(x => x.Id == id, ct)
            ?? throw AppException.NotFound("Product quote not found.");
        e.Status = dto.Status;
        await _db.SaveChangesAsync(ct);
        await _audit.LogAsync("ProductQuote", id.ToString(), "Status", dto.Status.ToString(), ct);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var e = await _db.ProductQuotes.FirstOrDefaultAsync(x => x.Id == id, ct)
            ?? throw AppException.NotFound("Product quote not found.");
        await _files.DeleteFileAsync(e.AttachmentPath, ct);
        _db.ProductQuotes.Remove(e);
        await _db.SaveChangesAsync(ct);
        await _audit.LogAsync("ProductQuote", id.ToString(), "Delete", e.Email, ct);
    }

    public async Task BulkDeleteAsync(IEnumerable<int> ids, CancellationToken ct = default)
    {
        var list = await _db.ProductQuotes.Where(x => ids.Contains(x.Id)).ToListAsync(ct);
        foreach (var item in list)
            await _files.DeleteFileAsync(item.AttachmentPath, ct);
        _db.ProductQuotes.RemoveRange(list);
        await _db.SaveChangesAsync(ct);
    }

    public async Task<byte[]> ExportAsync(bool excel, CancellationToken ct = default)
    {
        var data = await _db.ProductQuotes.AsNoTracking().Include(x => x.Product)
            .OrderByDescending(x => x.CreatedOn).ToListAsync(ct);
        var mapped = data.Select(Map).ToList();
        var cols = new (string, Func<ProductQuoteListItemDto, object?>)[]
        {
            ("Name", x => x.Name),
            ("Company", x => x.Company),
            ("Phone", x => x.Phone),
            ("Email", x => x.Email),
            ("Product", x => x.ProductName),
            ("Qty", x => x.Quantity),
            ("City", x => x.City),
            ("Status", x => x.Status),
            ("Created", x => x.CreatedOn)
        };
        return excel ? _exports.ExportToExcel(mapped, cols, "ProductQuotes") : _exports.ExportToCsv(mapped, cols);
    }

    private static ProductQuoteListItemDto Map(ProductQuote x) => new()
    {
        Id = x.Id,
        Name = x.Name,
        Company = x.Company,
        Phone = x.Phone,
        Email = x.Email,
        ProductId = x.ProductId,
        ProductName = x.Product?.Name ?? string.Empty,
        Message = x.Message,
        Quantity = x.Quantity,
        PreferredBrand = x.PreferredBrand,
        City = x.City,
        AttachmentPath = x.AttachmentPath,
        Status = x.Status,
        CreatedOn = x.CreatedOn
    };
}
