using System.Reflection;
using JavidHrm.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using JavidHrm.Infrastructure.Persistence.Interceptors;

namespace JavidHrm.Infrastructure.Persistence;

public sealed class JavidHrmDbContext(DbContextOptions<JavidHrmDbContext> options) : DbContext(options)
{
    public DbSet<Department> Department { get; set; }
    public DbSet<Employee> Employee { get; set; }
    public DbSet<AttendanceRecord> AttendanceRecord { get; set; }
    public DbSet<LeaveRequest> LeaveRequest { get; set; }
    public DbSet<PayrollEntry> PayrollEntry { get; set; }
    public DbSet<Permission> Permission { get; set; }
    public DbSet<RefreshToken> RefreshToken { get; set; }
    public DbSet<UserSession> UserSession { get; set; }
    public DbSet<Role> Role { get; set; }
    public DbSet<RolePermission> RolePermission { get; set; }
    public DbSet<User> User { get; set; }
    public DbSet<UserAddress> UserAddress { get; set; }
    public DbSet<UserRole> UserRole { get; set; }
    public DbSet<WebSiteSetting> WebSiteSetting { get; set; }
    public DbSet<Currency> Currency { get; set; }
    public DbSet<Province> Province { get; set; }
    public DbSet<City> City { get; set; }
    public DbSet<ContentPolicy> ContentPolicy { get; set; }
    public DbSet<ContentPolicyRule> ContentPolicyRule { get; set; }
    public DbSet<ContentPolicyRecordAccess> ContentPolicyRecordAccess { get; set; }
    public DbSet<Bank> Bank { get; set; }
    public DbSet<ChartOfAccount> ChartOfAccount { get; set; }
    public DbSet<FinancialYear> FinancialYear { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.AddInterceptors(new CleanStringPropertyInterceptor());
        base.OnConfiguring(optionsBuilder);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        base.OnModelCreating(modelBuilder);
    }
}
