using FluentValidation;

using JavidHrm.Common.Localization;

using JavidHrm.Domain.Repositories;

using JavidHrm.Application.Common.Validation;



namespace JavidHrm.Application.Features.LeaveTypeDefinitions.Commands;



public class CreateLeaveTypeDefinitionValidator : AbstractValidator<CreateLeaveTypeDefinitionRequest>

{

    public CreateLeaveTypeDefinitionValidator(ILeaveTypeDefinitionRepository leaveTypeDefinitionRepository)

    {

        RuleFor(x => x.Code)

            .NotEmpty()

            .WithMessage(MessageKeys.AccountCodeRequired)

            .MaximumLength(EntityFieldLengths.LeaveTypeDefinition.Code)

            .MustAsync(async (code, cancellationToken)

                => !await leaveTypeDefinitionRepository.AnyAsync(x => x.Code == code.Trim(), cancellationToken))

            .WithMessage(MessageKeys.DuplicateRecord);



        RuleFor(x => x.Name)

            .NotEmpty()

            .WithMessage(MessageKeys.NameRequired)

            .MaximumLength(EntityFieldLengths.LeaveTypeDefinition.Name)

            .MustAsync(async (name, cancellationToken)

                => !await leaveTypeDefinitionRepository.AnyAsync(x => x.Name == name.Trim(), cancellationToken))

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

