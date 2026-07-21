using FluentValidation;
using JavidHrm.Common.Localization;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.LeaveTypeDefinitions.Commands;

public class UpdateLeaveTypeDefinitionValidator : AbstractValidator<UpdateLeaveTypeDefinitionRequest>
{
    public UpdateLeaveTypeDefinitionValidator(ILeaveTypeDefinitionRepository leaveTypeDefinitionRepository)
    {
        RuleFor(x => x.Id).MustBeValidEntityId();

        RuleFor(x => x.Code)
            .NotEmpty()
            .WithMessage(MessageKeys.AccountCodeRequired)
            .MaximumLength(EntityFieldLengths.LeaveTypeDefinition.Code);

        RuleFor(x => new { x.Id, x.Code })
            .MustAsync(async (x, cancellationToken)
                => !await leaveTypeDefinitionRepository.AnyAsync(d => d.Id != x.Id && d.Code == x.Code.Trim(), cancellationToken))
            .WithMessage(MessageKeys.DuplicateRecord);

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage(MessageKeys.NameRequired)
            .MaximumLength(EntityFieldLengths.LeaveTypeDefinition.Name);

        RuleFor(x => new { x.Id, x.Name })
            .MustAsync(async (x, cancellationToken)
                => !await leaveTypeDefinitionRepository.AnyAsync(d => d.Id != x.Id && d.Name == x.Name.Trim(), cancellationToken))
            .WithMessage(MessageKeys.DuplicateRecord);

        RuleFor(x => x.Description).MaximumLength(EntityFieldLengths.LeaveTypeDefinition.Description);
        RuleFor(x => x.Color).MaximumLength(EntityFieldLengths.LeaveTypeDefinition.Color);

        RuleFor(x => x)
            .Must(x => !x.MaxPerRequest.HasValue || !x.MaxPerYear.HasValue || x.MaxPerRequest <= x.MaxPerYear)
            .WithMessage(MessageKeys.InvalidRequest);

        RuleFor(x => x.MaxCarryForwardDays)
            .NotNull()
            .When(x => x.CarryForwardEnabled);
    }
}
