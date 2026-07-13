using JavidHrm.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JavidHrm.Infrastructure.Persistence.Configuration;

internal class LeaveBalanceConfig : IEntityTypeConfiguration<LeaveBalance>
{
    public void Configure(EntityTypeBuilder<LeaveBalance> builder)
    {
        builder.Property(e => e.TotalDays).HasPrecision(5, 2);
        builder.Property(e => e.UsedDays).HasPrecision(5, 2);
        builder.Property(e => e.LeaveType).IsRequired();

        builder.HasOne(e => e.Employee).WithMany().HasForeignKey(e => e.EmployeeId).OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => new { e.EmployeeId, e.LeaveType, e.Year }).IsUnique();
        builder.HasIndex(e => e.Year);
    }
}
