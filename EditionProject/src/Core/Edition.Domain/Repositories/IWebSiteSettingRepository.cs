using JavidHrm.Domain.Entities;

namespace JavidHrm.Domain.Repositories;

public interface IWebSiteSettingRepository
{
    ValueTask<WebSiteSetting?> GetAsync();
    Task<WebSiteSetting?> GetAsNoTrackingAsync(CancellationToken cancellationToken = default);
}