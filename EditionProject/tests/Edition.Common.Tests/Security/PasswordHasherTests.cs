using JavidHrm.Common.Security;
using JavidHrm.Common.Utilities;

namespace JavidHrm.Common.Tests.Security;

public class PasswordHasherTests
{
    private readonly PasswordHasher _sut = new();

    #region HashPassword

    [Fact]
    public void HashPassword_ValidPassword_ReturnsBcryptHash()
    {
        var hash = _sut.HashPassword("SecurePassword1!");

        hash.Should().StartWith("$2");
        hash.Should().NotBe("SecurePassword1!");
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void HashPassword_InvalidPassword_ThrowsArgumentException(string? password)
    {
        var act = () => _sut.HashPassword(password!);

        act.Should().Throw<ArgumentException>();
    }

    #endregion

    #region VerifyPassword (bcrypt)

    [Fact]
    public void VerifyPassword_BcryptHash_CorrectPassword_ReturnsTrue()
    {
        const string password = "MySecretPassword";
        var hash = _sut.HashPassword(password);

        _sut.VerifyPassword(password, hash).Should().BeTrue();
    }

    [Fact]
    public void VerifyPassword_BcryptHash_WrongPassword_ReturnsFalse()
    {
        var hash = _sut.HashPassword("correct-password");

        _sut.VerifyPassword("wrong-password", hash).Should().BeFalse();
    }

    #endregion

    #region VerifyPassword (legacy SHA256)

    [Fact]
    public void VerifyPassword_LegacySha256Hash_CorrectPassword_ReturnsTrue()
    {
        const string password = "legacy-password";
        var legacyHash = SecurityUtility.GetSha256Hash(password);

        _sut.VerifyPassword(password, legacyHash).Should().BeTrue();
    }

    [Fact]
    public void VerifyPassword_LegacySha256Hash_WrongPassword_ReturnsFalse()
    {
        var legacyHash = SecurityUtility.GetSha256Hash("original");

        _sut.VerifyPassword("different", legacyHash).Should().BeFalse();
    }

    #endregion

    #region NeedsRehash

    [Fact]
    public void NeedsRehash_BcryptHash_ReturnsFalse()
    {
        var hash = _sut.HashPassword("password");

        _sut.NeedsRehash(hash).Should().BeFalse();
    }

    [Fact]
    public void NeedsRehash_LegacySha256Hash_ReturnsTrue()
    {
        var legacyHash = SecurityUtility.GetSha256Hash("password");

        _sut.NeedsRehash(legacyHash).Should().BeTrue();
    }

    [Theory]
    [InlineData("plain-text-hash")]
    [InlineData("$1$legacy-md5-style")]
    public void NeedsRehash_NonBcryptHash_ReturnsTrue(string storedHash)
    {
        _sut.NeedsRehash(storedHash).Should().BeTrue();
    }

    #endregion

    #region VerifyPassword validation

    [Theory]
    [InlineData(null, "$2a$12$hash")]
    [InlineData("password", null)]
    [InlineData("", "$2a$12$hash")]
    [InlineData("password", "   ")]
    public void VerifyPassword_InvalidArguments_ThrowsArgumentException(string? password, string? hash)
    {
        var act = () => _sut.VerifyPassword(password!, hash!);

        act.Should().Throw<ArgumentException>();
    }

    #endregion
}
