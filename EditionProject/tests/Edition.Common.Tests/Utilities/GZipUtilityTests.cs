using JavidHrm.Common.Utilities;

namespace JavidHrm.Common.Tests.Utilities;

public class GZipUtilityTests
{
    [Theory]
    [InlineData("")]
    [InlineData("hello")]
    [InlineData("The quick brown fox jumps over the lazy dog.")]
    [InlineData("متن فارسی با اعداد ۱۲۳")]
    public void Compress_Then_DeCompress_RoundTripsOriginalValue(string original)
    {
        var compressed = GZipUtility.Compress(original);
        var decompressed = GZipUtility.DeCompress(compressed);

        decompressed.Should().Be(original);
    }

    [Fact]
    public void Compress_ProducesNonEmptyByteArray()
    {
        var compressed = GZipUtility.Compress("test data");

        compressed.Should().NotBeEmpty();
    }

    [Fact]
    public void Compress_SameInput_ProducesConsistentOutput()
    {
        const string input = "consistent input";

        var first = GZipUtility.Compress(input);
        var second = GZipUtility.Compress(input);

        first.Should().Equal(second);
    }
}
