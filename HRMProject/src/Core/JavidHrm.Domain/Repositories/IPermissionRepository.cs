using JavidHrm.Domain.Entities;
using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Dtos.Permissions;

namespace JavidHrm.Domain.Repositories;

public interface IPermissionRepository
{
    void Add(Permission permission);
    void Remove(Permission permission);
    ValueTask<Permission?> FindAsync(PermissionType id, CancellationToken cancellationToken = default);
    Task<Permission?> GetAsNoTrackingAsync(PermissionType id, CancellationToken cancellationToken = default);
    Task<PagedResult<Permission>> GetAllAsync(GetAllPermissionRequestDto request, Expression<Func<Permission, bool>>? contentFilter = null);
    Task<bool> HasPermissionAsync(int UserId, PermissionType PermissionType);
    Task<List<PermissionType>> GetUserPermissionTypesAsync(int userId, CancellationToken cancellationToken = default);
    Task<bool> AnyAsync(Expression<Func<Permission, bool>> expression, CancellationToken cancellationToken = default);
}