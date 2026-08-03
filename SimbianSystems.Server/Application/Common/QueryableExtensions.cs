using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace SimbianSystems.Server.Application.Common;

public static class QueryableExtensions
{
    public static async Task<PagedResult<T>> ToPagedResultAsync<T>(
        this IQueryable<T> query,
        PaginationQuery pagination,
        CancellationToken cancellationToken = default)
    {
        var total = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((pagination.Page - 1) * pagination.PageSize)
            .Take(pagination.PageSize)
            .ToListAsync(cancellationToken);

        return PagedResult<T>.Create(items, pagination.Page, pagination.PageSize, total);
    }

    public static IQueryable<T> ApplyOrdering<T>(
        this IQueryable<T> query,
        PaginationQuery pagination,
        string defaultSortProperty,
        params string[] allowedProperties)
    {
        var sortBy = string.IsNullOrWhiteSpace(pagination.SortBy)
            ? defaultSortProperty
            : pagination.SortBy;

        if (allowedProperties.Length > 0 &&
            !allowedProperties.Contains(sortBy, StringComparer.OrdinalIgnoreCase))
        {
            sortBy = defaultSortProperty;
        }

        var parameter = Expression.Parameter(typeof(T), "x");
        var property = typeof(T).GetProperties()
            .FirstOrDefault(p => string.Equals(p.Name, sortBy, StringComparison.OrdinalIgnoreCase));

        if (property is null)
        {
            property = typeof(T).GetProperty(defaultSortProperty)
                       ?? typeof(T).GetProperties().First();
        }

        var propertyAccess = Expression.MakeMemberAccess(parameter, property);
        var conversion = Expression.Convert(propertyAccess, typeof(object));
        var lambda = Expression.Lambda<Func<T, object>>(conversion, parameter);

        return pagination.IsDescending
            ? query.OrderByDescending(lambda)
            : query.OrderBy(lambda);
    }
}
