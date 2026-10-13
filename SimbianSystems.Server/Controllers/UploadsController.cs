using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SimbianSystems.Server.Application.Common;
using SimbianSystems.Server.Application.DTOs.Common;
using SimbianSystems.Server.Application.Interfaces;

namespace SimbianSystems.Server.Controllers;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/uploads")]
public class UploadsController : ControllerBase
{
    private const long MaxBytes = 10L * 1024 * 1024;
    private static readonly HashSet<string> AllowedImageTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/png", "image/jpeg", "image/jpg", "image/webp"
    };

    private readonly IFileStorageService _files;

    public UploadsController(IFileStorageService files) => _files = files;

    [HttpPost("image")]
    [RequestSizeLimit(MaxBytes + 256_000)]
    [RequestFormLimits(MultipartBodyLengthLimit = MaxBytes + 256_000)]
    public async Task<ActionResult<ApiResponse<ImageUploadResultDto>>> UploadImage(
        IFormFile file, [FromQuery] string folder = "products", CancellationToken ct = default)
    {
        if (file is null || file.Length == 0)
            return BadRequest(ApiResponse<ImageUploadResultDto>.Fail("Image file is required."));
        if (file.Length > MaxBytes)
            return BadRequest(ApiResponse<ImageUploadResultDto>.Fail("Image must be 10MB or smaller."));

        var ext = Path.GetExtension(file.FileName)?.ToLowerInvariant();
        var okExt = ext is ".png" or ".jpg" or ".jpeg" or ".webp";
        if (!AllowedImageTypes.Contains(file.ContentType ?? "") && !okExt)
            return BadRequest(ApiResponse<ImageUploadResultDto>.Fail("Only PNG, JPG, and WEBP images are allowed."));

        await using var stream = file.OpenReadStream();
        var saved = await _files.SaveImageAsync(stream, folder, file.FileName, ct);
        return Ok(ApiResponse<ImageUploadResultDto>.Ok(new ImageUploadResultDto
        {
            BasePath = saved.BasePath,
            WebpPath = saved.WebpPath,
            PngPath = saved.PngPath
        }));
    }

    [HttpDelete("image")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteImage([FromQuery] string basePath, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(basePath))
            return BadRequest(ApiResponse<object>.Fail("Image path is required."));
        var normalized = basePath.Replace('\\', '/').Trim();
        if (normalized.Contains("..") || !normalized.StartsWith("/uploads/", StringComparison.OrdinalIgnoreCase))
            return BadRequest(ApiResponse<object>.Fail("Invalid image path."));
        await _files.DeleteAsync(normalized, ct);
        return Ok(ApiResponse.Ok("Image deleted."));
    }

    [HttpPost("pdf")]
    [HttpPost("file")]
    [RequestSizeLimit(MaxBytes + 256_000)]
    [RequestFormLimits(MultipartBodyLengthLimit = MaxBytes + 256_000)]
    public async Task<ActionResult<ApiResponse<string>>> UploadPdf(
        IFormFile file, [FromQuery] string folder = "products", CancellationToken ct = default)
    {
        if (file is null || file.Length == 0)
            return BadRequest(ApiResponse<string>.Fail("PDF file is required."));
        if (file.Length > MaxBytes)
            return BadRequest(ApiResponse<string>.Fail("File must be 10MB or smaller."));

        var ext = Path.GetExtension(file.FileName)?.ToLowerInvariant();
        if (ext != ".pdf" && !string.Equals(file.ContentType, "application/pdf", StringComparison.OrdinalIgnoreCase))
            return BadRequest(ApiResponse<string>.Fail("Only PDF files are allowed."));

        await using var stream = file.OpenReadStream();
        var path = await _files.SaveFileAsync(stream, folder, file.FileName, ct);
        return Ok(ApiResponse<string>.Ok(path));
    }
}
