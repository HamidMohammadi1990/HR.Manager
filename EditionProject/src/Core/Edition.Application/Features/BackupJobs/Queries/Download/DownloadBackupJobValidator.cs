using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.BackupJobs.Queries;

public class DownloadBackupJobValidator : AbstractValidator<DownloadBackupJobRequest>
{
    public DownloadBackupJobValidator() => RuleFor(x => x.Id).MustBeValidEntityId();
}
