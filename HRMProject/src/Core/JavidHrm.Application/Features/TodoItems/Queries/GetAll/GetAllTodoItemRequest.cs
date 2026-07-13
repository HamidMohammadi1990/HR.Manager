using JavidHrm.Common.Models;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.TodoItems.Queries;

public record GetAllTodoItemRequest : IRequest<OperationResult<PagedResult<GetAllTodoItemResponse>>>, IContentPolicyFilteredRequest<TodoItem>
{
    [JsonConverter(typeof(UserNullableEncryptor))]
    public int? UserId { get; init; }

    public TodoPriority? Priority { get; init; }
    public bool? IsCompleted { get; init; }
    public string? Title { get; init; }
    public DateTime? DueDateFrom { get; init; }
    public DateTime? DueDateTo { get; init; }
    public PagedRequest Pagination { get; init; } = default!;
}
