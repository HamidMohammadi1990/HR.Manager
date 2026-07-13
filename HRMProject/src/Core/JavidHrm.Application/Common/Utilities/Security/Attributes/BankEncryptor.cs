using JavidHrm.Application.Models.Constants;
using JavidHrm.Application.Common.Utilities.JsonAttributes;

namespace JavidHrm.Application.Common.Utilities.Security.Attributes;

public class BankEncryptor() : JsonIntEncryptor(SecurityKeyConstant.Bank) { }
public class BankNullableEncryptor() : JsonNullableIntEncryptor(SecurityKeyConstant.Bank) { }