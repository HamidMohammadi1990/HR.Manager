using JavidHrm.Common.Models;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.BackupJobs.Queries;

public record GetAllBackupJobRequest : IRequest<OperationResult<PagedResult<GetAllBackupJobResponse>>>, IContentPolicyFilteredRequest<BackupJob>
{
    public BackupStatus? Status { get; init; }
    public BackupType? Type { get; init; }
    public DateTime? CreatedFromUtc { get; init; }
    public DateTime? CreatedToUtc { get; init; }
    public PagedRequest Pagination { get; init; } = default!;
}
