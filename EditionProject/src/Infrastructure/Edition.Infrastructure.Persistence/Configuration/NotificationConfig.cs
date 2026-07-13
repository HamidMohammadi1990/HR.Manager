using JavidHrm.Domain.Entities;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JavidHrm.Infrastructure.Persistence.Configuration;

internal class NotificationConfig : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder
            .Property(e => e.Title)
            .IsRequired()
            .HasNVarcharMaxLength(200);

        builder
            .Property(e => e.Message)
            .IsRequired()
            .HasNVarcharMaxLength(1000);

        builder
            .Property(e => e.Type)
            .IsRequired();

        builder
            .Property(e => e.LinkPath)
            .HasNVarcharMaxLength(500);

        builder
            .Property(e => e.IconName)
            .HasNVarcharMaxLength(100);

        builder
            .HasOne(e => e.User)
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(e => e.UserId);
        builder.HasIndex(e => e.IsRead);
        builder.HasIndex(e => e.Type);
        builder.HasIndex(e => e.CreatedOnUtc);
    }
}
