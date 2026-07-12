using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JavidHrm.Infrastructure.Persistence.Configuration;

internal class ContentPolicyRuleConfig : IEntityTypeConfiguration<ContentPolicyRule>
{
    public void Configure(EntityTypeBuilder<ContentPolicyRule> builder)
    {
        builder
            .Property(x => x.FieldPath)
            .HasVarcharMaxLength(150)
            .IsRequired();

        builder
            .Property(x => x.Value)
            .HasNVarcharMaxLength(200)
            .IsRequired();

        builder
            .Property(x => x.Operator)
            .HasConversion<int>();

        builder
            .Property(x => x.ValueType)
            .HasConversion<int>();

        builder
            .Property(x => x.RuleGroup)
            .HasConversion<int>()
            .HasDefaultValue(ContentPolicyRuleGroup.Group0);

        builder
            .HasIndex(x => x.PolicyId);
    }
}
