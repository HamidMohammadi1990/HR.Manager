using System.Collections.Concurrent;
using System.Linq.Expressions;
using System.Reflection;
using Microsoft.EntityFrameworkCore;

namespace JavidHrm.Infrastructure.Persistence.ContentPolicies;

internal static class ContentPolicyQueryableReflection
{
    private static readonly ConcurrentDictionary<Type, Func<DbContext, IQueryable>> QueryableFactories = new();
    private static readonly ConcurrentDictionary<Type, Func<IQueryable, LambdaExpression, IQueryable>> WhereDelegates = new();
    private static readonly ConcurrentDictionary<Type, Func<IQueryable, CancellationToken, Task<bool>>> AnyAsyncDelegates = new();
    private static readonly ConcurrentDictionary<Type, Func<IQueryable, CancellationToken, Task<int>>> CountAsyncDelegates = new();
    private static readonly ConcurrentDictionary<(Type EntityType, int SampleSize), Func<IQueryable, CancellationToken, Task<List<int>>>> TakeIdsAsyncDelegates = new();

    public static IQueryable GetQueryable(DbContext context, Type entityType)
        => QueryableFactories.GetOrAdd(entityType, CreateQueryableFactory)(context);

    public static IQueryable ApplyWhere(IQueryable source, Type entityType, LambdaExpression predicate)
        => WhereDelegates.GetOrAdd(entityType, CreateWhereDelegate)(source, predicate);

    public static Task<bool> ExecuteAnyAsync(IQueryable query, Type entityType, CancellationToken cancellationToken)
        => AnyAsyncDelegates.GetOrAdd(entityType, CreateAnyAsyncDelegate)(query, cancellationToken);

    public static Task<int> ExecuteCountAsync(IQueryable query, Type entityType, CancellationToken cancellationToken)
        => CountAsyncDelegates.GetOrAdd(entityType, CreateCountAsyncDelegate)(query, cancellationToken);

    public static Task<List<int>> ExecuteTakeIdsAsync(
        IQueryable query,
        Type entityType,
        int sampleSize,
        CancellationToken cancellationToken)
        => TakeIdsAsyncDelegates.GetOrAdd((entityType, sampleSize), CreateTakeIdsAsyncDelegate)(query, cancellationToken);

    private static Func<DbContext, IQueryable> CreateQueryableFactory(Type entityType)
        => context => (IQueryable)InvokeGeneric(nameof(GetQueryableCore), entityType, context)!;

    private static Func<IQueryable, LambdaExpression, IQueryable> CreateWhereDelegate(Type entityType)
        => (source, predicate) => (IQueryable)InvokeGeneric(nameof(ApplyWhereCore), entityType, source, predicate)!;

    private static Func<IQueryable, CancellationToken, Task<bool>> CreateAnyAsyncDelegate(Type entityType)
        => (query, cancellationToken) => (Task<bool>)InvokeGeneric(nameof(ExecuteAnyAsyncCore), entityType, query, cancellationToken)!;

    private static Func<IQueryable, CancellationToken, Task<int>> CreateCountAsyncDelegate(Type entityType)
        => (query, cancellationToken) => (Task<int>)InvokeGeneric(nameof(ExecuteCountAsyncCore), entityType, query, cancellationToken)!;

    private static Func<IQueryable, CancellationToken, Task<List<int>>> CreateTakeIdsAsyncDelegate((Type EntityType, int SampleSize) key)
        => (query, cancellationToken) => (Task<List<int>>)InvokeGeneric(
            nameof(ExecuteTakeIdsAsyncCore),
            key.EntityType,
            query,
            key.SampleSize,
            cancellationToken)!;

    private static IQueryable<TEntity> GetQueryableCore<TEntity>(DbContext context)
        where TEntity : class
        => context.Set<TEntity>();

    private static IQueryable<TEntity> ApplyWhereCore<TEntity>(IQueryable source, LambdaExpression predicate)
        where TEntity : class
        => ((IQueryable<TEntity>)source).Where((Expression<Func<TEntity, bool>>)predicate);

    private static Task<bool> ExecuteAnyAsyncCore<TEntity>(IQueryable query, CancellationToken cancellationToken)
        where TEntity : class
        => ((IQueryable<TEntity>)query).AnyAsync(cancellationToken);

    private static Task<int> ExecuteCountAsyncCore<TEntity>(IQueryable query, CancellationToken cancellationToken)
        where TEntity : class
        => ((IQueryable<TEntity>)query).CountAsync(cancellationToken);

    private static Task<List<int>> ExecuteTakeIdsAsyncCore<TEntity>(
        IQueryable query,
        int sampleSize,
        CancellationToken cancellationToken)
        where TEntity : class
        => ((IQueryable<TEntity>)query)
            .OrderBy(entity => EF.Property<int>(entity, nameof(Domain.Common.IEntity<int>.Id)))
            .Take(sampleSize)
            .Select(entity => EF.Property<int>(entity, nameof(Domain.Common.IEntity<int>.Id)))
            .ToListAsync(cancellationToken);

    private static object? InvokeGeneric(string methodName, Type entityType, params object?[] args)
    {
        var methods = typeof(ContentPolicyQueryableReflection)
            .GetMethods(BindingFlags.NonPublic | BindingFlags.Static)
            .Where(method =>
                method.Name == methodName
                && method.IsGenericMethodDefinition
                && method.GetParameters().Length == args.Length)
            .ToArray();

        if (methods.Length != 1)
        {
            throw new InvalidOperationException(
                $"Expected exactly one generic method '{methodName}' on '{typeof(ContentPolicyQueryableReflection).FullName}' with {args.Length} parameters, found {methods.Length}.");
        }

        return methods[0].MakeGenericMethod(entityType).Invoke(null, args);
    }
}
