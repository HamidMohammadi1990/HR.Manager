using JavidHrm.Domain.Entities;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JavidHrm.Infrastructure.Persistence.Configuration;

internal class AttendanceRecordConfig : IEntityTypeConfiguration<AttendanceRecord>
{
    public void Configure(EntityTypeBuilder<AttendanceRecord> builder)
    {
        builder
            .Property(e => e.WorkDate)
            .IsRequired()
            .HasColumnType("date");

        builder
            .Property(e => e.Status)
            .IsRequired();

        builder
            .HasOne(e => e.Employee)
            .WithMany()
            .HasForeignKey(e => e.EmployeeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => new { e.EmployeeId, e.WorkDate }).IsUnique();
        builder.HasIndex(e => e.EmployeeId);
        builder.HasIndex(e => e.WorkDate);
        builder.HasIndex(e => e.Status);
    }
}
