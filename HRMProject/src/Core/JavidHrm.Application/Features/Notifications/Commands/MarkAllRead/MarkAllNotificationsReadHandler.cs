using JavidHrm.Application.Contracts;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.Notifications.Commands;

public class MarkAllNotificationsReadHandler
    (INotificationRepository notificationRepository, ICurrentUserContext currentUserContext, IUnitOfWork uow)
    : IRequestHandler<MarkAllNotificationsReadRequest, OperationResult>
{
    public async Task<OperationResult> Handle(MarkAllNotificationsReadRequest request, CancellationToken cancellationToken)
    {
        var userId = request.UserId ?? currentUserContext.UserId;
        await notificationRepository.MarkAllVisibleAsReadAsync(userId, cancellationToken);
        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
