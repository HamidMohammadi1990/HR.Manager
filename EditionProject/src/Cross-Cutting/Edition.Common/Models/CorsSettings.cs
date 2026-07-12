namespace JavidHrm.Common.Models;

public record CorsSettings
{
    public string[] AllowedOrigins { get; init; } = [];
}
