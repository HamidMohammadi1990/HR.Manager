using JavidHrm.Common.Extensions;

namespace JavidHrm.Common.Tests.Extensions;

public class StringExtensionTests
{
    #region ToTimeSpan

    [Theory]
    [InlineData("45", 0, 0, 45, 0)]
    [InlineData("2:30", 0, 2, 30, 0)]
    [InlineData("1:15:20", 0, 1, 15, 20)]
    [InlineData("1:2:3:4", 1, 2, 3, 4)]
    public void ToTimeSpan_ValidFormats_ReturnsExpectedTimeSpan(
        string input, int days, int hours, int minutes, int seconds)
    {
        var result = input.ToTimeSpan();

        result.Days.Should().Be(days);
        result.Hours.Should().Be(hours);
        result.Minutes.Should().Be(minutes);
        result.Seconds.Should().Be(seconds);
    }

    [Fact]
    public void ToTimeSpan_FivePartFormat_IncludesMilliseconds()
    {
        var result = "0:0:0:0:250".ToTimeSpan();

        result.Milliseconds.Should().Be(250);
    }

    [Fact]
    public void ToTimeSpan_CustomSeparator_ParsesCorrectly()
    {
        var result = "2-30".ToTimeSpan('-');

        result.Should().Be(new TimeSpan(2, 30, 0));
    }

    [Fact]
    public void ToTimeSpan_Null_ThrowsArgumentNullException()
    {
        string? value = null;

        var act = () => value!.ToTimeSpan();

        act.Should().Throw<ArgumentNullException>()
            .WithParameterName("value");
    }

    [Fact]
    public void ToTimeSpan_Empty_ThrowsFormatException()
    {
        var act = () => "".ToTimeSpan();

        act.Should().Throw<FormatException>()
            .WithMessage("Input string is empty");
    }

    [Theory]
    [InlineData("abc")]
    [InlineData("1:two")]
    [InlineData("1:2:3:4:5:6")]
    public void ToTimeSpan_InvalidInput_Throws(string input)
    {
        var act = () => input.ToTimeSpan();

        act.Should().Throw<Exception>();
    }

    [Fact]
    public void ToTimeSpan_TooManyParts_ThrowsArgumentOutOfRangeException()
    {
        var act = () => "1:2:3:4:5:6".ToTimeSpan();

        act.Should().Throw<ArgumentOutOfRangeException>()
            .WithParameterName("value");
    }

    [Fact]
    public void ToTimeSpan_NonNumericPart_ThrowsFormatException()
    {
        var act = () => "1:abc".ToTimeSpan();

        act.Should().Throw<FormatException>()
            .WithMessage("Input string is not numeric");
    }

    #endregion

    #region HasValue

    [Theory]
    [InlineData("hello", true, true)]
    [InlineData("hello", false, true)]
    [InlineData("  ", true, false)]
    [InlineData("  ", false, true)]
    [InlineData("", true, false)]
    [InlineData("", false, false)]
    [InlineData(null, true, false)]
    [InlineData(null, false, false)]
    public void HasValue_ReturnsExpectedResult(string? value, bool ignoreWhiteSpace, bool expected)
    {
        value.HasValue(ignoreWhiteSpace).Should().Be(expected);
    }

    #endregion

    #region En2Fa / Fa2En

    [Fact]
    public void En2Fa_ConvertsAllDigitsToPersian()
    {
        "0123456789".En2Fa().Should().Be("۰۱۲۳۴۵۶۷۸۹");
    }

    [Fact]
    public void Fa2En_ConvertsPersianDigitsToEnglish()
    {
        "۰۱۲۳۴۵۶۷۸۹".Fa2En().Should().Be("0123456789");
    }

    [Theory]
    [InlineData("٠", "0")]
    [InlineData("١", "1")]
    [InlineData("٢", "2")]
    [InlineData("٣", "3")]
    [InlineData("٤", "4")]
    [InlineData("٥", "5")]
    [InlineData("٦", "6")]
    [InlineData("٧", "7")]
    [InlineData("٨", "8")]
    [InlineData("٩", "9")]
    public void Fa2En_ConvertsArabicIndicDigits(string input, string expected)
    {
        input.Fa2En().Should().Be(expected);
    }

