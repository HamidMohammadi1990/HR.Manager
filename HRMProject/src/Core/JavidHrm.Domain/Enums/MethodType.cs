using System.ComponentModel.DataAnnotations;
using JavidHrm.Domain.Resources;

namespace JavidHrm.Domain.Enums;

public enum MethodType
{
    [Display(Name = "MethodType_Synchronous", ResourceType = typeof(EnumResources))]
    Synchronous,

    [Display(Name = "MethodType_AsyncAction", ResourceType = typeof(EnumResources))]
    AsyncAction,

    [Display(Name = "MethodType_AsyncFunction", ResourceType = typeof(EnumResources))]
    AsyncFunction
}
