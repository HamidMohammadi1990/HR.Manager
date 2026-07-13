using System.ComponentModel.DataAnnotations;
using JavidHrm.Domain.Resources;

namespace JavidHrm.Domain.Enums;

public enum WalletTransactionType
{
    [Display(Name = "WalletTransactionType_Incremental", ResourceType = typeof(EnumResources))]
    Incremental,

    [Display(Name = "WalletTransactionType_Decremental", ResourceType = typeof(EnumResources))]
    Decremental
}
