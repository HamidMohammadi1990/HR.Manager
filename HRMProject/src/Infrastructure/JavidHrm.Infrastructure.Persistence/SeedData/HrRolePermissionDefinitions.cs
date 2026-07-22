using JavidHrm.Domain.Enums;

namespace JavidHrm.Infrastructure.Persistence.SeedData;

/// <summary>
/// Default permission sets for bootstrap HR roles.
/// System admin receives every permission in <see cref="SeedService"/>.
/// </summary>
internal static class HrRolePermissionDefinitions
{
    private static IEnumerable<PermissionType> InRange(int minInclusive, int maxInclusive)
        => Enum.GetValues<PermissionType>()
            .Where(permission =>
            {
                var value = (int)permission;
                return value >= minInclusive && value <= maxInclusive;
            });

    /// <summary>
    /// Full HR operations without system/access-control administration.
    /// </summary>
    public static IReadOnlyCollection<PermissionType> HrManager { get; } = BuildHrManager();

    /// <summary>
    /// Self-service HR for regular employees.
    /// </summary>
    public static IReadOnlyCollection<PermissionType> Employee { get; } = BuildEmployee();

    private static PermissionType[] BuildHrManager()
    {
        var permissions = new List<PermissionType>
        {
            // Read-only user lookup for HR forms
            PermissionType.ListUser,
            PermissionType.GetUserById,
            // Location lookups used in employee/profile forms
            PermissionType.ListProvince,
            PermissionType.GetProvinceById,
            PermissionType.ListCity,
            PermissionType.GetCityById,
        };

        // Departments (200-349)
        permissions.AddRange(InRange(200, 349));
        // Employees (700-706)
        permissions.AddRange(InRange(700, 706));
        // Attendance (800-808)
        permissions.AddRange(InRange(800, 808));
        // Leaves + approval inbox (900-909)
        permissions.AddRange(InRange(900, 909));
        // Payroll (1000-1009)
        permissions.AddRange(InRange(1000, 1009));
        // Notifications (1100-1110)
        permissions.AddRange(InRange(1100, 1110));
        // Announcements (1200-1208)
        permissions.AddRange(InRange(1200, 1208));
        // Calendar (1300-1306)
        permissions.AddRange(InRange(1300, 1306));
        // Todo (1400-1407)
        permissions.AddRange(InRange(1400, 1407));
        // Work shifts + employee schedules (1500-1511)
        permissions.AddRange(InRange(1500, 1511));
        // Leave types + balances (1550-1607)
        permissions.AddRange(InRange(1550, 1607));

        return permissions.Distinct().ToArray();
    }

    private static PermissionType[] BuildEmployee() =>
    [
        // Leave self-service
        PermissionType.ListLeave,
        PermissionType.GetLeaveById,
        PermissionType.CreateLeave,
        PermissionType.UpdateLeave,
        PermissionType.DeleteLeave,
        PermissionType.GetEmployeeLeaveBalance,
        // Attendance self-service
        PermissionType.ListAttendance,
        PermissionType.GetAttendanceById,
        PermissionType.CreateAttendance,
        PermissionType.UpdateAttendance,
        PermissionType.CheckInAttendance,
        PermissionType.CheckOutAttendance,
        // Payroll read-only
        PermissionType.ListPayroll,
        PermissionType.GetPayrollById,
        PermissionType.DownloadPayslip,
        // Notifications
        PermissionType.ListNotification,
        PermissionType.GetNotificationById,
        PermissionType.GetUnreadNotificationCount,
        PermissionType.MarkNotificationRead,
        PermissionType.MarkAllNotificationsRead,
        PermissionType.DeleteReadNotifications,
        // Announcements read-only
        PermissionType.ListAnnouncement,
        PermissionType.GetAnnouncementById,
        // Personal productivity
        PermissionType.ListCalendarEvent,
        PermissionType.GetCalendarEventById,
        PermissionType.CreateCalendarEvent,
        PermissionType.UpdateCalendarEvent,
        PermissionType.DeleteCalendarEvent,
        PermissionType.ListTodoItem,
        PermissionType.GetTodoItemById,
        PermissionType.CreateTodoItem,
        PermissionType.UpdateTodoItem,
        PermissionType.DeleteTodoItem,
        PermissionType.ToggleCompleteTodoItem,
    ];
}
