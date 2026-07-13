using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.TodoItems.Commands;

public record CreateTodoItemRequest : IRequest<OperationResult<CreateTodoItemResponse>>
{
    [JsonConverter(typeof(UserEncryptor))]
    public int UserId { get; init; }

    public string Title { get; init; } = default!;
    public string? Description { get; init; }
    public DateTime? DueDate { get; init; }
    public TodoPriority Priority { get; init; } = TodoPriority.Medium;
}
