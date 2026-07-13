using System.ComponentModel.DataAnnotations;
using JavidHrm.Common.Resources;

namespace JavidHrm.Common.Enums;

public enum ApiControllerCategory
{
    [Display(Name = "ApiControllerCategory_Authentication", ResourceType = typeof(ControllerCategoryResources))]
    Authentication = 1,

    [Display(Name = "ApiControllerCategory_General", ResourceType = typeof(ControllerCategoryResources))]
    General = 2,

    [Display(Name = "ApiControllerCategory_Users", ResourceType = typeof(ControllerCategoryResources))]
    Users = 10,

    [Display(Name = "ApiControllerCategory_Department", ResourceType = typeof(ControllerCategoryResources))]
    Department = 20,

    [Display(Name = "ApiControllerCategory_Employee", ResourceType = typeof(ControllerCategoryResources))]
    Employee = 25,

    [Display(Name = "ApiControllerCategory_HrOperations", ResourceType = typeof(ControllerCategoryResources))]
    HrOperations = 30,

    [Display(Name = "ApiControllerCategory_Location", ResourceType = typeof(ControllerCategoryResources))]
    Location = 100,

    [Display(Name = "ApiControllerCategory_ContentPolicy", ResourceType = typeof(ControllerCategoryResources))]
    ContentPolicy = 120,

    [Display(Name = "ApiControllerCategory_AccessControl", ResourceType = typeof(ControllerCategoryResources))]
    AccessControl = 130,

    [Display(Name = "ApiControllerCategory_Financial", ResourceType = typeof(ControllerCategoryResources))]
    Financial = 80,
}
