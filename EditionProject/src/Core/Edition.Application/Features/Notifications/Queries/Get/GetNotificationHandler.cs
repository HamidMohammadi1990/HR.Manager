using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.Notifications.Queries;

public class GetNotificationHandler
    (INotificationRepository notificationRepository, IUserRepository userRepository, INotificationMapperService mapper)
    : IRequestHandler<GetNotificationRequest, OperationResult<GetNotificationResponse?>>
{
    public async Task<OperationResult<GetNotificationResponse?>> Handle(GetNotificationRequest request, CancellationToken cancellationToken)
    {
        var notification = await notificationRepository.GetAsNoTrackingAsync(request.Id, cancellationToken);
        if (notification is null)
            return ErrorModel.Create("InvalidId");

        var user = await userRepository.GetAsNoTrackingAsync(notification.UserId, cancellationToken);
        if (user is null)
            return ErrorModel.Create("InvalidId");

        return mapper.Map(notification, user);
    }
}
