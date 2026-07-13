namespace JavidHrm.Application.Features.BackupJobs.Queries;

public record DownloadBackupJobResponse
{
    public byte[] FileBytes { get; init; } = default!;
    public string FileName { get; init; } = default!;
    public string ContentType { get; init; } = "application/json";
}
