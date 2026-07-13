using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.TodoItems.Commands;

public record CreateTodoItemResponse
{
    [JsonConverter(typeof(TodoItemEncryptor))]
    public int Id { get; init; }
}
