using JavidHrm.Common.Extensions;
using JavidHrm.Common.Models;

namespace JavidHrm.Common.Tests.Models;

public class OperationResultTests
{
    [Fact]
    public void Success_ReturnsSuccessfulResult()
    {
        var result = OperationResult.Success();

        result.IsSuccess.Should().BeTrue();
    }

    [Fact]
    public void Fail_ReturnsFailedResult()
    {
        var result = OperationResult.Fail();

        result.IsSuccess.Should().BeFalse();
    }

    [Fact]
    public void GenericSuccess_ReturnsValue()
    {
        OperationResult<int> result = 42;

        result.IsSuccess.Should().BeTrue();
        result.Result.Should().Be(42);
    }
}

public class ErrorModelTests
{
    [Fact]
    public void Create_SetsCodeAndResourceFlag()
    {
        var error = ErrorModel.Create("InvalidId");

        error.Code.Should().Be("InvalidId");
        error.UseResourceMessage.Should().BeTrue();
    }
}
