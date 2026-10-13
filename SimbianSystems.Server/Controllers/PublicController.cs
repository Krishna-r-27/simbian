using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using SimbianSystems.Server.Application.Common;
using SimbianSystems.Server.Application.DTOs.Enquiries;
using SimbianSystems.Server.Application.DTOs.Products;
using SimbianSystems.Server.Application.Interfaces.Services;

namespace SimbianSystems.Server.Controllers;

/// <summary>Anonymous public catalog and form submission stubs for later storefront wiring.</summary>
[ApiController]
[AllowAnonymous]
[Route("api/public")]
public class PublicController : ControllerBase
{
    private readonly IPublicCatalogService _catalog;
    private readonly IEnquiryService _enquiries;
    private readonly IProductQuoteService _quotes;

    public PublicController(IPublicCatalogService catalog, IEnquiryService enquiries, IProductQuoteService quotes)
    {
        _catalog = catalog;
        _enquiries = enquiries;
        _quotes = quotes;
    }

    /// <summary>Active product categories for storefront nav and filters.</summary>
    [HttpGet("categories")]
    public async Task<ActionResult<ApiResponse<List<CategoryDto>>>> Categories(CancellationToken ct)
        => Ok(ApiResponse<List<CategoryDto>>.Ok(await _catalog.GetCategoriesAsync(ct)));

    /// <summary>Product listing (published only). Filter by category slug or id.</summary>
    [HttpGet("category")]
    public async Task<ActionResult<ApiResponse<PagedResult<ProductListItemDto>>>> Listing(
        [FromQuery] PaginationQuery query,
        [FromQuery] string? categorySlug,
        [FromQuery] int? categoryId,
        CancellationToken ct)
        => Ok(ApiResponse<PagedResult<ProductListItemDto>>.Ok(
            await _catalog.GetPublishedProductsAsync(query, categorySlug, categoryId, ct)));

    /// <summary>Product detail page (PDP) by product slug.</summary>
    [HttpGet("category/{slug}")]
    public async Task<ActionResult<ApiResponse<ProductDetailDto>>> Detail(string slug, CancellationToken ct)
        => Ok(ApiResponse<ProductDetailDto>.Ok(await _catalog.GetPublishedProductBySlugAsync(slug, ct)));

    [EnableRateLimiting("public-post")]
    [HttpPost("enquiries")]
    public async Task<ActionResult<ApiResponse<EnquiryListItemDto>>> CreateEnquiry([FromBody] EnquiryCreateDto dto, CancellationToken ct)
        => Ok(ApiResponse<EnquiryListItemDto>.Ok(await _enquiries.CreateAsync(dto, ct), "Enquiry submitted."));

    [EnableRateLimiting("public-post")]
    [HttpPost("product-quotes")]
    public async Task<ActionResult<ApiResponse<ProductQuoteListItemDto>>> CreateQuote([FromBody] ProductQuoteCreateDto dto, CancellationToken ct)
        => Ok(ApiResponse<ProductQuoteListItemDto>.Ok(await _quotes.CreateAsync(dto, ct), "Quote submitted."));
}
