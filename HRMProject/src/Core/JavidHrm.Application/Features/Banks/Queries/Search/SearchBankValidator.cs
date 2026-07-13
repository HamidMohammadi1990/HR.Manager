using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.Banks.Queries;

public class SearchBankValidator : AbstractValidator<SearchBankRequest>
{
    public SearchBankValidator()
    {
        RuleFor(x => x.Pagination).MustBeValidPagination();
        RuleFor(x => x.Title).MaximumLengthWhenNotEmpty(EntityFieldLengths.Bank.Name);
    }
}
