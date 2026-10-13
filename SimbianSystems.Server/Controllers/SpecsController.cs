using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SimbianSystems.Server.Application.Common;
using SimbianSystems.Server.Application.DTOs.Specs;
using SimbianSystems.Server.Application.Interfaces.Services;

namespace SimbianSystems.Server.Controllers;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/specs")]
public class SpecsController : ControllerBase
{
    private readonly ISpecService _service;

    public SpecsController(ISpecService service) => _service = service;

    [HttpGet("groups")]
    public async Task<ActionResult<ApiResponse<List<SpecGroupDto>>>> Groups(CancellationToken ct)
        => Ok(ApiResponse<List<SpecGroupDto>>.Ok(await _service.GetGroupsAsync(ct)));

    [HttpPost("groups")]
    public async Task<ActionResult<ApiResponse<SpecGroupDto>>> CreateGroup([FromBody] SpecGroupUpsertDto dto, CancellationToken ct)
        => Ok(ApiResponse<SpecGroupDto>.Ok(await _service.CreateGroupAsync(dto, ct)));

    [HttpPut("groups/{id:int}")]
    public async Task<ActionResult<ApiResponse<SpecGroupDto>>> UpdateGroup(int id, [FromBody] SpecGroupUpsertDto dto, CancellationToken ct)
        => Ok(ApiResponse<SpecGroupDto>.Ok(await _service.UpdateGroupAsync(id, dto, ct)));

    [HttpDelete("groups/{id:int}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteGroup(int id, CancellationToken ct)
    {
        await _service.DeleteGroupAsync(id, ct);
        return Ok(ApiResponse.Ok("Group deleted."));
    }

    [HttpPost("groups/reorder")]
    public async Task<ActionResult<ApiResponse<object>>> ReorderGroups([FromBody] SpecReorderDto dto, CancellationToken ct)
    {
        await _service.ReorderGroupsAsync(dto.Ids ?? [], ct);
        return Ok(ApiResponse.Ok("Group order saved."));
    }

    [HttpGet("definitions")]
    public async Task<ActionResult<ApiResponse<List<SpecDefinitionDto>>>> Definitions([FromQuery] int? categoryId, CancellationToken ct)
        => Ok(ApiResponse<List<SpecDefinitionDto>>.Ok(await _service.GetDefinitionsAsync(categoryId, ct)));

    [HttpPost("definitions")]
    public async Task<ActionResult<ApiResponse<SpecDefinitionDto>>> CreateDefinition([FromBody] SpecDefinitionUpsertDto dto, CancellationToken ct)
        => Ok(ApiResponse<SpecDefinitionDto>.Ok(await _service.CreateDefinitionAsync(dto, ct)));

    [HttpPut("definitions/{id:int}")]
    public async Task<ActionResult<ApiResponse<SpecDefinitionDto>>> UpdateDefinition(int id, [FromBody] SpecDefinitionUpsertDto dto, CancellationToken ct)
        => Ok(ApiResponse<SpecDefinitionDto>.Ok(await _service.UpdateDefinitionAsync(id, dto, ct)));

    [HttpDelete("definitions/{id:int}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteDefinition(int id, CancellationToken ct)
    {
        await _service.DeleteDefinitionAsync(id, ct);
        return Ok(ApiResponse.Ok("Definition deleted."));
    }

    [HttpPost("definitions/reorder")]
    public async Task<ActionResult<ApiResponse<object>>> ReorderDefinitions([FromBody] SpecReorderDto dto, CancellationToken ct)
    {
        await _service.ReorderDefinitionsAsync(dto.Ids ?? [], ct);
        return Ok(ApiResponse.Ok("Definition order saved."));
    }

    [HttpGet("template/{categoryId:int}")]
    public async Task<ActionResult<ApiResponse<List<SpecTemplateGroupDto>>>> Template(int categoryId, CancellationToken ct)
        => Ok(ApiResponse<List<SpecTemplateGroupDto>>.Ok(await _service.GetTemplateByCategoryAsync(categoryId, ct)));
}
