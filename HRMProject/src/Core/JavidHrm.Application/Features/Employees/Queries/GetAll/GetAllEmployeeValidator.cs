using FluentValidation;

namespace JavidHrm.Application.Features.Employees.Queries;

public class GetAllEmployeeValidator : AbstractValidator<GetAllEmployeeRequest>
{
    public GetAllEmployeeValidator()
    {
        RuleFor(x => x.Pagination).NotNull();
    }
}
