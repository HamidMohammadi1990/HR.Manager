namespace JavidHrm.Application.Features.Users.Commands;

public record UploadProfileImageResponse
{
    public string ProfileImageUrl { get; init; } = default!;
}
