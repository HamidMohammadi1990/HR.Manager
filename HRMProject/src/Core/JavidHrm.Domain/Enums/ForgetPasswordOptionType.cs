using System.ComponentModel.DataAnnotations;
using JavidHrm.Domain.Resources;

namespace JavidHrm.Domain.Enums;

public enum ForgetPasswordOptionType
{
    [Display(Name = "ForgetPasswordOptionType_Message", ResourceType = typeof(EnumResources))]
    Message = 1,

    [Display(Name = "ForgetPasswordOptionType_Email", ResourceType = typeof(EnumResources))]
    Email = 2
}
