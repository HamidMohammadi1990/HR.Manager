using System.Linq.Expressions;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Dtos.UserRoles;
using JavidHrm.Infrastructure.Persistence.Extensions;

namespace JavidHrm.Infrastructure.Persistence.Repositories;

public class UserRoleRepository
    (JavidHrmDbContext context)
    : Repository<UserRole>(context), IUserRoleRepository
{
    public async Task<GetUserRoleDto?> GetInfoAsync(int id)
    {
        return await
            (from userRole in Context.UserRole.AsNoTracking()
             join user in Context.User on userRole.UserId equals user.Id
             join role in Context.Role on userRole.RoleId equals role.Id
             where userRole.Id == id
             select new GetUserRoleDto
             {
                 Id = userRole.Id,
                 UserId = userRole.UserId,
                 UserName = user.UserName,
                 RoleId = userRole.RoleId,
                 RoleTitle = role.Title
             })
            .FirstOrDefaultAsync();
    }

    public async Task<PagedResult<GetAllUserRoleDto>> GetAllAsync(GetAllUserRoleRequestDto request, Expression<Func<UserRole, bool>>? contentFilter = null)
    {
        var userRoleSource = Context.UserRole
            .ApplyContentPolicyFilter(contentFilter);

        var userRoles =
            from userRole in userRoleSource
            join user in Context.User on userRole.UserId equals user.Id
            join role in Context.Role on userRole.RoleId equals role.Id
            select new { userRole, user, role };

        userRoles = userRoles.ApplyQueryFilters(request);

        var result = await
            userRoles
            .Select(x => new GetAllUserRoleDto
            {
                Id = x.userRole.Id,
                UserId = x.userRole.UserId,
                UserName = x.user.UserName,
                RoleId = x.userRole.RoleId,
                RoleTitle = x.role.Title
            })
            .AsNoTracking()
            .ToPagedAsync(request.Pagination);

        return result;
    }
}