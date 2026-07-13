using FluentValidation;
using JavidHrm.Common.Localization;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.Departments.Commands;

public class UpdateDepartmentValidator : AbstractValidator<UpdateDepartmentRequest>
{
    public UpdateDepartmentValidator(IDepartmentRepository departmentRepository)
    {
        RuleFor(x => x.Id).MustBeValidEntityId();

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage(MessageKeys.NameRequired)
            .MaximumLength(EntityFieldLengths.Company.Name);

        RuleFor(x => new { x.Id, x.Name })
            .MustAsync(async (x, cancellationToken)
                => !await departmentRepository.AnyAsync(d => d.Id != x.Id && d.Name == x.Name.Trim(), cancellationToken))
            .WithMessage(MessageKeys.DuplicateRecord);

        RuleFor(x => x.Code)
            .NotEmpty()
            .WithMessage(MessageKeys.AccountCodeRequired)
            .MaximumLength(EntityFieldLengths.Company.Code);

        RuleFor(x => new { x.Id, x.Code })
            .MustAsync(async (x, cancellationToken)
                => !await departmentRepository.AnyAsync(d => d.Id != x.Id && d.Code == x.Code.Trim(), cancellationToken))
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
