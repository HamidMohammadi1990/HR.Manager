using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.TodoItems.Queries;

public record GetTodoItemResponse
{
    [JsonConverter(typeof(TodoItemEncryptor))]
    public int Id { get; init; }

    [JsonConverter(typeof(UserEncryptor))]
    public int UserId { get; init; }

    public string? UserFirstName { get; init; }
    public string? UserLastName { get; init; }
    public string? UserName { get; init; }
    public string Title { get; init; } = default!;
    public string? Description { get; init; }
    public DateTime? DueDate { get; init; }
    public TodoPriority Priority { get; init; }
    public bool IsCompleted { get; init; }
    public DateTime? CompletedAtUtc { get; init; }
    public DateTime CreatedOnUtc { get; init; }
}
