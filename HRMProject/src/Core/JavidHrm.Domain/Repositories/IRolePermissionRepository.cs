using JavidHrm.Domain.Entities;
using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Dtos.RolePermissions;

namespace JavidHrm.Domain.Repositories;

public interface IRolePermissionRepository
{
    void Add(RolePermission rolePermission);
    void Remove(RolePermission rolePermission);
    ValueTask<RolePermission?> FindAsync(int id, CancellationToken cancellationToken = default);
    Task<GetRolePermissionDto?> GetInfoAsync(int id);
    Task<PagedResult<GetAllRolePermissionDto>> GetAllAsync(GetAllRolePermissionRequestDto request, Expression<Func<RolePermission, bool>>? contentFilter = null);
    Task<bool> AnyAsync(Expression<Func<RolePermission, bool>> expression, CancellationToken cancellationToken = default);
}