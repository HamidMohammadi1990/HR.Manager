using JavidHrm.Application.Models.Constants;
using JavidHrm.Application.Common.Utilities.JsonAttributes;

namespace JavidHrm.Application.Common.Utilities.Security.Attributes;

public class NotificationEncryptor() : JsonIntEncryptor(SecurityKeyConstant.Notification) { }
public class NotificationNullableEncryptor() : JsonNullableIntEncryptor(SecurityKeyConstant.Notification) { }
