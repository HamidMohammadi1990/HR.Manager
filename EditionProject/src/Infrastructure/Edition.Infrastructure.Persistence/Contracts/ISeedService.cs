using JavidHrm.Domain.Dtos.Others;

namespace JavidHrm.Infrastructure.Persistence.Contracts;

public interface ISeedService
{
    Task SeedDataAsync(List<DynamicPermission> permissions);
}