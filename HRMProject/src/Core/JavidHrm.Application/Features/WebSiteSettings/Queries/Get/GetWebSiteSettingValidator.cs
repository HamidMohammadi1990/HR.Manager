using FluentValidation;

namespace JavidHrm.Application.Features.WebSiteSettings.Queries;

public class GetWebSiteSettingValidator : AbstractValidator<GetWebSiteSettingRequest>
{
    public GetWebSiteSettingValidator()
    {
    }
}
