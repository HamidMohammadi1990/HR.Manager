using JavidHrm.Application.Common.Validation;
using JavidHrm.Application.Tests.Helpers;
using FluentValidation;

namespace JavidHrm.Application.Tests.Common.Validation;

public class FilterValidationExtensionsTests
{
    private sealed class FilterModel
    {
        public string? Title { get; init; }
    }

    private sealed class FilterValidator : AbstractValidator<FilterModel>
    {
        public FilterValidator() => RuleFor(x => x.Title).MaximumLengthWhenNotEmpty(5);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("abc")]
    public void MaximumLengthWhenNotEmpty_AcceptsNullEmptyOrWithinLimit(string? title)
    {
        new FilterValidator().ShouldBeValid(new FilterModel { Title = title });
    }

    [Fact]
    public void MaximumLengthWhenNotEmpty_RejectsTooLongValue()
    {
        new FilterValidator().ShouldHaveValidationErrorFor(new FilterModel { Title = "123456" }, nameof(FilterModel.Title));
    }
}
