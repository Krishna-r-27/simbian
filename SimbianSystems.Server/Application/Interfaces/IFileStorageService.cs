namespace SimbianSystems.Server.Application.Interfaces;

public class ImageSaveResult
{
    public string BasePath { get; set; } = string.Empty;
    public string WebpPath { get; set; } = string.Empty;
    public string PngPath { get; set; } = string.Empty;
}

public interface IFileStorageService
{
    Task<ImageSaveResult> SaveImageAsync(Stream stream, string folder, string? originalFileName = null, CancellationToken cancellationToken = default);
    Task<string> SaveFileAsync(Stream stream, string folder, string fileName, CancellationToken cancellationToken = default);
    Task DeleteAsync(string? basePath, CancellationToken cancellationToken = default);
    Task DeleteFileAsync(string? relativePath, CancellationToken cancellationToken = default);
}
