using JavidHrm.Domain.ContentPolicies;
using JavidHrm.Domain.Dtos.ContentPolicies;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Domain.Tests.ContentPolicies;

public class ContentPolicyPolicyResolverTests
{
    private static readonly IReadOnlyList<ContentPolicyRuleDto> EmptyRules = [];

    [Fact]
    public void Resolve_WhenUserPolicyUsesReplaceRole_ExcludesRolePolicies()
    {
        var userPolicies = new[]
        {
            CreatePolicy(id: 2, priority: 20, mergeMode: ContentPolicyMergeMode.ReplaceRole, name: "User policy"),
            CreatePolicy(id: 1, priority: 10, mergeMode: ContentPolicyMergeMode.Additive, name: "Ignored additive user policy")
        };

        var rolePolicies = new[]
        {
            CreatePolicy(id: 3, priority: 5, mergeMode: ContentPolicyMergeMode.Additive, name: "Role policy")
        };

        var result = ContentPolicyPolicyResolver.Resolve(userPolicies, rolePolicies);

        result.EffectiveMergeMode.Should().Be(ContentPolicyMergeMode.ReplaceRole);
        result.AppliedPolicies.Select(p => p.Id).Should().Equal(1, 2);
        result.ExcludedRolePolicies.Select(p => p.Id).Should().Equal(3);
    }

    [Fact]
    public void Resolve_WhenNoReplaceRoleUserPolicies_MergesUserAndRolePolicies()
    {
        var userPolicies = new[]
        {
            CreatePolicy(id: 2, priority: 20, mergeMode: ContentPolicyMergeMode.Additive, name: "User policy")
        };

        var rolePolicies = new[]
        {
            CreatePolicy(id: 3, priority: 5, mergeMode: ContentPolicyMergeMode.Additive, name: "Role policy"),
            CreatePolicy(id: 1, priority: 1, mergeMode: ContentPolicyMergeMode.Additive, name: "Another role policy")
        };

        var result = ContentPolicyPolicyResolver.Resolve(userPolicies, rolePolicies);

        result.EffectiveMergeMode.Should().Be(ContentPolicyMergeMode.Additive);
        result.AppliedPolicies.Select(p => p.Id).Should().Equal(1, 3, 2);
        result.ExcludedRolePolicies.Should().BeEmpty();
    }

    [Fact]
    public void ResolveForMergeMode_WhenForcedReplaceRoleWithUserPolicies_UsesReplaceRole()
    {
        var userPolicies = new[]
        {
            CreatePolicy(id: 5, priority: 1, mergeMode: ContentPolicyMergeMode.Additive, name: "User policy")
        };

        var rolePolicies = new[]
        {
            CreatePolicy(id: 7, priority: 1, mergeMode: ContentPolicyMergeMode.Additive, name: "Role policy")
        };

        var result = ContentPolicyPolicyResolver.ResolveForMergeMode(
            userPolicies,
            rolePolicies,
            ContentPolicyMergeMode.ReplaceRole);

        result.EffectiveMergeMode.Should().Be(ContentPolicyMergeMode.ReplaceRole);
        result.AppliedPolicies.Select(p => p.Id).Should().Equal(5);
        result.ExcludedRolePolicies.Select(p => p.Id).Should().Equal(7);
    }

    [Fact]
    public void ResolveForMergeMode_WhenForcedReplaceRoleWithoutUserPolicies_UsesAdditive()
    {
        var rolePolicies = new[]
        {
            CreatePolicy(id: 7, priority: 1, mergeMode: ContentPolicyMergeMode.Additive, name: "Role policy")
        };

        var result = ContentPolicyPolicyResolver.ResolveForMergeMode(
            [],
            rolePolicies,
            ContentPolicyMergeMode.ReplaceRole);

        result.EffectiveMergeMode.Should().Be(ContentPolicyMergeMode.Additive);
        result.AppliedPolicies.Select(p => p.Id).Should().Equal(7);
        result.ExcludedRolePolicies.Should().BeEmpty();
    }

    [Fact]
    public void ResolveForMergeMode_WhenForcedAdditive_IgnoresReplaceRoleUserPolicies()
    {
        var userPolicies = new[]
        {
            CreatePolicy(id: 2, priority: 1, mergeMode: ContentPolicyMergeMode.ReplaceRole, name: "Replace role user policy")
        };

        var rolePolicies = new[]
        {
            CreatePolicy(id: 3, priority: 1, mergeMode: ContentPolicyMergeMode.Additive, name: "Role policy")
        };

        var result = ContentPolicyPolicyResolver.ResolveForMergeMode(
            userPolicies,
            rolePolicies,
            ContentPolicyMergeMode.Additive);

        result.EffectiveMergeMode.Should().Be(ContentPolicyMergeMode.Additive);
        result.AppliedPolicies.Select(p => p.Id).Should().Equal(3, 2);
        result.ExcludedRolePolicies.Should().BeEmpty();
    }

    private static ContentPolicyWithRulesDto CreatePolicy(
        int id,
        int priority,
        ContentPolicyMergeMode mergeMode,
        string name)
        => new(
            Id: id,
            RoleId: mergeMode == ContentPolicyMergeMode.Additive ? 1 : null,
            UserId: mergeMode == ContentPolicyMergeMode.ReplaceRole ? 1 : null,
            MergeMode: mergeMode,
            EntityType: "Department",
            QueryAction: ContentPolicyQueryAction.All,
            Name: name,
            Effect: ContentPolicyEffect.Allow,
            Priority: priority,
            Rules: EmptyRules,
            RecordEntityIds: []);
}
