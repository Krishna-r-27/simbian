using Microsoft.AspNetCore.Hosting;
using SimbianSystems.Server.Application.Interfaces;

namespace SimbianSystems.Server.Infrastructure.Services;

public class FileStorageService : IFileStorageService
{
    private readonly IWebHostEnvironment _environment;
    private readonly IImageCompressionService _compression;

    public FileStorageService(IWebHostEnvironment environment, IImageCompressionService compression)
    {
        _environment = environment;
        _compression = compression;
    }

    public async Task<ImageSaveResult> SaveImageAsync(
        Stream stream,
        string folder,
        string? originalFileName = null,
        CancellationToken cancellationToken = default)
    {
        var webRoot = ResolveWebRoot();
        var relativeFolder = NormalizeFolder(folder);
        var physicalFolder = Path.Combine(webRoot, "uploads", relativeFolder);
        Directory.CreateDirectory(physicalFolder);

        var fileId = Guid.NewGuid().ToString("N");
        var relativeBase = $"/uploads/{relativeFolder.Replace('\\', '/')}/{fileId}".Replace("//", "/");

        var compressed = await _compression.CompressToWebpAndPngAsync(stream, cancellationToken);

        await File.WriteAllBytesAsync(Path.Combine(physicalFolder, $"{fileId}.webp"), compressed.WebpBytes, cancellationToken);
        await File.WriteAllBytesAsync(Path.Combine(physicalFolder, $"{fileId}.png"), compressed.PngBytes, cancellationToken);

        return new ImageSaveResult
        {
            BasePath = relativeBase,
            WebpPath = $"{relativeBase}.webp",
            PngPath = $"{relativeBase}.png"
        };
    }

    public async Task<string> SaveFileAsync(
        Stream stream,
        string folder,
        string fileName,
        CancellationToken cancellationToken = default)
    {
        var webRoot = ResolveWebRoot();
        var relativeFolder = NormalizeFolder(folder);
        var physicalFolder = Path.Combine(webRoot, "uploads", relativeFolder);
        Directory.CreateDirectory(physicalFolder);

        var safeName = Path.GetFileName(fileName);
        if (string.IsNullOrWhiteSpace(safeName))
            safeName = Guid.NewGuid().ToString("N");

        var physicalPath = Path.Combine(physicalFolder, safeName);
        await using (var fs = new FileStream(physicalPath, FileMode.Create, FileAccess.Write, FileShare.None))
        {
            await stream.CopyToAsync(fs, cancellationToken);
        }

        return $"/uploads/{relativeFolder.Replace('\\', '/')}/{safeName}".Replace("//", "/");
    }

    public Task DeleteAsync(string? basePath, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(basePath))
            return Task.CompletedTask;

        var normalized = basePath.Replace('\\', '/').Trim();
        foreach (var ext in new[] { ".webp", ".png", ".jpg", ".jpeg", ".bmp", ".gif" })
        {
            if (normalized.EndsWith(ext, StringComparison.OrdinalIgnoreCase))
            {
                normalized = normalized[..^ext.Length];
                break;
            }
        }

        DeletePhysical(normalized + ".webp");
        DeletePhysical(normalized + ".png");
        return Task.CompletedTask;
    }

    public Task DeleteFileAsync(string? relativePath, CancellationToken cancellationToken = default)
    {
        if (!string.IsNullOrWhiteSpace(relativePath))
            DeletePhysical(relativePath);

        return Task.CompletedTask;
    }

    private string ResolveWebRoot()
    {
        if (!string.IsNullOrWhiteSpace(_environment.WebRootPath))
            return _environment.WebRootPath;

        var fallback = Path.Combine(_environment.ContentRootPath, "wwwroot");
        Directory.CreateDirectory(fallback);
        return fallback;
    }

    private static string NormalizeFolder(string folder)
    {
        var value = (folder ?? string.Empty).Replace('\\', '/').Trim().Trim('/');
        if (string.IsNullOrWhiteSpace(value))
            value = "misc";

        return value.Replace('/', Path.DirectorySeparatorChar);
    }

    private void DeletePhysical(string relativePath)
    {
        var relative = relativePath.Replace('\\', '/').Trim().TrimStart('/');
        if (string.IsNullOrWhiteSpace(relative)
            || relative.Contains("..", StringComparison.Ordinal)
            || !relative.StartsWith("uploads/", StringComparison.OrdinalIgnoreCase))
        {
            return;
        }

        var webRoot = ResolveWebRoot();
        var physical = Path.GetFullPath(Path.Combine(webRoot, relative.Replace('/', Path.DirectorySeparatorChar)));
        var rootFull = Path.GetFullPath(webRoot);
        if (!physical.StartsWith(rootFull, StringComparison.OrdinalIgnoreCase))
            return;

        if (File.Exists(physical))
            File.Delete(physical);
    }
}
