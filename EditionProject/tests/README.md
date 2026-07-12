# Test suite

Run all tests:

```powershell
dotnet test JavidHrm.sln
```

Run with coverage:

```powershell
dotnet test JavidHrm.sln --collect:"XPlat Code Coverage"
```

## Projects

| Project | Scope |
|---------|--------|
| `JavidHrm.Arch.Tests` | Architecture / layer dependency rules |
| `JavidHrm.Common.Tests` | Extensions, utilities, security, models |
| `JavidHrm.Domain.Tests` | Domain entities, content policy, pagination |
| `JavidHrm.Application.Tests` | Validation, utilities, mappers, validators, DI |
| `JavidHrm.Infrastructure.Tests` | Identity, auth context |
| `JavidHrm.Infrastructure.Persistence.Tests` | EF Core + SQL Server integration (Testcontainers) |

## Persistence integration tests

Requires **Docker Desktop** (or Docker Engine) running locally. Tests spin up a real SQL Server container, apply EF migrations, and reset data between tests with [Respawn](https://github.com/jbogard/Respawn).

```powershell
# Run only persistence integration tests
dotnet test tests/Edition.Infrastructure.Persistence.Tests

# Skip integration tests (unit tests only)
dotnet test JavidHrm.sln --filter "Category!=Integration"
```

## Conventions

- xUnit v3 + FluentAssertions + NSubstitute (where mocking is needed)
- Shared packages via `tests/Directory.Build.props`
- Validator helpers in `JavidHrm.Application.Tests/Helpers/ValidatorTestHelper.cs`
- Domain order/discount fixtures in `JavidHrm.Domain.Tests/Helpers/OrderTestData.cs`

## Next expansion targets

- Content policy expression pipeline (`ContentPolicyOperatorApplier`, `ContentPolicyValueResolver`)
- Additional repository integration tests (ContentPolicy, Order, User)
- Template-driven validator tests for remaining ~390 validators
- Mapper snapshot tests for all `*MapperService` implementations
