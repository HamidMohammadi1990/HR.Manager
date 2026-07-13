using JavidHrm.Domain.Entities;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JavidHrm.Infrastructure.Persistence.Configuration;

internal class BackupJobConfig : IEntityTypeConfiguration<BackupJob>
{
    public void Configure(EntityTypeBuilder<BackupJob> builder)
    {
        builder.Property(e => e.FileName).IsRequired().HasNVarcharMaxLength(260);
        builder.Property(e => e.StoragePath).IsRequired().HasNVarcharMaxLength(500);
        builder.Property(e => e.ErrorMessage).HasNVarcharMaxLength(2000);
        builder.Property(e => e.Status).IsRequired();
        builder.Property(e => e.Type).IsRequired();

        builder.HasOne(e => e.CreatedByUser).WithMany().HasForeignKey(e => e.CreatedByUserId).OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => e.Status);
        builder.HasIndex(e => e.CreatedOnUtc);
    }
}
