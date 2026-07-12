using System.Security.Claims;
using System.Security.Principal;
using JavidHrm.Common.Extensions;

namespace JavidHrm.Common.Tests.Extensions;

public class IdentityExtensionsTests
{
    #region FindFirstValue (ClaimsIdentity)

    [Fact]
    public void FindFirstValue_ClaimsIdentity_ExistingClaim_ReturnsValue()
    {
        var identity = new ClaimsIdentity([new Claim("custom-type", "custom-value")]);

        identity.FindFirstValue("custom-type").Should().Be("custom-value");
    }

    [Fact]
    public void FindFirstValue_ClaimsIdentity_MissingClaim_ReturnsNull()
    {
        var identity = new ClaimsIdentity();

        identity.FindFirstValue("missing").Should().BeNull();
    }

    [Fact]
    public void FindFirstValue_ClaimsIdentity_NullIdentity_ReturnsNull()
    {
        ClaimsIdentity? identity = null;

        identity!.FindFirstValue("any").Should().BeNull();
    }

    #endregion

    #region GetUserId

    [Fact]
    public void GetUserId_ReturnsNameIdentifierClaim()
    {
        var identity = CreateIdentity(new Claim(ClaimTypes.NameIdentifier, "user-42"));

        identity.GetUserId().Should().Be("user-42");
    }

    [Fact]
    public void GetUserId_MissingClaim_ReturnsNull()
    {
        var identity = new ClaimsIdentity();

        identity.GetUserId().Should().BeNull();
    }

    #endregion

    #region GetUserId<T>

    [Fact]
    public void GetUserId_GenericInt_ConvertsSuccessfully()
    {
        var identity = CreateIdentity(new Claim(ClaimTypes.NameIdentifier, "42"));

        identity.GetUserId<int>().Should().Be(42);
    }

    [Fact]
    public void GetUserId_GenericGuid_ConvertsSuccessfully()
    {
        var guid = Guid.Parse("a1b2c3d4-e5f6-7890-abcd-ef1234567890");
        var identity = CreateIdentity(new Claim(ClaimTypes.NameIdentifier, guid.ToString()));

        identity.GetUserId<Guid>().Should().Be(guid);
    }

    [Fact]
    public void GetUserId_GenericMissingClaim_ReturnsDefault()
    {
        var identity = new ClaimsIdentity();

        identity.GetUserId<int>().Should().Be(default);
    }

    [Fact]
    public void GetUserId_GenericWhitespaceClaim_ReturnsDefault()
    {
        var identity = CreateIdentity(new Claim(ClaimTypes.NameIdentifier, "   "));

        identity.GetUserId<int>().Should().Be(default);
    }

    #endregion

    #region IsInRole

    [Fact]
    public void IsInRole_ClaimWithRoleNameExists_ReturnsTrue()
    {
        var identity = CreateIdentity(new Claim("Admin", "true"));

        identity.IsInRole("Admin").Should().BeTrue();
    }

    [Fact]
    public void IsInRole_ClaimWithRoleNameMissing_ReturnsFalse()
    {
        var identity = new ClaimsIdentity();

        identity.IsInRole("Admin").Should().BeFalse();
    }

    [Fact]
    public void IsInRole_NullIdentity_ReturnsFalse()
    {
        IIdentity? identity = null;

        identity!.IsInRole("Admin").Should().BeFalse();
    }

    [Fact]
    public void IsInRole_StandardRoleClaimType_RequiresClaimTypeToMatchRoleName()
    {
        var identity = CreateIdentity(new Claim(ClaimTypes.Role, "Admin"));

        identity.IsInRole("Admin").Should().BeFalse();
    }

    #endregion

    private static ClaimsIdentity CreateIdentity(params Claim[] claims)
        => new(claims);
}