using System.Linq.Expressions;

namespace JavidHrm.Domain.ContentPolicies;

public static class ContentPolicyFilterExpressions
{
    public static bool IsDenyAll(LambdaExpression? filter)
        => filter?.Body is ConstantExpression { Value: false };
}
