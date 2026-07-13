using System.Net;
using JavidHrm.Common.Enums;

namespace JavidHrm.Common.Exceptions;

public sealed class AppContentPolicyAccessDeniedException()
    : AppException(OperationStatusCode.NotFound, "AccessDenied", HttpStatusCode.NotFound);