using JavidHrm.Domain.Entities;
using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.Cities;
using JavidHrm.Domain.Dtos.Pagination;

namespace JavidHrm.Domain.Repositories;

public interface ICityRepository
{
    ValueTask<City?> FindAsync(int id, CancellationToken cancellationToken = default);
    Task<City?> GetAsNoTrackingAsync(int id, CancellationToken cancellationToken = default);
    void Add(City city);
    Task<bool> AnyAsync(Expression<Func<City, bool>> expression, CancellationToken cancellationToken = default);
    Task<PagedResult<GetAllCityResponseDto>> GetAllAsync(GetAllCityRequestDto request, Expression<Func<City, bool>>? contentFilter = null);
    Task<PagedResult<SearchCityResponseDto>> SearchAsync(SearchCityRequestDto request, Expression<Func<City, bool>>? contentFilter = null);
}