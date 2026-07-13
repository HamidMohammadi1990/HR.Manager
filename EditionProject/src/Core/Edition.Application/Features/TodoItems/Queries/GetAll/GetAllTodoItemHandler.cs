using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Domain.Dtos.Pagination;

namespace JavidHrm.Application.Features.TodoItems.Queries;

public class GetAllTodoItemHandler
    (ITodoItemRepository todoItemRepository, ITodoItemMapperService mapper, IContentPolicyFilterContext contentPolicyFilterContext)
    : IRequestHandler<GetAllTodoItemRequest, OperationResult<PagedResult<GetAllTodoItemResponse>>>
{
    public async Task<OperationResult<PagedResult<GetAllTodoItemResponse>>> Handle(GetAllTodoItemRequest request, CancellationToken cancellationToken)
    {
        var requestModel = mapper.Map(request);
        var filter = contentPolicyFilterContext.GetContentFilter<Domain.Entities.TodoItem>();
        var todoItems = await todoItemRepository.GetAllAsync(requestModel, filter);
        return mapper.Map(todoItems);
    }
}
