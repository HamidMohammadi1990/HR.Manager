using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.Notifications.Commands;

public class CreateNotificationHandler
    (IUnitOfWork uow, INotificationRepository notificationRepository)
    : IRequestHandler<CreateNotificationRequest, OperationResult<CreateNotificationResponse>>
{
    public async Task<OperationResult<CreateNotificationResponse>> Handle(CreateNotificationRequest request, CancellationToken cancellationToken)
    {
        var notification = Domain.Entities.Notification.Create(
            request.UserId,
            request.Title.Trim(),
            request.Message.Trim(),
            request.Type,
            request.LinkPath?.Trim(),
            request.IconName?.Trim());

        notificationRepository.Add(notification);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult.ToGenericFailure<CreateNotificationResponse>();

        return new CreateNotificationResponse { Id = notification.Id };
    }
}
