using JavidHrm.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JavidHrm.Infrastructure.Persistence.Configuration;

internal class LeaveBalanceConfig : IEntityTypeConfiguration<LeaveBalance>
{
    public void Configure(EntityTypeBuilder<LeaveBalance> builder)
    {
        builder.Property(e => e.TotalDays).HasPrecision(8, 2);
        builder.Property(e => e.UsedDays).HasPrecision(8, 2);

        builder
            .HasOne(e => e.Employee)
            .WithMany()
            .HasForeignKey(e => e.EmployeeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasOne(e => e.LeaveTypeDefinition)
            .WithMany()
            .HasForeignKey(e => e.LeaveTypeDefinitionId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => new { e.EmployeeId, e.LeaveTypeDefinitionId, e.Year }).IsUnique();
        builder.HasIndex(e => e.Year);
    }
}
