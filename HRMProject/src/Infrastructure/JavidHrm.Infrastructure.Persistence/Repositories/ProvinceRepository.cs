using JavidHrm.Domain.Entities;
using System.Linq.Expressions;
using JavidHrm.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using JavidHrm.Domain.Dtos.Provinces;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Infrastructure.Persistence.Extensions;

namespace JavidHrm.Infrastructure.Persistence.Repositories;

public class ProvinceRepository
    (JavidHrmDbContext context)
    : Repository<Province>(context), IProvinceRepository
{
    public async Task<PagedResult<GetAllProvinceResponseDto>> GetAllAsync(GetAllProvinceRequestDto request, Expression<Func<Province, bool>>? contentFilter = null)
    {
        var provinces = Context.Province
            .ApplyContentPolicyFilter(contentFilter)
            .ApplyQueryFilters(request);

        return await provinces
            .Select(x => new GetAllProvinceResponseDto
            {
                Id = x.Id,
                Name = x.Name,
                Rate = x.Rate,
                Slug = x.Slug,
                IsActive = x.IsActive,
                Latitude = x.Latitude,
                Longitude = x.Longitude,
                Description = x.Description
            })
            .AsNoTracking()
            .ToPagedAsync(request.Pagination);
    }

    public async Task<PagedResult<SearchProvinceResponseDto>> SearchAsync(SearchProvinceRequestDto request, Expression<Func<Province, bool>>? contentFilter = null)
    {
        var provinces = Context.Province
            .ApplyContentPolicyFilter(contentFilter)
            .Where(x => x.IsActive)
            .ApplyQueryFilters(request);

        return await provinces
            .Select(x => new SearchProvinceResponseDto
            {
                Id = x.Id,
                Name = x.Name,
                Rate = x.Rate,
                Slug = x.Slug,
                Latitude = x.Latitude,
                Longitude = x.Longitude,
                Description = x.Description
            })
            .AsNoTracking()
            .ToPagedAsync(request.Pagination);
    }
}