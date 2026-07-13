using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Announcements.Commands;

public record DeleteAnnouncementRequest : IRequest<OperationResult>
{
    [JsonConverter(typeof(AnnouncementEncryptor))]
    public int Id { get; init; }
}
