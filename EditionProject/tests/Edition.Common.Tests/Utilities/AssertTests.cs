using EditionAssert = JavidHrm.Common.Utilities.Assert;

namespace JavidHrm.Common.Tests.Utilities;

public class AssertTests
{
    [Fact]
    public void NotNull_ReferenceType_Null_ThrowsArgumentNullException()
    {
        string? value = null;

        var act = () => EditionAssert.NotNull<string>(value, "paramName", "must not be null");

        act.Should().Throw<ArgumentNullException>()
            .WithParameterName("paramName : System.String")
            .WithMessage("*must not be null*");
    }

    [Fact]
    public void NotNull_ReferenceType_NonNull_DoesNotThrow()
    {
        var act = () => EditionAssert.NotNull("value", "paramName");

        act.Should().NotThrow();
    }

    [Fact]
    public void NotNull_NullableStruct_NoValue_ThrowsArgumentNullException()
    {
        int? value = null;

        var act = () => EditionAssert.NotNull(value, "paramName", "required");

        act.Should().Throw<ArgumentNullException>()
            .WithParameterName("paramName : System.Int32");
    }

    [Fact]
    public void NotNull_NullableStruct_HasValue_DoesNotThrow()
    {
        int? value = 5;

        var act = () => EditionAssert.NotNull(value, "paramName");

        act.Should().NotThrow();
    }

    [Fact]
    public void NotEmpty_StringNull_ThrowsArgumentException()
    {
        string? value = null;

        var act = () => EditionAssert.NotEmpty<string>(value!, "name", "empty string");

        act.Should().Throw<ArgumentException>()
            .WithParameterName("name : System.String")
            .WithMessage("*Argument is empty : empty string*");
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void NotEmpty_StringWhitespace_ThrowsArgumentException(string value)
    {
        var act = () => EditionAssert.NotEmpty<string>(value, "name");

        act.Should().Throw<ArgumentException>()
            .WithParameterName("name : System.String");
    }

    [Fact]
    public void NotEmpty_StringWithContent_DoesNotThrow()
    {
        var act = () => EditionAssert.NotEmpty<string>("hello", "name");

        act.Should().NotThrow();
    }

    [Fact]
    public void NotEmpty_EmptyEnumerable_ThrowsArgumentException()
    {
        IEnumerable<int> value = [];

        var act = () => EditionAssert.NotEmpty<IEnumerable<int>>(value, "items", "no items");

        act.Should().Throw<ArgumentException>()
            .WithMessage("*Argument is empty : no items*")
            .Which.ParamName.Should().StartWith("items :");
    }

    [Fact]
    public void NotEmpty_NonEmptyEnumerable_DoesNotThrow()
    {
        IEnumerable<int> value = [1, 2, 3];

        var act = () => EditionAssert.NotEmpty<IEnumerable<int>>(value, "items");

        act.Should().NotThrow();
    }
}