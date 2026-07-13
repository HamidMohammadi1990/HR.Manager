using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.BackupJobs.Queries;

public class GetBackupJobValidator : AbstractValidator<GetBackupJobRequest>
{
    public GetBackupJobValidator() => RuleFor(x => x.Id).MustBeValidEntityId();
}
