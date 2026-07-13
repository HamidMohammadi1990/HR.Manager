using JavidHrm.Application.Contracts;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;

namespace JavidHrm.Application.Features.Notifications.Commands;

public class DeleteReadNotificationsHandler
    (INotificationRepository notificationRepository, ICurrentUserContext currentUserContext)
    : IRequestHandler<DeleteReadNotificationsRequest, OperationResult>
{
    public async Task<OperationResult> Handle(DeleteReadNotificationsRequest request, CancellationToken cancellationToken)
    {
        var userId = request.UserId;
        if (!userId.HasValue && currentUserContext.IsAuthenticated)
            userId = currentUserContext.UserId;

        await notificationRepository.DeleteReadAsync(userId, cancellationToken);
        return OperationResult.Success();
    }
}
