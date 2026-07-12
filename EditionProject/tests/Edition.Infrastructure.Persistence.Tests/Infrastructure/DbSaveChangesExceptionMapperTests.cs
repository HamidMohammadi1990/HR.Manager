using JavidHrm.Infrastructure.Persistence;

namespace JavidHrm.Infrastructure.Persistence.Tests.Infrastructure;

public sealed class DbSaveChangesExceptionMapperTests
{
    [Theory]
    [InlineData(547, "The DELETE statement conflicted with the REFERENCE constraint \"FK_SubCategory_Category_CategoryId\".", "RecordHasDependencies")]
    [InlineData(547, "The INSERT statement conflicted with the FOREIGN KEY constraint \"FK_SubCategory_Category_CategoryId\".", "InvalidReference")]
    [InlineData(547, "The UPDATE statement conflicted with the REFERENCE constraint \"FK_SubCategory_Category_CategoryId\".", "InvalidReference")]
    [InlineData(547, "The INSERT statement conflicted with the CHECK constraint \"CK_User_Age\".", "ValidationError")]
    [InlineData(2627, "Violation of UNIQUE KEY constraint.", "DuplicateRecord")]
    [InlineData(2601, "Cannot insert duplicate key row.", "DuplicateRecord")]
    [InlineData(515, "Cannot insert the value NULL into column 'Title'.", "RequiredFieldMissing")]
    [InlineData(8152, "String or binary data would be truncated.", "DataTooLong")]
    [InlineData(1205, "Transaction was deadlocked.", "DatabaseDeadlock")]
    [InlineData(-2, "Execution Timeout Expired.", "DatabaseTimeout")]
    public void MapSqlError_ReturnsExpectedCode(int number, string message, string expectedCode)
    {
        var result = DbSaveChangesExceptionMapper.MapSqlError(number, message);

        result.Should().NotBeNull();
        result!.Code.Should().Be(expectedCode);
        result.UseResourceMessage.Should().BeTrue();
    }

    [Fact]
    public void Map_UnknownExceptionInProduction_ReturnsGeneralException()
    {
        var result = DbSaveChangesExceptionMapper.Map(new InvalidOperationException("secret details"), includeTechnicalDetails: false);

        result.Code.Should().Be("GeneralException");
    }

    [Fact]
    public void Map_UnknownExceptionInDevelopment_ReturnsTechnicalMessage()
    {
        var result = DbSaveChangesExceptionMapper.Map(new InvalidOperationException("secret details"), includeTechnicalDetails: true);

        result.Code.Should().Be("ServerError");
        result.Message.Should().Be("secret details");
        result.UseResourceMessage.Should().BeFalse();
    }
}
