using System.Linq.Expressions;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Dtos.Users;
using JavidHrm.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Infrastructure.Persistence.Extensions;

namespace JavidHrm.Infrastructure.Persistence.Repositories;

public class UserRepository
    (JavidHrmDbContext context)
    : Repository<User>(context), IUserRepository
{
    public async Task<PagedResult<GetAllUserDto>> GetAllAsync(GetAllUserRequestDto request, Expression<Func<User, bool>>? contentFilter = null)
    {
        var users = Context.User
            .ApplyContentPolicyFilter(contentFilter)
            .ApplyQueryFilters(request);

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var term = request.Search.Trim();
            users = users.Where(x =>
                x.FirstName.Contains(term)
                || x.LastName.Contains(term)
                || x.UserName.Contains(term)
                || (x.Email != null && x.Email.Contains(term))
                || (x.PhoneNumber != null && x.PhoneNumber.Contains(term)));
        }

        var result =
            await users
                .Select(x => new GetAllUserDto
                {
                    Id = x.Id,
                    Email = x.Email,
                    Gender = x.Gender,
                    IsActive = x.IsActive,
                    FirstName = x.FirstName,
                    LastName = x.LastName,
                    UserName = x.UserName,
                    PhoneNumber = x.PhoneNumber,
                    EmailConfirmed = x.EmailConfirmed,
                    LoginPermission = x.LoginPermission,
                    AccessFailedCount = x.AccessFailedCount,
                    LastLoginDateOnUtc = x.LastLoginDateOnUtc,
                    PhoneNumberConfirmed = x.PhoneNumberConfirmed
                })
                .AsNoTracking()
                .ToPagedAsync(request.Pagination);

        return result;
    }

    public async Task<User?> FindByUserNameAsync(string userName, CancellationToken cancellationToken = default)
    {
        return await Context.User.SingleOrDefaultAsync(x => x.UserName == userName && x.IsActive, cancellationToken);
    }

    public async Task<User?> FindByLoginAsync(string userNameOrEmail, CancellationToken cancellationToken = default)
    {
        return await Context.User.FirstOrDefaultAsync(
            x => (x.UserName == userNameOrEmail || x.Email == userNameOrEmail) && x.IsActive,
            cancellationToken);
    }

    public async Task<string?> GetSecurityStampAsync(int userId, CancellationToken cancellationToken = default)
    {
        return await Context.User
            .AsNoTracking()
            .Where(x => x.Id == userId && x.IsActive)
            .Select(x => x.SecurityStamp)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<bool> VerifyRepeatPhoneAsync(string phoneNumber)
    {
        return await Context.User.AnyAsync(u => (u.PhoneNumber == phoneNumber || u.UserName == phoneNumber) && u.PhoneNumberConfirmed);
    }

    public async Task<bool> VerifyRepeatEmailAsync(string email)
    {
        return await Context.User.AnyAsync(u => (u.Email == email || u.UserName == email) && u.EmailConfirmed);
    }
}
