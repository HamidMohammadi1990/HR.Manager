namespace JavidHrm.Infrastructure.Persistence.SeedData;

internal static class HrContentPolicyDefinitions
{
    public const string EmployeeEntityType = "Employee";

    public const string EmployeeDepartmentScopePolicyName = "محدودیت مشاهده پرسنل به دپارتمان خود";

    public const string EmployeeDepartmentFieldPath = "Employee.DepartmentId";

    public const string DepartmentIdsContextValue = "DepartmentIds";
}
