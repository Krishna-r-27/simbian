using SimbianSystems.Server.Application.DTOs.Specs;
namespace SimbianSystems.Server.Application.Interfaces.Services;
public interface ISpecService
{
    Task<List<SpecGroupDto>> GetGroupsAsync(CancellationToken ct = default);
    Task<SpecGroupDto> CreateGroupAsync(SpecGroupUpsertDto dto, CancellationToken ct = default);
    Task<SpecGroupDto> UpdateGroupAsync(int id, SpecGroupUpsertDto dto, CancellationToken ct = default);
    Task DeleteGroupAsync(int id, CancellationToken ct = default);
    Task ReorderGroupsAsync(IReadOnlyList<int> ids, CancellationToken ct = default);
    Task<List<SpecDefinitionDto>> GetDefinitionsAsync(int? categoryId = null, CancellationToken ct = default);
    Task<SpecDefinitionDto> CreateDefinitionAsync(SpecDefinitionUpsertDto dto, CancellationToken ct = default);
    Task<SpecDefinitionDto> UpdateDefinitionAsync(int id, SpecDefinitionUpsertDto dto, CancellationToken ct = default);
    Task DeleteDefinitionAsync(int id, CancellationToken ct = default);
    Task ReorderDefinitionsAsync(IReadOnlyList<int> ids, CancellationToken ct = default);
    Task<List<SpecTemplateGroupDto>> GetTemplateByCategoryAsync(int categoryId, CancellationToken ct = default);
}
