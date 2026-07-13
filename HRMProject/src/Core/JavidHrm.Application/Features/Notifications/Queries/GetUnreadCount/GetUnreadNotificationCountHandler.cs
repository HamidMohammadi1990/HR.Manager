using JavidHrm.Application.Contracts;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;

namespace JavidHrm.Application.Features.Notifications.Queries;

public class GetUnreadNotificationCountHandler
    (INotificationRepository notificationRepository, ICurrentUserContext currentUserContext)
    : IRequestHandler<GetUnreadNotificationCountRequest, OperationResult<GetUnreadNotificationCountResponse>>
{
    public async Task<OperationResult<GetUnreadNotificationCountResponse>> Handle(
        GetUnreadNotificationCountRequest request,
        CancellationToken cancellationToken)
    {
        var userId = request.UserId ?? currentUserContext.UserId;
        var count = await notificationRepository.CountUnreadAsync(userId, cancellationToken);
        return new GetUnreadNotificationCountResponse { UnreadCount = count };
    }
}
