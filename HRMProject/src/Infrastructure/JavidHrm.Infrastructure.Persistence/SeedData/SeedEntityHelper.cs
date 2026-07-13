using JavidHrm.Domain.Common;

namespace JavidHrm.Infrastructure.Persistence.SeedData;

internal static class SeedEntityHelper
{
    public static TEntity WithId<TEntity>(TEntity entity, int id)
        where TEntity : BaseEntity
    {
        typeof(BaseEntity).GetProperty(nameof(BaseEntity.Id))!
            .SetValue(entity, id);
        return entity;
    }
}
