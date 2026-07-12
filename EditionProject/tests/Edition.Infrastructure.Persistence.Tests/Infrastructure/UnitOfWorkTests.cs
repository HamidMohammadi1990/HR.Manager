using JavidHrm.Infrastructure.Persistence;
using JavidHrm.Infrastructure.Persistence.Tests.Fixtures;
using JavidHrm.Infrastructure.Persistence.Tests.Support;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;

namespace JavidHrm.Infrastructure.Persistence.Tests.Infrastructure;

public sealed class UnitOfWorkTests(SqlServerContainerFixture fixture)
    : PersistenceIntegrationTestBase(fixture)
{
    private static UnitOfWork CreateUnitOfWork(JavidHrmDbContext context, bool includeDetailedSaveErrors = false)
        => new(context, NullLogger<UnitOfWork>.Instance, new SaveChangesExceptionReporting(includeDetailedSaveErrors));

    [Fact]
    public async Task SaveChangesAsync_WhenEntitiesAreValid_ReturnsSuccess()
    {
        await using var context = CreateContext();
        var unitOfWork = CreateUnitOfWork(context);

        context.Bank.Add(PersistenceTestData.CreateBank("Melli"));

        var result = await unitOfWork.SaveChangesAsync(TestCancellation);

        result.IsSuccess.Should().BeTrue();
        (await context.Bank.CountAsync(TestCancellation)).Should().Be(1);
    }

    [Fact]
    public async Task SaveChangesAsync_WhenRequiredFieldMissing_ReturnsRequiredFieldMissingError()
    {
        await using var context = CreateContext();
        var unitOfWork = CreateUnitOfWork(context);

        context.Bank.Add(new Domain.Entities.Bank { Title = null!, Icon = "icon.svg", IsActive = true });

        var result = await unitOfWork.SaveChangesAsync(TestCancellation);

        result.IsSuccess.Should().BeFalse();
        result.Messages.Should().ContainSingle();
        result.Messages[0].Code.Should().Be("RequiredFieldMissing");
    }

    [Fact]
    public async Task SaveChangesAsync_WhenRecordHasDependencies_ReturnsRecordHasDependenciesError()
    {
        await using var context = CreateContext();
        var unitOfWork = CreateUnitOfWork(context);

        var category = Domain.Entities.Category.Create("Print", "print", "001");
        context.Category.Add(category);
        await context.SaveChangesAsync(TestCancellation);

        context.SubCategory.Add(Domain.Entities.SubCategory.Create("Books", "books", "001-1", category.Id));
        await context.SaveChangesAsync(TestCancellation);

        context.Category.Remove(category);

        var result = await unitOfWork.SaveChangesAsync(TestCancellation);

        result.IsSuccess.Should().BeFalse();
        result.Messages.Should().ContainSingle();
        result.Messages[0].Code.Should().Be("RecordHasDependencies");
    }
}
