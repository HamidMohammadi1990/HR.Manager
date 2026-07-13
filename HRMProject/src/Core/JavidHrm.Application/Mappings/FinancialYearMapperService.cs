using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Dtos.FinancialYears;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Features.FinancialYears.Queries;

namespace JavidHrm.Application.Mappings;

public class FinancialYearMapperService : IFinancialYearMapperService
{
    public GetAllFinancialYearRequestDto Map(GetAllFinancialYearRequest model)
    {
        return new GetAllFinancialYearRequestDto
        {
            Name = model.Name,
            IsActive = model.IsActive,
            DepartmentId = model.DepartmentId,
            Pagination = model.Pagination
        };
    }

    public GetFinancialYearResponse Map(FinancialYear model)
    {
        return new GetFinancialYearResponse
        {
            Id = model.Id,
            Name = model.Name,
            IsActive = model.IsActive,
            StartDate = model.StartDate,
            EndDate = model.EndDate,
            DepartmentId = model.DepartmentId
        };
    }

    public PagedResult<GetAllFinancialYearResponse> Map(PagedResult<FinancialYear> model)
    {
        var items = model
            .Items
            .Select(x => new GetAllFinancialYearResponse
            {
                Id = x.Id,
                Name = x.Name,
                EndDate = x.EndDate,
                IsActive = x.IsActive,
                StartDate = x.StartDate,
                DepartmentId = x.DepartmentId,
                CreatedOnUtc = x.CreatedOnUtc
            })
            .ToList();

        return PagedResult<GetAllFinancialYearResponse>.Create(items, model);
    }
}