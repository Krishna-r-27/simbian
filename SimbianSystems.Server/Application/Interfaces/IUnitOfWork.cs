using SimbianSystems.Server.Domain.Entities;

namespace SimbianSystems.Server.Application.Interfaces;

public interface IUnitOfWork : IAsyncDisposable
{
    IRepository<Admin> Admins { get; }
    IRepository<RefreshToken> RefreshTokens { get; }
    IRepository<Category> Categories { get; }
    IRepository<Product> Products { get; }
    IRepository<ProductGalleryImage> ProductGalleryImages { get; }
    IRepository<SpecificationGroup> SpecificationGroups { get; }
    IRepository<SpecificationDefinition> SpecificationDefinitions { get; }
    IRepository<ProductSpecification> ProductSpecifications { get; }
    IRepository<Enquiry> Enquiries { get; }
    IRepository<ProductQuote> ProductQuotes { get; }
    IRepository<AuditLog> AuditLogs { get; }
    IRepository<ExceptionLog> ExceptionLogs { get; }

    IRepository<T> GetRepository<T>() where T : class;
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
