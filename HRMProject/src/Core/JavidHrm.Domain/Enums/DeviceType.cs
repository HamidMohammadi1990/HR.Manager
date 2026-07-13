using System.ComponentModel.DataAnnotations;
using JavidHrm.Domain.Resources;

namespace JavidHrm.Domain.Enums;

public enum DeviceType
{
    [Display(Name = "DeviceType_Unknown", ResourceType = typeof(EnumResources))]
    Unknown = 0,

    [Display(Name = "DeviceType_Desktop", ResourceType = typeof(EnumResources))]
    Desktop = 1,

    [Display(Name = "DeviceType_Mobile", ResourceType = typeof(EnumResources))]
    Mobile = 2,

    [Display(Name = "DeviceType_Tablet", ResourceType = typeof(EnumResources))]
    Tablet = 3
}
