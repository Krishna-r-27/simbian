namespace SimbianSystems.Server.Application.Common;

public class PaginationQuery
{
    private int _page = 1;
    private int _pageSize = 10;

    public int Page
    {
        get => _page;
        set => _page = value < 1 ? 1 : value;
    }

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value is < 1 or > 200 ? 10 : value;
    }

    public string? Search { get; set; }
    public string? SortBy { get; set; }
    public string? SortDir { get; set; } = "desc";
    public Dictionary<string, string>? Filters { get; set; }

    public bool IsDescending =>
        string.Equals(SortDir, "desc", StringComparison.OrdinalIgnoreCase);
}
