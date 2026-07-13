using System.ComponentModel.DataAnnotations;
using JavidHrm.Domain.Resources;

namespace JavidHrm.Domain.Enums;

public enum ContentPolicyEffect
{
    [Display(Name = "ContentPolicyEffect_Allow", ResourceType = typeof(EnumResources))]
    Allow = 1,

    [Display(Name = "ContentPolicyEffect_Deny", ResourceType = typeof(EnumResources))]
    Deny = 2
}
