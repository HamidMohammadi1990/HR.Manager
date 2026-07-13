using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.BackupJobs.Queries;

public record GetAllBackupJobResponse
{
    [JsonConverter(typeof(BackupJobEncryptor))]
    public int Id { get; init; }

    public string FileName { get; init; } = default!;
    public long FileSizeBytes { get; init; }
    public BackupStatus Status { get; init; }
    public BackupType Type { get; init; }
    public string StoragePath { get; init; } = default!;
    public string? ErrorMessage { get; init; }

    [JsonConverter(typeof(UserEncryptor))]
    public int CreatedByUserId { get; init; }

    public string? CreatorFirstName { get; init; }
    public string? CreatorLastName { get; init; }
    public string? CreatorUserName { get; init; }
    public DateTime? CompletedAtUtc { get; init; }
    public DateTime CreatedOnUtc { get; init; }
}
