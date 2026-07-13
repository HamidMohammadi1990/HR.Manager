using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.BackupJobs.Commands;

public record DeleteBackupJobRequest : IRequest<OperationResult>
{
    [JsonConverter(typeof(BackupJobEncryptor))]
    public int Id { get; init; }
}
