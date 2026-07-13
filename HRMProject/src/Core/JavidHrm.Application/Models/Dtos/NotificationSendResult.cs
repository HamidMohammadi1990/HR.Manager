using JavidHrm.Common.Models;

namespace JavidHrm.Application.Models.Dtos;

public record NotificationSendResult
{
    public bool SuccessSent { get; set; }
    public bool AlreadySend { get; set; }
    public ErrorModel? Message { get; set; }
}