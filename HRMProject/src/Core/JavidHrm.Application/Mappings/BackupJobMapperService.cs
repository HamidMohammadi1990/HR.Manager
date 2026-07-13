using JavidHrm.Application.Features.BackupJobs.Queries;
using JavidHrm.Domain.Dtos.HrBackupJobs;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Mappings;

public class BackupJobMapperService : IBackupJobMapperService
{
    public GetAllBackupJobRequestDto Map(GetAllBackupJobRequest model)
        => new()
        {
            Status = model.Status,
            Type = model.Type,
            CreatedFromUtc = model.CreatedFromUtc,
            CreatedToUtc = model.CreatedToUtc,
            Pagination = model.Pagination
        };

    public GetBackupJobResponse Map(BackupJob model, User creator)
        => new()
        {
            Id = model.Id,
            FileName = model.FileName,
            FileSizeBytes = model.FileSizeBytes,
            Status = model.Status,
            Type = model.Type,
            StoragePath = model.StoragePath,
            ErrorMessage = model.ErrorMessage,
            CreatedByUserId = model.CreatedByUserId,
            CreatorFirstName = creator.FirstName,
            CreatorLastName = creator.LastName,
            CreatorUserName = creator.UserName,
            CompletedAtUtc = model.CompletedAtUtc,
            CreatedOnUtc = model.CreatedOnUtc
        };

    public PagedResult<GetAllBackupJobResponse> Map(PagedResult<GetAllBackupJobResponseDto> model)
    {
        var items = model.Items.Select(x => new GetAllBackupJobResponse
        {
            Id = x.Id,
            FileName = x.FileName,
            FileSizeBytes = x.FileSizeBytes,
            Status = x.Status,
            Type = x.Type,
            StoragePath = x.StoragePath,
            ErrorMessage = x.ErrorMessage,
            CreatedByUserId = x.CreatedByUserId,
            CreatorFirstName = x.CreatorFirstName,
            CreatorLastName = x.CreatorLastName,
            CreatorUserName = x.CreatorUserName,
            CompletedAtUtc = x.CompletedAtUtc,
            CreatedOnUtc = x.CreatedOnUtc
        }).ToList();

        return PagedResult<GetAllBackupJobResponse>.Create(items, model);
    }
}
