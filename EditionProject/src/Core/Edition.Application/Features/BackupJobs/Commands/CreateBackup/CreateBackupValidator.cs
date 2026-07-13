using FluentValidation;
using JavidHrm.Common.Localization;

namespace JavidHrm.Application.Features.BackupJobs.Commands;

public class CreateBackupValidator : AbstractValidator<CreateBackupRequest>
{
    public CreateBackupValidator()
    {
        RuleFor(x => x.Type).IsInEnum().Must(t => t != default).WithMessage(MessageKeys.InvalidId);
    }
}
