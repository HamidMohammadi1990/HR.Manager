using JavidHrm.Infrastructure.Persistence;
using JavidHrm.Infrastructure.Persistence.Tests.Fixtures;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace JavidHrm.Infrastructure.Persistence.Tests.Support;

[Collection(PersistenceTestCollection.Name)]
[Trait("Category", "Integration")]
public abstract class PersistenceIntegrationTestBase(SqlServerContainerFixture fixture) : IAsyncLifetime
{
    protected SqlServerContainerFixture Fixture { get; } = fixture;

    protected static CancellationToken TestCancellation
        => TestContext.Current.CancellationToken;

    public async ValueTask InitializeAsync()
    {
        await using var connection = new SqlConnection(Fixture.ConnectionString);
        await connection.OpenAsync(TestCancellation);
        await Fixture.Respawner.ResetAsync(connection);
    }

    public ValueTask DisposeAsync()
        => ValueTask.CompletedTask;

    protected JavidHrmDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<JavidHrmDbContext>()
            .UseSqlServer(Fixture.ConnectionString)
            .Options;

        return new JavidHrmDbContext(options);
    }

    protected static Task SaveAsync(JavidHrmDbContext context)
        => context.SaveChangesAsync(TestContext.Current.CancellationToken);
}
