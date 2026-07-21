using System.ComponentModel.DataAnnotations;
using JavidHrm.Domain.Resources;

namespace JavidHrm.Domain.Enums;

public enum LeaveTypeUnit
{
    [Display(Name = "LeaveTypeUnit_Day", ResourceType = typeof(EnumResources))]
    Day = 1,

    [Display(Name = "LeaveTypeUnit_Hour", ResourceType = typeof(EnumResources))]
    Hour = 2
}
