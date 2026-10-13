using SimbianSystems.Server.Application.DTOs.Dashboard;
namespace SimbianSystems.Server.Application.Interfaces.Services;
public interface IDashboardService { Task<DashboardStatsDto> GetStatsAsync(CancellationToken ct = default); }
