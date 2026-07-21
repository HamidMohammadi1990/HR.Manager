using JavidHrm.Application.Contracts.Mapping;

using JavidHrm.Application.Features.LeaveTypeDefinitions.Queries;

using JavidHrm.Domain.Dtos.LeaveTypeDefinitions;

using JavidHrm.Domain.Dtos.Pagination;

using JavidHrm.Domain.Entities;



namespace JavidHrm.Application.Mappings;



public class LeaveTypeDefinitionMapperService : ILeaveTypeDefinitionMapperService

{

    public GetAllLeaveTypeDefinitionRequestDto Map(GetAllLeaveTypeDefinitionRequest model)

        => new()

        {

            Code = model.Code,

            Name = model.Name,

            Category = model.Category,

            Unit = model.Unit,

            IsActive = model.IsActive,

            IsPaid = model.IsPaid,

            Pagination = model.Pagination

        };



    public SearchLeaveTypeDefinitionRequestDto Map(SearchLeaveTypeDefinitionRequest model)

        => new()

        {

            Code = model.Code,

            Name = model.Name,

            Category = model.Category,

            Unit = model.Unit,

            IsPaid = model.IsPaid,

            IsActive = model.IsActive,

            Pagination = model.Pagination

        };



    public GetLeaveTypeDefinitionResponse Map(LeaveTypeDefinition model)

        => new()

        {

            Id = model.Id,

            Code = model.Code,

            Name = model.Name,

            Description = model.Description,

            Category = model.Category,

            Unit = model.Unit,

            IsPaid = model.IsPaid,

            IsActive = model.IsActive,

            AffectsLeaveBalance = model.AffectsLeaveBalance,

            RequiresApproval = model.RequiresApproval,

            DefaultAnnualAllowance = model.DefaultAnnualAllowance,

            MaxPerYear = model.MaxPerYear,

            MaxPerRequest = model.MaxPerRequest,

            MinNoticeDays = model.MinNoticeDays,

            AllowNegativeBalance = model.AllowNegativeBalance,

            CarryForwardEnabled = model.CarryForwardEnabled,

            MaxCarryForwardDays = model.MaxCarryForwardDays,

            IncludeWeekends = model.IncludeWeekends,

            IncludeHolidays = model.IncludeHolidays,

            SortOrder = model.SortOrder,

            Color = model.Color,

            CreatedOnUtc = model.CreatedOnUtc

        };



    public PagedResult<GetAllLeaveTypeDefinitionResponse> Map(PagedResult<GetAllLeaveTypeDefinitionResponseDto> model)

    {

        var items = model.Items.Select(MapGetAllItem).ToList();

        return PagedResult<GetAllLeaveTypeDefinitionResponse>.Create(items, model);

    }



    public PagedResult<SearchLeaveTypeDefinitionResponse> Map(PagedResult<SearchLeaveTypeDefinitionResponseDto> model)

    {

        var items = model.Items.Select(MapSearchItem).ToList();

        return PagedResult<SearchLeaveTypeDefinitionResponse>.Create(items, model);

    }



    private static GetAllLeaveTypeDefinitionResponse MapGetAllItem(GetAllLeaveTypeDefinitionResponseDto x)

        => new()

        {

            Id = x.Id,

            Code = x.Code,

            Name = x.Name,

            Description = x.Description,

            Category = x.Category,

            Unit = x.Unit,

            IsPaid = x.IsPaid,

            IsActive = x.IsActive,

            AffectsLeaveBalance = x.AffectsLeaveBalance,

            RequiresApproval = x.RequiresApproval,

            DefaultAnnualAllowance = x.DefaultAnnualAllowance,

            MaxPerYear = x.MaxPerYear,

            MaxPerRequest = x.MaxPerRequest,

            MinNoticeDays = x.MinNoticeDays,

            AllowNegativeBalance = x.AllowNegativeBalance,

            CarryForwardEnabled = x.CarryForwardEnabled,

            MaxCarryForwardDays = x.MaxCarryForwardDays,

            IncludeWeekends = x.IncludeWeekends,

            IncludeHolidays = x.IncludeHolidays,

            SortOrder = x.SortOrder,

            Color = x.Color,

            CreatedOnUtc = x.CreatedOnUtc

        };



    private static SearchLeaveTypeDefinitionResponse MapSearchItem(SearchLeaveTypeDefinitionResponseDto x)

        => new()

        {

            Id = x.Id,

            Code = x.Code,

            Name = x.Name,

            Description = x.Description,

            Category = x.Category,

            Unit = x.Unit,

            IsPaid = x.IsPaid,

            AffectsLeaveBalance = x.AffectsLeaveBalance,

            RequiresApproval = x.RequiresApproval,

            DefaultAnnualAllowance = x.DefaultAnnualAllowance,

            MaxPerYear = x.MaxPerYear,

            MaxPerRequest = x.MaxPerRequest,

            MinNoticeDays = x.MinNoticeDays,

            AllowNegativeBalance = x.AllowNegativeBalance,

            CarryForwardEnabled = x.CarryForwardEnabled,

            MaxCarryForwardDays = x.MaxCarryForwardDays,

            IncludeWeekends = x.IncludeWeekends,

            IncludeHolidays = x.IncludeHolidays,

            SortOrder = x.SortOrder,

            Color = x.Color,

            CreatedOnUtc = x.CreatedOnUtc

        };

}

