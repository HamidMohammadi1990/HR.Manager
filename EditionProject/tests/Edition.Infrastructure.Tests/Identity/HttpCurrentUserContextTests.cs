using System.Security.Claims;
using JavidHrm.Application.Contracts;
using JavidHrm.Application.Models.Constants;
using JavidHrm.Domain.Enums;
using JavidHrm.Infrastructure.Identity;
using Microsoft.AspNetCore.Http;
using NSubstitute;

namespace JavidHrm.Infrastructure.Tests.Identity;

public class HttpCurrentUserContextTests
{
    [Fact]
    public void UserId_ReturnsNameIdentifierClaim()
    {
        var context = CreateContext(new ClaimsIdentity([
            new Claim(ClaimTypes.NameIdentifier, "42")
        ], authenticationType: "Bearer"));

        var currentUser = new HttpCurrentUserContext(context);

        currentUser.UserId.Should().Be(42);
    }

    [Fact]
    public void SessionId_ReturnsParsedSidClaim()
    {
        var sessionId = Guid.NewGuid();
        var context = CreateContext(new ClaimsIdentity([
            new Claim(AuthClaimTypes.SessionId, sessionId.ToString())
        ], authenticationType: "Bearer"));

        var currentUser = new HttpCurrentUserContext(context);

        currentUser.SessionId.Should().Be(sessionId);
    }

    [Fact]
    public void IsAuthenticated_ReturnsFalse_WhenUserIsNotAuthenticated()
    {
        var context = CreateContext(new ClaimsIdentity());

        new HttpCurrentUserContext(context).IsAuthenticated.Should().BeFalse();
    }

    [Fact]
    public void IsCooperation_ReturnsTrue_WhenCooperationClaimExists()
    {
        var context = CreateContext(new ClaimsIdentity([
            new Claim("Cooperation", "true")
        ], authenticationType: "Bearer"));

        new HttpCurrentUserContext(context).IsCooperation.Should().BeTrue();
    }

    [Fact]
    public void ClientIp_UsesForwardedHeaderWhenPresent()
    {
        var accessor = CreateContext(new ClaimsIdentity(), configureHttpContext: httpContext =>
        {
            httpContext.Request.Headers["X-Forwarded-For"] = "203.0.113.10, 10.0.0.1";
        });

        new HttpCurrentUserContext(accessor).ClientIp.Should().Be("203.0.113.10");
    }

    [Fact]
    public void GetSessionContext_ReturnsParsedDeviceInfo()
    {
        var accessor = CreateContext(new ClaimsIdentity(), configureHttpContext: httpContext =>
        {
            httpContext.Request.Headers.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0";
        });

        var sessionContext = new HttpCurrentUserContext(accessor).GetSessionContext();

        sessionContext.DeviceName.Should().Contain("Chrome");
        sessionContext.DeviceType.Should().Be(DeviceType.Desktop);
        sessionContext.OperatingSystem.Should().Be(OperatingSystemType.Windows);
        sessionContext.UserAgent.Should().NotBeNullOrWhiteSpace();
    }

    private static IHttpContextAccessor CreateContext(
        ClaimsIdentity identity,
        Action<HttpContext>? configureHttpContext = null)
    {
        var httpContext = new DefaultHttpContext
        {
            User = new ClaimsPrincipal(identity)
        };

        configureHttpContext?.Invoke(httpContext);

        var accessor = Substitute.For<IHttpContextAccessor>();
        accessor.HttpContext.Returns(httpContext);
        return accessor;
    }
}
