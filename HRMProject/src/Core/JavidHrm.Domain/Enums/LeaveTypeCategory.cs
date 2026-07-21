using System.ComponentModel.DataAnnotations;
using JavidHrm.Domain.Resources;

namespace JavidHrm.Domain.Enums;

public enum LeaveTypeCategory
{
    [Display(Name = "LeaveTypeCategory_Leave", ResourceType = typeof(EnumResources))]
    Leave = 1,

    [Display(Name = "LeaveTypeCategory_Mission", ResourceType = typeof(EnumResources))]
    Mission = 2
}
