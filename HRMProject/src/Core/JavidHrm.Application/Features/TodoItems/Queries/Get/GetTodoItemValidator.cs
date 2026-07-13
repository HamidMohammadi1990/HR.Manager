using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.TodoItems.Queries;

public class GetTodoItemValidator : AbstractValidator<GetTodoItemRequest>
{
    public GetTodoItemValidator() => RuleFor(x => x.Id).MustBeValidEntityId();
}
