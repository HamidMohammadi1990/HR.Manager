using JavidHrm.Domain.Entities;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JavidHrm.Infrastructure.Persistence.Configuration;

internal class CalendarEventConfig : IEntityTypeConfiguration<CalendarEvent>
{
    public void Configure(EntityTypeBuilder<CalendarEvent> builder)
    {
        builder.Property(e => e.Title).IsRequired().HasNVarcharMaxLength(200);
        builder.Property(e => e.Description).HasNVarcharMaxLength(2000);
        builder.Property(e => e.Color).HasNVarcharMaxLength(20);
        builder.Property(e => e.EventType).IsRequired();

        builder.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(e => e.Department).WithMany().HasForeignKey(e => e.DepartmentId).OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => e.StartAtUtc);
        builder.HasIndex(e => e.EndAtUtc);
        builder.HasIndex(e => e.EventType);
    }
}
