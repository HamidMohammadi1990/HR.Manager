using JavidHrm.Domain.Entities;
using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Dtos.UserAddresses;

namespace JavidHrm.Domain.Repositories;

public interface IUserAddressRepository
{
    Task<PagedResult<GetAllUserAddressDto>> GetAllAsync(GetAllUserAddressRequestDto model, Expression<Func<UserAddress, bool>>? contentFilter = null);
    Task<PagedResult<GetUserAddressDto>> GetUserAddressAsync(GetUserAddressesRequestDto request, Expression<Func<UserAddress, bool>>? contentFilter = null);

    ValueTask<UserAddress?> FindAsync(int id, CancellationToken cancellationToken = default);
    Task<UserAddress?> GetAsNoTrackingAsync(int id, CancellationToken cancellationToken = default);
    Task<List<UserAddressSummaryDto>> GetSummariesAsync(int userId);
    void Add(UserAddress userAddress);
    void Remove(UserAddress userAddress);
    Task<bool> AnyAsync(Expression<Func<UserAddress, bool>> expression, CancellationToken cancellationToken = default);
}