using System.Reflection;
using System.Linq.Expressions;
using System.Collections.Concurrent;
using Microsoft.EntityFrameworkCore;

namespace JavidHrm.Infrastructure.Persistence.ContentPolicies;

internal static class ContentPolicyQueryableReflection
{
    private static readonly MethodInfo WhereMethodDefinition = GetQueryableMethod(
        nameof(Queryable.Where),
        parameters =>
            IsQueryableParameter(parameters[0])
            && IsExpressionParameter(parameters[1]));

    private static readonly MethodInfo AnyAsyncMethodDefinition = GetQueryableAsyncMethod(
        nameof(EntityFrameworkQueryableExtensions.AnyAsync),
        parameters =>
            IsQueryableParameter(parameters[0])
            && parameters[1].ParameterType == typeof(CancellationToken));

    private static readonly MethodInfo SetMethodDefinition = typeof(DbContext)
        .GetMethods(BindingFlags.Public | BindingFlags.Instance)
        .Single(method =>
            method.Name == nameof(DbContext.Set)
            && method.IsGenericMethodDefinition
            && method.GetParameters().Length == 0);

    private static readonly MethodInfo CountAsyncMethodDefinition = GetQueryableAsyncMethod(
        nameof(EntityFrameworkQueryableExtensions.CountAsync),
        parameters =>
            IsQueryableParameter(parameters[0])
            && parameters[1].ParameterType == typeof(CancellationToken));

    private static readonly MethodInfo ToListAsyncMethodDefinition = GetQueryableAsyncMethod(
        nameof(EntityFrameworkQueryableExtensions.ToListAsync),
        parameters =>
            IsQueryableParameter(parameters[0])
            && parameters[1].ParameterType == typeof(CancellationToken));

    private static readonly MethodInfo OrderByMethodDefinition = GetQueryableMethod(
        nameof(Queryable.OrderBy),
        parameters =>
            IsQueryableParameter(parameters[0])
            && IsExpressionParameter(parameters[1]));

    private static readonly MethodInfo TakeMethodDefinition = GetQueryableMethod(
        nameof(Queryable.Take),
        parameters =>
            IsQueryableParameter(parameters[0])
            && parameters[1].ParameterType == typeof(int));

    private static readonly MethodInfo SelectMethodDefinition = GetQueryableMethod(
        nameof(Queryable.Select),
        parameters =>
            IsQueryableParameter(parameters[0])
            && IsExpressionParameter(parameters[1]));

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

    private static MethodInfo GetQueryableMethod(string name, Func<ParameterInfo[], bool> parameterValidator)
        => GetSingleGenericMethod(typeof(Queryable), name, parameterValidator, BindingFlags.Public | BindingFlags.Static);

    private static MethodInfo GetQueryableAsyncMethod(string name, Func<ParameterInfo[], bool> parameterValidator)
        => GetSingleGenericMethod(
            typeof(EntityFrameworkQueryableExtensions),
            name,
            parameterValidator,
            BindingFlags.Public | BindingFlags.Static);

    private static MethodInfo GetSingleGenericMethod(
        Type type,
        string name,
        Func<ParameterInfo[], bool> parameterValidator,
        BindingFlags bindingFlags)
    {
        var matches = type
            .GetMethods(bindingFlags)
            .Where(method =>
                method.Name == name
                && method.IsGenericMethodDefinition
                && parameterValidator(method.GetParameters()))
            .ToArray();

        if (matches.Length != 1)
        {
            throw new InvalidOperationException(
                $"Expected exactly one generic method '{name}' on '{type.FullName}', found {matches.Length}.");
        }

        return matches[0];
    }

    private static bool IsQueryableParameter(ParameterInfo parameter)
        => parameter.ParameterType.IsGenericType
           && parameter.ParameterType.GetGenericTypeDefinition() == typeof(IQueryable<>);

    private static bool IsExpressionParameter(ParameterInfo parameter)
        => parameter.ParameterType.IsGenericType
           && parameter.ParameterType.GetGenericTypeDefinition() == typeof(Expression<>);

    private static Func<DbContext, IQueryable> CreateQueryableFactory(Type entityType)
    {
        var setMethod = SetMethodDefinition.MakeGenericMethod(entityType);
        return ctx => (IQueryable)setMethod.Invoke(ctx, null)!;
    }

    private static Func<IQueryable, LambdaExpression, IQueryable> CreateWhereDelegate(Type entityType)
    {
        var whereMethod = WhereMethodDefinition.MakeGenericMethod(entityType);
        return (source, predicate) => (IQueryable)whereMethod.Invoke(null, [source, predicate])!;
    }

    private static Func<IQueryable, CancellationToken, Task<bool>> CreateAnyAsyncDelegate(Type entityType)
    {
        var anyAsyncMethod = AnyAsyncMethodDefinition.MakeGenericMethod(entityType);
        return (query, cancellationToken) => (Task<bool>)anyAsyncMethod.Invoke(null, [query, cancellationToken])!;
    }

    private static Func<IQueryable, CancellationToken, Task<int>> CreateCountAsyncDelegate(Type entityType)
    {
        var countAsyncMethod = CountAsyncMethodDefinition.MakeGenericMethod(entityType);
        return (query, cancellationToken) => (Task<int>)countAsyncMethod.Invoke(null, [query, cancellationToken])!;
    }

    private static Func<IQueryable, CancellationToken, Task<List<int>>> CreateTakeIdsAsyncDelegate((Type EntityType, int SampleSize) key)
    {
        var entityType = key.EntityType;
        var sampleSize = key.SampleSize;
        var idProperty = ContentPolicyPropertyReflection.GetIdProperty(entityType);

        var parameter = Expression.Parameter(entityType, "entity");
        var orderByLambda = Expression.Lambda(
            Expression.Property(parameter, idProperty),
            parameter);
        var orderByMethod = OrderByMethodDefinition.MakeGenericMethod(entityType, idProperty.PropertyType);
        var takeMethod = TakeMethodDefinition.MakeGenericMethod(entityType);

        var selectParameter = Expression.Parameter(entityType, "entity");
        var selectLambda = Expression.Lambda(
            Expression.Property(selectParameter, idProperty),
            selectParameter);
        var selectMethod = SelectMethodDefinition.MakeGenericMethod(entityType, idProperty.PropertyType);
        var toListAsyncMethod = ToListAsyncMethodDefinition.MakeGenericMethod(idProperty.PropertyType);

        return async (query, cancellationToken) =>
        {
            var ordered = (IQueryable)orderByMethod.Invoke(null, [query, orderByLambda])!;
            var taken = (IQueryable)takeMethod.Invoke(null, [ordered, sampleSize])!;
            var selected = (IQueryable)selectMethod.Invoke(null, [taken, selectLambda])!;
            var task = (Task)toListAsyncMethod.Invoke(null, [selected, cancellationToken])!;
            await task.ConfigureAwait(false);
            var resultProperty = task.GetType().GetProperty(nameof(Task<object>.Result))!;
            var ids = (System.Collections.IEnumerable)resultProperty.GetValue(task)!;

            var list = new List<int>();
            foreach (var id in ids)
                list.Add(Convert.ToInt32(id));

            return list;
        };
    }
}
