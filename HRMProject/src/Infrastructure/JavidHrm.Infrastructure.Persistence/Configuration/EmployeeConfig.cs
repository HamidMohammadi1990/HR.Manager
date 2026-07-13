using JavidHrm.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JavidHrm.Infrastructure.Persistence.Configuration;

internal class EmployeeConfig : IEntityTypeConfiguration<Employee>
{
    public void Configure(EntityTypeBuilder<Employee> builder)
    {
        builder
            .Property(e => e.EmployeeCode)
            .IsRequired()
            .HasVarcharMaxLength(20);

        builder
            .Property(e => e.JobTitle)
            .IsRequired()
            .HasNVarcharMaxLength(80);

        builder
            .Property(e => e.HireDate)
            .IsRequired();

        builder
            .HasOne(e => e.User)
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasOne(e => e.Department)
            .WithMany()
            .HasForeignKey(e => e.DepartmentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasOne(e => e.Manager)
            .WithMany(e => e.DirectReports)
            .HasForeignKey(e => e.ManagerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => e.UserId).IsUnique();
        builder.HasIndex(e => e.EmployeeCode).IsUnique();
        builder.HasIndex(e => e.DepartmentId);
        builder.HasIndex(e => e.ManagerId);
        builder.HasIndex(e => e.IsActive);
    }
}
