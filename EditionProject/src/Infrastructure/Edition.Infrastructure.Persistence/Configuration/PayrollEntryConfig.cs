using JavidHrm.Domain.Entities;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JavidHrm.Infrastructure.Persistence.Configuration;

internal class PayrollEntryConfig : IEntityTypeConfiguration<PayrollEntry>
{
    public void Configure(EntityTypeBuilder<PayrollEntry> builder)
    {
        builder
            .Property(e => e.Year)
            .IsRequired();

        builder
            .Property(e => e.Month)
            .IsRequired();

        builder
            .Property(e => e.BaseSalary)
            .IsRequired()
            .HasPrecision(18, 2);

        builder
            .Property(e => e.GrossAmount)
            .IsRequired()
            .HasPrecision(18, 2);

        builder
            .Property(e => e.Deductions)
            .IsRequired()
            .HasPrecision(18, 2);

        builder
            .Property(e => e.NetAmount)
            .IsRequired()
            .HasPrecision(18, 2);

        builder
            .Property(e => e.Status)
            .IsRequired();

        builder
            .Property(e => e.Notes)
            .HasNVarcharMaxLength(500);

        builder
            .HasOne(e => e.Employee)
            .WithMany()
            .HasForeignKey(e => e.EmployeeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => new { e.EmployeeId, e.Year, e.Month }).IsUnique();
        builder.HasIndex(e => e.EmployeeId);
        builder.HasIndex(e => e.Year);
        builder.HasIndex(e => e.Month);
        builder.HasIndex(e => e.Status);
    }
}
