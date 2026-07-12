using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Entities;
using JavidHrm.Application.Models.Dtos;
using JavidHrm.Application.Models.Services;

namespace JavidHrm.Application.Contracts;

public interface IAccountingService
{
    Task<OperationResult<LogOutTokenResponseDto>> BlockTokenAsync(CheckTokenRequestDto request);
    Task<OperationResult<bool>> IsTokenBlockedAsync(CheckTokenRequestDto request);
    OperationResult<AccessTokenResponse> GenerateTokenAsync(User user, Guid sessionId);
    Task<OperationResult<AccessTokenResponse>> IssueTokenPairAsync(User user, UserSessionContext sessionContext, Guid? sessionId = null, CancellationToken cancellationToken = default);
    Task<OperationResult<AccessTokenResponse>> RefreshTokenAsync(string token, string refreshToken, CancellationToken cancellationToken = default);
    Task<NotificationSendResult> SendActivationCodeToPhoneAsync(string phoneNumber);
    Task<NotificationSendResult> SendActivationCodeToEmailAsync(string email);
    List<ForgetPasswordOptionDto> GetForgetPasswordOptionsByUser(User user);
    Task<bool> HasPermissionAsync(int userId, PermissionType permissionType);
}
