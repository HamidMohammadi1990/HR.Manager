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
            .Property(x => x.PhoneNumber)
            .HasVarcharMaxLength(11);

        builder
            .Property(u => u.Email)
            .HasVarcharMaxLength(35);

        builder
            .Property(x => x.PostalCode)
            .HasVarcharMaxLength(10);

        builder
            .Property(x => x.Address)
            .IsRequired()
            .HasNVarcharMaxLength(120);

        builder
            .HasOne(x => x.User)
            .WithMany(x => x.Departments)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasOne(x => x.City)
            .WithMany(x => x.Departments)
            .HasForeignKey(x => x.CityId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasMany(x => x.FinancialYears)
            .WithOne(x => x.Department)
            .HasForeignKey(x => x.DepartmentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.UserId);
        builder.HasIndex(x => x.CityId);
        builder.HasIndex(x => x.Name).IsUnique();
    }
}
