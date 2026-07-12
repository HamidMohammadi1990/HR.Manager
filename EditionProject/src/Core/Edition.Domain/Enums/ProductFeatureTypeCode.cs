using JavidHrm.Domain.Attributes;
using System.ComponentModel.DataAnnotations;
using JavidHrm.Domain.Resources;

namespace JavidHrm.Domain.Enums;

public enum ProductFeatureTypeCode
{
    [Display(Name = "ProductFeatureTypeCode_DisplayOnMenu", ResourceType = typeof(EnumResources))]
    [ProductFeatureTypeValue("true")]
    DisplayOnMenu = 1
}
