using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Infrastructure.Persistence;

public sealed class SaveChangesExceptionReporting(bool includeTechnicalDetails) : ISaveChangesExceptionReporting
{
    public bool IncludeTechnicalDetails { get; } = includeTechnicalDetails;
}
