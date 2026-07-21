using JavidHrm.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JavidHrm.Infrastructure.Persistence.Configuration;

internal class LeaveTypeDefinitionConfig : IEntityTypeConfiguration<LeaveTypeDefinition>
{
    public void Configure(EntityTypeBuilder<LeaveTypeDefinition> builder)
    {
        builder
            .Property(x => x.Code)
            .IsRequired()
            .HasVarcharMaxLength(12);

        builder
            .Property(x => x.Name)
            .IsRequired()
            .HasNVarcharMaxLength(50);

        builder
            .Property(x => x.Description)
            .HasNVarcharMaxLength(300);

        builder
            .Property(x => x.Color)
            .HasVarcharMaxLength(20);

        builder
            .Property(x => x.DefaultAnnualAllowance)
            .HasPrecision(8, 2);

        builder
            .Property(x => x.MaxPerYear)
            .HasPrecision(8, 2);

        builder
            .Property(x => x.MaxPerRequest)
            .HasPrecision(8, 2);

        builder
            .Property(x => x.MaxCarryForwardDays)
            .HasPrecision(8, 2);

        builder.HasIndex(x => x.Code).IsUnique();
        builder.HasIndex(x => x.Name).IsUnique();
        builder.HasIndex(x => x.IsActive);
        builder.HasIndex(x => x.SortOrder);
        builder.HasIndex(x => x.Category);
    }
}
