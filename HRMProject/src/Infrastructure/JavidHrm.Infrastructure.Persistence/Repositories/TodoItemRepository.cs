using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.TodoItems;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Repositories;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;

namespace JavidHrm.Infrastructure.Persistence.Repositories;

public class TodoItemRepository(JavidHrmDbContext context)
    : Repository<TodoItem>(context), ITodoItemRepository
{
    public async Task<PagedResult<GetAllTodoItemResponseDto>> GetAllAsync(
        GetAllTodoItemRequestDto request,
        Expression<Func<TodoItem, bool>>? contentFilter = null)
    {
        var requestSource = Context.TodoItem.ApplyContentPolicyFilter(contentFilter);

        var todoItems =
            from todoItem in requestSource
            join user in Context.User on todoItem.UserId equals user.Id
            select new { todoItem, user };

        todoItems = todoItems.ApplyQueryFilters(request);

        if (request.DueDateFrom.HasValue)
            todoItems = todoItems.Where(x => x.todoItem.DueDate >= request.DueDateFrom.Value.Date);

        if (request.DueDateTo.HasValue)
            todoItems = todoItems.Where(x => x.todoItem.DueDate <= request.DueDateTo.Value.Date);

        return await todoItems
            .OrderByDescending(x => x.todoItem.CreatedOnUtc)
            .Select(x => new GetAllTodoItemResponseDto
            {
                Id = x.todoItem.Id,
                UserId = x.todoItem.UserId,
                UserFirstName = x.user.FirstName,
                UserLastName = x.user.LastName,
                UserName = x.user.UserName,
                Title = x.todoItem.Title,
                Description = x.todoItem.Description,
                DueDate = x.todoItem.DueDate,
                Priority = x.todoItem.Priority,
                IsCompleted = x.todoItem.IsCompleted,
                CompletedAtUtc = x.todoItem.CompletedAtUtc,
                CreatedOnUtc = x.todoItem.CreatedOnUtc
            })
            .AsNoTracking()
            .ToPagedAsync(request.Pagination);
    }
}
