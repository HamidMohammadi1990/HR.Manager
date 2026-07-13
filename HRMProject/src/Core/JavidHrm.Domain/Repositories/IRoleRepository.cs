using JavidHrm.Domain.Entities;
using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.Roles;
using JavidHrm.Domain.Dtos.Pagination;

namespace JavidHrm.Domain.Repositories;

public interface IRoleRepository
{
    void Add(Role role);
    void Remove(Role role);
    ValueTask<Role?> FindAsync(int id, CancellationToken cancellationToken = default);
    Task<Role?> GetAsNoTrackingAsync(int id, CancellationToken cancellationToken = default);
    Task<PagedResult<Role>> GetAllAsync(GetAllRoleRequestDto request, Expression<Func<Role, bool>>? contentFilter = null);
    Task<bool> AnyAsync(Expression<Func<Role, bool>> expression, CancellationToken cancellationToken = default);
}