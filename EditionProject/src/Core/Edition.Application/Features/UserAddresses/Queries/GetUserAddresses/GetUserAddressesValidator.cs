using FluentValidation;
using JavidHrm.Common.Localization;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.UserAddresses.Queries;

public class GetUserAddressesValidator : AbstractValidator<GetUserAddressesRequest>
{
    public GetUserAddressesValidator()
    {
        RuleFor(x => x.Pagination)
            .MustBeValidPagination();
    }
}
