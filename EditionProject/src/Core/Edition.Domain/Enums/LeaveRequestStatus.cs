using System.ComponentModel.DataAnnotations;
using JavidHrm.Domain.Resources;

namespace JavidHrm.Domain.Enums;

public enum LeaveRequestStatus
{
    [Display(Name = "LeaveRequestStatus_Pending", ResourceType = typeof(EnumResources))]
    Pending = 1,

    [Display(Name = "LeaveRequestStatus_Approved", ResourceType = typeof(EnumResources))]
    Approved = 2,

    [Display(Name = "LeaveRequestStatus_Rejected", ResourceType = typeof(EnumResources))]
    Rejected = 3
}
