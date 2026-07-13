using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.TodoItems;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;

namespace JavidHrm.Domain.Repositories;

public interface ITodoItemRepository
{
    void Add(TodoItem todoItem);
    void Remove(TodoItem todoItem);
    ValueTask<TodoItem?> FindAsync(int id, CancellationToken cancellationToken = default);
    Task<TodoItem?> GetAsNoTrackingAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> AnyAsync(Expression<Func<TodoItem, bool>> expression, CancellationToken cancellationToken = default);
    Task<PagedResult<GetAllTodoItemResponseDto>> GetAllAsync(
        GetAllTodoItemRequestDto request,
        Expression<Func<TodoItem, bool>>? contentFilter = null);
}
