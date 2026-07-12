using System.ComponentModel.DataAnnotations;
using JavidHrm.Domain.Resources;

namespace JavidHrm.Domain.Enums;

public enum WalletStatusType
{
    [Display(Name = "WalletStatusType_None", ResourceType = typeof(EnumResources))]
    None,

    [Display(Name = "WalletStatusType_Active", ResourceType = typeof(EnumResources))]
    Active,

    [Display(Name = "WalletStatusType_Suspend", ResourceType = typeof(EnumResources))]
    Suspend,

    [Display(Name = "WalletStatusType_Banned", ResourceType = typeof(EnumResources))]
    Banned
}
