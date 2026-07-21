namespace JavidHrm.Domain.Dtos.Departments;

public class SearchDepartmentResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string Code { get; set; } = default!;
    public int? ParentDepartmentId { get; set; }
    public string? ParentDepartmentName { get; set; }
    public int UserId { get; set; }
    public string? UserFirstName { get; set; }
    public string? UserLastName { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedOnUtc { get; set; }
}
