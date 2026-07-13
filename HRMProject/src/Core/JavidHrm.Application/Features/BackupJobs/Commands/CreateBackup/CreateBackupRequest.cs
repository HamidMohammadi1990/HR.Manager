using JavidHrm.Common.Models;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.BackupJobs.Commands;

public record CreateBackupRequest : IRequest<OperationResult<CreateBackupResponse>>
{
    public BackupType Type { get; init; } = BackupType.Manual;
}
