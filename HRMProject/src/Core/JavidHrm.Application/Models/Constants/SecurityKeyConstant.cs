using JavidHrm.Common.Security;

namespace JavidHrm.Application.Models.Constants;

public static class SecurityKeyConstant
{
    public static string Tag => SecurityKeyRegistry.Get(nameof(Tag));
    public static string User => SecurityKeyRegistry.Get(nameof(User));
    public static string City => SecurityKeyRegistry.Get(nameof(City));
    public static string Bank => SecurityKeyRegistry.Get(nameof(Bank));
    public static string Role => SecurityKeyRegistry.Get(nameof(Role));
    public static string Department => SecurityKeyRegistry.Get(nameof(Department));
    public static string Employee => SecurityKeyRegistry.Get(nameof(Employee));
    public static string AttendanceRecord => SecurityKeyRegistry.Get(nameof(AttendanceRecord));
    public static string LeaveRequest => SecurityKeyRegistry.Get(nameof(LeaveRequest));
    public static string PayrollEntry => SecurityKeyRegistry.Get(nameof(PayrollEntry));
    public static string Notification => SecurityKeyRegistry.Get(nameof(Notification));
    public static string Announcement => SecurityKeyRegistry.Get(nameof(Announcement));
    public static string CalendarEvent => SecurityKeyRegistry.Get(nameof(CalendarEvent));
    public static string TodoItem => SecurityKeyRegistry.Get(nameof(TodoItem));
    public static string BackupJob => SecurityKeyRegistry.Get(nameof(BackupJob));
    public static string WorkShift => SecurityKeyRegistry.Get(nameof(WorkShift));
    public static string LeaveBalance => SecurityKeyRegistry.Get(nameof(LeaveBalance));
    public static string Company => Department;
    public static string Province => SecurityKeyRegistry.Get(nameof(Province));
    public static string Currency => SecurityKeyRegistry.Get(nameof(Currency));
    public static string Permission => SecurityKeyRegistry.Get(nameof(Permission));
    public static string BankAccount => SecurityKeyRegistry.Get(nameof(BankAccount));
    public static string BankTransaction => SecurityKeyRegistry.Get(nameof(BankTransaction));
    public static string UserAddress => SecurityKeyRegistry.Get(nameof(UserAddress));
    public static string FinancialYear => SecurityKeyRegistry.Get(nameof(FinancialYear));
    public static string ChartOfAccount => SecurityKeyRegistry.Get(nameof(ChartOfAccount));
    public static string RolePermission => SecurityKeyRegistry.Get(nameof(RolePermission));
    public static string UserRole => SecurityKeyRegistry.Get(nameof(UserRole));
    public static string UserSession => SecurityKeyRegistry.Get(nameof(UserSession));
    public static string WebSiteSetting => SecurityKeyRegistry.Get(nameof(WebSiteSetting));
}
