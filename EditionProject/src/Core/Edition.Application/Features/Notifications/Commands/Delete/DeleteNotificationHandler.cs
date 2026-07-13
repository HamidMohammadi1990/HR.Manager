using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.Notifications.Commands;

public class DeleteNotificationHandler
    (INotificationRepository notificationRepository, IUnitOfWork uow)
    : IRequestHandler<DeleteNotificationRequest, OperationResult>
{
    public async Task<OperationResult> Handle(DeleteNotificationRequest request, CancellationToken cancellationToken)
    {
        var notification = await notificationRepository.FindAsync(request.Id, cancellationToken);
        if (notification is null)
            return ErrorModel.Create("InvalidId");

        notificationRepository.Remove(notification);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
