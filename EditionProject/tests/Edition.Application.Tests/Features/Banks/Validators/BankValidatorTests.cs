using JavidHrm.Application.Features.Banks.Queries;
using JavidHrm.Application.Tests.Helpers;
using JavidHrm.Domain.Dtos.Pagination;

namespace JavidHrm.Application.Tests.Features.Banks.Validators;

public class GetBankValidatorTests
{
    private readonly GetBankValidator validator = new();

    [Fact]
    public void Validate_AcceptsPositiveId()
    {
        validator.ShouldBeValid(new GetBankRequest { Id = 10 });
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public void Validate_RejectsInvalidId(int id)
    {
        validator.ShouldHaveValidationErrorFor(new GetBankRequest { Id = id }, nameof(GetBankRequest.Id));
    }
}

public class GetAllBankValidatorTests
{
    private readonly GetAllBankValidator validator = new();

    [Fact]
    public void Validate_AcceptsValidRequest()
    {
        validator.ShouldBeValid(new GetAllBankRequest
        {
            Title = "bank",
            Pagination = new TestPagedRequest { PageNumber = 1, PageSize = 20 }
        });
    }

    [Fact]
    public void Validate_RejectsTooLongTitle()
    {
        validator.ShouldHaveValidationErrorFor(
            new GetAllBankRequest
            {
                Title = new string('a', 31),
                Pagination = new TestPagedRequest { PageNumber = 1, PageSize = 20 }
            },
            nameof(GetAllBankRequest.Title));
    }

    private sealed record TestPagedRequest : PagedRequest;
}
