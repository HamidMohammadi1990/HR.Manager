using System.Linq.Expressions;
using System.Text.Json;
using JavidHrm.Domain.Dtos.HrBackupJobs;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Repositories;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;

namespace JavidHrm.Infrastructure.Persistence.Repositories;

public class BackupJobRepository(JavidHrmDbContext context)
    : Repository<BackupJob>(context), IBackupJobRepository
{
    public async Task<PagedResult<GetAllBackupJobResponseDto>> GetAllAsync(
        GetAllBackupJobRequestDto request,
        Expression<Func<BackupJob, bool>>? contentFilter = null)
    {
        var requestSource = Context.BackupJob.ApplyContentPolicyFilter(contentFilter);

        var backupJobs =
            from backupJob in requestSource
            join user in Context.User on backupJob.CreatedByUserId equals user.Id
            select new { backupJob, user };

        backupJobs = backupJobs.ApplyQueryFilters(request);

        if (request.CreatedFromUtc.HasValue)
            backupJobs = backupJobs.Where(x => x.backupJob.CreatedOnUtc >= request.CreatedFromUtc.Value);

        if (request.CreatedToUtc.HasValue)
            backupJobs = backupJobs.Where(x => x.backupJob.CreatedOnUtc <= request.CreatedToUtc.Value);

        return await backupJobs
            .OrderByDescending(x => x.backupJob.CreatedOnUtc)
            .Select(x => new GetAllBackupJobResponseDto
            {
                Id = x.backupJob.Id,
                FileName = x.backupJob.FileName,
                FileSizeBytes = x.backupJob.FileSizeBytes,
                Status = x.backupJob.Status,
                Type = x.backupJob.Type,
                StoragePath = x.backupJob.StoragePath,
                ErrorMessage = x.backupJob.ErrorMessage,
                CreatedByUserId = x.backupJob.CreatedByUserId,
                CreatorFirstName = x.user.FirstName,
                CreatorLastName = x.user.LastName,
                CreatorUserName = x.user.UserName,
                CompletedAtUtc = x.backupJob.CompletedAtUtc,
                CreatedOnUtc = x.backupJob.CreatedOnUtc
            })
            .AsNoTracking()
            .ToPagedAsync(request.Pagination);
    }

    public async Task<string> BuildHrBackupJsonAsync(CancellationToken cancellationToken = default)
    {
        var data = new
        {
            ExportedAtUtc = DateTime.UtcNow,
            Employees = await Context.Employee.AsNoTracking().ToListAsync(cancellationToken),
            Departments = await Context.Department.AsNoTracking().ToListAsync(cancellationToken),
            AttendanceRecords = await Context.AttendanceRecord.AsNoTracking().ToListAsync(cancellationToken),
            LeaveRequests = await Context.LeaveRequest.AsNoTracking().ToListAsync(cancellationToken),
            PayrollEntries = await Context.PayrollEntry.AsNoTracking().ToListAsync(cancellationToken)
        };

        return JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });
    }
}
