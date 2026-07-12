using JavidHrm.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JavidHrm.Infrastructure.Persistence.Configuration;

internal class CurrencyConfig : IEntityTypeConfiguration<Currency>
{
    public void Configure(EntityTypeBuilder<Currency> builder)
    {
        builder
            .Property(x => x.Code)
            .IsRequired()
            .HasVarcharMaxLength(5);

        builder
            .Property(x => x.Name)
            .IsRequired()
            .HasNVarcharMaxLength(15);
    }
}