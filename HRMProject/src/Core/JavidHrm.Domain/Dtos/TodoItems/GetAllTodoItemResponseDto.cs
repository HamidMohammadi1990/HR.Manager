using JavidHrm.Domain.Enums;

namespace JavidHrm.Domain.Dtos.TodoItems;

public class GetAllTodoItemResponseDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string? UserFirstName { get; set; }
    public string? UserLastName { get; set; }
    public string? UserName { get; set; }
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public DateTime? DueDate { get; set; }
    public TodoPriority Priority { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime? CompletedAtUtc { get; set; }
    public DateTime CreatedOnUtc { get; set; }
}
