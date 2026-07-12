using JavidHrm.Application.Common.Extensions;
using JavidHrm.Application.Tests.Helpers;
using FluentValidation;

namespace JavidHrm.Application.Tests.Common.Extensions;

public class RuleBuilderExtensionsTests
{
    private sealed class IpModel
    {
        public string Ip { get; init; } = string.Empty;
    }

    private sealed class IpValidator : AbstractValidator<IpModel>
    {
        public IpValidator() => RuleFor(x => x.Ip).IsValidIP();
    }

    [Theory]
    [InlineData("192.168.0.1")]
    [InlineData("10.0.0.255")]
    public void IsValidIP_AcceptsValidIpv4(string ip)
    {
        new IpValidator().ShouldBeValid(new IpModel { Ip = ip });
    }

    [Theory]
    [InlineData("")]
    [InlineData("999.1.1.1")]
    [InlineData("not-an-ip")]
    public void IsValidIP_RejectsInvalidIpv4(string ip)
    {
        new IpValidator().ShouldHaveValidationErrorFor(new IpModel { Ip = ip }, nameof(IpModel.Ip));
    }
}
