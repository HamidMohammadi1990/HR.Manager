using FluentValidation;
using JavidHrm.Common.Localization;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.Employees.Commands;

public class UpdateEmployeeValidator : AbstractValidator<UpdateEmployeeRequest>
{
    public UpdateEmployeeValidator(IEmployeeRepository employeeRepository, IWorkShiftRepository workShiftRepository)
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
        RuleFor(x => x.DepartmentId).MustBeValidEntityId();

        RuleFor(x => x.EmployeeCode)
            .NotEmpty()
            .MaximumLength(20)
            .MustAsync(async (request, code, cancellationToken)
                => !await employeeRepository.AnyAsync(
                    x => x.EmployeeCode == code.Trim() && x.Id != request.Id, cancellationToken))
            .WithMessage(MessageKeys.DuplicateRecord);

        RuleFor(x => x.JobTitle).NotEmpty().MaximumLength(80);
        RuleFor(x => x.HireDate).NotEmpty();

        RuleFor(x => x.ManagerId)
            .MustAsync(async (request, managerId, cancellationToken) =>
            {
                if (managerId is null or <= 0) return true;
                if (managerId == request.Id) return false;
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
