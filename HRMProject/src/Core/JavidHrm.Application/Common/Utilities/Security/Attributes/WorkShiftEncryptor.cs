using JavidHrm.Application.Models.Constants;
using JavidHrm.Application.Common.Utilities.JsonAttributes;

namespace JavidHrm.Application.Common.Utilities.Security.Attributes;

public class WorkShiftEncryptor() : JsonIntEncryptor(SecurityKeyConstant.WorkShift) { }
public class WorkShiftNullableEncryptor() : JsonNullableIntEncryptor(SecurityKeyConstant.WorkShift) { }
