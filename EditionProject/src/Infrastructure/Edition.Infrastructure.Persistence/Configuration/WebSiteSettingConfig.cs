using JavidHrm.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JavidHrm.Infrastructure.Persistence.Configuration;

public class WebSiteSettingConfig : IEntityTypeConfiguration<WebSiteSetting>
{
    public void Configure(EntityTypeBuilder<WebSiteSetting> builder)
    {
        builder
            .Property(x => x.Email)
            .HasVarcharMaxLength(50);

        builder
            .Property(x => x.PhoneNumber)
            .HasVarcharMaxLength(11);

        builder
            .Property(x => x.Telephone)
            .HasVarcharMaxLength(11);

        builder
            .Property(x => x.Address)
            .HasVarcharMaxLength(150);

        builder
            .Property(x => x.CartNumber)
            .HasVarcharMaxLength(16);

        builder
            .Property(x => x.EmailUserName)
            .HasVarcharMaxLength(30);

        builder
            .Property(x => x.EmailPassword)
            .HasVarcharMaxLength(30);

        builder
            .Property(x => x.SmsAccountUrl)
            .HasVarcharMaxLength(50);

        builder
            .Property(x => x.SmsAccountUserName)
            .HasVarcharMaxLength(20);

        builder
            .Property(x => x.SmsAccountPassword)
            .HasVarcharMaxLength(20);
    }
}