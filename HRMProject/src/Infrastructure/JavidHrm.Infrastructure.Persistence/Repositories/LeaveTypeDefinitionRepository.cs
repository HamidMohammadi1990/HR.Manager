using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.LeaveTypeDefinitions;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Repositories;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;

namespace JavidHrm.Infrastructure.Persistence.Repositories;

public class LeaveTypeDefinitionRepository(JavidHrmDbContext context)
    : Repository<LeaveTypeDefinition>(context), ILeaveTypeDefinitionRepository
{
    public async Task<PagedResult<GetAllLeaveTypeDefinitionResponseDto>> GetAllAsync(
        GetAllLeaveTypeDefinitionRequestDto request,
        Expression<Func<LeaveTypeDefinition, bool>>? contentFilter = null)
    {
        var leaveTypeDefinitionSource = Context.LeaveTypeDefinition.ApplyContentPolicyFilter(contentFilter);

        var leaveTypeDefinitions =
            from leaveTypeDefinition in leaveTypeDefinitionSource
            select new { leaveTypeDefinition };

        leaveTypeDefinitions = leaveTypeDefinitions.ApplyQueryFilters(request);

        return await leaveTypeDefinitions
            .OrderBy(x => x.leaveTypeDefinition.SortOrder)
            .ThenBy(x => x.leaveTypeDefinition.Name)
            .Select(x => new GetAllLeaveTypeDefinitionResponseDto
            {
                Id = x.leaveTypeDefinition.Id,
                Code = x.leaveTypeDefinition.Code,
                Name = x.leaveTypeDefinition.Name,
                Description = x.leaveTypeDefinition.Description,
                Category = x.leaveTypeDefinition.Category,
                Unit = x.leaveTypeDefinition.Unit,
                IsPaid = x.leaveTypeDefinition.IsPaid,
                IsActive = x.leaveTypeDefinition.IsActive,
                AffectsLeaveBalance = x.leaveTypeDefinition.AffectsLeaveBalance,
                RequiresApproval = x.leaveTypeDefinition.RequiresApproval,
                DefaultAnnualAllowance = x.leaveTypeDefinition.DefaultAnnualAllowance,
                MaxPerYear = x.leaveTypeDefinition.MaxPerYear,
                MaxPerRequest = x.leaveTypeDefinition.MaxPerRequest,
                MinNoticeDays = x.leaveTypeDefinition.MinNoticeDays,
                AllowNegativeBalance = x.leaveTypeDefinition.AllowNegativeBalance,
                CarryForwardEnabled = x.leaveTypeDefinition.CarryForwardEnabled,
                MaxCarryForwardDays = x.leaveTypeDefinition.MaxCarryForwardDays,
                IncludeWeekends = x.leaveTypeDefinition.IncludeWeekends,
                IncludeHolidays = x.leaveTypeDefinition.IncludeHolidays,
                SortOrder = x.leaveTypeDefinition.SortOrder,
                Color = x.leaveTypeDefinition.Color,
                CreatedOnUtc = x.leaveTypeDefinition.CreatedOnUtc
            })
            .AsNoTracking()
            .ToPagedAsync(request.Pagination);
    }

    public async Task<PagedResult<SearchLeaveTypeDefinitionResponseDto>> SearchAsync(
        SearchLeaveTypeDefinitionRequestDto request,
        Expression<Func<LeaveTypeDefinition, bool>>? contentFilter = null)
    {
        var leaveTypeDefinitionSource = Context.LeaveTypeDefinition.ApplyContentPolicyFilter(contentFilter);

        var leaveTypeDefinitions =
            from leaveTypeDefinition in leaveTypeDefinitionSource
            select new { leaveTypeDefinition };

        leaveTypeDefinitions = leaveTypeDefinitions.ApplyQueryFilters(request);

        return await leaveTypeDefinitions
            .OrderBy(x => x.leaveTypeDefinition.SortOrder)
            .ThenBy(x => x.leaveTypeDefinition.Name)
            .Select(x => new SearchLeaveTypeDefinitionResponseDto
            {
                Id = x.leaveTypeDefinition.Id,
                Code = x.leaveTypeDefinition.Code,
                Name = x.leaveTypeDefinition.Name,
                Description = x.leaveTypeDefinition.Description,
                Category = x.leaveTypeDefinition.Category,
                Unit = x.leaveTypeDefinition.Unit,
                IsPaid = x.leaveTypeDefinition.IsPaid,
                AffectsLeaveBalance = x.leaveTypeDefinition.AffectsLeaveBalance,
                RequiresApproval = x.leaveTypeDefinition.RequiresApproval,
                DefaultAnnualAllowance = x.leaveTypeDefinition.DefaultAnnualAllowance,
                MaxPerYear = x.leaveTypeDefinition.MaxPerYear,
                MaxPerRequest = x.leaveTypeDefinition.MaxPerRequest,
                MinNoticeDays = x.leaveTypeDefinition.MinNoticeDays,
                AllowNegativeBalance = x.leaveTypeDefinition.AllowNegativeBalance,
                CarryForwardEnabled = x.leaveTypeDefinition.CarryForwardEnabled,
                MaxCarryForwardDays = x.leaveTypeDefinition.MaxCarryForwardDays,
                IncludeWeekends = x.leaveTypeDefinition.IncludeWeekends,
                IncludeHolidays = x.leaveTypeDefinition.IncludeHolidays,
                SortOrder = x.leaveTypeDefinition.SortOrder,
                Color = x.leaveTypeDefinition.Color,
                CreatedOnUtc = x.leaveTypeDefinition.CreatedOnUtc
            })
            .AsNoTracking()
            .ToPagedAsync(request.Pagination);
    }
}
