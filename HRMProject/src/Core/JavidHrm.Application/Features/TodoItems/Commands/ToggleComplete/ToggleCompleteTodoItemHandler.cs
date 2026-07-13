using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.TodoItems.Commands;

public class ToggleCompleteTodoItemHandler
    (ITodoItemRepository todoItemRepository, IUnitOfWork uow)
    : IRequestHandler<ToggleCompleteTodoItemRequest, OperationResult>
{
    public async Task<OperationResult> Handle(ToggleCompleteTodoItemRequest request, CancellationToken cancellationToken)
    {
        var todoItem = await todoItemRepository.FindAsync(request.Id, cancellationToken);
        if (todoItem is null)
            return ErrorModel.Create("InvalidId");

        todoItem.ToggleComplete();

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
