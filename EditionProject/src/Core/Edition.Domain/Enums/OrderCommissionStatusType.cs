using System.ComponentModel.DataAnnotations;
using JavidHrm.Domain.Resources;

namespace JavidHrm.Domain.Enums;

public enum OrderCommissionStatusType
{
    [Display(Name = "OrderCommissionStatusType_Pending", ResourceType = typeof(EnumResources))]
    Pending = 1,

    [Display(Name = "OrderCommissionStatusType_Paid", ResourceType = typeof(EnumResources))]
    Paid = 2,

    [Display(Name = "OrderCommissionStatusType_Refunded", ResourceType = typeof(EnumResources))]
    Refunded = 3
}
