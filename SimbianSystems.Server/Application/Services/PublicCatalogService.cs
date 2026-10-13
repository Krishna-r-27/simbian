using Microsoft.EntityFrameworkCore;
using SimbianSystems.Server.Application.Common;
using SimbianSystems.Server.Application.DTOs.Products;
using SimbianSystems.Server.Application.Interfaces.Services;
using SimbianSystems.Server.Persistence.Context;
namespace SimbianSystems.Server.Application.Services;
public sealed class PublicCatalogService(AppDbContext db):IPublicCatalogService {
 public Task<List<CategoryDto>> GetCategoriesAsync(CancellationToken ct=default)=>
  db.Categories.Where(x=>x.IsActive).OrderBy(x=>x.DisplayOrder)
   .Select(x=>new CategoryDto{Id=x.Id,Name=x.Name,Slug=x.Slug,Icon=x.Icon,Description=x.Description,DisplayOrder=x.DisplayOrder})
   .ToListAsync(ct);

 public async Task<PagedResult<ProductListItemDto>> GetPublishedProductsAsync(PaginationQuery q,string? slug=null,int? categoryId=null,CancellationToken ct=default){
  var x=db.Products.Include(p=>p.Category).Where(p=>p.IsPublished);
  if(categoryId.HasValue)x=x.Where(p=>p.CategoryId==categoryId);
  if(!string.IsNullOrWhiteSpace(slug))x=x.Where(p=>p.Category.Slug==slug);
  if(!string.IsNullOrWhiteSpace(q.Search))x=x.Where(p=>p.Name.Contains(q.Search));
  var total=await x.CountAsync(ct);
  var items=await x.OrderBy(p=>p.DisplayOrder).Skip((q.Page-1)*q.PageSize).Take(q.PageSize)
   .Select(p=>new ProductListItemDto{
    Id=p.Id,Name=p.Name,Slug=p.Slug,CategoryId=p.CategoryId,CategoryName=p.Category.Name,CategorySlug=p.Category.Slug,
    Brand=p.Brand,ModelNumber=p.ModelNumber,FeaturedImage=p.FeaturedImage,
    DisplayOrder=p.DisplayOrder,IsPublished=p.IsPublished,CreatedOn=p.CreatedOn,UpdatedOn=p.UpdatedOn
   }).ToListAsync(ct);
  return PagedResult<ProductListItemDto>.Create(items,q.Page,q.PageSize,total);
 }

 public async Task<ProductDetailDto> GetPublishedProductBySlugAsync(string slug,CancellationToken ct=default){
  var p=await db.Products.Include(x=>x.Category).Include(x=>x.GalleryImages)
   .Include(x=>x.Specifications).ThenInclude(x=>x.SpecificationDefinition).ThenInclude(x=>x.SpecificationGroup)
   .FirstOrDefaultAsync(x=>x.IsPublished&&x.Slug==slug,ct)??throw AppException.NotFound("Product not found.");
  return new ProductDetailDto{
   Id=p.Id,Name=p.Name,Slug=p.Slug,CategoryId=p.CategoryId,CategoryName=p.Category.Name,CategorySlug=p.Category.Slug,
   FeaturedImage=p.FeaturedImage,ShortDescription=p.ShortDescription,Description=p.Description,
   Brand=p.Brand,ModelNumber=p.ModelNumber,Warranty=p.Warranty,Brochure=p.Brochure,
   SeoTitle=p.SeoTitle,SeoKeywords=p.SeoKeywords,SeoDescription=p.SeoDescription,
   DisplayOrder=p.DisplayOrder,IsPublished=p.IsPublished,CreatedOn=p.CreatedOn,UpdatedOn=p.UpdatedOn,
   GalleryImages=p.GalleryImages.OrderBy(x=>x.DisplayOrder).ThenBy(x=>x.Id).Select(x=>x.ImageBasePath).ToList(),
   Specifications=p.Specifications.Select(x=>new ProductSpecValueDto{
    SpecificationDefinitionId=x.SpecificationDefinitionId,Value=x.Value,
    DefinitionName=x.SpecificationDefinition.Name,GroupName=x.SpecificationDefinition.SpecificationGroup.Name,
    ControlType=x.SpecificationDefinition.ControlType
   }).ToList()
  };
 }
}
