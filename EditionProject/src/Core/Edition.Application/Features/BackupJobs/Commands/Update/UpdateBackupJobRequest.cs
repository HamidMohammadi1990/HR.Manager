using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.BackupJobs.Commands;

public record UpdateBackupJobRequest : IRequest<OperationResult>
{
    [JsonConverter(typeof(BackupJobEncryptor))]
    public int Id { get; init; }

    public BackupType Type { get; init; }
}
