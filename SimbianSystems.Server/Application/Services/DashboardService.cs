using Microsoft.EntityFrameworkCore;
using SimbianSystems.Server.Application.DTOs.Dashboard;
using SimbianSystems.Server.Application.Interfaces.Services;
using SimbianSystems.Server.Domain.Enums;
using SimbianSystems.Server.Persistence.Context;
namespace SimbianSystems.Server.Application.Services;
public sealed class DashboardService(AppDbContext db):IDashboardService {
 public async Task<DashboardStatsDto> GetStatsAsync(CancellationToken ct=default)=>new(){TotalProducts=await db.Products.CountAsync(ct),ActiveProducts=await db.Products.CountAsync(x=>x.IsPublished,ct),InactiveProducts=await db.Products.CountAsync(x=>!x.IsPublished,ct),TotalEnquiries=await db.Enquiries.CountAsync(ct),UnreadEnquiries=await db.Enquiries.CountAsync(x=>x.Status==EnquiryStatus.Unread,ct),TotalProductQuotes=await db.ProductQuotes.CountAsync(ct),UnreadProductQuotes=await db.ProductQuotes.CountAsync(x=>x.Status==EnquiryStatus.Unread,ct)};
}
