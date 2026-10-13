using Microsoft.EntityFrameworkCore;
using SimbianSystems.Server.Domain.Entities;

namespace SimbianSystems.Server.Persistence.Context;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Admin> Admins => Set<Admin>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductGalleryImage> ProductGalleryImages => Set<ProductGalleryImage>();
    public DbSet<SpecificationGroup> SpecificationGroups => Set<SpecificationGroup>();
    public DbSet<SpecificationDefinition> SpecificationDefinitions => Set<SpecificationDefinition>();
    public DbSet<ProductSpecification> ProductSpecifications => Set<ProductSpecification>();
    public DbSet<Enquiry> Enquiries => Set<Enquiry>();
    public DbSet<ProductQuote> ProductQuotes => Set<ProductQuote>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<ExceptionLog> ExceptionLogs => Set<ExceptionLog>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Admin>(e =>
        {
            e.HasIndex(x => x.Username).IsUnique();
            e.HasIndex(x => x.Email).IsUnique();
        });

        builder.Entity<RefreshToken>(e =>
        {
            e.HasIndex(x => x.Token).IsUnique();
        });

        builder.Entity<Category>(e =>
        {
            e.HasIndex(x => x.Slug).IsUnique();
        });

        builder.Entity<Product>(e =>
        {
            e.HasIndex(x => x.Slug).IsUnique();
            e.HasOne(x => x.Category).WithMany(x => x.Products).HasForeignKey(x => x.CategoryId).OnDelete(DeleteBehavior.Restrict);
            e.Property(x => x.Description).HasColumnType("longtext");
        });

        builder.Entity<ProductGalleryImage>(e =>
        {
            e.HasOne(x => x.Product).WithMany(x => x.GalleryImages).HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<SpecificationDefinition>(e =>
        {
            e.HasOne(x => x.Category).WithMany(x => x.SpecificationDefinitions).HasForeignKey(x => x.CategoryId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.SpecificationGroup).WithMany(x => x.Definitions).HasForeignKey(x => x.SpecificationGroupId).OnDelete(DeleteBehavior.Restrict);
            e.Property(x => x.OptionsJson).HasColumnType("longtext");
        });

        builder.Entity<ProductSpecification>(e =>
        {
            e.HasOne(x => x.Product).WithMany(x => x.Specifications).HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.SpecificationDefinition).WithMany(x => x.ProductSpecifications).HasForeignKey(x => x.SpecificationDefinitionId).OnDelete(DeleteBehavior.Restrict);
            e.HasIndex(x => new { x.ProductId, x.SpecificationDefinitionId }).IsUnique();
            e.Property(x => x.Value).HasColumnType("longtext");
        });

        builder.Entity<ProductQuote>(e =>
        {
            e.HasOne(x => x.Product).WithMany(x => x.Quotes).HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.Restrict);
            e.Property(x => x.Message).HasColumnType("longtext");
        });

        builder.Entity<Enquiry>(e =>
        {
            e.Property(x => x.Message).HasColumnType("longtext");
        });

        builder.Entity<AuditLog>(e =>
        {
            e.Property(x => x.Details).HasColumnType("longtext");
        });

        builder.Entity<ExceptionLog>(e =>
        {
            e.Property(x => x.Message).HasColumnType("longtext");
            e.Property(x => x.StackTrace).HasColumnType("longtext");
            e.Property(x => x.InnerException).HasColumnType("longtext");
            e.HasIndex(x => x.CreatedOn);
        });
    }
}
