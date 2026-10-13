using SimbianSystems.Server.Domain.Enums;

namespace SimbianSystems.Server.Application.DTOs.Specs;

public class SpecGroupDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}

public class SpecGroupUpsertDto
{
    public string Name { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

public class SpecDefinitionDto
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public int SpecificationGroupId { get; set; }
    public string GroupName { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public ControlType ControlType { get; set; }
    public bool IsRequired { get; set; }
    public List<string> Options { get; set; } = new();
}

public class SpecDefinitionUpsertDto
{
    public int CategoryId { get; set; }
    public int SpecificationGroupId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public ControlType ControlType { get; set; }
    public bool IsRequired { get; set; }
    public List<string>? Options { get; set; }
}

public class SpecTemplateGroupDto
{
    public int GroupId { get; set; }
    public string GroupName { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public List<SpecDefinitionDto> Fields { get; set; } = new();
}

public class SpecReorderDto
{
    public List<int> Ids { get; set; } = new();
}
