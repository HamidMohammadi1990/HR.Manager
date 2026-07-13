using JavidHrm.Domain.Entities;
using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.Provinces;
using JavidHrm.Domain.Dtos.Pagination;

namespace JavidHrm.Domain.Repositories;

public interface IProvinceRepository
{
    void Add(Province province);
    ValueTask<Province?> FindAsync(int id, CancellationToken cancellationToken = default);
    Task<Province?> GetAsNoTrackingAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> AnyAsync(Expression<Func<Province, bool>> expression, CancellationToken cancellationToken = default);
    Task<PagedResult<GetAllProvinceResponseDto>> GetAllAsync(GetAllProvinceRequestDto request, Expression<Func<Province, bool>>? contentFilter = null);
    Task<PagedResult<SearchProvinceResponseDto>> SearchAsync(SearchProvinceRequestDto request, Expression<Func<Province, bool>>? contentFilter = null);
}