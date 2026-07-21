using JavidHrm.Domain.Common;

namespace JavidHrm.Domain.Entities;

public class Department : BaseEntity
{
    public int UserId { get; private set; }
    public int? ParentDepartmentId { get; private set; }
    public int? DefaultWorkShiftId { get; private set; }
    public string Name { get; private set; } = default!;
    public string Code { get; private set; } = default!;
    public string? Description { get; private set; }
    public DateTime CreatedOnUtc { get; private set; } = DateTime.UtcNow;
    public bool IsActive { get; private set; }

    public User User { get; private set; } = default!;
    public Department? ParentDepartment { get; private set; }
    public WorkShift? DefaultWorkShift { get; private set; }
    public ICollection<Department> Children { get; private set; } = new List<Department>();

    public static Department Create(
        int userId,
        string name,
        string code,
        string? description,
        int? parentDepartmentId,
        int? defaultWorkShiftId = null)
        => new()
        {
            Name = name,
            Code = code,
            UserId = userId,
            ParentDepartmentId = parentDepartmentId,
            DefaultWorkShiftId = defaultWorkShiftId,
            Description = description
        };

    public void Update(
        string name,
        string code,
        string? description,
        int? parentDepartmentId,
        int? defaultWorkShiftId)
    {
        Name = name;
        Code = code;
        Description = description;
        ParentDepartmentId = parentDepartmentId;
        DefaultWorkShiftId = defaultWorkShiftId;
    }

    public void Active() => IsActive = true;

    public void InActive() => IsActive = false;
}
