using Microsoft.Extensions.Options;
using SimbianSystems.Server.Application.Interfaces;
using SimbianSystems.Server.Infrastructure.Options;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;

namespace SimbianSystems.Server.Infrastructure.Services;

public class ImageCompressionService : IImageCompressionService
{
    private readonly CompressionSettings _settings;

    public ImageCompressionService(IOptions<CompressionSettings> options)
    {
        _settings = options.Value;
    }

    public async Task<DualImageResult> CompressToWebpAndPngAsync(Stream input, CancellationToken cancellationToken = default)
    {
        await using var buffer = new MemoryStream();
        await input.CopyToAsync(buffer, cancellationToken);
        var inputBytes = buffer.ToArray();

        using var image = Image.Load(inputBytes);

        if (!_settings.PreserveAlpha)
            image.Mutate(ctx => ctx.BackgroundColor(Color.White));

        if (inputBytes.LongLength <= _settings.ImageSkipBelowBytes)
        {
            using var working = image.Clone(ctx => ResizeToBounds(ctx, image, _settings.ImageMaxWidth, _settings.ImageMaxHeight));
            return new DualImageResult
            {
                WebpBytes = EncodeWebp(working, _settings.ImageStartQuality),
                PngBytes = EncodePng(working, 9)
            };
        }

        var maxW = _settings.ImageMaxWidth;
        var maxH = _settings.ImageMaxHeight;
        byte[]? bestWebp = null;
        byte[]? bestPng = null;

        while (true)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using var working = image.Clone(ctx => ResizeToBounds(ctx, image, maxW, maxH));
            var webp = EncodeSmallestWebp(working, _settings);
            var png = EncodeSmallestPng(working);

            bestWebp = webp;
            bestPng = png;

            var webpOk = webp.Length <= _settings.ImageTargetMaxBytes;
            var pngOk = png.Length <= _settings.PngTargetMaxBytes;
            var atMin = maxW <= _settings.ImageMinWidth && maxH <= _settings.ImageMinHeight;

            if ((webpOk && pngOk) || atMin)
            {
                return new DualImageResult
                {
                    WebpBytes = webp,
                    PngBytes = png
                };
            }

            var nextW = Math.Max(_settings.ImageMinWidth, (int)(maxW * 0.85));
            var nextH = Math.Max(_settings.ImageMinHeight, (int)(maxH * 0.85));

            if (nextW == maxW && nextH == maxH)
            {
                return new DualImageResult
                {
                    WebpBytes = bestWebp,
                    PngBytes = bestPng
                };
            }

            maxW = nextW;
            maxH = nextH;
        }
    }

    private static byte[] EncodeSmallestWebp(Image image, CompressionSettings settings)
    {
        byte[]? best = null;
        byte[]? underTarget = null;

        for (var quality = settings.ImageStartQuality; quality >= settings.ImageMinQuality; quality -= 5)
        {
            var encoded = EncodeWebp(image, quality);
            if (best is null || encoded.Length < best.Length)
                best = encoded;

            if (encoded.Length <= settings.ImageTargetMaxBytes)
            {
                underTarget = encoded;
                break;
            }
        }

        if (underTarget is null && settings.ImageMinQuality < settings.ImageStartQuality)
        {
            var encoded = EncodeWebp(image, settings.ImageMinQuality);
            if (best is null || encoded.Length < best.Length)
                best = encoded;
            if (encoded.Length <= settings.ImageTargetMaxBytes)
                underTarget = encoded;
        }

        return underTarget ?? best ?? EncodeWebp(image, settings.ImageMinQuality);
    }

    private static byte[] EncodeSmallestPng(Image image) => EncodePng(image, 6);

    private static byte[] EncodeWebp(Image image, int quality)
    {
        using var ms = new MemoryStream();
        image.SaveAsWebp(ms, new WebpEncoder
        {
            Quality = quality,
            FileFormat = WebpFileFormatType.Lossy
        });
        return ms.ToArray();
    }

    private static byte[] EncodePng(Image image, int compressionLevel)
    {
        using var ms = new MemoryStream();
        image.SaveAsPng(ms, new PngEncoder
        {
            CompressionLevel = (PngCompressionLevel)Math.Clamp(compressionLevel, 0, 9)
        });
        return ms.ToArray();
    }

    private static void ResizeToBounds(IImageProcessingContext ctx, Image source, int maxWidth, int maxHeight)
    {
        if (source.Width <= maxWidth && source.Height <= maxHeight)
            return;

        ctx.Resize(new ResizeOptions
        {
            Size = new Size(maxWidth, maxHeight),
            Mode = ResizeMode.Max,
            Sampler = KnownResamplers.Lanczos3
        });
    }
}
