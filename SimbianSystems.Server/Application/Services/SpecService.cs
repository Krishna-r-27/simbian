using Microsoft.EntityFrameworkCore;
using SimbianSystems.Server.Application.Common;
using SimbianSystems.Server.Application.DTOs.Specs;
using SimbianSystems.Server.Application.Interfaces.Services;
using SimbianSystems.Server.Domain.Entities;
using SimbianSystems.Server.Persistence.Context;
namespace SimbianSystems.Server.Application.Services;
public sealed class SpecService(AppDbContext db):ISpecService {
 public Task<List<SpecGroupDto>> GetGroupsAsync(CancellationToken ct=default)=>db.SpecificationGroups.OrderBy(x=>x.DisplayOrder).Select(x=>new SpecGroupDto{Id=x.Id,Name=x.Name,DisplayOrder=x.DisplayOrder,IsActive=x.IsActive}).ToListAsync(ct);
 public async Task<SpecGroupDto>CreateGroupAsync(SpecGroupUpsertDto d,CancellationToken ct=default){var x=new SpecificationGroup{Name=d.Name,DisplayOrder=d.DisplayOrder,IsActive=d.IsActive};db.Add(x);await db.SaveChangesAsync(ct);return new(){Id=x.Id,Name=x.Name,DisplayOrder=x.DisplayOrder,IsActive=x.IsActive};}
 public async Task<SpecGroupDto>UpdateGroupAsync(int id,SpecGroupUpsertDto d,CancellationToken ct=default){var x=await db.SpecificationGroups.FindAsync([id],ct)??throw AppException.NotFound();x.Name=d.Name;x.DisplayOrder=d.DisplayOrder;x.IsActive=d.IsActive;await db.SaveChangesAsync(ct);return new(){Id=x.Id,Name=x.Name,DisplayOrder=x.DisplayOrder,IsActive=x.IsActive};}
 public async Task DeleteGroupAsync(int id,CancellationToken ct=default){var x=await db.SpecificationGroups.FindAsync([id],ct)??throw AppException.NotFound();db.Remove(x);await db.SaveChangesAsync(ct);}
 public Task<List<SpecDefinitionDto>>GetDefinitionsAsync(int? c=null,CancellationToken ct=default)=>Defs(c).ToListAsync(ct);
 public async Task<SpecDefinitionDto>CreateDefinitionAsync(SpecDefinitionUpsertDto d,CancellationToken ct=default){var x=Set(new SpecificationDefinition(),d);db.Add(x);await db.SaveChangesAsync(ct);return await Defs().SingleAsync(y=>y.Id==x.Id,ct);}
 public async Task<SpecDefinitionDto>UpdateDefinitionAsync(int id,SpecDefinitionUpsertDto d,CancellationToken ct=default){var x=await db.SpecificationDefinitions.FindAsync([id],ct)??throw AppException.NotFound();Set(x,d);await db.SaveChangesAsync(ct);return await Defs().SingleAsync(y=>y.Id==id,ct);}
 public async Task DeleteDefinitionAsync(int id,CancellationToken ct=default){var x=await db.SpecificationDefinitions.FindAsync([id],ct)??throw AppException.NotFound();db.Remove(x);await db.SaveChangesAsync(ct);}
 public async Task<List<SpecTemplateGroupDto>>GetTemplateByCategoryAsync(int c,CancellationToken ct=default)=> (await Defs(c).ToListAsync(ct)).GroupBy(x=>new{x.SpecificationGroupId,x.GroupName}).Select(g=>new SpecTemplateGroupDto{GroupId=g.Key.SpecificationGroupId,GroupName=g.Key.GroupName,DisplayOrder=g.Min(x=>x.DisplayOrder),Fields=g.ToList()}).ToList();
 private IQueryable<SpecDefinitionDto> Defs(int? c=null){var q=db.SpecificationDefinitions.Include(x=>x.Category).Include(x=>x.SpecificationGroup).AsQueryable();if(c.HasValue)q=q.Where(x=>x.CategoryId==c);return q.Select(x=>new SpecDefinitionDto{Id=x.Id,CategoryId=x.CategoryId,CategoryName=x.Category.Name,SpecificationGroupId=x.SpecificationGroupId,GroupName=x.SpecificationGroup.Name,Name=x.Name,DisplayOrder=x.DisplayOrder,ControlType=x.ControlType,IsRequired=x.IsRequired,Options=System.Text.Json.JsonSerializer.Deserialize<List<string>>(x.OptionsJson??"[]", (System.Text.Json.JsonSerializerOptions?)null)!});}
 private static SpecificationDefinition Set(SpecificationDefinition x,SpecDefinitionUpsertDto d){x.CategoryId=d.CategoryId;x.SpecificationGroupId=d.SpecificationGroupId;x.Name=d.Name;x.DisplayOrder=d.DisplayOrder;x.ControlType=d.ControlType;x.IsRequired=d.IsRequired;x.OptionsJson=System.Text.Json.JsonSerializer.Serialize(d.Options??[]);return x;}
}
