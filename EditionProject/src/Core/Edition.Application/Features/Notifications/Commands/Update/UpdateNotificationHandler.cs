using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.Notifications.Commands;

public class UpdateNotificationHandler
    (INotificationRepository notificationRepository, IUnitOfWork uow)
    : IRequestHandler<UpdateNotificationRequest, OperationResult>
{
    public async Task<OperationResult> Handle(UpdateNotificationRequest request, CancellationToken cancellationToken)
    {
        var notification = await notificationRepository.FindAsync(request.Id, cancellationToken);
        if (notification is null)
            return ErrorModel.Create("InvalidId");

        notification.Update(
            request.UserId,
            request.Title.Trim(),
            request.Message.Trim(),
            request.Type,
            request.LinkPath?.Trim(),
            request.IconName?.Trim());

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
