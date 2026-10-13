using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SimbianSystems.Server.Application.Common;
using SimbianSystems.Server.Application.DTOs.Common;
using SimbianSystems.Server.Application.DTOs.Products;
using SimbianSystems.Server.Application.Interfaces.Services;

namespace SimbianSystems.Server.Controllers;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _service;

    public ProductsController(IProductService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<ProductListItemDto>>>> GetPaged(
        [FromQuery] PaginationQuery query,
        [FromQuery] int? categoryId,
        [FromQuery] bool? isPublished,
        CancellationToken ct)
        => Ok(ApiResponse<PagedResult<ProductListItemDto>>.Ok(await _service.GetPagedAsync(query, categoryId, isPublished, ct)));

    [HttpGet("categories")]
    public async Task<ActionResult<ApiResponse<List<CategoryDto>>>> Categories(CancellationToken ct)
        => Ok(ApiResponse<List<CategoryDto>>.Ok(await _service.GetCategoriesAsync(ct)));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<ProductDetailDto>>> Get(int id, CancellationToken ct)
        => Ok(ApiResponse<ProductDetailDto>.Ok(await _service.GetByIdAsync(id, ct)));

    [HttpPost]
    public async Task<ActionResult<ApiResponse<ProductDetailDto>>> Create([FromBody] ProductUpsertDto dto, CancellationToken ct)
        => Ok(ApiResponse<ProductDetailDto>.Ok(await _service.CreateAsync(dto, ct), "Product created."));

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ApiResponse<ProductDetailDto>>> Update(int id, [FromBody] ProductUpsertDto dto, CancellationToken ct)
        => Ok(ApiResponse<ProductDetailDto>.Ok(await _service.UpdateAsync(id, dto, ct), "Product updated."));

    [HttpPut("{id:int}/gallery-order")]
    public async Task<ActionResult<ApiResponse<ProductDetailDto>>> ReorderGallery(int id, [FromBody] ProductGalleryOrderDto dto, CancellationToken ct)
        => Ok(ApiResponse<ProductDetailDto>.Ok(await _service.ReorderGalleryAsync(id, dto, ct), "Gallery order saved."));

    [HttpDelete("{id:int}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(int id, CancellationToken ct)
    {
        await _service.DeleteAsync(id, ct);
        return Ok(ApiResponse.Ok("Product deleted."));
    }

    [HttpPost("{id:int}/duplicate")]
    public async Task<ActionResult<ApiResponse<ProductDetailDto>>> Duplicate(int id, CancellationToken ct)
        => Ok(ApiResponse<ProductDetailDto>.Ok(await _service.DuplicateAsync(id, ct), "Product duplicated."));

    [HttpPost("bulk-delete")]
    public async Task<ActionResult<ApiResponse<object>>> BulkDelete([FromBody] BulkIdsRequest request, CancellationToken ct)
    {
        await _service.BulkDeleteAsync(request.Ids, ct);
        return Ok(ApiResponse.Ok("Products deleted."));
    }

    [HttpPost("bulk-publish")]
    public async Task<ActionResult<ApiResponse<object>>> BulkPublish([FromBody] BulkStatusRequest request, CancellationToken ct)
    {
        await _service.BulkPublishAsync(request.Ids, request.IsPublished, ct);
        return Ok(ApiResponse.Ok("Products updated."));
    }

    [HttpGet("export")]
    public async Task<IActionResult> Export([FromQuery] bool excel = false, CancellationToken ct = default)
    {
        var bytes = await _service.ExportAsync(excel, ct);
        var contentType = excel
            ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            : "text/csv";
        var fileName = excel ? "products.xlsx" : "products.csv";
        return File(bytes, contentType, fileName);
    }
}
