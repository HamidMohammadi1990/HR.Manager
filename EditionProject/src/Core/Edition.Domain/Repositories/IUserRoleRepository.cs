using JavidHrm.Domain.Entities;
using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.UserRoles;
using JavidHrm.Domain.Dtos.Pagination;

namespace JavidHrm.Domain.Repositories;

public interface IUserRoleRepository
{
    void Add(UserRole userRole);
    void Remove(UserRole userRole);
    ValueTask<UserRole?> FindAsync(int id, CancellationToken cancellationToken = default);
    Task<GetUserRoleDto?> GetInfoAsync(int id);
    Task<PagedResult<GetAllUserRoleDto>> GetAllAsync(GetAllUserRoleRequestDto request, Expression<Func<UserRole, bool>>? contentFilter = null);
    Task<bool> AnyAsync(Expression<Func<UserRole, bool>> expression, CancellationToken cancellationToken = default);
}