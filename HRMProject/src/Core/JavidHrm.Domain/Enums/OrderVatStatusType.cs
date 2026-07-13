using System.ComponentModel.DataAnnotations;
using JavidHrm.Domain.Resources;

namespace JavidHrm.Domain.Enums;

public enum OrderVatStatusType
{
    [Display(Name = "OrderVatStatusType_Pending", ResourceType = typeof(EnumResources))]
    Pending = 1,

    [Display(Name = "OrderVatStatusType_Paid", ResourceType = typeof(EnumResources))]
    Paid = 2,

    [Display(Name = "OrderVatStatusType_Refunded", ResourceType = typeof(EnumResources))]
    Refunded = 3
}
