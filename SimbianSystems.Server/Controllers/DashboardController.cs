using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SimbianSystems.Server.Application.Common;
using SimbianSystems.Server.Application.DTOs.Dashboard;
using SimbianSystems.Server.Application.Interfaces.Services;

namespace SimbianSystems.Server.Controllers;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _service;

    public DashboardController(IDashboardService service) => _service = service;

    [HttpGet("stats")]
    public async Task<ActionResult<ApiResponse<DashboardStatsDto>>> Stats(CancellationToken ct)
        => Ok(ApiResponse<DashboardStatsDto>.Ok(await _service.GetStatsAsync(ct)));
}
