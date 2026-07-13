using JavidHrm.Common.Models;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.BackupJobs.Commands;

public record CreateBackupJobRequest : IRequest<OperationResult<CreateBackupJobResponse>>
{
    public BackupType Type { get; init; } = BackupType.Manual;
    public string FileName { get; init; } = default!;
    public string StoragePath { get; init; } = default!;
}
