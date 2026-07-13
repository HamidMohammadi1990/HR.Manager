using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Announcements.Commands;

public record CreateAnnouncementResponse
{
    [JsonConverter(typeof(AnnouncementEncryptor))]
    public int Id { get; init; }
}
