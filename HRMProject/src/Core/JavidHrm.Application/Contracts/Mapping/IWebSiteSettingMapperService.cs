using JavidHrm.Domain.Entities;
using JavidHrm.Application.Features.WebSiteSettings.Queries;

namespace JavidHrm.Application.Contracts.Mapping;

public interface IWebSiteSettingMapperService : IMapper
{
    GetWebSiteSettingResponse Map(WebSiteSetting model);
}
