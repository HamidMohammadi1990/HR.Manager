using JavidHrm.Common.Models;
using JavidHrm.Domain.Entities;

namespace JavidHrm.Application.Contracts;

public interface IAnnouncementDispatchService
{
    Task<OperationResult> DispatchInAppNotificationsAsync(
        Announcement announcement,
        CancellationToken cancellationToken = default);
}
