namespace JavidHrm.Infrastructure.Persistence.Configurations;

public class SeedSettings
{
    public bool Enabled { get; set; } = true;
    public bool SeedDemoUsers { get; set; } = true;

    public string AdminUserName { get; set; } = "09120000000";
    public string AdminPassword { get; set; } = "Admin@123";
    public string AdminEmail { get; set; } = "admin@javidhrm.local";
    public string AdminFirstName { get; set; } = "مدیر";
    public string AdminLastName { get; set; } = "سیستم";

    public string HrManagerUserName { get; set; } = "09120000001";
    public string HrManagerPassword { get; set; } = "Hr@123456";
    public string HrManagerEmail { get; set; } = "hr.manager@javidhrm.local";
    public string HrManagerFirstName { get; set; } = "مدیر";
    public string HrManagerLastName { get; set; } = "منابع انسانی";

    public string EmployeeUserName { get; set; } = "09120000002";
    public string EmployeePassword { get; set; } = "Emp@123456";
    public string EmployeeEmail { get; set; } = "employee@javidhrm.local";
    public string EmployeeFirstName { get; set; } = "کارمند";
    public string EmployeeLastName { get; set; } = "نمونه";
    public string EmployeeCode { get; set; } = "EMP-001";
    public string EmployeeJobTitle { get; set; } = "کارشناس";
}
