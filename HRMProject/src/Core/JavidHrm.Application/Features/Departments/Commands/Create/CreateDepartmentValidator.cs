using FluentValidation;
using JavidHrm.Common.Localization;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.Departments.Commands;

public class CreateDepartmentValidator : AbstractValidator<CreateDepartmentRequest>
{
    public CreateDepartmentValidator(IDepartmentRepository departmentRepository)
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage(MessageKeys.NameRequired)
            .MaximumLength(EntityFieldLengths.Company.Name)
            .MustAsync(async (name, cancellationToken)
                => !await departmentRepository.AnyAsync(x => x.Name == name.Trim(), cancellationToken))
            .WithMessage(MessageKeys.DuplicateRecord);

        RuleFor(x => x.Code)
            .NotEmpty()
            .WithMessage(MessageKeys.AccountCodeRequired)
            .MaximumLength(EntityFieldLengths.Company.Code)
            .MustAsync(async (code, cancellationToken)
                => !await departmentRepository.AnyAsync(x => x.Code == code.Trim(), cancellationToken))
            .WithMessage(MessageKeys.DuplicateRecord);

        RuleFor(x => x.Address)
            .NotEmpty()
            .WithMessage(MessageKeys.AddressRequired)
            .MaximumLength(EntityFieldLengths.Company.Address);

        RuleFor(x => x.CityId).MustBeValidEntityId();
        RuleFor(x => x.PhoneNumber).MaximumLength(EntityFieldLengths.Company.PhoneNumber);
        RuleFor(x => x.Email).MaximumLength(EntityFieldLengths.Company.Email);
        RuleFor(x => x.PostalCode).MaximumLength(EntityFieldLengths.Company.PostalCode);
        RuleFor(x => x.Description).MaximumLength(EntityFieldLengths.Company.Description);
    }
}
