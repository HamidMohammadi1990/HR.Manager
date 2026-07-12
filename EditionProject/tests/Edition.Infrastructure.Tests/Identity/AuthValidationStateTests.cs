using JavidHrm.Infrastructure.Identity;

namespace JavidHrm.Infrastructure.Tests.Identity;

public class AuthValidationStateTests
{
    [Fact]
    public void CachedResult_CanStoreValidationOutcome()
    {
        var state = new AuthValidationState
        {
            CachedResult = true
        };

        state.CachedResult.Should().BeTrue();
    }
}
