using System.Linq.Expressions;

namespace SimbianSystems.Server.Application.Interfaces;

public interface IRepository<T> where T : class
{
    IQueryable<T> Query(bool asNoTracking = true);
    Task<T?> GetByIdAsync(object id, CancellationToken cancellationToken = default);
    Task<List<T>> ListAsync(Expression<Func<T, bool>>? predicate = null, CancellationToken cancellationToken = default);
    Task<bool> AnyAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default);
    Task AddAsync(T entity, CancellationToken cancellationToken = default);
    Task AddRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default);
    void Update(T entity);
    void Remove(T entity);
    void RemoveRange(IEnumerable<T> entities);
}
