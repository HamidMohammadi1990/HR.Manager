using JavidHrm.Application.Common.Caching.Enums;

namespace JavidHrm.Application.Configurations.ContentPolicies;

public interface IContentPolicyCacheConfiguration
{
    CacheInstanceType CacheInstance { get; }
    string GenerationKey { get; }
    TimeSpan UserContextTtl { get; }
    TimeSpan PoliciesTtl { get; }
    TimeSpan GenerationTtl { get; }
}
