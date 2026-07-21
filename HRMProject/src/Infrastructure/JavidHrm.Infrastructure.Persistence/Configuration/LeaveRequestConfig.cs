using JavidHrm.Domain.Entities;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JavidHrm.Infrastructure.Persistence.Configuration;

internal class LeaveRequestConfig : IEntityTypeConfiguration<LeaveRequest>
{
    public void Configure(EntityTypeBuilder<LeaveRequest> builder)
    {
        builder
            .Property(e => e.StartDate)
            .IsRequired()
            .HasColumnType("datetime2");

        builder
            .Property(e => e.EndDate)
            .IsRequired()
            .HasColumnType("datetime2");

        builder
            .Property(e => e.Status)
            .IsRequired();

        builder
            .Property(e => e.Reason)
            .IsRequired()
            .HasNVarcharMaxLength(500);

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

        builder.HasIndex(e => e.EmployeeId);
        builder.HasIndex(e => e.LeaveTypeDefinitionId);
        builder.HasIndex(e => e.Status);
        builder.HasIndex(e => e.StartDate);
        builder.HasIndex(e => e.EndDate);
        builder.HasIndex(e => e.CurrentApprovalStepOrder);
    }
}
