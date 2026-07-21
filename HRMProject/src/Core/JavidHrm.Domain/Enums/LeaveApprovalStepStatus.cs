using System.ComponentModel.DataAnnotations;
using JavidHrm.Domain.Resources;

namespace JavidHrm.Domain.Enums;

public enum LeaveApprovalStepStatus
{
    [Display(Name = "LeaveApprovalStepStatus_Pending", ResourceType = typeof(EnumResources))]
    Pending = 1,

    [Display(Name = "LeaveApprovalStepStatus_Approved", ResourceType = typeof(EnumResources))]
    Approved = 2,

    [Display(Name = "LeaveApprovalStepStatus_Rejected", ResourceType = typeof(EnumResources))]
    Rejected = 3,

    [Display(Name = "LeaveApprovalStepStatus_Skipped", ResourceType = typeof(EnumResources))]
    Skipped = 4
}
