using JavidHrm.Application.Models.Constants;
using JavidHrm.Application.Common.Utilities.JsonAttributes;

namespace JavidHrm.Application.Common.Utilities.Security.Attributes;

public class EmployeeEncryptor() : JsonIntEncryptor(SecurityKeyConstant.Employee) { }
public class EmployeeNullableEncryptor() : JsonNullableIntEncryptor(SecurityKeyConstant.Employee) { }
