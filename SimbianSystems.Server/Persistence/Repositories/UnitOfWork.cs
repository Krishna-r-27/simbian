using SimbianSystems.Server.Application.Interfaces;
using SimbianSystems.Server.Domain.Entities;
using SimbianSystems.Server.Persistence.Context;

namespace SimbianSystems.Server.Persistence.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;
    private readonly Dictionary<Type, object> _repositories = new();

    private IRepository<Admin>? _admins;
    private IRepository<RefreshToken>? _refreshTokens;
    private IRepository<Category>? _categories;
    private IRepository<Product>? _products;
    private IRepository<ProductGalleryImage>? _gallery;
    private IRepository<SpecificationGroup>? _specGroups;
    private IRepository<SpecificationDefinition>? _specDefs;
    private IRepository<ProductSpecification>? _productSpecs;
    private IRepository<Enquiry>? _enquiries;
    private IRepository<ProductQuote>? _quotes;
    private IRepository<AuditLog>? _auditLogs;
    private IRepository<ExceptionLog>? _exceptionLogs;

    public UnitOfWork(AppDbContext context) => _context = context;

    public IRepository<Admin> Admins => _admins ??= new Repository<Admin>(_context);
    public IRepository<RefreshToken> RefreshTokens => _refreshTokens ??= new Repository<RefreshToken>(_context);
    public IRepository<Category> Categories => _categories ??= new Repository<Category>(_context);
    public IRepository<Product> Products => _products ??= new Repository<Product>(_context);
    public IRepository<ProductGalleryImage> ProductGalleryImages => _gallery ??= new Repository<ProductGalleryImage>(_context);
    public IRepository<SpecificationGroup> SpecificationGroups => _specGroups ??= new Repository<SpecificationGroup>(_context);
    public IRepository<SpecificationDefinition> SpecificationDefinitions => _specDefs ??= new Repository<SpecificationDefinition>(_context);
    public IRepository<ProductSpecification> ProductSpecifications => _productSpecs ??= new Repository<ProductSpecification>(_context);
    public IRepository<Enquiry> Enquiries => _enquiries ??= new Repository<Enquiry>(_context);
    public IRepository<ProductQuote> ProductQuotes => _quotes ??= new Repository<ProductQuote>(_context);
    public IRepository<AuditLog> AuditLogs => _auditLogs ??= new Repository<AuditLog>(_context);
    public IRepository<ExceptionLog> ExceptionLogs => _exceptionLogs ??= new Repository<ExceptionLog>(_context);

    public IRepository<T> GetRepository<T>() where T : class
    {
        var type = typeof(T);
        if (_repositories.TryGetValue(type, out var existing))
            return (IRepository<T>)existing;

        var repository = new Repository<T>(_context);
        _repositories[type] = repository;
        return repository;
    }

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        => _context.SaveChangesAsync(cancellationToken);

    public ValueTask DisposeAsync() => _context.DisposeAsync();
}
