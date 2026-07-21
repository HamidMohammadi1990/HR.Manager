using JavidHrm.Domain.Entities;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JavidHrm.Infrastructure.Persistence.Configuration;

internal class EmployeeShiftScheduleConfig : IEntityTypeConfiguration<EmployeeShiftSchedule>
{
    public void Configure(EntityTypeBuilder<EmployeeShiftSchedule> builder)
    {
        builder.Property(e => e.EffectiveFrom).IsRequired().HasColumnType("date");
        builder.Property(e => e.EffectiveTo).HasColumnType("date");
        builder.Property(e => e.Note).HasNVarcharMaxLength(300);

        builder
            .HasOne(e => e.Employee)
            .WithMany()
            .HasForeignKey(e => e.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(e => e.WorkShift)
            .WithMany()
            .HasForeignKey(e => e.WorkShiftId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => e.EmployeeId);
        builder.HasIndex(e => e.WorkShiftId);
        builder.HasIndex(e => new { e.EmployeeId, e.EffectiveFrom });
    }
}
