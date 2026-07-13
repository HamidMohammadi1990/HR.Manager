using JavidHrm.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JavidHrm.Infrastructure.Persistence.Configuration;

internal class ProvinceConfig : IEntityTypeConfiguration<Province>
{
    public void Configure(EntityTypeBuilder<Province> builder)
    {
        builder
            .Property(e => e.Name)
            .HasNVarcharMaxLength(25)
            .IsRequired();

        builder
            .Property(x => x.Slug)
            .HasNVarcharMaxLength(30)
            .IsRequired();

        builder
            .Property(x => x.TelPrefix)
            .HasVarcharMaxLength(6);

        builder
            .Property(e => e.Description)
            .HasNVarcharMaxLength(200);

        builder
            .HasMany(x => x.Cities)
            .WithOne(x => x.Province)
            .HasForeignKey(x => x.ProvinceId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasIndex(x => x.Slug)
            .IsUnique();
    }
}