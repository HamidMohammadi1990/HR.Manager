using JavidHrm.Common.Extensions;

namespace JavidHrm.Common.Tests.Extensions;

public class ShortToTimeSpanTests
{
    [Fact]
    public void ToTimeSpan_ConvertsMinutesToTimeSpan()
    {
        ((short)90).ToTimeSpan().Should().Be(new TimeSpan(1, 30, 0));
    }

    [Fact]
    public void ToTimeSpan_Nullable_ReturnsNullWhenInputIsNull()
    {
        short? minutes = null;

        minutes.ToTimeSpan().Should().BeNull();
    }
}
