using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.LeaveTypeDefinitions.Queries;

public class GetAllLeaveTypeDefinitionValidator : AbstractValidator<GetAllLeaveTypeDefinitionRequest>
{
    public GetAllLeaveTypeDefinitionValidator()
    {
        RuleFor(x => x.Pagination).MustBeValidPagination();
        RuleFor(x => x.Name).MaximumLengthWhenNotEmpty(EntityFieldLengths.LeaveTypeDefinition.Name);
        RuleFor(x => x.Code).MaximumLengthWhenNotEmpty(EntityFieldLengths.LeaveTypeDefinition.Code);
    }
}
