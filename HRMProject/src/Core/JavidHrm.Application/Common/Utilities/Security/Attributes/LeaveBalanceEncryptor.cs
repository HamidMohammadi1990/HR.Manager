using JavidHrm.Application.Models.Constants;
using JavidHrm.Application.Common.Utilities.JsonAttributes;

namespace JavidHrm.Application.Common.Utilities.Security.Attributes;

public class LeaveBalanceEncryptor() : JsonIntEncryptor(SecurityKeyConstant.LeaveBalance) { }
public class LeaveBalanceNullableEncryptor() : JsonNullableIntEncryptor(SecurityKeyConstant.LeaveBalance) { }
