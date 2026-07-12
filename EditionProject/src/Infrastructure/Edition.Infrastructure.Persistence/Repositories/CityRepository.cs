using JavidHrm.Domain.Entities;
using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.Cities;
using JavidHrm.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Infrastructure.Persistence.Extensions;

namespace JavidHrm.Infrastructure.Persistence.Repositories;

public class CityRepository
    (JavidHrmDbContext context)
    : Repository<City>(context), ICityRepository
{
    public async Task<PagedResult<GetAllCityResponseDto>> GetAllAsync(GetAllCityRequestDto request, Expression<Func<City, bool>>? contentFilter = null)
    {
        var cities = Context.City
            .Include(x => x.Province)
            .ApplyContentPolicyFilter(contentFilter)
            .ApplyQueryFilters(request);

        return await cities
            .Select(x => new GetAllCityResponseDto
            {
                Id = x.Id,
                Name = x.Name,
                Rate = x.Rate,
                Slug = x.Slug,
                Latitude = x.Latitude,
                Longitude = x.Longitude,
                ProvinceId = x.ProvinceId,
                ProvinceName = x.Province.Name,
                Description = x.Description
            })
            .AsNoTracking()
            .ToPagedAsync(request.Pagination);
    }

    public async Task<PagedResult<SearchCityResponseDto>> SearchAsync(SearchCityRequestDto request, Expression<Func<City, bool>>? contentFilter = null)
    {
        var cities = Context.City
            .ApplyContentPolicyFilter(contentFilter)
            .Include(x => x.Province)
            .Where(x => x.IsActive)
            .ApplyQueryFilters(request);

        return await cities
            .Select(x => new SearchCityResponseDto
            {
                Id = x.Id,
                Name = x.Name,
                Rate = x.Rate,
                Slug = x.Slug,
                Latitude = x.Latitude,
                Longitude = x.Longitude,
                ProvinceId = x.ProvinceId,
                ProvinceName = x.Province.Name,
                Description = x.Description
            })
            .AsNoTracking()
            .ToPagedAsync(request.Pagination);
    }
}