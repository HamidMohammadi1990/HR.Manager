namespace JavidHrm.Infrastructure.Persistence.Tests.Fixtures;

[CollectionDefinition(Name)]
public sealed class PersistenceTestCollection : ICollectionFixture<SqlServerContainerFixture>
{
    public const string Name = "Persistence.SqlServer";
}
