using JavidHrm.Domain.Enums;

namespace JavidHrm.Api.Attributes;

[AttributeUsage(AttributeTargets.Method, AllowMultiple = false)]
public class ActionInfoAttribute(PermissionType permissionType) : Attribute
{
    public PermissionType PermissionType { get; } = permissionType;
}