using JavidHrm.Application.Common.Utilities;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Tests.Common.Utilities;

public class UserAgentDeviceParserTests
{
    [Fact]
    public void Parse_ReturnsUnknownDevice_WhenUserAgentIsMissing()
    {
        UserAgentDeviceParser.Parse(null).Should().Be("دستگاه نامشخص");
        UserAgentDeviceParser.Parse("   ").Should().Be("دستگاه نامشخص");
    }

    [Fact]
    public void Parse_DetectsChromeOnWindows()
    {
        var result = UserAgentDeviceParser.Parse(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");

        result.Should().Be("Chrome روی Windows");
    }

    [Fact]
    public void Parse_DetectsEdgeOnWindows()
    {
        var result = UserAgentDeviceParser.Parse(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0");

        result.Should().Be("Edge روی Windows");
    }

    [Fact]
    public void Parse_DetectsFirefoxOnLinux()
    {
        var result = UserAgentDeviceParser.Parse(
            "Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0");

        result.Should().Be("Firefox روی Linux");
    }

    [Fact]
    public void ParseDeviceType_ReturnsUnknown_WhenUserAgentIsMissing()
    {
        UserAgentDeviceParser.ParseDeviceType(null).Should().Be(DeviceType.Unknown);
        UserAgentDeviceParser.ParseDeviceType("   ").Should().Be(DeviceType.Unknown);
    }

    [Theory]
    [InlineData("Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0", DeviceType.Desktop)]
    [InlineData("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Safari/604.1", DeviceType.Mobile)]
    [InlineData("Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) Safari/604.1", DeviceType.Tablet)]
    [InlineData("Mozilla/5.0 (Linux; Android 13; SM-T870) AppleWebKit/537.36", DeviceType.Tablet)]
    [InlineData("Mozilla/5.0 (Linux; Android 13; Mobile) AppleWebKit/537.36", DeviceType.Mobile)]
    public void ParseDeviceType_DetectsFormFactor(string userAgent, DeviceType expected)
    {
        UserAgentDeviceParser.ParseDeviceType(userAgent).Should().Be(expected);
    }

    [Fact]
    public void ParseOperatingSystem_ReturnsUnknown_WhenUserAgentIsMissing()
    {
        UserAgentDeviceParser.ParseOperatingSystem(null).Should().Be(OperatingSystemType.Unknown);
        UserAgentDeviceParser.ParseOperatingSystem("   ").Should().Be(OperatingSystemType.Unknown);
    }

    [Theory]
    [InlineData("Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0", OperatingSystemType.Windows)]
    [InlineData("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Safari/604.1", OperatingSystemType.iOS)]
    [InlineData("Mozilla/5.0 (Linux; Android 13; Mobile) AppleWebKit/537.36", OperatingSystemType.Android)]
    [InlineData("Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0", OperatingSystemType.Linux)]
    [InlineData("Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) Safari/605.1.15", OperatingSystemType.MacOs)]
    public void ParseOperatingSystem_DetectsPlatform(string userAgent, OperatingSystemType expected)
    {
        UserAgentDeviceParser.ParseOperatingSystem(userAgent).Should().Be(expected);
    }
}
