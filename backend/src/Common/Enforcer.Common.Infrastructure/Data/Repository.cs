using System.Linq.Expressions;
using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain.DomainEvents;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Common.Infrastructure.Data;

public class Repository<TEntity> : IRepository<TEntity> where TEntity : Entity
{
    protected readonly DbContext _context;
    protected readonly DbSet<TEntity> _dbSet;

    public Repository(DbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _dbSet = _context.Set<TEntity>();
    }

    public virtual async Task<TEntity?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _dbSet
            .AsNoTracking()
            .FirstOrDefaultAsync(entity => entity.Id == id, ct);
    }

    public virtual Task<List<TEntity>> GetAllAsync(CancellationToken ct = default)
    {
        return _dbSet.AsNoTracking().ToListAsync(ct);
    }

    public virtual Task<List<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken ct = default)
    {
        return _dbSet
            .AsNoTracking()
            .Where(predicate)
            .ToListAsync(ct);
    }

    public virtual Task<TEntity?> FirstOrDefaultAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken ct = default)
    {
        return _dbSet.AsNoTracking().FirstOrDefaultAsync(predicate, ct);
    }

    public virtual async Task AddAsync(TEntity entity, CancellationToken ct = default)
    {
        await _dbSet.AddAsync(entity, ct);
    }

    public virtual async Task AddRangeAsync(IEnumerable<TEntity> entities, CancellationToken ct = default)
    {
        await _dbSet.AddRangeAsync(entities, ct);
    }

    public virtual void Update(TEntity entity)
    {
        _dbSet.Update(entity);
    }

    public virtual void UpdateRange(IEnumerable<TEntity> entities)
    {
        _dbSet.UpdateRange(entities);
    }

    public virtual void Delete(TEntity entity)
    {
        _dbSet.Remove(entity);
    }

    public virtual Task<int> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        return _dbSet.Where(entity => entity.Id == id).ExecuteDeleteAsync(ct);
    }

    public virtual void DeleteRange(IEnumerable<TEntity> entities)
    {
        _dbSet.RemoveRange(entities);
    }

    public virtual IQueryable<TEntity> Query()
    {
        return _dbSet.AsNoTracking().AsQueryable();
    }

    public Task<bool> ExistsAsync(Guid id, CancellationToken ct = default)
    {
        return _dbSet.AsNoTracking().AnyAsync(entity => entity.Id == id, ct);
    }

    public virtual async Task<int> CountAsync(
        Expression<Func<TEntity, bool>>? predicate = null,
        CancellationToken ct = default)
    {
        return predicate == null
            ? await _dbSet.AsNoTracking().CountAsync(ct)
            : await _dbSet.AsNoTracking().CountAsync(predicate, ct);
    }
}