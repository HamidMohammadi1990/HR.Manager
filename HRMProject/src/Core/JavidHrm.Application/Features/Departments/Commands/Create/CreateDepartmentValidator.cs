using FluentValidation;
using JavidHrm.Common.Localization;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.Departments.Commands;

public class CreateDepartmentValidator : AbstractValidator<CreateDepartmentRequest>
{
    public CreateDepartmentValidator(IDepartmentRepository departmentRepository, IWorkShiftRepository workShiftRepository)
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage(MessageKeys.NameRequired)
            .MaximumLength(EntityFieldLengths.Department.Name)
            .MustAsync(async (name, cancellationToken)
                => !await departmentRepository.AnyAsync(x => x.Name == name.Trim(), cancellationToken))
            .WithMessage(MessageKeys.DuplicateRecord);

        RuleFor(x => x.Code)
            .NotEmpty()
            .WithMessage(MessageKeys.AccountCodeRequired)
            .MaximumLength(EntityFieldLengths.Department.Code)
            .MustAsync(async (code, cancellationToken)
                => !await departmentRepository.AnyAsync(x => x.Code == code.Trim(), cancellationToken))
            .WithMessage(MessageKeys.DuplicateRecord);

        RuleFor(x => x.Description).MaximumLength(EntityFieldLengths.Department.Description);

        RuleFor(x => x.ParentDepartmentId)
            .MustAsync(async (parentId, cancellationToken) =>
                !parentId.HasValue
                || await departmentRepository.AnyAsync(x => x.Id == parentId.Value, cancellationToken))
            .WithMessage(MessageKeys.InvalidParentId);

        RuleFor(x => x.DefaultWorkShiftId)
            .MustAsync(async (workShiftId, cancellationToken) =>
            {
                if (workShiftId is null or <= 0) return true;
                return await workShiftRepository.AnyAsync(x => x.Id == workShiftId && x.IsActive, cancellationToken);
            })
            .WithMessage(MessageKeys.InvalidId);
    }
}
