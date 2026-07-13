using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.TodoItems.Queries;

public class GetTodoItemHandler
    (ITodoItemRepository todoItemRepository, IUserRepository userRepository, ITodoItemMapperService mapper)
    : IRequestHandler<GetTodoItemRequest, OperationResult<GetTodoItemResponse?>>
{
    public async Task<OperationResult<GetTodoItemResponse?>> Handle(GetTodoItemRequest request, CancellationToken cancellationToken)
    {
        var todoItem = await todoItemRepository.GetAsNoTrackingAsync(request.Id, cancellationToken);
        if (todoItem is null)
            return (GetTodoItemResponse?)null;

        var user = await userRepository.GetAsNoTrackingAsync(todoItem.UserId, cancellationToken);
        if (user is null)
            return ErrorModel.Create("InvalidId");

        return mapper.Map(todoItem, user);
    }
}
