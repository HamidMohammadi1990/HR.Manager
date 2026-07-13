using FluentValidation;

namespace JavidHrm.Application.Features.BackupJobs.Queries;

public class GetAllBackupJobValidator : AbstractValidator<GetAllBackupJobRequest>
{
    public GetAllBackupJobValidator() => RuleFor(x => x.Pagination).NotNull();
}
