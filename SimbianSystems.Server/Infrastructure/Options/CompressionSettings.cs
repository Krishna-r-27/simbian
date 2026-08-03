namespace SimbianSystems.Server.Infrastructure.Options;

public class CompressionSettings
{
    public const string SectionName = "Compression";

    public long ImageTargetKb { get; set; } = 120;
    public long PngTargetKb { get; set; } = 200;
    public long ImageSkipCompressBelowKb { get; set; } = 30;
    public int ImageMaxWidth { get; set; } = 1600;
    public int ImageMaxHeight { get; set; } = 1600;
    public int ImageMinWidth { get; set; } = 800;
    public int ImageMinHeight { get; set; } = 800;
    public int ImageStartQuality { get; set; } = 85;
    public int ImageMinQuality { get; set; } = 40;
    public bool PreserveAlpha { get; set; } = true;

    public long ImageSkipBelowBytes => ImageSkipCompressBelowKb * 1024L;
    public long ImageTargetMaxBytes => ImageTargetKb * 1024L;
    public long PngTargetMaxBytes => PngTargetKb * 1024L;
}
