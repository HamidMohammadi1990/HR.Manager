using JavidHrm.Domain.Common;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace JavidHrm.Infrastructure.Persistence.Repositories;

public abstract class Repository<TEntity, TKey>(JavidHrmDbContext context)
    where TEntity : class, IEntity<TKey>
    where TKey : notnull
{
    protected JavidHrmDbContext Context { get; } = context;

    private DbSet<TEntity> DbSet { get; } = context.Set<TEntity>();

    public virtual ValueTask<TEntity?> FindAsync(TKey id, CancellationToken cancellationToken = default)
        => DbSet.FindAsync([id!], cancellationToken);

    public virtual Task<TEntity?> GetAsNoTrackingAsync(TKey id, CancellationToken cancellationToken = default)
        => DbSet.AsNoTracking().FirstOrDefaultAsync(x => x.Id.Equals(id), cancellationToken);

    public void Add(TEntity entity)
        => DbSet.Add(entity);

    public void Remove(TEntity entity)
        => DbSet.Remove(entity);

    public Task<bool> AnyAsync(Expression<Func<TEntity, bool>> expression, CancellationToken cancellationToken = default)
        => DbSet.AnyAsync(expression, cancellationToken);
}

public abstract class Repository<TEntity>(JavidHrmDbContext context)
    : Repository<TEntity, int>(context)
    where TEntity : BaseEntity;