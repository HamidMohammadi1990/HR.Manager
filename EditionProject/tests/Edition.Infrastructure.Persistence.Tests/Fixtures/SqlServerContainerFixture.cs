using JavidHrm.Infrastructure.Persistence;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Respawn;
using Testcontainers.MsSql;

namespace JavidHrm.Infrastructure.Persistence.Tests.Fixtures;

public sealed class SqlServerContainerFixture : IAsyncLifetime
{
    private readonly MsSqlContainer container = new MsSqlBuilder("mcr.microsoft.com/mssql/server:2022-CU14-ubuntu-22.04")
        .Build();

    public string ConnectionString => container.GetConnectionString();

    public Respawner Respawner { get; private set; } = default!;

    public async ValueTask InitializeAsync()
    {
        await container.StartAsync();

        var options = new DbContextOptionsBuilder<JavidHrmDbContext>()
            .UseSqlServer(ConnectionString)
            .Options;

        await using (var context = new JavidHrmDbContext(options))
            await context.Database.MigrateAsync();

        await using var connection = new SqlConnection(ConnectionString);
        await connection.OpenAsync();

        Respawner = await Respawner.CreateAsync(connection, new RespawnerOptions
        {
            DbAdapter = DbAdapter.SqlServer,
            SchemasToInclude = ["dbo"]
        });
    }

    public async ValueTask DisposeAsync()
        => await container.DisposeAsync();
}
