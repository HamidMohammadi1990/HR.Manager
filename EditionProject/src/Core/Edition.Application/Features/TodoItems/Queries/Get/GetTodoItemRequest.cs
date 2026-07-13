using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.TodoItems.Queries;

public record GetTodoItemRequest : IRequest<OperationResult<GetTodoItemResponse?>>
{
    [JsonConverter(typeof(TodoItemEncryptor))]
    public int Id { get; init; }
}
