using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.LeaveTypeDefinitions.Queries;

public class SearchLeaveTypeDefinitionValidator : AbstractValidator<SearchLeaveTypeDefinitionRequest>
{
    public SearchLeaveTypeDefinitionValidator()
    {
        RuleFor(x => x.Pagination).MustBeValidPagination();
        RuleFor(x => x.Name).MaximumLengthWhenNotEmpty(EntityFieldLengths.LeaveTypeDefinition.Name);
        RuleFor(x => x.Code).MaximumLengthWhenNotEmpty(EntityFieldLengths.LeaveTypeDefinition.Code);
    }
}
