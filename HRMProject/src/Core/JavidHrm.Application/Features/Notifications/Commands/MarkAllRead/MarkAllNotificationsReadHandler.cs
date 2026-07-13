using JavidHrm.Application.Contracts;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;

namespace JavidHrm.Application.Features.Notifications.Commands;

public class MarkAllNotificationsReadHandler
    (INotificationRepository notificationRepository, ICurrentUserContext currentUserContext)
    : IRequestHandler<MarkAllNotificationsReadRequest, OperationResult>
{
    public async Task<OperationResult> Handle(MarkAllNotificationsReadRequest request, CancellationToken cancellationToken)
    {
        var userId = request.UserId ?? currentUserContext.UserId;
        await notificationRepository.MarkAllAsReadAsync(userId, cancellationToken);
        return OperationResult.Success();
    }
}
