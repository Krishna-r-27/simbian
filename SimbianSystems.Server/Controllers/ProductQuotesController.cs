using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SimbianSystems.Server.Application.Common;
using SimbianSystems.Server.Application.DTOs.Common;
using SimbianSystems.Server.Application.DTOs.Enquiries;
using SimbianSystems.Server.Application.Interfaces.Services;

namespace SimbianSystems.Server.Controllers;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/product-quotes")]
public class ProductQuotesController : ControllerBase
{
    private readonly IProductQuoteService _service;

    public ProductQuotesController(IProductQuoteService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<ProductQuoteListItemDto>>>> GetPaged([FromQuery] PaginationQuery query, CancellationToken ct)
        => Ok(ApiResponse<PagedResult<ProductQuoteListItemDto>>.Ok(await _service.GetPagedAsync(query, ct)));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<ProductQuoteListItemDto>>> Get(int id, CancellationToken ct)
        => Ok(ApiResponse<ProductQuoteListItemDto>.Ok(await _service.GetAsync(id, ct)));

    [HttpPut("{id:int}/status")]
    public async Task<ActionResult<ApiResponse<object>>> Status(int id, [FromBody] EnquiryStatusUpdateDto dto, CancellationToken ct)
    {
        await _service.UpdateStatusAsync(id, dto, ct);
        return Ok(ApiResponse.Ok("Status updated."));
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(int id, CancellationToken ct)
    {
        await _service.DeleteAsync(id, ct);
        return Ok(ApiResponse.Ok("Quote deleted."));
    }

    [HttpPost("bulk-delete")]
    public async Task<ActionResult<ApiResponse<object>>> BulkDelete([FromBody] BulkIdsRequest request, CancellationToken ct)
    {
        await _service.BulkDeleteAsync(request.Ids, ct);
        return Ok(ApiResponse.Ok("Quotes deleted."));
    }

    [HttpGet("export")]
    public async Task<IActionResult> Export([FromQuery] bool excel = false, CancellationToken ct = default)
    {
        var bytes = await _service.ExportAsync(excel, ct);
        return File(bytes,
            excel ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : "text/csv",
            excel ? "product-quotes.xlsx" : "product-quotes.csv");
    }
}
