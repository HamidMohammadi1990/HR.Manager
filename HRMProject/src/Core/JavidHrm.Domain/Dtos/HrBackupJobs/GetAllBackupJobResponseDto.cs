using JavidHrm.Domain.Enums;

namespace JavidHrm.Domain.Dtos.HrBackupJobs;

public record GetAllBackupJobResponseDto
{
    public int Id { get; init; }
    public string FileName { get; init; } = default!;
    public long FileSizeBytes { get; init; }
    public BackupStatus Status { get; init; }
    public BackupType Type { get; init; }
    public string StoragePath { get; init; } = default!;
    public string? ErrorMessage { get; init; }
    public int CreatedByUserId { get; init; }
    public string? CreatorFirstName { get; init; }
    public string? CreatorLastName { get; init; }
    public string? CreatorUserName { get; init; }
    public DateTime? CompletedAtUtc { get; init; }
    public DateTime CreatedOnUtc { get; init; }
}
