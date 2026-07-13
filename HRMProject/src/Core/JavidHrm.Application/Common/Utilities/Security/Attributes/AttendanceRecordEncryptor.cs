using JavidHrm.Application.Models.Constants;
using JavidHrm.Application.Common.Utilities.JsonAttributes;

namespace JavidHrm.Application.Common.Utilities.Security.Attributes;

public class AttendanceRecordEncryptor() : JsonIntEncryptor(SecurityKeyConstant.AttendanceRecord) { }
public class AttendanceRecordNullableEncryptor() : JsonNullableIntEncryptor(SecurityKeyConstant.AttendanceRecord) { }
