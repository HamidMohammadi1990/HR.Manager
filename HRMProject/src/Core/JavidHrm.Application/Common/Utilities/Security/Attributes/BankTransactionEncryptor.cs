using JavidHrm.Application.Models.Constants;
using JavidHrm.Application.Common.Utilities.JsonAttributes;

namespace JavidHrm.Application.Common.Utilities.Security.Attributes;

public class BankTransactionEncryptor() : JsonIntEncryptor(SecurityKeyConstant.BankTransaction) { }

public class BankTransactionNullableEncryptor() : JsonNullableIntEncryptor(SecurityKeyConstant.BankTransaction) { }
