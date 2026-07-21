using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Enums;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JavidHrm.Infrastructure.Persistence.Configuration;

internal class LeaveRequestApprovalStepConfig : IEntityTypeConfiguration<LeaveRequestApprovalStep>
{
    public void Configure(EntityTypeBuilder<LeaveRequestApprovalStep> builder)
    {
        builder
            .Property(e => e.StepOrder)
            .IsRequired();

        builder
            .Property(e => e.Status)
            .IsRequired();

        builder
            .Property(e => e.Comment)
            .HasNVarcharMaxLength(500);

        builder
            .HasOne(e => e.LeaveRequest)
            .WithMany(e => e.ApprovalSteps)
            .HasForeignKey(e => e.LeaveRequestId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(e => e.ApproverEmployee)
            .WithMany()
            .HasForeignKey(e => e.ApproverEmployeeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => e.LeaveRequestId);
        builder.HasIndex(e => e.ApproverEmployeeId);
        builder.HasIndex(e => e.Status);
        builder.HasIndex(e => new { e.LeaveRequestId, e.StepOrder }).IsUnique();
    }
}
