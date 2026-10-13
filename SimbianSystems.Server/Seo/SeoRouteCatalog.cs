using System.Text.Json;
using System.Text.Json.Serialization;

namespace SimbianSystems.Server.Seo;

public sealed class SeoRouteEntry
{
    public string Path { get; set; } = "/";
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string Keywords { get; set; } = "";
    public string Canonical { get; set; } = "";
    public bool Prerender { get; set; }
    public bool Sitemap { get; set; } = true;
    public string Heading { get; set; } = "";
    public string Summary { get; set; } = "";
}

public sealed class SeoRouteFile
{
    public string Origin { get; set; } = "";
    public SeoRouteEntry NotFound { get; set; } = new();
    public List<SeoRouteEntry> Routes { get; set; } = new();
}

public sealed class SeoRouteCatalog
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    private readonly IWebHostEnvironment _environment;
    private readonly object _gate = new();
    private SeoRouteFile? _cached;
    private string? _cachedPath;
    private DateTime _cachedWriteUtc;

    public SeoRouteCatalog(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public string? FindSpaRoot()
    {
        foreach (var candidate in Candidates())
        {
            if (File.Exists(Path.Combine(candidate, "spa-shell.html")))
                return candidate;
        }

        return null;
    }

    public SeoRouteFile? Load()
    {
        var path = FindRoutesFile();
        if (path == null)
            return null;

        var writeUtc = File.GetLastWriteTimeUtc(path);
        lock (_gate)
        {
            if (_cached != null && _cachedPath == path && _cachedWriteUtc == writeUtc)
                return _cached;

            var json = File.ReadAllText(path);
            _cached = JsonSerializer.Deserialize<SeoRouteFile>(json, JsonOptions);
            _cachedPath = path;
            _cachedWriteUtc = writeUtc;
            return _cached;
        }
    }

    public string? ReadShell()
    {
        var root = FindSpaRoot();
        if (root == null)
            return null;

        var path = Path.Combine(root, "spa-shell.html");
        return File.Exists(path) ? File.ReadAllText(path) : null;
    }

    public string? ReadPrerendered(string requestPath)
    {
        var root = FindSpaRoot();
        if (root == null)
            return null;

        var relative = requestPath == "/"
            ? "index.html"
            : requestPath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar) + $"{Path.DirectorySeparatorChar}index.html";
        var full = Path.GetFullPath(Path.Combine(root, relative));
        var rootFull = Path.GetFullPath(root);
        if (!full.StartsWith(rootFull, StringComparison.OrdinalIgnoreCase))
            return null;
        if (!File.Exists(full))
            return null;

        var html = File.ReadAllText(full);
        return html.Contains("id=\"seo-content\"", StringComparison.OrdinalIgnoreCase) ? html : null;
    }

    private string? FindRoutesFile()
    {
        foreach (var candidate in Candidates())
        {
            var path = Path.Combine(candidate, "seo-routes.json");
            if (File.Exists(path))
                return path;
        }

        return null;
    }

    private IEnumerable<string> Candidates()
    {
        var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var webRoot = _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot");
        var list = new[]
        {
            webRoot,
            Path.GetFullPath(Path.Combine(_environment.ContentRootPath, "..", "simbiansystems.client", "dist")),
            Path.Combine(AppContext.BaseDirectory, "wwwroot")
        };

        foreach (var candidate in list)
        {
            if (string.IsNullOrWhiteSpace(candidate))
                continue;
            var full = Path.GetFullPath(candidate);
            if (seen.Add(full) && Directory.Exists(full))
                yield return full;
        }
    }
}
