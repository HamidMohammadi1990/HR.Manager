using JavidHrm.Domain.Entities;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JavidHrm.Infrastructure.Persistence.Configuration;

internal class AnnouncementConfig : IEntityTypeConfiguration<Announcement>
{
    public void Configure(EntityTypeBuilder<Announcement> builder)
    {
        builder.Property(e => e.Title).IsRequired().HasNVarcharMaxLength(200);
        builder.Property(e => e.Content).IsRequired().HasNVarcharMaxLength(4000);
        builder.Property(e => e.Status).IsRequired();
        builder.Property(e => e.Audience).IsRequired();
        builder.Property(e => e.Channel).IsRequired();

        builder.HasOne(e => e.Department).WithMany().HasForeignKey(e => e.DepartmentId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(e => e.Role).WithMany().HasForeignKey(e => e.RoleId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(e => e.CreatedByUser).WithMany().HasForeignKey(e => e.CreatedByUserId).OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => e.Status);
        builder.HasIndex(e => e.Audience);
        builder.HasIndex(e => e.CreatedOnUtc);
    }
}
