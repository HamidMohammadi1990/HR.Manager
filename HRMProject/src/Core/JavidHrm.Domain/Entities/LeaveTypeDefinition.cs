using JavidHrm.Domain.Common;

using JavidHrm.Domain.Enums;



namespace JavidHrm.Domain.Entities;



public class LeaveTypeDefinition : BaseEntity

{

    public string Code { get; private set; } = default!;

    public string Name { get; private set; } = default!;

    public string? Description { get; private set; }

    public LeaveTypeCategory Category { get; private set; }

    public LeaveTypeUnit Unit { get; private set; }

    public bool IsPaid { get; private set; }

    public bool IsActive { get; private set; } = true;

    public bool AffectsLeaveBalance { get; private set; }

    public bool RequiresApproval { get; private set; } = true;

    public decimal? DefaultAnnualAllowance { get; private set; }

    public decimal? MaxPerYear { get; private set; }

    public decimal? MaxPerRequest { get; private set; }

    public int? MinNoticeDays { get; private set; }

    public bool AllowNegativeBalance { get; private set; }

    public bool CarryForwardEnabled { get; private set; }

    public decimal? MaxCarryForwardDays { get; private set; }

    public bool IncludeWeekends { get; private set; }

    public bool IncludeHolidays { get; private set; }

    public int SortOrder { get; private set; }

    public string? Color { get; private set; }

    public DateTime CreatedOnUtc { get; private set; } = DateTime.UtcNow;



    public static LeaveTypeDefinition Create(

        string code,

        string name,

        string? description,

        LeaveTypeCategory category,

        LeaveTypeUnit unit,

        bool isPaid,

        bool affectsLeaveBalance,

        bool requiresApproval,

        decimal? defaultAnnualAllowance,

        decimal? maxPerYear,

        decimal? maxPerRequest,

        int? minNoticeDays,

        bool allowNegativeBalance,

        bool carryForwardEnabled,

        decimal? maxCarryForwardDays,

        bool includeWeekends,

        bool includeHolidays,

        int sortOrder,

        string? color)

        => new()

        {

            Code = code,

            Name = name,

            Description = description,

            Category = category,

            Unit = unit,

            IsPaid = isPaid,

            AffectsLeaveBalance = affectsLeaveBalance,

            RequiresApproval = requiresApproval,

            DefaultAnnualAllowance = defaultAnnualAllowance,

            MaxPerYear = maxPerYear,

            MaxPerRequest = maxPerRequest,

            MinNoticeDays = minNoticeDays,

            AllowNegativeBalance = allowNegativeBalance,

            CarryForwardEnabled = carryForwardEnabled,

            MaxCarryForwardDays = maxCarryForwardDays,

            IncludeWeekends = includeWeekends,

            IncludeHolidays = includeHolidays,

            SortOrder = sortOrder,

            Color = color

        };



    public void Update(

        string code,

        string name,

        string? description,

        LeaveTypeCategory category,

        LeaveTypeUnit unit,

        bool isPaid,

        bool isActive,

        bool affectsLeaveBalance,

        bool requiresApproval,

        decimal? defaultAnnualAllowance,

        decimal? maxPerYear,

        decimal? maxPerRequest,

        int? minNoticeDays,

        bool allowNegativeBalance,

        bool carryForwardEnabled,

        decimal? maxCarryForwardDays,

        bool includeWeekends,

        bool includeHolidays,

        int sortOrder,

        string? color)

    {

        Code = code;

        Name = name;

        Description = description;

        Category = category;

        Unit = unit;

        IsPaid = isPaid;

        IsActive = isActive;

        AffectsLeaveBalance = affectsLeaveBalance;

        RequiresApproval = requiresApproval;

        DefaultAnnualAllowance = defaultAnnualAllowance;

        MaxPerYear = maxPerYear;

        MaxPerRequest = maxPerRequest;

        MinNoticeDays = minNoticeDays;

        AllowNegativeBalance = allowNegativeBalance;

        CarryForwardEnabled = carryForwardEnabled;

        MaxCarryForwardDays = maxCarryForwardDays;

        IncludeWeekends = includeWeekends;

        IncludeHolidays = includeHolidays;

        SortOrder = sortOrder;

        Color = color;

    }



    public void Active() => IsActive = true;



    public void InActive() => IsActive = false;

}

