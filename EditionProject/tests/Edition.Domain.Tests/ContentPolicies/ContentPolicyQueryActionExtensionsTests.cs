using JavidHrm.Domain.ContentPolicies;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Domain.Tests.ContentPolicies;

public class ContentPolicyQueryActionExtensionsTests
{
    [Theory]
    [InlineData(ContentPolicyQueryAction.All, ContentPolicyQueryAction.Get)]
    [InlineData(ContentPolicyQueryAction.All, ContentPolicyQueryAction.GetAll)]
    [InlineData(ContentPolicyQueryAction.All, ContentPolicyQueryAction.Search)]
    [InlineData(ContentPolicyQueryAction.All, ContentPolicyQueryAction.GetUserAddresses)]
    public void Matches_WhenPolicyActionIsAll_ReturnsTrue(
        ContentPolicyQueryAction policyAction,
        ContentPolicyQueryAction requestAction)
    {
        ContentPolicyQueryActionExtensions.Matches(policyAction, requestAction)
            .Should().BeTrue();
    }

    [Theory]
    [InlineData(ContentPolicyQueryAction.Get, ContentPolicyQueryAction.Get)]
    [InlineData(ContentPolicyQueryAction.GetAll, ContentPolicyQueryAction.GetAll)]
    [InlineData(ContentPolicyQueryAction.Search, ContentPolicyQueryAction.Search)]
    [InlineData(ContentPolicyQueryAction.GetUserAddresses, ContentPolicyQueryAction.GetUserAddresses)]
    public void Matches_WhenActionsAreEqual_ReturnsTrue(
        ContentPolicyQueryAction policyAction,
        ContentPolicyQueryAction requestAction)
    {
        ContentPolicyQueryActionExtensions.Matches(policyAction, requestAction)
            .Should().BeTrue();
    }

    [Theory]
    [InlineData(ContentPolicyQueryAction.Get, ContentPolicyQueryAction.GetAll)]
    [InlineData(ContentPolicyQueryAction.GetAll, ContentPolicyQueryAction.Get)]
    [InlineData(ContentPolicyQueryAction.Search, ContentPolicyQueryAction.GetUserAddresses)]
    public void Matches_WhenActionsDiffer_ReturnsFalse(
        ContentPolicyQueryAction policyAction,
        ContentPolicyQueryAction requestAction)
    {
        ContentPolicyQueryActionExtensions.Matches(policyAction, requestAction)
            .Should().BeFalse();
    }
}
