using JavidHrm.Domain.Common;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Domain.Entities;

public class BackupJob : BaseEntity
{
    public string FileName { get; private set; } = default!;
    public long FileSizeBytes { get; private set; }
    public BackupStatus Status { get; private set; }
    public BackupType Type { get; private set; }
    public string StoragePath { get; private set; } = default!;
    public string? ErrorMessage { get; private set; }
    public int CreatedByUserId { get; private set; }
    public DateTime? CompletedAtUtc { get; private set; }
    public DateTime CreatedOnUtc { get; private set; } = DateTime.UtcNow;

    public User CreatedByUser { get; private set; } = default!;

    public static BackupJob Create(
        string fileName,
        BackupType type,
        string storagePath,
        int createdByUserId)
        => new()
        {
            FileName = fileName,
            Type = type,
            StoragePath = storagePath,
            Status = BackupStatus.Pending,
            CreatedByUserId = createdByUserId
        };

    public void MarkInProgress() => Status = BackupStatus.InProgress;

    public void MarkCompleted(long fileSizeBytes)
    {
        Status = BackupStatus.Completed;
        FileSizeBytes = fileSizeBytes;
        CompletedAtUtc = DateTime.UtcNow;
        ErrorMessage = null;
    }

    public void MarkFailed(string errorMessage)
    {
        Status = BackupStatus.Failed;
        ErrorMessage = errorMessage;
        CompletedAtUtc = DateTime.UtcNow;
    }

    public void Update(BackupType type) => Type = type;
}
