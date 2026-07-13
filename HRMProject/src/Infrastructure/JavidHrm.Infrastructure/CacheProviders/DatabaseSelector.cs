using System.Diagnostics;
using JavidHrm.Application.Common.Caching.Enums;
using JavidHrm.Application.Common.Caching.Abstractions;

namespace JavidHrm.Infrastructure.CacheProviders;

public class DatabaseSelector : IDatabaseSelector
{
    [DebuggerStepThrough]
    public int Select(CacheInstanceType cacheInstance) => cacheInstance switch
    {
        CacheInstanceType.Default or CacheInstanceType.AppSettings or CacheInstanceType.Default => 0,
        _ => 5,
    };
}