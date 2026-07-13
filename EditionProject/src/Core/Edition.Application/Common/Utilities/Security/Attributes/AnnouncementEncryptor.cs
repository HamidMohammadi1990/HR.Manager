using JavidHrm.Application.Models.Constants;
using JavidHrm.Application.Common.Utilities.JsonAttributes;

namespace JavidHrm.Application.Common.Utilities.Security.Attributes;

public class AnnouncementEncryptor() : JsonIntEncryptor(SecurityKeyConstant.Announcement) { }
public class AnnouncementNullableEncryptor() : JsonNullableIntEncryptor(SecurityKeyConstant.Announcement) { }
