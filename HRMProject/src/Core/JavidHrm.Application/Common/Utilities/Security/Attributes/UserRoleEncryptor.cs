using JavidHrm.Application.Models.Constants;
using JavidHrm.Application.Common.Utilities.JsonAttributes;

namespace JavidHrm.Application.Common.Utilities.Security.Attributes;

public class UserRoleEncryptor() : JsonIntEncryptor(SecurityKeyConstant.UserRole) { }

public class UserRoleNullableEncryptor() : JsonNullableIntEncryptor(SecurityKeyConstant.UserRole) { }
