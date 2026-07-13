using JavidHrm.Application.Models.Constants;
using JavidHrm.Application.Common.Utilities.JsonAttributes;

namespace JavidHrm.Application.Common.Utilities.Security.Attributes;

public class WebSiteSettingEncryptor() : JsonIntEncryptor(SecurityKeyConstant.WebSiteSetting) { }
public class WebSiteSettingNullableEncryptor() : JsonNullableIntEncryptor(SecurityKeyConstant.WebSiteSetting) { }
