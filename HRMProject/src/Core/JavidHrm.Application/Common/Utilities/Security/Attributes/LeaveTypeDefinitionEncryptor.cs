using JavidHrm.Application.Models.Constants;
using JavidHrm.Application.Common.Utilities.JsonAttributes;

namespace JavidHrm.Application.Common.Utilities.Security.Attributes;

public class LeaveTypeDefinitionEncryptor() : JsonIntEncryptor(SecurityKeyConstant.LeaveTypeDefinition) { }
public class LeaveTypeDefinitionNullableEncryptor() : JsonNullableIntEncryptor(SecurityKeyConstant.LeaveTypeDefinition) { }
