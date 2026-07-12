using JavidHrm.Common.Utilities;

namespace JavidHrm.Common.Tests.Utilities;

public class NumberGeneratorTests
{
    [Fact]
    public void Create_DefaultRange_ReturnsValueWithinBounds()
    {
        for (var i = 0; i < 100; i++)
        {
            var value = NumberGenerator.Create();

            value.Should().BeGreaterThanOrEqualTo(10_000);
            value.Should().BeLessThan(100_000);
        }
    }

    [Theory]
    [InlineData(0, 10)]
    [InlineData(5, 15)]
    [InlineData(-100, -50)]
    [InlineData(1_000, 1_001)]
    public void Create_CustomRange_ReturnsValueWithinBounds(int from, int to)
    {
        for (var i = 0; i < 50; i++)
        {
            var value = NumberGenerator.Create(from, to);

            value.Should().BeGreaterThanOrEqualTo(from);
            value.Should().BeLessThan(to);
        }
    }

    [Fact]
    public void Create_SingleValueRange_ThrowsArgumentOutOfRangeException()
    {
        var act = () => NumberGenerator.Create(5, 5);

        act.Should().Throw<ArgumentOutOfRangeException>();
    }

    [Fact]
    public void Create_InvertedRange_ThrowsArgumentOutOfRangeException()
    {
        var act = () => NumberGenerator.Create(10, 5);

        act.Should().Throw<ArgumentOutOfRangeException>();
    }
}
