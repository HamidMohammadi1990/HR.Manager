using System.ComponentModel.DataAnnotations;
using JavidHrm.Domain.Resources;

namespace JavidHrm.Domain.Enums;

public enum PosTransactionStatusType
{
    [Display(Name = "PosTransactionStatusType_Success", ResourceType = typeof(EnumResources))]
    Success = 1,

    [Display(Name = "PosTransactionStatusType_Failed", ResourceType = typeof(EnumResources))]
    Failed = 2,

    [Display(Name = "PosTransactionStatusType_Cancelled", ResourceType = typeof(EnumResources))]
    Cancelled = 3
}
