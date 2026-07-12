using System.Security.Claims;
using JavidHrm.Application.Contracts;
using JavidHrm.Application.Models.Constants;
using JavidHrm.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using NSubstitute;

namespace JavidHrm.Infrastructure.Tests.Identity;

public class AuthContextValidatorTests
{
    private static readonly string SecurityStampClaimType = new ClaimsIdentityOptions().SecurityStampClaimType;

    [Fact]
    public async Task ValidateAsync_ReturnsTrue_WhenSecurityStampIsValidAndSessionClaimMissing()
    {
        var cache = Substitute.For<IUserAuthCache>();
        cache.ValidateSecurityStampAsync(10, "stamp", Arg.Any<CancellationToken>()).Returns(true);

        var validator = new AuthContextValidator(cache, new AuthValidationState());
        var principal = CreatePrincipal(userId: 10, securityStamp: "stamp");

        var result = await validator.ValidateAsync(principal, TestContext.Current.CancellationToken);

        result.Should().BeTrue();
    }

    [Fact]
    public async Task ValidateAsync_ReturnsFalse_WhenSecurityStampIsInvalid()
    {
        var cache = Substitute.For<IUserAuthCache>();
        cache.ValidateSecurityStampAsync(10, "stamp", Arg.Any<CancellationToken>()).Returns(false);

        var validator = new AuthContextValidator(cache, new AuthValidationState());
        var principal = CreatePrincipal(userId: 10, securityStamp: "stamp");

        var result = await validator.ValidateAsync(principal, TestContext.Current.CancellationToken);

        result.Should().BeFalse();
    }

    [Fact]
    public async Task ValidateAsync_ValidatesSession_WhenSidAndJtiClaimsExist()
    {
        var sessionId = Guid.NewGuid();
        var cache = Substitute.For<IUserAuthCache>();
        cache.ValidateSecurityStampAsync(10, "stamp", Arg.Any<CancellationToken>()).Returns(true);
        cache.ValidateSessionAsync(sessionId, 10, "jwt-id", Arg.Any<CancellationToken>()).Returns(true);

        var validator = new AuthContextValidator(cache, new AuthValidationState());
        var principal = CreatePrincipal(userId: 10, securityStamp: "stamp", sessionId: sessionId, jwtId: "jwt-id");

        var result = await validator.ValidateAsync(principal, TestContext.Current.CancellationToken);

        result.Should().BeTrue();
        await cache.Received(1).ValidateSessionAsync(sessionId, 10, "jwt-id", Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task ValidateAsync_UsesCachedResultWithinSameScope()
    {
        var cache = Substitute.For<IUserAuthCache>();
        cache.ValidateSecurityStampAsync(10, "stamp", Arg.Any<CancellationToken>()).Returns(true);

        var state = new AuthValidationState();
        var validator = new AuthContextValidator(cache, state);
        var principal = CreatePrincipal(userId: 10, securityStamp: "stamp");

        (await validator.ValidateAsync(principal, TestContext.Current.CancellationToken)).Should().BeTrue();
        (await validator.ValidateAsync(principal, TestContext.Current.CancellationToken)).Should().BeTrue();

        await cache.Received(1).ValidateSecurityStampAsync(10, "stamp", Arg.Any<CancellationToken>());
    }

    private static ClaimsPrincipal CreatePrincipal(
        int userId,
        string securityStamp,
        Guid? sessionId = null,
        string? jwtId = null)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId.ToString()),
            new(SecurityStampClaimType, securityStamp)
        };

        if (sessionId.HasValue)
            claims.Add(new Claim(AuthClaimTypes.SessionId, sessionId.Value.ToString()));

        if (!string.IsNullOrWhiteSpace(jwtId))
            claims.Add(new Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Jti, jwtId));

        return new ClaimsPrincipal(new ClaimsIdentity(claims, authenticationType: "Bearer"));
    }
}
