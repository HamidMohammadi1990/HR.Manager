using FluentValidation;
using JavidHrm.Common.Localization;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.Employees.Commands;

public class CreateEmployeeValidator : AbstractValidator<CreateEmployeeRequest>
{
    public CreateEmployeeValidator(IEmployeeRepository employeeRepository, IWorkShiftRepository workShiftRepository)
    {
        RuleFor(x => x.UserId).MustBeValidEntityId();
        RuleFor(x => x.DepartmentId).MustBeValidEntityId();

        RuleFor(x => x.EmployeeCode)
            .NotEmpty()
            .WithMessage(MessageKeys.AccountCodeRequired)
            .MaximumLength(20)
            .MustAsync(async (code, cancellationToken)
                => !await employeeRepository.AnyAsync(x => x.EmployeeCode == code.Trim(), cancellationToken))
            .WithMessage(MessageKeys.DuplicateRecord);

        RuleFor(x => x.JobTitle)
            .NotEmpty()
            .WithMessage(MessageKeys.NameRequired)
            .MaximumLength(80);

        RuleFor(x => x.HireDate).NotEmpty();

        RuleFor(x => x.UserId)
            .MustAsync(async (userId, cancellationToken)
                => !await employeeRepository.AnyAsync(x => x.UserId == userId, cancellationToken))
            .WithMessage(MessageKeys.DuplicateRecord);

        RuleFor(x => x.ManagerId)
            .MustAsync(async (managerId, cancellationToken) =>
            {
                if (managerId is null or <= 0) return true;
                return await employeeRepository.AnyAsync(x => x.Id == managerId, cancellationToken);
            })
            .WithMessage(MessageKeys.InvalidId);

        RuleFor(x => x.WorkShiftId)
            .MustAsync(async (workShiftId, cancellationToken) =>
            {
                if (workShiftId is null or <= 0) return true;
                return await workShiftRepository.AnyAsync(x => x.Id == workShiftId && x.IsActive, cancellationToken);
            })
            .WithMessage(MessageKeys.InvalidId);
    }
}