    [Fact]
    public void En2Fa_LeavesNonDigitsUnchanged()
    {
        "abc-123".En2Fa().Should().Be("abc-۱۲۳");
    }

    #endregion

    #region FixPersianChars

    [Theory]
    [InlineData("ﮎ", "ک")]
    [InlineData("ﮏ", "ک")]
    [InlineData("ﮐ", "ک")]
    [InlineData("ﮑ", "ک")]
    [InlineData("ك", "ک")]
    [InlineData("ي", "ی")]
    [InlineData("ھ", "ه")]
    public void FixPersianChars_NormalizesCharacterVariants(string input, string expected)
    {
        input.FixPersianChars().Should().Be(expected);
    }

    [Fact]
    public void FixPersianChars_ReplacesNonBreakingSpaceAndZeroWidthNonJoinerWithSpace()
    {
        "a\u00A0b\u200Cb".FixPersianChars().Should().Be("a b b");
    }

    #endregion

    #region CleanString

    [Fact]
    public void CleanString_TrimsFixesPersianCharsAndConvertsDigits()
    {
        "  كي ۱۲۳  ".CleanString().Should().Be("کی 123");
    }

    [Fact]
    public void CleanString_EmptyAfterProcessing_ReturnsNull()
    {
        "   ".CleanString().Should().BeNull();
    }

    #endregion

    #region NullIfEmpty

    [Fact]
    public void NullIfEmpty_EmptyString_ReturnsNull()
    {
        "".NullIfEmpty().Should().BeNull();
    }

    [Fact]
    public void NullIfEmpty_NonEmpty_ReturnsOriginal()
    {
        "text".NullIfEmpty().Should().Be("text");
    }

    [Fact]
    public void NullIfEmpty_Null_ReturnsNull()
    {
        string? value = null;

        value!.NullIfEmpty().Should().BeNull();
    }

    #endregion

    #region TrimEnd

    [Theory]
    [InlineData("HelloWorld", "World", "Hello")]
    [InlineData("TestTEST", "test", "")]
    [InlineData("NoSuffix", "xyz", "NoSuffix")]
    public void TrimEnd_RemovesSuffixCaseInsensitively(string source, string suffix, string expected)
    {
        source.TrimEnd(suffix).Should().Be(expected);
    }

    [Fact]
    public void TrimEnd_RepeatedSuffix_RemovesAllOccurrences()
    {
        "abcabcabc".TrimEnd("abc").Should().BeEmpty();
    }

    #endregion

    #region IsEmail

    [Theory]
    [InlineData("user@example.com")]
    [InlineData("name.surname@domain.co.uk")]
    public void IsEmail_ValidAddresses_ReturnsTrue(string email)
    {
        email.IsEmail().Should().BeTrue();
    }

    [Theory]
    [InlineData("")]
    [InlineData("not-an-email")]
    [InlineData("@missing-local.com")]
    [InlineData("missing-at-sign.com")]
    public void IsEmail_InvalidAddresses_ReturnsFalse(string email)
    {
        email.IsEmail().Should().BeFalse();
    }

    #endregion

    #region IsMobile

    [Theory]
    [InlineData("09123456789")]
    [InlineData("9123456789")]
    [InlineData("+989123456789")]
    [InlineData("00989123456789")]
    [InlineData("989123456789")]
    public void IsMobile_ValidIranianNumbers_ReturnsTrue(string mobile)
    {
        mobile.IsMobile().Should().BeTrue();
    }

    [Theory]
    [InlineData("")]
    [InlineData("08123456789")]
    [InlineData("0912345678")]
    [InlineData("091234567890")]
    [InlineData("19123456789")]
    [InlineData("not-a-number")]
    public void IsMobile_InvalidNumbers_ReturnsFalse(string mobile)
    {
        mobile.IsMobile().Should().BeFalse();
    }

    #endregion
}
