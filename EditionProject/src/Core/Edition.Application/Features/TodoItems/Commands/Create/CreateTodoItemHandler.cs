using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.TodoItems.Commands;

public class CreateTodoItemHandler
    (IUnitOfWork uow, ITodoItemRepository todoItemRepository)
    : IRequestHandler<CreateTodoItemRequest, OperationResult<CreateTodoItemResponse>>
{
    public async Task<OperationResult<CreateTodoItemResponse>> Handle(CreateTodoItemRequest request, CancellationToken cancellationToken)
    {
        var todoItem = Domain.Entities.TodoItem.Create(
            request.UserId,
            request.Title.Trim(),
            request.Description?.Trim(),
            request.DueDate,
            request.Priority);

        todoItemRepository.Add(todoItem);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult.ToGenericFailure<CreateTodoItemResponse>();

        return new CreateTodoItemResponse { Id = todoItem.Id };
    }
}
