using JavidHrm.Application.Models.Constants;
using JavidHrm.Application.Common.Utilities.JsonAttributes;

namespace JavidHrm.Application.Common.Utilities.Security.Attributes;

public class LeaveRequestEncryptor() : JsonIntEncryptor(SecurityKeyConstant.LeaveRequest) { }
public class LeaveRequestNullableEncryptor() : JsonNullableIntEncryptor(SecurityKeyConstant.LeaveRequest) { }
