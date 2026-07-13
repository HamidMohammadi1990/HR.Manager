using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.HrBackupJobs;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;

namespace JavidHrm.Domain.Repositories;

public interface IBackupJobRepository
{
    void Add(BackupJob backupJob);
    void Remove(BackupJob backupJob);
    ValueTask<BackupJob?> FindAsync(int id, CancellationToken cancellationToken = default);
    Task<BackupJob?> GetAsNoTrackingAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> AnyAsync(Expression<Func<BackupJob, bool>> expression, CancellationToken cancellationToken = default);
    Task<PagedResult<GetAllBackupJobResponseDto>> GetAllAsync(
        GetAllBackupJobRequestDto request,
        Expression<Func<BackupJob, bool>>? contentFilter = null);
    Task<string> BuildHrBackupJsonAsync(CancellationToken cancellationToken = default);
}
