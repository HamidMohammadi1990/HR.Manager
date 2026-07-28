using JavidHrm.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JavidHrm.Infrastructure.Persistence.Configuration;

internal class NotificationReadReceiptConfig : IEntityTypeConfiguration<NotificationReadReceipt>
{
    public void Configure(EntityTypeBuilder<NotificationReadReceipt> builder)
    {
        builder
            .HasOne(e => e.Notification)
            .WithMany()
            .HasForeignKey(e => e.NotificationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(e => e.User)
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(e => new { e.NotificationId, e.UserId }).IsUnique();
        builder.HasIndex(e => e.UserId);
    }
}
