using JavidHrm.Domain.Enums;
using JavidHrm.Domain.Entities;
using System.Linq.Expressions;
using JavidHrm.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Dtos.Permissions;
using JavidHrm.Infrastructure.Persistence.Extensions;

namespace JavidHrm.Infrastructure.Persistence.Repositories;

public class PermissionRepository
    (JavidHrmDbContext context)
    : Repository<Permission, PermissionType>(context), IPermissionRepository
{
    public async Task<PagedResult<Permission>> GetAllAsync(GetAllPermissionRequestDto request, Expression<Func<Permission, bool>>? contentFilter = null)
    {
        var permissions = Context.Permission
            .ApplyContentPolicyFilter(contentFilter)
            .ApplyQueryFilters(request);

        var result = await
            permissions
            .AsNoTracking()
            .ToPagedAsync(request.Pagination);

        return result;
    }

    public async Task<bool> HasPermissionAsync(int userId, PermissionType permissionType)
    {
        return await (from UserRole in Context.UserRole
                      join RolePermission in Context.RolePermission
                      on UserRole.RoleId equals RolePermission.RoleId
                      where UserRole.UserId == userId
                      && RolePermission.PermissionId == permissionType
                      select RolePermission.PermissionId)
                   .AnyAsync();
    }
}