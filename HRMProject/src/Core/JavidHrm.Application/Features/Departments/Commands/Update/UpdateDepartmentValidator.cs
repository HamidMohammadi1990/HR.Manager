using FluentValidation;
using JavidHrm.Common.Localization;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.Departments.Commands;

public class UpdateDepartmentValidator : AbstractValidator<UpdateDepartmentRequest>
{
    public UpdateDepartmentValidator(IDepartmentRepository departmentRepository, IWorkShiftRepository workShiftRepository)
    {
        RuleFor(x => x.Id).MustBeValidEntityId();

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage(MessageKeys.NameRequired)
            .MaximumLength(EntityFieldLengths.Department.Name);

        RuleFor(x => new { x.Id, x.Name })
            .MustAsync(async (x, cancellationToken)
                => !await departmentRepository.AnyAsync(d => d.Id != x.Id && d.Name == x.Name.Trim(), cancellationToken))
            .WithMessage(MessageKeys.DuplicateRecord);

        RuleFor(x => x.Code)
            .NotEmpty()
            .WithMessage(MessageKeys.AccountCodeRequired)
            .MaximumLength(EntityFieldLengths.Department.Code);

        RuleFor(x => new { x.Id, x.Code })
            .MustAsync(async (x, cancellationToken)
                => !await departmentRepository.AnyAsync(d => d.Id != x.Id && d.Code == x.Code.Trim(), cancellationToken))
            .WithMessage(MessageKeys.DuplicateRecord);

        RuleFor(x => x.Description).MaximumLength(EntityFieldLengths.Department.Description);

        RuleFor(x => x)
            .Must(x => !x.ParentDepartmentId.HasValue || x.ParentDepartmentId.Value != x.Id)
            .WithMessage(MessageKeys.InvalidParentId);

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
