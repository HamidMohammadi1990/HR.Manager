using JavidHrm.Application.Models.Constants;
using JavidHrm.Application.Common.Utilities.JsonAttributes;

namespace JavidHrm.Application.Common.Utilities.Security.Attributes;

public class PayrollEntryEncryptor() : JsonIntEncryptor(SecurityKeyConstant.PayrollEntry) { }
public class PayrollEntryNullableEncryptor() : JsonNullableIntEncryptor(SecurityKeyConstant.PayrollEntry) { }
