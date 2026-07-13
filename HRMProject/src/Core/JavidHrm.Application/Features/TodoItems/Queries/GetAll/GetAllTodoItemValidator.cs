using FluentValidation;

namespace JavidHrm.Application.Features.TodoItems.Queries;

public class GetAllTodoItemValidator : AbstractValidator<GetAllTodoItemRequest>
{
    public GetAllTodoItemValidator()
    {
        RuleFor(x => x.Pagination).NotNull();
    }
}
