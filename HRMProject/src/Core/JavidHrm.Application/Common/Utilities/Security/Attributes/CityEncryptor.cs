using JavidHrm.Application.Models.Constants;
using JavidHrm.Application.Common.Utilities.JsonAttributes;

namespace JavidHrm.Application.Common.Utilities.Security.Attributes;

public class CityEncryptor() : JsonIntEncryptor(SecurityKeyConstant.City) { }

public class CityNullableEncryptor() : JsonNullableIntEncryptor(SecurityKeyConstant.City) { }