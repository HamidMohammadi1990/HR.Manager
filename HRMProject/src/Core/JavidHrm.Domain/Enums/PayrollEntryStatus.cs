using System.ComponentModel.DataAnnotations;
using JavidHrm.Domain.Resources;

namespace JavidHrm.Domain.Enums;

public enum PayrollEntryStatus
{
    [Display(Name = "PayrollEntryStatus_Draft", ResourceType = typeof(EnumResources))]
    Draft = 1,

    [Display(Name = "PayrollEntryStatus_Approved", ResourceType = typeof(EnumResources))]
    Approved = 2,

    [Display(Name = "PayrollEntryStatus_Paid", ResourceType = typeof(EnumResources))]
    Paid = 3
}
