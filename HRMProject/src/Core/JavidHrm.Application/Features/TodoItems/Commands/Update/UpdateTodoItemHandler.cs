using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.TodoItems.Commands;

public class UpdateTodoItemHandler
    (ITodoItemRepository todoItemRepository, IUnitOfWork uow)
    : IRequestHandler<UpdateTodoItemRequest, OperationResult>
{
    public async Task<OperationResult> Handle(UpdateTodoItemRequest request, CancellationToken cancellationToken)
    {
        var todoItem = await todoItemRepository.FindAsync(request.Id, cancellationToken);
        if (todoItem is null)
            return ErrorModel.Create("InvalidId");

        todoItem.Update(
            request.UserId,
            request.Title.Trim(),
            request.Description?.Trim(),
            request.DueDate,
            request.Priority);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
