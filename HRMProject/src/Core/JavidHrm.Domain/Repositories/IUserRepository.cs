using JavidHrm.Domain.Entities;
using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.Users;
using JavidHrm.Domain.Dtos.Pagination;

namespace JavidHrm.Domain.Repositories;

public interface IUserRepository
{
    Task<PagedResult<GetAllUserDto>> GetAllAsync(GetAllUserRequestDto request, Expression<Func<User, bool>>? contentFilter = null);
    void Add(User user);
    Task<bool> AnyAsync(Expression<Func<User, bool>> expression, CancellationToken cancellationToken = default);
    ValueTask<User?> FindAsync(int userId, CancellationToken cancellationToken = default);
    Task<User?> GetAsNoTrackingAsync(int id, CancellationToken cancellationToken = default);
    Task<User?> FindByUserNameAsync(string userName, CancellationToken cancellationToken = default);
    Task<User?> FindByLoginAsync(string userNameOrEmail, CancellationToken cancellationToken = default);
    Task<string?> GetSecurityStampAsync(int userId, CancellationToken cancellationToken = default);
    Task<bool> VerifyRepeatPhoneAsync(string phoneNumber);
    Task<bool> VerifyRepeatEmailAsync(string email);
}