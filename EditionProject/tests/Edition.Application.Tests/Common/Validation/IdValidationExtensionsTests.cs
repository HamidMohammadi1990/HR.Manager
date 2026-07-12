using JavidHrm.Application.Common.Validation;
using JavidHrm.Application.Tests.Helpers;
using FluentValidation;

namespace JavidHrm.Application.Tests.Common.Validation;

public class IdValidationExtensionsTests
{
    private sealed class IntIdModel
    {
        public int Id { get; init; }
    }

    private sealed class IntIdValidator : AbstractValidator<IntIdModel>
    {
        public IntIdValidator() => RuleFor(x => x.Id).MustBeValidEntityId();
    }

    private sealed class OptionalIntIdModel
    {
        public int? Id { get; init; }
    }

    private sealed class OptionalIntIdValidator : AbstractValidator<OptionalIntIdModel>
    {
        public OptionalIntIdValidator() => RuleFor(x => x.Id).MustBeValidOptionalEntityId();
    }

    private sealed class LongIdModel
    {
        public long Id { get; init; }
    }

    private sealed class LongIdValidator : AbstractValidator<LongIdModel>
    {
        public LongIdValidator() => RuleFor(x => x.Id).MustBeValidEntityId();
    }

    [Theory]
    [InlineData(1)]
    [InlineData(42)]
    public void MustBeValidEntityId_AcceptsPositiveIntegers(int id)
    {
        new IntIdValidator().ShouldBeValid(new IntIdModel { Id = id });
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public void MustBeValidEntityId_RejectsNonPositiveIntegers(int id)
    {
        new IntIdValidator().ShouldHaveValidationErrorFor(new IntIdModel { Id = id }, nameof(IntIdModel.Id));
    }

    [Theory]
    [InlineData(null)]
    [InlineData(1)]
    public void MustBeValidOptionalEntityId_AcceptsNullOrPositive(int? id)
    {
        new OptionalIntIdValidator().ShouldBeValid(new OptionalIntIdModel { Id = id });
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-5)]
    public void MustBeValidOptionalEntityId_RejectsNonPositive(int? id)
    {
        new OptionalIntIdValidator().ShouldHaveValidationErrorFor(new OptionalIntIdModel { Id = id }, nameof(OptionalIntIdModel.Id));
    }

    [Fact]
    public void MustBeValidEntityId_AcceptsPositiveLong()
    {
        new LongIdValidator().ShouldBeValid(new LongIdModel { Id = 99 });
    }

    [Fact]
    public void MustBeValidEntityId_RejectsZeroLong()
    {
        new LongIdValidator().ShouldHaveValidationErrorFor(new LongIdModel { Id = 0 }, nameof(LongIdModel.Id));
    }
}
