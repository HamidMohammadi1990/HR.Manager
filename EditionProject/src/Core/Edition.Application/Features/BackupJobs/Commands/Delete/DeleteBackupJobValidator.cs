using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.BackupJobs.Commands;

public class DeleteBackupJobValidator : AbstractValidator<DeleteBackupJobRequest>
{
    public DeleteBackupJobValidator() => RuleFor(x => x.Id).MustBeValidEntityId();
}
