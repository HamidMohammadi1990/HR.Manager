using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.TodoItems.Commands;

public class DeleteTodoItemValidator : AbstractValidator<DeleteTodoItemRequest>
{
    public DeleteTodoItemValidator() => RuleFor(x => x.Id).MustBeValidEntityId();
}
