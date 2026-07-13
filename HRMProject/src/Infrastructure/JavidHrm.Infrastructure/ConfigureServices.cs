using RedLockNet.SERedis;
using StackExchange.Redis;
using JavidHrm.Infrastructure.Services;
using JavidHrm.Infrastructure.Identity;
using RedLockNet.SERedis.Configuration;
using Microsoft.Extensions.Configuration;
using JavidHrm.Infrastructure.SmsProviders;
using JavidHrm.Infrastructure.CacheProviders;
using JavidHrm.Infrastructure.EmailProviders;
using JavidHrm.Infrastructure.Configurations;
using Microsoft.Extensions.DependencyInjection;
using JavidHrm.Infrastructure.CacheProviders.Redis;
using JavidHrm.Application.Contracts.Infrastructure;
using JavidHrm.Application.Common.Caching.Abstractions;
using JavidHrm.Application.Contracts;

namespace JavidHrm.Infrastructure;

public static class ConfigureServices
{
    public static IServiceCollection RegisterInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddHttpClient();
        var redisConfiguration = configuration.GetSection("RedisConfiguration").Get<RedisConfiguration>();
        var redisHost = (redisConfiguration?.Hosts.FirstOrDefault())
                ?? throw new NullReferenceException($"{nameof(RedisConfiguration.Hosts)} is null in redis configuration!");

        var multiplexer = ConnectionMultiplexer.Connect(new ConfigurationOptions
        {
            Ssl = redisConfiguration.Ssl,
            Password = redisConfiguration.Password,
            AllowAdmin = redisConfiguration.AllowAdmin,
            DefaultDatabase = redisConfiguration.Database,
            ConnectRetry = redisConfiguration.ConnectRetry,
            ConnectTimeout = redisConfiguration.ConnectTimeout,
            EndPoints = { $"{redisHost.Host}:{redisHost.Port}" }
        });

        services.AddSingleton<IImageService, ImageService>();

        services.AddScoped<ICurrentUserContext, HttpCurrentUserContext>();
        services.AddScoped<IAuthValidationState, AuthValidationState>();
        services.AddScoped<IAuthContextValidator, AuthContextValidator>();

        services.AddScoped<ISmsService, SmsService>();
        services.AddScoped<IEmailService, EmailServie>();

        services.AddSingleton<IConnectionMultiplexer>(multiplexer);
        services.AddSingleton<IDatabaseSelector, DatabaseSelector>();
        services.AddScoped<IRedisCacheService, RedisCacheService>();
        services.AddScoped<IDistributedCache, DistributedCache>();

        services.AddSingleton(sp =>
        {
            var redLockMultiplexer = new RedLockMultiplexer(multiplexer);
            return RedLockFactory.Create([redLockMultiplexer]);
        });

        return services;
    }
}