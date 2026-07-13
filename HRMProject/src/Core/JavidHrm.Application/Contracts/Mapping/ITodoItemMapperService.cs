using JavidHrm.Application.Features.TodoItems.Queries;
using JavidHrm.Domain.Dtos.TodoItems;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;

namespace JavidHrm.Application.Contracts.Mapping;

public interface ITodoItemMapperService : IMapper
{
    GetAllTodoItemRequestDto Map(GetAllTodoItemRequest model);
    GetTodoItemResponse Map(TodoItem model, User user);
    PagedResult<GetAllTodoItemResponse> Map(PagedResult<GetAllTodoItemResponseDto> model);
}
