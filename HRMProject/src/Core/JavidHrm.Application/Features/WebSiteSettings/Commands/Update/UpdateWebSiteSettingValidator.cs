using FluentValidation;
using JavidHrm.Common.Localization;

namespace JavidHrm.Application.Features.WebSiteSettings.Commands;

public class UpdateWebSiteSettingValidator : AbstractValidator<UpdateWebSiteSettingRequest>
{
    public UpdateWebSiteSettingValidator()
    {
        RuleFor(x => x.Email)
            .EmailAddress()
            .When(x => !string.IsNullOrWhiteSpace(x.Email))
            .WithMessage(MessageKeys.EmailIsNotValid);
    }
}
