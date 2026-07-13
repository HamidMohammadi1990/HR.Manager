namespace JavidHrm.Domain.Dtos.Employees;

public class GetAllEmployeeResponseDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string? UserFirstName { get; set; }
    public string? UserLastName { get; set; }
    public string? UserName { get; set; }
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; } = default!;
    public int? ManagerId { get; set; }
    public string? ManagerFirstName { get; set; }
    public string? ManagerLastName { get; set; }
    public string EmployeeCode { get; set; } = default!;
    public string JobTitle { get; set; } = default!;
    public DateTime HireDate { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedOnUtc { get; set; }
}
