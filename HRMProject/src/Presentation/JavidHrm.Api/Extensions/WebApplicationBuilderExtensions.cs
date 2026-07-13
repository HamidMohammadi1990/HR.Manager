using Autofac;
using JavidHrm.Api.Modules;
using Autofac.Extensions.DependencyInjection;

namespace JavidHrm.Api.Extensions;

public static class WebApplicationBuilderExtensions
{
    public static void AddAutofactServiceProviderAndInterceptors(this WebApplicationBuilder applicationBuilder)
    {
        applicationBuilder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
        applicationBuilder.Host.ConfigureContainer<ContainerBuilder>
                     (builder => builder.RegisterModule(new RepositoryModule()));
    }
}