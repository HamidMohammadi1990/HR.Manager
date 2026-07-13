using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Common.Extensions;

namespace JavidHrm.Application.Features.BackupJobs.Queries;

public class GetAllBackupJobHandler
    (IBackupJobRepository backupJobRepository, IBackupJobMapperService mapper, IContentPolicyFilterContext contentPolicyFilterContext)
    : IRequestHandler<GetAllBackupJobRequest, OperationResult<PagedResult<GetAllBackupJobResponse>>>
{
    public async Task<OperationResult<PagedResult<GetAllBackupJobResponse>>> Handle(GetAllBackupJobRequest request, CancellationToken cancellationToken)
    {
        var requestModel = mapper.Map(request);
        var filter = contentPolicyFilterContext.GetContentFilter<Domain.Entities.BackupJob>();
        var backupJobs = await backupJobRepository.GetAllAsync(requestModel, filter);
        return mapper.Map(backupJobs);
    }
}
