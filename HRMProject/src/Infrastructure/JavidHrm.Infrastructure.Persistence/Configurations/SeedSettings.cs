namespace JavidHrm.Infrastructure.Persistence.Configurations;

public class SeedSettings
{
    public bool Enabled { get; set; } = true;
    public string AdminUserName { get; set; } = "09120000000";
    public string AdminPassword { get; set; } = "Admin@123";
    public string AdminEmail { get; set; } = "admin@javidhrm.local";
    public string AdminFirstName { get; set; } = "مدیر";
    public string AdminLastName { get; set; } = "سیستم";
}
