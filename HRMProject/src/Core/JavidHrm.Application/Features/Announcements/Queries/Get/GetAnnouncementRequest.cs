using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Announcements.Queries;

public record GetAnnouncementRequest : IRequest<OperationResult<GetAnnouncementResponse?>>
{
    [JsonConverter(typeof(AnnouncementEncryptor))]
    public int Id { get; init; }
}
