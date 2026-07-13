using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.BackupJobs.Queries;

public record GetBackupJobRequest : IRequest<OperationResult<GetBackupJobResponse?>>
{
    [JsonConverter(typeof(BackupJobEncryptor))]
    public int Id { get; init; }
}
