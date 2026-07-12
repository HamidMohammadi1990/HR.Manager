using FluentValidation;
using FluentValidation.Results;

namespace JavidHrm.Application.Tests.Helpers;

public static class ValidatorTestHelper
{
    public static ValidationResult Validate<T>(this AbstractValidator<T> validator, T instance)
        => validator.Validate(instance);

    public static void ShouldBeValid<T>(this AbstractValidator<T> validator, T instance)
    {
        var result = validator.Validate(instance);
        result.IsValid.Should().BeTrue(result.ToString());
    }

    public static void ShouldHaveValidationErrorFor<T>(
        this AbstractValidator<T> validator,
        T instance,
        string propertyName)
    {
        var result = validator.Validate(instance);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(error => error.PropertyName == propertyName);
    }
}
