using JavidHrm.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JavidHrm.Infrastructure.Persistence.Configuration;

internal class UserSessionConfig : IEntityTypeConfiguration<UserSession>
{
    public void Configure(EntityTypeBuilder<UserSession> builder)
    {
        builder
            .Property(x => x.CurrentJwtId)
            .HasVarcharMaxLength(40)
            .IsRequired();

        builder
            .Property(x => x.IpAddress)
            .HasVarcharMaxLength(45);

        builder
            .Property(x => x.UserAgent)
            .HasVarcharMaxLength(512);

        builder
            .Property(x => x.DeviceName)
            .HasNVarcharMaxLength(100);

        builder
            .Property(x => x.DeviceType)
            .HasConversion<int>();

        builder
            .Property(x => x.OperatingSystem)
            .HasConversion<int>();

        builder
            .Property(x => x.RevokedReason)
            .HasConversion<int>();

        builder
            .HasOne(x => x.User)
            .WithMany(x => x.UserSessions)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasIndex(x => x.UserId);

        builder
            .HasIndex(x => new { x.UserId, x.IsRevoked });
    }
}
