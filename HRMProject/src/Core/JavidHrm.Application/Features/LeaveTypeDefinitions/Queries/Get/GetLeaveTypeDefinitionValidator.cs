using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.LeaveTypeDefinitions.Queries;

public class GetLeaveTypeDefinitionValidator : AbstractValidator<GetLeaveTypeDefinitionRequest>
{
    public GetLeaveTypeDefinitionValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
