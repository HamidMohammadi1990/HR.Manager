using System.Linq.Expressions;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Dtos.Roles;
using JavidHrm.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Infrastructure.Persistence.Extensions;

namespace JavidHrm.Infrastructure.Persistence.Repositories;

public class RoleRepository
    (JavidHrmDbContext context)
    : Repository<Role>(context), IRoleRepository
{
    public async Task<PagedResult<Role>> GetAllAsync(GetAllRoleRequestDto request, Expression<Func<Role, bool>>? contentFilter = null)
    {
        var roles = await Context.Role
            .ApplyContentPolicyFilter(contentFilter)
            .ApplyQueryFilters(request)
            .AsNoTracking()
            .ToPagedAsync(request.Pagination);
        
        return roles;
    }
}