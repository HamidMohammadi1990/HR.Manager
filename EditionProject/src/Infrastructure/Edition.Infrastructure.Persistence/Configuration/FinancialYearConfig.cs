using JavidHrm.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JavidHrm.Infrastructure.Persistence.Configuration;

public class FinancialYearConfig : IEntityTypeConfiguration<FinancialYear>
{
    public void Configure(EntityTypeBuilder<FinancialYear> builder)
    {
        builder
            .Property(x => x.Name)
            .HasNVarcharMaxLength(50)
            .IsRequired();

        builder
            .HasOne(x => x.Department)
            .WithMany(x => x.FinancialYears)
            .HasForeignKey(x => x.DepartmentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.DepartmentId);
    }
}
