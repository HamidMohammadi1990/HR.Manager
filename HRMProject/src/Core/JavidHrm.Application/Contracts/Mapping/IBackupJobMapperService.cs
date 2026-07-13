using JavidHrm.Application.Features.BackupJobs.Queries;
using JavidHrm.Domain.Dtos.HrBackupJobs;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;

namespace JavidHrm.Application.Contracts.Mapping;

public interface IBackupJobMapperService : IMapper
{
    GetAllBackupJobRequestDto Map(GetAllBackupJobRequest model);
    GetBackupJobResponse Map(BackupJob model, User creator);
    PagedResult<GetAllBackupJobResponse> Map(PagedResult<GetAllBackupJobResponseDto> model);
}
