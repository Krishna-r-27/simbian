namespace SimbianSystems.Server.Application.Interfaces;

public class DualImageResult
{
    public byte[] WebpBytes { get; set; } = Array.Empty<byte>();
    public byte[] PngBytes { get; set; } = Array.Empty<byte>();
}

public interface IImageCompressionService
{
    Task<DualImageResult> CompressToWebpAndPngAsync(Stream input, CancellationToken cancellationToken = default);
}
