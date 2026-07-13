using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Domain.Dtos.Pagination;

namespace JavidHrm.Application.Features.Notifications.Queries;

public class GetAllNotificationHandler
    (INotificationRepository notificationRepository, INotificationMapperService mapper, IContentPolicyFilterContext contentPolicyFilterContext)
    : IRequestHandler<GetAllNotificationRequest, OperationResult<PagedResult<GetAllNotificationResponse>>>
{
    public async Task<OperationResult<PagedResult<GetAllNotificationResponse>>> Handle(GetAllNotificationRequest request, CancellationToken cancellationToken)
    {
        var requestModel = mapper.Map(request);
        var filter = contentPolicyFilterContext.GetContentFilter<Domain.Entities.Notification>();
        var notifications = await notificationRepository.GetAllAsync(requestModel, filter);
        return mapper.Map(notifications);
    }
}
