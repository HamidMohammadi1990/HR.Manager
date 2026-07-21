using JavidHrm.Domain.Common;

namespace JavidHrm.Domain.Entities;

public class Employee : BaseEntity
{
    public int UserId { get; private set; }
    public int DepartmentId { get; private set; }
    public int? ManagerId { get; private set; }
    public int? WorkShiftId { get; private set; }
    public string EmployeeCode { get; private set; } = default!;
    public string JobTitle { get; private set; } = default!;
    public DateTime HireDate { get; private set; }
    public bool IsActive { get; private set; }
    public DateTime CreatedOnUtc { get; private set; } = DateTime.UtcNow;

    public User User { get; private set; } = default!;
    public Department Department { get; private set; } = default!;
    public Employee? Manager { get; private set; }
    public WorkShift? WorkShift { get; private set; }
    public ICollection<Employee> DirectReports { get; private set; } = [];

    public static Employee Create(
        int userId,
        int departmentId,
        int? managerId,
        int? workShiftId,
        string employeeCode,
        string jobTitle,
        DateTime hireDate)
        => new()
        {
            UserId = userId,
            DepartmentId = departmentId,
            ManagerId = managerId,
            WorkShiftId = workShiftId,
            EmployeeCode = employeeCode,
            JobTitle = jobTitle,
            HireDate = hireDate,
            IsActive = true
        };

    public void Update(
        int departmentId,
        int? managerId,
        int? workShiftId,
        string employeeCode,
        string jobTitle,
        DateTime hireDate)
    {
        DepartmentId = departmentId;
        ManagerId = managerId;
        WorkShiftId = workShiftId;
        EmployeeCode = employeeCode;
        JobTitle = jobTitle;
        HireDate = hireDate;
    }

    public void Active() => IsActive = true;

    public void InActive() => IsActive = false;
}
