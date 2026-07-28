using JavidHrm.Application.Contracts;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.Notifications.Commands;

public class DeleteReadNotificationsHandler
    (INotificationRepository notificationRepository, ICurrentUserContext currentUserContext, IUnitOfWork uow)
    : IRequestHandler<DeleteReadNotificationsRequest, OperationResult>
{
    public async Task<OperationResult> Handle(DeleteReadNotificationsRequest request, CancellationToken cancellationToken)
    {
        var userId = request.UserId;
        if (!userId.HasValue && currentUserContext.IsAuthenticated)
            userId = currentUserContext.UserId;

        if (!userId.HasValue)
            return OperationResult.Success();

        await notificationRepository.DeleteVisibleReadAsync(userId.Value, cancellationToken);
        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
