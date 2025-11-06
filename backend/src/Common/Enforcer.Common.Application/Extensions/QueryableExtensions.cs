using Enforcer.Common.Application.Data;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Common.Application.Extensions;

public static class QueryableExtensions
{
    public static IQueryable<T> Paginate<T>(this IQueryable<T> query, Pagination pagination)
    {
        return query.Skip(pagination.PageSize * (pagination.PageNumber - 1)).Take(pagination.PageSize);
    }

    public static async Task<PagedResponse<T>> ToPagedResponseAsync<T>(
        this IEnumerable<T> source,
        Pagination pagination,
        int totalCount)
    {
        var items = await ((IQueryable<T>)source).ToListAsync();

        return new PagedResponse<T>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = pagination.PageNumber,
            PageSize = pagination.PageSize
        };
    }
}