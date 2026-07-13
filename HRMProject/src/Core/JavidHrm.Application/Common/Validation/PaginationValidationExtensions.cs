using JavidHrm.Common.Localization;
using JavidHrm.Domain.Dtos.Pagination;
using FluentValidation;

namespace JavidHrm.Application.Common.Validation;

public static class PaginationValidationExtensions
{
    private const int MaxPageSize = 100;

    public static IRuleBuilderOptions<T, PagedRequest> MustBeValidPagination<T>(this IRuleBuilder<T, PagedRequest> ruleBuilder)
        => ruleBuilder
            .NotNull()
            .WithMessage(MessageKeys.InvalidRequest)
            .ChildRules(pagination =>
            {
                pagination.RuleFor(x => x.PageNumber)
                    .GreaterThan(0)
                    .WithMessage(MessageKeys.InvalidRequest);

                pagination.RuleFor(x => x.PageSize)
                    .InclusiveBetween(1, MaxPageSize)
                    .WithMessage(MessageKeys.InvalidRequest);
            });
}
