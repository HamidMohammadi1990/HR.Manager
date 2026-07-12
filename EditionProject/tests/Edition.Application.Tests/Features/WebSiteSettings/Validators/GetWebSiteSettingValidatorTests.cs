using JavidHrm.Application.Features.WebSiteSettings.Queries;
using JavidHrm.Application.Tests.Helpers;

namespace JavidHrm.Application.Tests.Features.WebSiteSettings.Validators;

public class GetWebSiteSettingValidatorTests
{
    private readonly GetWebSiteSettingValidator validator = new();

    [Fact]
    public void Validate_AcceptsEmptyRequest()
    {
        validator.ShouldBeValid(new GetWebSiteSettingRequest());
    }
}
