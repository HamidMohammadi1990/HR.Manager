using System.ComponentModel.DataAnnotations;
using JavidHrm.Domain.Resources;

namespace JavidHrm.Domain.Enums;

public enum ContentPolicyValueType
{
    [Display(Name = "ContentPolicyValueType_Literal", ResourceType = typeof(EnumResources))]
    Literal = 1,

    [Display(Name = "ContentPolicyValueType_Context", ResourceType = typeof(EnumResources))]
    Context = 2
}
