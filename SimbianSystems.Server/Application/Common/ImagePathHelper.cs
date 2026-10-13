namespace SimbianSystems.Server.Application.Common;

public static class ImagePathHelper
{
    public static string? NormalizeBasePath(string? path)
    {
        if (string.IsNullOrWhiteSpace(path))
            return null;

        var value = path.Replace('\\', '/').Trim();
        foreach (var ext in new[] { ".webp", ".png", ".jpg", ".jpeg", ".bmp", ".gif" })
        {
            if (value.EndsWith(ext, StringComparison.OrdinalIgnoreCase))
                return value[..^ext.Length];
        }

        return value;
    }

    public static string? ToWebpUrl(string? basePath)
    {
        var normalized = NormalizeBasePath(basePath);
        return normalized is null ? null : $"{normalized}.webp";
    }

    public static string? ToPngUrl(string? basePath)
    {
        var normalized = NormalizeBasePath(basePath);
        return normalized is null ? null : $"{normalized}.png";
    }
}
