using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.TodoItems.Commands;

public record ToggleCompleteTodoItemRequest : IRequest<OperationResult>
{
    [JsonConverter(typeof(TodoItemEncryptor))]
    public int Id { get; init; }
}
