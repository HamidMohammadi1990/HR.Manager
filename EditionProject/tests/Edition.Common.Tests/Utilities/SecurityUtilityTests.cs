using JavidHrm.Common.Utilities;

namespace JavidHrm.Common.Tests.Utilities;

public class SecurityUtilityTests
{
    [Fact]
    public void GetSha256Hash_SameInput_ProducesDeterministicResult()
    {
        const string input = "password123";

        var first = SecurityUtility.GetSha256Hash(input);
        var second = SecurityUtility.GetSha256Hash(input);

        first.Should().Be(second);
        first.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public void GetSha256Hash_DifferentInputs_ProduceDifferentHashes()
    {
        var hashA = SecurityUtility.GetSha256Hash("input-a");
        var hashB = SecurityUtility.GetSha256Hash("input-b");

        hashA.Should().NotBe(hashB);
    }

    [Theory]
    [InlineData("")]
    [InlineData("hello world")]
    [InlineData("متن فارسی")]
    public void GetSha256Hash_ReturnsValidBase64String(string input)
    {
        var hash = SecurityUtility.GetSha256Hash(input);

        var act = () => Convert.FromBase64String(hash);

        act.Should().NotThrow();
        Convert.FromBase64String(hash).Should().HaveCount(32);
    }

    [Fact]
    public void GetSha256Hash_KnownInput_MatchesExpectedHash()
    {
        var hash = SecurityUtility.GetSha256Hash("test");
        var expected = Convert.ToBase64String(System.Security.Cryptography.SHA256.HashData("test"u8.ToArray()));

        hash.Should().Be(expected);
    }
}
