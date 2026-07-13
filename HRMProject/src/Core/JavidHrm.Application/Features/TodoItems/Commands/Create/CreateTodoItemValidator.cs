using FluentValidation;
using JavidHrm.Common.Localization;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.TodoItems.Commands;

public class CreateTodoItemValidator : AbstractValidator<CreateTodoItemRequest>
{
    public CreateTodoItemValidator(IUserRepository userRepository)
    {
        RuleFor(x => x.UserId).MustBeValidEntityId();
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Description).MaximumLength(2000);
        RuleFor(x => x.Priority).IsInEnum().Must(p => p != default).WithMessage(MessageKeys.InvalidId);
        RuleFor(x => x.UserId)
            .MustAsync(async (id, ct) => await userRepository.AnyAsync(u => u.Id == id, ct))
            .WithMessage(MessageKeys.InvalidId);
    }
}
