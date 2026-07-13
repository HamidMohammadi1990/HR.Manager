using JavidHrm.Domain.Entities;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Features.WebSiteSettings.Queries;

namespace JavidHrm.Application.Mappings;

public class WebSiteSettingMapperService : IWebSiteSettingMapperService
{
    public GetWebSiteSettingResponse Map(WebSiteSetting model)
    {
        return new GetWebSiteSettingResponse
        {
            Id = model.Id,
            Email = model.Email,
            PhoneNumber = model.PhoneNumber,
            Telephone = model.Telephone,
            Address = model.Address,
            CartNumber = model.CartNumber,
            EmailUserName = model.EmailUserName,
            EmailPassword = model.EmailPassword,
            SmsAccountUrl = model.SmsAccountUrl,
            SmsAccountUserName = model.SmsAccountUserName,
            SmsAccountPassword = model.SmsAccountPassword
        };
    }
}
