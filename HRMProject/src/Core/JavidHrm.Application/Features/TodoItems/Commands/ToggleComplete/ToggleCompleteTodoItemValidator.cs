using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.TodoItems.Commands;

public class ToggleCompleteTodoItemValidator : AbstractValidator<ToggleCompleteTodoItemRequest>
{
    public ToggleCompleteTodoItemValidator() => RuleFor(x => x.Id).MustBeValidEntityId();
}
