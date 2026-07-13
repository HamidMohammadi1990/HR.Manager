using JavidHrm.Application.Models.Constants;
using JavidHrm.Application.Common.Utilities.JsonAttributes;

namespace JavidHrm.Application.Common.Utilities.Security.Attributes;

public class BackupJobEncryptor() : JsonIntEncryptor(SecurityKeyConstant.BackupJob) { }
public class BackupJobNullableEncryptor() : JsonNullableIntEncryptor(SecurityKeyConstant.BackupJob) { }
