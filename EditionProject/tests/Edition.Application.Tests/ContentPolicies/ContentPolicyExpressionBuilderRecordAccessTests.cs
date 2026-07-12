using System.Reflection;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.ContentPolicies;
using JavidHrm.Domain.Dtos.ContentPolicies;
using Microsoft.Extensions.Logging.Abstractions;
using JavidHrm.Application.Models.ContentPolicies;
using JavidHrm.Application.Services.ContentPolicies;

namespace JavidHrm.Application.Tests.ContentPolicies;

public sealed class ContentPolicyExpressionBuilderRecordAccessTests
{
    private readonly ContentPolicyExpressionBuilder builder = new(
        new ContentPolicyRuleExpressionFactory(new TestContentEntityTypeRegistry(typeof(Bank).Assembly)),
        NullLogger<ContentPolicyExpressionBuilder>.Instance);

    [Fact]
    public void Build_AllowPolicyWithRecordAccess_FiltersToAllowedIds()
    {
        var policies = new[]
        {
            new ContentPolicyWithRulesDto(
                Id: 1,
                RoleId: 1,
                UserId: null,
                MergeMode: ContentPolicyMergeMode.Additive,
                EntityType: "Bank",
                QueryAction: ContentPolicyQueryAction.All,
                Name: "Allow specific banks",
                Effect: ContentPolicyEffect.Allow,
                Priority: 0,
                Rules: [],
                RecordEntityIds: [2, 5])
        };

        var filter = builder.Build<Bank>(nameof(Bank), policies, new ContentPolicyContext(1, [], [1]));
        filter.Should().NotBeNull();

        var predicate = filter!.Compile();
        predicate(CreateBank(2)).Should().BeTrue();
        predicate(CreateBank(5)).Should().BeTrue();
        predicate(CreateBank(3)).Should().BeFalse();
    }

    [Fact]
    public void Build_DenyPolicyWithRecordAccess_ExcludesDeniedIds()
    {
        var policies = new[]
        {
            new ContentPolicyWithRulesDto(
                Id: 1,
                RoleId: 1,
                UserId: null,
                MergeMode: ContentPolicyMergeMode.Additive,
                EntityType: "Bank",
                QueryAction: ContentPolicyQueryAction.All,
                Name: "Deny specific bank",
                Effect: ContentPolicyEffect.Deny,
                Priority: 0,
                Rules: [],
                RecordEntityIds: [42])
        };

        var filter = builder.Build<Bank>(nameof(Bank), policies, new ContentPolicyContext(1, [], [1]));
        filter.Should().NotBeNull();

        var predicate = filter!.Compile();
        predicate(CreateBank(42)).Should().BeFalse();
        predicate(CreateBank(7)).Should().BeTrue();
    }

    private static Bank CreateBank(int id)
    {
        var bank = new Bank();
        typeof(Domain.Common.BaseEntity).GetProperty(nameof(Domain.Common.BaseEntity.Id))!
            .SetValue(bank, id);
        return bank;
    }
}

internal sealed class TestContentEntityTypeRegistry : IContentEntityTypeRegistry
{
    private readonly Dictionary<string, Type> entities;

    public TestContentEntityTypeRegistry(Assembly assembly)
    {
        entities = assembly.GetTypes()
            .Where(t => t.IsClass && !t.IsAbstract && typeof(Domain.Common.IEntity).IsAssignableFrom(t))
            .ToDictionary(t => t.Name, t => t, StringComparer.Ordinal);
    }

    public bool IsRegistered(string entityTypeName) => entities.ContainsKey(entityTypeName);

    public Type GetClrType(string entityTypeName) => entities[entityTypeName];

    public string GetEntityPrefix(string entityTypeName) => entityTypeName;

    public IReadOnlyList<string> GetRegisteredNamesOrderedByLengthDesc() => entities.Keys.OrderByDescending(x => x.Length).ToList();

    public IReadOnlyList<string> GetRegisteredEntityTypeNames() => [.. entities.Keys.OrderBy(x => x, StringComparer.Ordinal)];
}
