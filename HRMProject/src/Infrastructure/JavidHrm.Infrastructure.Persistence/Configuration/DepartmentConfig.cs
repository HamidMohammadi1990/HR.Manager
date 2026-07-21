using JavidHrm.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JavidHrm.Infrastructure.Persistence.Configuration;

internal class DepartmentConfig : IEntityTypeConfiguration<Department>
{
    public void Configure(EntityTypeBuilder<Department> builder)
    {
        builder
            .Property(e => e.Name)
            .IsRequired()
            .HasNVarcharMaxLength(30);

        builder
            .Property(e => e.Description)
            .HasNVarcharMaxLength(300);

        builder
            .Property(x => x.Code)
            .IsRequired()
            .HasVarcharMaxLength(12);

        builder
            .HasOne(x => x.User)
            .WithMany(x => x.Departments)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasOne(x => x.ParentDepartment)
            .WithMany(x => x.Children)
            .HasForeignKey(x => x.ParentDepartmentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasOne(x => x.DefaultWorkShift)
            .WithMany()
            .HasForeignKey(x => x.DefaultWorkShiftId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(x => x.ParentDepartmentId);
        builder.HasIndex(x => x.UserId);
        builder.HasIndex(x => x.Name).IsUnique();
    }
}
