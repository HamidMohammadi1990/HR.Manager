using JavidHrm.Application.Features.TodoItems.Queries;
using JavidHrm.Domain.Dtos.TodoItems;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Mappings;

public class TodoItemMapperService : ITodoItemMapperService
{
    public GetAllTodoItemRequestDto Map(GetAllTodoItemRequest model)
        => new()
        {
            UserId = model.UserId,
            Priority = model.Priority,
            IsCompleted = model.IsCompleted,
            Title = model.Title,
            DueDateFrom = model.DueDateFrom,
            DueDateTo = model.DueDateTo,
            Pagination = model.Pagination
        };

    public GetTodoItemResponse Map(TodoItem model, User user)
        => new()
        {
            Id = model.Id,
            UserId = model.UserId,
            UserFirstName = user.FirstName,
            UserLastName = user.LastName,
            UserName = user.UserName,
            Title = model.Title,
            Description = model.Description,
            DueDate = model.DueDate,
            Priority = model.Priority,
            IsCompleted = model.IsCompleted,
            CompletedAtUtc = model.CompletedAtUtc,
            CreatedOnUtc = model.CreatedOnUtc
        };

    public PagedResult<GetAllTodoItemResponse> Map(PagedResult<GetAllTodoItemResponseDto> model)
    {
        var items = model.Items.Select(x => new GetAllTodoItemResponse
        {
            Id = x.Id,
            UserId = x.UserId,
            UserFirstName = x.UserFirstName,
            UserLastName = x.UserLastName,
            UserName = x.UserName,
            Title = x.Title,
            Description = x.Description,
            DueDate = x.DueDate,
            Priority = x.Priority,
            IsCompleted = x.IsCompleted,
            CompletedAtUtc = x.CompletedAtUtc,
            CreatedOnUtc = x.CreatedOnUtc
        }).ToList();

        return PagedResult<GetAllTodoItemResponse>.Create(items, model);
    }
}
