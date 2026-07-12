using JavidHrm.Domain.Enums;

namespace JavidHrm.Api.Modules;

public sealed record AdminControllerPermissionMetadata(PermissionType PageType, PermissionType GroupType);