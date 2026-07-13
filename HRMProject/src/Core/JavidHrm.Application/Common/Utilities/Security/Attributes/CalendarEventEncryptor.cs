using JavidHrm.Application.Models.Constants;
using JavidHrm.Application.Common.Utilities.JsonAttributes;

namespace JavidHrm.Application.Common.Utilities.Security.Attributes;

public class CalendarEventEncryptor() : JsonIntEncryptor(SecurityKeyConstant.CalendarEvent) { }
public class CalendarEventNullableEncryptor() : JsonNullableIntEncryptor(SecurityKeyConstant.CalendarEvent) { }
