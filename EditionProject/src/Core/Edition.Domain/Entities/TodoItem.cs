using JavidHrm.Domain.Common;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Domain.Entities;

public class TodoItem : BaseEntity
{
    public int UserId { get; private set; }
    public string Title { get; private set; } = default!;
    public string? Description { get; private set; }
    public DateTime? DueDate { get; private set; }
    public TodoPriority Priority { get; private set; }
    public bool IsCompleted { get; private set; }
    public DateTime? CompletedAtUtc { get; private set; }
    public DateTime CreatedOnUtc { get; private set; } = DateTime.UtcNow;

    public User User { get; private set; } = default!;

    public static TodoItem Create(
        int userId,
        string title,
        string? description,
        DateTime? dueDate,
        TodoPriority priority)
        => new()
        {
            UserId = userId,
            Title = title,
            Description = description,
            DueDate = dueDate?.Date,
            Priority = priority
        };

    public void Update(
        int userId,
        string title,
        string? description,
        DateTime? dueDate,
        TodoPriority priority)
    {
        UserId = userId;
        Title = title;
        Description = description;
        DueDate = dueDate?.Date;
        Priority = priority;
    }

    public void ToggleComplete()
    {
        IsCompleted = !IsCompleted;
        CompletedAtUtc = IsCompleted ? DateTime.UtcNow : null;
    }
}
