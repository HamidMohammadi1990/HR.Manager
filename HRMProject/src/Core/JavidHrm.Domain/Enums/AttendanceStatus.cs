using System.ComponentModel.DataAnnotations;
using JavidHrm.Domain.Resources;

namespace JavidHrm.Domain.Enums;

public enum AttendanceStatus
{
    [Display(Name = "AttendanceStatus_Present", ResourceType = typeof(EnumResources))]
    Present = 1,

    [Display(Name = "AttendanceStatus_Absent", ResourceType = typeof(EnumResources))]
    Absent = 2,

    [Display(Name = "AttendanceStatus_Late", ResourceType = typeof(EnumResources))]
    Late = 3,

    [Display(Name = "AttendanceStatus_OnLeave", ResourceType = typeof(EnumResources))]
    OnLeave = 4,

    [Display(Name = "AttendanceStatus_EarlyLeave", ResourceType = typeof(EnumResources))]
    EarlyLeave = 5
}
