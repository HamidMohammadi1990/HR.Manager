using JavidHrm.Application.Models.Constants;
using JavidHrm.Application.Common.Utilities.JsonAttributes;

namespace JavidHrm.Application.Common.Utilities.Security.Attributes;

public class DepartmentEncryptor() : JsonIntEncryptor(SecurityKeyConstant.Department) { }
public class DepartmentNullableEncryptor() : JsonNullableIntEncryptor(SecurityKeyConstant.Department) { }
