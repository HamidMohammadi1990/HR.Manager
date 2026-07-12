using JavidHrm.Common.Models;

namespace JavidHrm.Application.Features.WebSiteSettings.Queries;

public record GetWebSiteSettingRequest : IRequest<OperationResult<GetWebSiteSettingResponse>>;
