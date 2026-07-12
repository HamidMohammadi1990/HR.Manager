using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace JavidHrm.Infrastructure.Persistence.Repositories;

public class WebSiteSettingRepository
    (JavidHrmDbContext context)
    : Repository<WebSiteSetting>(context), IWebSiteSettingRepository
{
    public async ValueTask<WebSiteSetting?> GetAsync()
    {
        return await Context.WebSiteSetting.FirstOrDefaultAsync();
    }

    public async Task<WebSiteSetting?> GetAsNoTrackingAsync(CancellationToken cancellationToken = default)
    {
        return await Context.WebSiteSetting.AsNoTracking().FirstOrDefaultAsync(cancellationToken);
    }
}