namespace JavidHrm.Infrastructure.Persistence.SeedData;

internal static class HrContentPolicyDefinitions
{
    public const string EmployeeEntityType = "Employee";
    public const string LeaveRequestEntityType = "LeaveRequest";
    public const string PayrollEntryEntityType = "PayrollEntry";

    public const string EmployeeDepartmentScopePolicyName = "محدودیت مشاهده پرسنل به دپارتمان خود";
    public const string LeaveRequestDepartmentScopePolicyName = "محدودیت مشاهده درخواست مرخصی به دپارتمان خود";
    public const string LeaveRequestSelfScopePolicyName = "محدودیت مشاهده درخواست مرخصی به خود کاربر";
    public const string PayrollEntryDepartmentScopePolicyName = "محدودیت مشاهده فیش حقوق به دپارتمان خود";
    public const string PayrollEntrySelfScopePolicyName = "محدودیت مشاهده فیش حقوق به خود کاربر";

    public const string EmployeeDepartmentFieldPath = "Employee.DepartmentId";
    public const string LeaveRequestDepartmentFieldPath = "LeaveRequest.Employee.DepartmentId";
    public const string LeaveRequestEmployeeUserFieldPath = "LeaveRequest.Employee.UserId";
    public const string PayrollEntryDepartmentFieldPath = "PayrollEntry.Employee.DepartmentId";
    public const string PayrollEntryEmployeeUserFieldPath = "PayrollEntry.Employee.UserId";

    public const string DepartmentIdsContextValue = "DepartmentIds";
    public const string UserIdContextValue = "UserId";
}
