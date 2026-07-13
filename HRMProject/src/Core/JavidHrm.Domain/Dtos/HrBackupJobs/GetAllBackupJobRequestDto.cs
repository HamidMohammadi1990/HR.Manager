using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.QueryFilters;

namespace JavidHrm.Domain.Dtos.HrBackupJobs;

public record GetAllBackupJobRequestDto
{
    [QueryFilter(MemberPath = "backupJob.Status")]
    public BackupStatus? Status { get; init; }

    [QueryFilter(MemberPath = "backupJob.Type")]
    public BackupType? Type { get; init; }

    public DateTime? CreatedFromUtc { get; init; }
    public DateTime? CreatedToUtc { get; init; }

    public PagedRequest Pagination { get; init; } = default!;
}
