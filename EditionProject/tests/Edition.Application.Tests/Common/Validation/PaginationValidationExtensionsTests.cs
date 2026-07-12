using JavidHrm.Application.Common.Validation;
using JavidHrm.Application.Tests.Helpers;
using JavidHrm.Domain.Dtos.Pagination;
using FluentValidation;

namespace JavidHrm.Application.Tests.Common.Validation;

public class PaginationValidationExtensionsTests
{
    private sealed record TestPagedRequest : PagedRequest;

    private sealed class PaginationModel
    {
        public PagedRequest Pagination { get; init; } = new TestPagedRequest();
    }

    private sealed class PaginationValidator : AbstractValidator<PaginationModel>
    {
        public PaginationValidator() => RuleFor(x => x.Pagination).MustBeValidPagination();
    }

    [Fact]
    public void MustBeValidPagination_AcceptsValidRequest()
    {
        var validator = new PaginationValidator();
        validator.ShouldBeValid(new PaginationModel
        {
            Pagination = new TestPagedRequest { PageNumber = 1, PageSize = 20 }
        });
    }

    [Theory]
    [InlineData(0, 10)]
    [InlineData(-1, 10)]
    public void MustBeValidPagination_RejectsInvalidPageNumber(int pageNumber, int pageSize)
    {
        var validator = new PaginationValidator();
        var result = validator.Validate(new PaginationModel
        {
            Pagination = new TestPagedRequest { PageNumber = pageNumber, PageSize = pageSize }
        });

        result.IsValid.Should().BeFalse();
    }

    [Theory]
    [InlineData(1, 0)]
    [InlineData(1, 101)]
    public void MustBeValidPagination_RejectsInvalidPageSize(int pageNumber, int pageSize)
    {
        var validator = new PaginationValidator();
        var result = validator.Validate(new PaginationModel
        {
            Pagination = new TestPagedRequest { PageNumber = pageNumber, PageSize = pageSize }
        });

        result.IsValid.Should().BeFalse();
    }
}
