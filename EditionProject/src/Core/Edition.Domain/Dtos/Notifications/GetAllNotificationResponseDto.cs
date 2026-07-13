using JavidHrm.Domain.Enums;

namespace JavidHrm.Domain.Dtos.Notifications;

public record GetAllNotificationResponseDto
{
    public int Id { get; init; }
    public int UserId { get; init; }
    public string? UserFirstName { get; init; }
    public string? UserLastName { get; init; }
    public string? UserName { get; init; }
    public string Title { get; init; } = default!;
    public string Message { get; init; } = default!;
    public NotificationType Type { get; init; }
    public bool IsRead { get; init; }
    public DateTime? ReadAtUtc { get; init; }
    public string? LinkPath { get; init; }
    public string? IconName { get; init; }
    public DateTime CreatedOnUtc { get; init; }
}
