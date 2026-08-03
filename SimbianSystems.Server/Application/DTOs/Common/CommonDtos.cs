namespace SimbianSystems.Server.Application.DTOs.Common;

public class ImageUploadResultDto
{
    public string BasePath { get; set; } = string.Empty;
    public string WebpPath { get; set; } = string.Empty;
    public string PngPath { get; set; } = string.Empty;
}

public class BulkIdsRequest
{
    public List<int> Ids { get; set; } = new();
}

public class BulkStatusRequest
{
    public List<int> Ids { get; set; } = new();
    public bool IsPublished { get; set; }
}
