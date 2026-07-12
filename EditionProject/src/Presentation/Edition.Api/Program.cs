using Serilog;
using JavidHrm.Application;
using JavidHrm.Api.Modules;
using JavidHrm.Common.Models;
using JavidHrm.Api.Extensions;
using JavidHrm.Infrastructure;
using JavidHrm.Api.Middlewares;
using JavidHrm.WebFramework.Swagger;
using JavidHrm.WebFramework.Extensions;
using JavidHrm.Infrastructure.Persistence;
using JavidHrm.Infrastructure.LogProviders;
using JavidHrm.Infrastructure.Configurations;
using JavidHrm.Infrastructure.Persistence.Contracts;

var builder = WebApplication.CreateBuilder(args);

//builder.Host.UseSerilog();

builder.AddAutofactServiceProviderAndInterceptors();

builder.Services.AddHttpContextAccessor();
builder.Services.AddEditionSecurity(builder.Configuration);
builder.Services.AddEditionLocalization(builder.Configuration);
builder.Services.AddSingleton(
    builder.Configuration.GetSection(nameof(ForwardedHeadersSettings)).Get<ForwardedHeadersSettings>()
    ?? new ForwardedHeadersSettings());

builder.Services.AddCustomCors(builder.Configuration);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddEmailTokenProviderConfiguration(builder.Configuration);
builder.Services.AddPhoneNumberTokenProviderConfiguration(builder.Configuration);
builder.Services.AddContentPolicyCacheConfiguration(builder.Configuration);
builder.Services.RegisterApplicationServices()
                .RegisterInfrastructureServices(builder.Configuration)
                .RegisterPersistenceServices(builder.Configuration, builder.Environment.IsDevelopment());

var siteSettings = builder.Configuration
    .GetSection(nameof(SiteSettings)).Get<SiteSettings>()
    ?? throw new NullReferenceException("siteSettings is null ...");

builder.Services.AddSwagger();
builder.Services.AddSingleton(siteSettings!);
builder.Services.AddMinimalMvc();
builder.Services.AddJwtAuthentication(siteSettings!.JwtSettings, builder.Environment);
builder.Services.AddCustomApiVersioning();
builder.Services.AddCustomResponseCompression();

var serilogConfiguration = builder.Configuration.GetSection("Serilog:Configuration").Get<SeilogConfiguration>();
serilogConfiguration!.UseSerilog(builder.Configuration);


var app = builder.Build();

app.UseEditionLocalization();
app.UseMiddleware<BlockTokenControlMiddleware>();

if (app.Environment.IsDevelopment())
    await app.ApplyDevelopmentBootstrapAsync();

if (!builder.Environment.IsDevelopment())
    app.UseHsts();

app.UserCustomeForwardedHeaders();

app.UseCustomExceptionHandler();
app.UseCors("CustomCors");
app.UseHttpsRedirection();
app.UseSwaggerAndUI();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

//app.CloseSerilogWhenApplicationStopping();

await app.CustomRunAsync();