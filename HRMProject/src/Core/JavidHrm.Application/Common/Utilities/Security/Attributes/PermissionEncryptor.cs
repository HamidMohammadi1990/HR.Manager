using JavidHrm.Application.Models.Constants;
using JavidHrm.Application.Common.Utilities.JsonAttributes;

namespace JavidHrm.Application.Common.Utilities.Security.Attributes;

public class PermissionEncryptor() : JsonIntEncryptor(SecurityKeyConstant.Permission) { }

public class PermissionNullableEncryptor() : JsonNullableIntEncryptor(SecurityKeyConstant.Permission) { }