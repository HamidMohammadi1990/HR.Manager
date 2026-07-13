using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.TodoItems.Commands;

public class DeleteTodoItemHandler
    (ITodoItemRepository todoItemRepository, IUnitOfWork uow)
    : IRequestHandler<DeleteTodoItemRequest, OperationResult>
{
    public async Task<OperationResult> Handle(DeleteTodoItemRequest request, CancellationToken cancellationToken)
    {
        var todoItem = await todoItemRepository.FindAsync(request.Id, cancellationToken);
        if (todoItem is null)
            return ErrorModel.Create("InvalidId");

        todoItemRepository.Remove(todoItem);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
