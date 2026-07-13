using FluentValidation;
using JavidHrm.Common.Localization;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.BackupJobs.Commands;

public class UpdateBackupJobValidator : AbstractValidator<UpdateBackupJobRequest>
{
    public UpdateBackupJobValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
        RuleFor(x => x.Type).IsInEnum().Must(t => t != default).WithMessage(MessageKeys.InvalidId);
    }
}
