using Microsoft.EntityFrameworkCore;
using SimbianSystems.Server.Application.Common;
using SimbianSystems.Server.Application.DTOs.Products;
using SimbianSystems.Server.Application.Interfaces;
using SimbianSystems.Server.Application.Interfaces.Services;
using SimbianSystems.Server.Domain.Entities;
using SimbianSystems.Server.Persistence.Context;

namespace SimbianSystems.Server.Application.Services;
public sealed class ProductService(AppDbContext db, IFileStorageService files, IAuditService audit, IExportService exports) : IProductService
{
    public async Task<PagedResult<ProductListItemDto>> GetPagedAsync(PaginationQuery q,int? categoryId=null,bool? published=null,CancellationToken ct=default) {
        var query=db.Products.Include(x=>x.Category).AsQueryable();
        if(categoryId.HasValue)query=query.Where(x=>x.CategoryId==categoryId);
        if(published.HasValue)query=query.Where(x=>x.IsPublished==published);
        if(!string.IsNullOrWhiteSpace(q.Search)) {var s=q.Search.Trim();query=query.Where(x=>x.Name.Contains(s)|| (x.Brand??"").Contains(s)||(x.ModelNumber??"").Contains(s));}
        var total=await query.CountAsync(ct);
        var items=await query.OrderByDescending(x=>x.CreatedOn).Skip((q.Page-1)*q.PageSize).Take(q.PageSize)
            .Select(x=>new ProductListItemDto{
                Id=x.Id,Name=x.Name,Slug=x.Slug,CategoryId=x.CategoryId,CategoryName=x.Category.Name,CategorySlug=x.Category.Slug,
                Brand=x.Brand,ModelNumber=x.ModelNumber,FeaturedImage=x.FeaturedImage,
                DisplayOrder=x.DisplayOrder,IsPublished=x.IsPublished,CreatedOn=x.CreatedOn,UpdatedOn=x.UpdatedOn
            }).ToListAsync(ct);
        return PagedResult<ProductListItemDto>.Create(items,q.Page,q.PageSize,total);
    }
    public async Task<ProductDetailDto> GetByIdAsync(int id,CancellationToken ct=default)=>Detail(await Full(id,ct));
    public async Task<ProductDetailDto> CreateAsync(ProductUpsertDto dto,CancellationToken ct=default) {
        await EnsureCategory(dto.CategoryId,ct); var product=Apply(new Product(),dto); product.Slug=await UniqueSlug(dto.Name,null,ct);
        db.Products.Add(product); await db.SaveChangesAsync(ct); await ReplaceSpecs(product,dto,ct); await audit.LogAsync("Product",product.Id.ToString(),"Create",product.Name,ct); return await GetByIdAsync(product.Id,ct);
    }
    public async Task<ProductDetailDto> UpdateAsync(int id,ProductUpsertDto dto,CancellationToken ct=default) {
        var p=await Full(id,ct); await EnsureCategory(dto.CategoryId,ct); var old=p.FeaturedImage; Apply(p,dto); p.Slug=await UniqueSlug(dto.Name,id,ct); p.UpdatedOn=DateTime.UtcNow;
        if(old!=p.FeaturedImage)await files.DeleteAsync(old,ct); await ReplaceSpecs(p,dto,ct); await db.SaveChangesAsync(ct); await audit.LogAsync("Product",id.ToString(),"Update",p.Name,ct); return Detail(p);
    }
    public async Task<ProductDetailDto> ReorderGalleryAsync(int id,ProductGalleryOrderDto dto,CancellationToken ct=default) {
        var p=await Full(id,ct);
        var ordered=(dto.GalleryImages??[]).Where(x=>!string.IsNullOrWhiteSpace(x)).Select(x=>x.Trim()).Distinct().ToList();
        var byPath=p.GalleryImages.GroupBy(x=>x.ImageBasePath).ToDictionary(g=>g.Key,g=>g.First());
        var assigned=new HashSet<int>();
        var order=0;
        foreach(var path in ordered){
            if(!byPath.TryGetValue(path,out var image)||!assigned.Add(image.Id)) continue;
            image.DisplayOrder=order++;
        }
        foreach(var image in p.GalleryImages.Where(x=>!assigned.Contains(x.Id)).OrderBy(x=>x.DisplayOrder).ThenBy(x=>x.Id))
            image.DisplayOrder=order++;
        p.UpdatedOn=DateTime.UtcNow; await db.SaveChangesAsync(ct);
        await audit.LogAsync("Product",id.ToString(),"UpdateGallery",p.Name,ct); return Detail(p);
    }
    public async Task DeleteAsync(int id,CancellationToken ct=default) {var p=await Full(id,ct); await files.DeleteAsync(p.FeaturedImage,ct); foreach(var image in p.GalleryImages)await files.DeleteAsync(image.ImageBasePath,ct); await files.DeleteFileAsync(p.Brochure,ct); db.Products.Remove(p);await db.SaveChangesAsync(ct);await audit.LogAsync("Product",id.ToString(),"Delete",p.Name,ct);}
    public async Task<ProductDetailDto> DuplicateAsync(int id,CancellationToken ct=default) {var s=await Full(id,ct);var p=new Product(); Apply(p,new ProductUpsertDto {CategoryId=s.CategoryId,Name=s.Name+" Copy",ShortDescription=s.ShortDescription,Description=s.Description,FeaturedImage=s.FeaturedImage,Brochure=s.Brochure,Brand=s.Brand,ModelNumber=s.ModelNumber,Warranty=s.Warranty,DisplayOrder=s.DisplayOrder,IsPublished=false,SeoTitle=s.SeoTitle,SeoKeywords=s.SeoKeywords,SeoDescription=s.SeoDescription,GalleryImages=s.GalleryImages.Select(x=>x.ImageBasePath).ToList(),Specifications=s.Specifications.Select(x=>new ProductSpecValueDto{SpecificationDefinitionId=x.SpecificationDefinitionId,Value=x.Value}).ToList()});p.Slug=await UniqueSlug(p.Name,null,ct);db.Products.Add(p);await db.SaveChangesAsync(ct);await ReplaceSpecs(p,new ProductUpsertDto{Specifications=s.Specifications.Select(x=>new ProductSpecValueDto{SpecificationDefinitionId=x.SpecificationDefinitionId,Value=x.Value}).ToList()},ct);return await GetByIdAsync(p.Id,ct);}
    public async Task BulkDeleteAsync(IEnumerable<int> ids,CancellationToken ct=default){foreach(var id in ids.Distinct().ToList())await DeleteAsync(id,ct);}
    public async Task BulkPublishAsync(IEnumerable<int> ids,bool published,CancellationToken ct=default){var rows=await db.Products.Where(x=>ids.Contains(x.Id)).ToListAsync(ct);rows.ForEach(x=>{x.IsPublished=published;x.UpdatedOn=DateTime.UtcNow;});await db.SaveChangesAsync(ct);}
    public Task<List<CategoryDto>> GetCategoriesAsync(CancellationToken ct=default)=>db.Categories.Where(x=>x.IsActive).OrderBy(x=>x.DisplayOrder).Select(x=>new CategoryDto{Id=x.Id,Name=x.Name,Slug=x.Slug,Icon=x.Icon,Description=x.Description,DisplayOrder=x.DisplayOrder}).ToListAsync(ct);
    public async Task<byte[]> ExportAsync(bool excel,CancellationToken ct=default){
        var data=await db.Products.Include(x=>x.Category).Select(x=>new ProductListItemDto{
            Id=x.Id,Name=x.Name,Slug=x.Slug,CategoryId=x.CategoryId,CategoryName=x.Category.Name,CategorySlug=x.Category.Slug,
            Brand=x.Brand,ModelNumber=x.ModelNumber,FeaturedImage=x.FeaturedImage,
            DisplayOrder=x.DisplayOrder,IsPublished=x.IsPublished,CreatedOn=x.CreatedOn,UpdatedOn=x.UpdatedOn
        }).ToListAsync(ct);
        var cols=new[]{("Name",(Func<ProductListItemDto,object?>)(x=>x.Name)),("Category",x=>x.CategoryName),("Published",x=>x.IsPublished)};
        return excel?exports.ExportToExcel(data,cols,"Products"):exports.ExportToCsv(data,cols);
    }
    private async Task<Product> Full(int id,CancellationToken ct)=>await db.Products.Include(x=>x.Category).Include(x=>x.GalleryImages).Include(x=>x.Specifications).ThenInclude(x=>x.SpecificationDefinition).ThenInclude(x=>x.SpecificationGroup).FirstOrDefaultAsync(x=>x.Id==id,ct)??throw AppException.NotFound("Product not found.");
    private async Task EnsureCategory(int id,CancellationToken ct){if(!await db.Categories.AnyAsync(x=>x.Id==id,ct))throw AppException.BadRequest("Invalid category.");}
    private async Task<string> UniqueSlug(string name,int? id,CancellationToken ct){var b=SlugHelper.Generate(name);var s=b;var n=2;while(await db.Products.AnyAsync(x=>x.Slug==s&&(!id.HasValue||x.Id!=id),ct))s=$"{b}-{n++}";return s;}
    private async Task ReplaceSpecs(Product p,ProductUpsertDto dto,CancellationToken ct){db.ProductSpecifications.RemoveRange(p.Specifications);p.Specifications.Clear();foreach(var s in dto.Specifications.Where(x=>x.SpecificationDefinitionId>0)){p.Specifications.Add(new ProductSpecification{ProductId=p.Id,SpecificationDefinitionId=s.SpecificationDefinitionId,Value=s.Value});} ReplaceGallery(p,dto.GalleryImages);await db.SaveChangesAsync(ct);}
    private static void ReplaceGallery(Product p,IEnumerable<string>? paths){p.GalleryImages.Clear();var order=0;foreach(var path in (paths??[]).Where(x=>!string.IsNullOrWhiteSpace(x)).Select(x=>x.Trim()).Distinct().Take(12))p.GalleryImages.Add(new ProductGalleryImage{ImageBasePath=path,DisplayOrder=order++});}
    private static Product Apply(Product p,ProductUpsertDto d){p.CategoryId=d.CategoryId;p.Name=d.Name.Trim();p.ShortDescription=d.ShortDescription;p.Description=d.Description;p.FeaturedImage=d.FeaturedImage;p.Brochure=d.Brochure;p.Brand=d.Brand;p.ModelNumber=d.ModelNumber;p.Warranty=d.Warranty;p.DisplayOrder=d.DisplayOrder;p.IsPublished=d.IsPublished;p.SeoTitle=d.SeoTitle;p.SeoKeywords=d.SeoKeywords;p.SeoDescription=d.SeoDescription;return p;}
    private static ProductListItemDto List(Product p)=>new(){Id=p.Id,Name=p.Name,Slug=p.Slug,CategoryId=p.CategoryId,CategoryName=p.Category.Name,CategorySlug=p.Category.Slug,Brand=p.Brand,ModelNumber=p.ModelNumber,FeaturedImage=p.FeaturedImage,DisplayOrder=p.DisplayOrder,IsPublished=p.IsPublished,CreatedOn=p.CreatedOn,UpdatedOn=p.UpdatedOn};
    private static ProductDetailDto Detail(Product p)=>new(){Id=p.Id,Name=p.Name,Slug=p.Slug,CategoryId=p.CategoryId,CategoryName=p.Category.Name,CategorySlug=p.Category.Slug,Brand=p.Brand,ModelNumber=p.ModelNumber,FeaturedImage=p.FeaturedImage,DisplayOrder=p.DisplayOrder,IsPublished=p.IsPublished,CreatedOn=p.CreatedOn,UpdatedOn=p.UpdatedOn,ShortDescription=p.ShortDescription,Description=p.Description,Brochure=p.Brochure,Warranty=p.Warranty,SeoTitle=p.SeoTitle,SeoKeywords=p.SeoKeywords,SeoDescription=p.SeoDescription,GalleryImages=p.GalleryImages.OrderBy(x=>x.DisplayOrder).ThenBy(x=>x.Id).Select(x=>x.ImageBasePath).ToList(),Specifications=p.Specifications.Select(x=>new ProductSpecValueDto{SpecificationDefinitionId=x.SpecificationDefinitionId,Value=x.Value,DefinitionName=x.SpecificationDefinition.Name,GroupName=x.SpecificationDefinition.SpecificationGroup.Name,ControlType=x.SpecificationDefinition.ControlType}).ToList()};
}
