using FluentValidation;
using JavidHrm.Common.Localization;

namespace JavidHrm.Application.Features.BackupJobs.Commands;

public class CreateBackupJobValidator : AbstractValidator<CreateBackupJobRequest>
{
    public CreateBackupJobValidator()
    {
        RuleFor(x => x.Type).IsInEnum().Must(t => t != default).WithMessage(MessageKeys.InvalidId);
        RuleFor(x => x.FileName).NotEmpty().MaximumLength(260);
        RuleFor(x => x.StoragePath).NotEmpty().MaximumLength(500);
    }
}
