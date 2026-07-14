using JavidHrm.Domain.Enums;
using JavidHrm.Domain.Entities;
using JavidHrm.Common.Extensions;
using Microsoft.EntityFrameworkCore;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JavidHrm.Infrastructure.Persistence.Configuration;

internal class PermissionConfig : IEntityTypeConfiguration<Permission>
{
    public void Configure(EntityTypeBuilder<Permission> builder)
    {
        builder
            .Property(x => x.Id)
            .ValueGeneratedNever();

        builder
            .Property(p => p.Title)
            .HasNVarcharMaxLength(150)
            .IsRequired();

        builder
            .Property(p => p.NameSpace)
            .HasVarcharMaxLength(150)
            .IsRequired();

        builder
            .Property(x => x.Url)
            .HasVarcharMaxLength(100)
            .IsRequired();

        builder
            .HasOne(x => x.Parent)
            .WithMany(x => x.Children)
            .HasForeignKey(x => x.ParentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasMany(x => x.RolePermissions)
            .WithOne(x => x.Permission)
            .HasForeignKey(x => x.PermissionId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasData(Permission.Create(PermissionType.ManageUsersGroup, "", PermissionType.ManageUsersGroup.ToDisplay(), "", 0, PermissionLevelType.Tab));
    }
}