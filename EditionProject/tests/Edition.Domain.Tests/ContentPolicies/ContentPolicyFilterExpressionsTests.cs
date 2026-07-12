using System.Linq.Expressions;
using JavidHrm.Domain.ContentPolicies;

namespace JavidHrm.Domain.Tests.ContentPolicies;

public class ContentPolicyFilterExpressionsTests
{
    [Fact]
    public void IsDenyAll_WhenFilterIsNull_ReturnsFalse()
    {
        ContentPolicyFilterExpressions.IsDenyAll(null).Should().BeFalse();
    }

    [Fact]
    public void IsDenyAll_WhenFilterIsConstantFalse_ReturnsTrue()
    {
        Expression<Func<bool>> filter = () => false;

        ContentPolicyFilterExpressions.IsDenyAll(filter).Should().BeTrue();
    }

    [Fact]
    public void IsDenyAll_WhenFilterIsConstantTrue_ReturnsFalse()
    {
        Expression<Func<bool>> filter = () => true;

        ContentPolicyFilterExpressions.IsDenyAll(filter).Should().BeFalse();
    }

    [Fact]
    public void IsDenyAll_WhenFilterIsNotConstantFalse_ReturnsFalse()
    {
        Expression<Func<int, bool>> filter = x => x > 0;

        ContentPolicyFilterExpressions.IsDenyAll(filter).Should().BeFalse();
    }
}
