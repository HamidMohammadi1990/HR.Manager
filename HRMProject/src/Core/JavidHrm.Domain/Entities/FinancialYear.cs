using JavidHrm.Domain.Common;

namespace JavidHrm.Domain.Entities;

public class FinancialYear : BaseEntity
{
    public string Name { get; set; } = default!;
    public DateTime StartDate { get; set; } = default!;
    public DateTime EndDate { get; set; } = default!;
    public bool IsActive { get; set; } = true;
    public int DepartmentId { get; set; } = default!;
    public DateTime CreatedOnUtc { get; set; } = DateTime.UtcNow;

    public Department Department { get; set; } = default!;

    public static FinancialYear Create(string name, DateTime startDate, DateTime endDate, int departmentId)
        => new()
        {
            Name = name,
            EndDate = endDate,
            DepartmentId = departmentId,
            StartDate = startDate
        };

    public void DeActive() => IsActive = false;

    public void Update(string name, DateTime startDate, DateTime endDate, bool isActive, int departmentId)
    {
        Name = name;
        EndDate = endDate;
        IsActive = isActive;
        DepartmentId = departmentId;
        StartDate = startDate;
    }
}
