using System.ComponentModel.DataAnnotations;
using JavidHrm.Domain.Resources;

namespace JavidHrm.Domain.Enums;

public enum GenderType : byte
{
    [Display(Name = "GenderType_Female", ResourceType = typeof(EnumResources))]
    Female = 1,

    [Display(Name = "GenderType_Male", ResourceType = typeof(EnumResources))]
    Male = 2
}
