using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.BackupJobs.Queries;

public record DownloadBackupJobRequest : IRequest<OperationResult<DownloadBackupJobResponse>>
{
    [JsonConverter(typeof(BackupJobEncryptor))]
    public int Id { get; init; }
}
