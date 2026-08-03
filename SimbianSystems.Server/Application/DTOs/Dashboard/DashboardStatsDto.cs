namespace SimbianSystems.Server.Application.DTOs.Dashboard;

public class DashboardStatsDto
{
    public int TotalProducts { get; set; }
    public int ActiveProducts { get; set; }
    public int InactiveProducts { get; set; }
    public int TotalEnquiries { get; set; }
    public int UnreadEnquiries { get; set; }
    public int TotalProductQuotes { get; set; }
    public int UnreadProductQuotes { get; set; }
}
