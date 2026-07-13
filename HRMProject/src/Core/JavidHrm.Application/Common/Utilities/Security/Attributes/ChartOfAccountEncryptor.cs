using JavidHrm.Application.Models.Constants;
using JavidHrm.Application.Common.Utilities.JsonAttributes;

namespace JavidHrm.Application.Common.Utilities.Security.Attributes;

public class ChartOfAccountEncryptor() : JsonIntEncryptor(SecurityKeyConstant.ChartOfAccount) { }

public class ChartOfAccountNullableEncryptor() : JsonNullableIntEncryptor(SecurityKeyConstant.ChartOfAccount) { }