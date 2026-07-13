using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.Notifications.Commands;

public class MarkNotificationReadHandler
    (INotificationRepository notificationRepository, IUnitOfWork uow)
    : IRequestHandler<MarkNotificationReadRequest, OperationResult>
{
    public async Task<OperationResult> Handle(MarkNotificationReadRequest request, CancellationToken cancellationToken)
    {
        var notification = await notificationRepository.FindAsync(request.Id, cancellationToken);
        if (notification is null)
            return ErrorModel.Create("InvalidId");

        if (request.IsRead)
            notification.MarkAsRead();
        else
            notification.MarkAsUnread();

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
