namespace JavidHrm.Common.Models;

public record ForwardedHeadersSettings
{
    public string[] KnownProxies { get; init; } = [];
}
