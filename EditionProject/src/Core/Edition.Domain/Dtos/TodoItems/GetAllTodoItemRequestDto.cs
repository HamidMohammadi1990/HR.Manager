using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.QueryFilters;

namespace JavidHrm.Domain.Dtos.TodoItems;

public record GetAllTodoItemRequestDto
{
    [QueryFilter(MemberPath = "todoItem.UserId")]
    public int? UserId { get; init; }

    [QueryFilter(MemberPath = "todoItem.Priority")]
    public TodoPriority? Priority { get; init; }

    [QueryFilter(MemberPath = "todoItem.IsCompleted")]
    public bool? IsCompleted { get; init; }

    [QueryFilter(MemberPath = "todoItem.Title", Operator = FilterOperator.Contains)]
    public string? Title { get; init; }

    public DateTime? DueDateFrom { get; init; }
    public DateTime? DueDateTo { get; init; }

    public PagedRequest Pagination { get; init; } = default!;
}
