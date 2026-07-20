using System.ComponentModel.DataAnnotations;
using JavidHrm.Domain.Resources;

namespace JavidHrm.Domain.Enums;

public enum LeaveType
{
    [Display(Name = "LeaveType_Annual", ResourceType = typeof(EnumResources))]
    Annual = 1,

    [Display(Name = "LeaveType_Sick", ResourceType = typeof(EnumResources))]
    Sick = 2,

    [Display(Name = "LeaveType_Unpaid", ResourceType = typeof(EnumResources))]
    Unpaid = 3,

    [Display(Name = "LeaveType_Other", ResourceType = typeof(EnumResources))]
    Other = 4,

    [Display(Name = "LeaveType_Hourly", ResourceType = typeof(EnumResources))]
    Hourly = 5
}
