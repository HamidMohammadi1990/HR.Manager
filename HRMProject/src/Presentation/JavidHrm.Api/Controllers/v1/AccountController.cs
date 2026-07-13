using MediatR;
using Asp.Versioning;
using JavidHrm.Common.Models;
using JavidHrm.Api.Extensions;
using JavidHrm.WebFramework.Api;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using JavidHrm.Application.Features.Users.Queries;
using JavidHrm.Application.Features.Users.Commands;
using JavidHrm.Application.Features.RefreshTokens.Commands;
using JavidHrm.Application.Features.UserSessions.Commands;
using JavidHrm.Application.Features.UserSessions.Queries;

using JavidHrm.Api.Attributes;
using JavidHrm.Common.Enums;

namespace JavidHrm.Api.Controllers.v1;

/// <summary>
/// Management User Account
/// </summary>
[ApiVersion("1")]
[ControllerName("account")]
[ApiControllerCategory(ApiControllerCategory.Authentication)]
public class AccountController
    (ISender mediator, IHttpContextAccessor httpContextAccessor)
    : BaseApiController
{
    [HttpPost("sign-in")]
    public async Task<ApiResult<SignInUserResponse>> SignIn(SignInUserRequest request)
        => await mediator.Send(request);

    [HttpPost("sign-in-by-phone-number")]
    public async Task<ApiResult<SignInUserResponse>> GetTokenByPhoneNumber(SignInUserByPhoneNumberRequest request)
        => await mediator.Send(request);

    [HttpPost("get-phone-number-token")]
    public async Task<ApiResult<SendPhoneNumberTokenResponse>> GetPhoneNumberToken(SendPhoneNumberTokenRequest request)
        => await mediator.Send(request);

    [HttpPost("get-email-token")]
    public async Task<ApiResult<SendEmailTokenResponse>> GetEmailToken(SendEmailTokenRequest request)
        => await mediator.Send(request);

    [Authorize]
    [HttpGet("active-sessions")]
    public async Task<ApiResult<List<GetActiveUserSessionResponse>>> GetActiveSessions()
        => await mediator.Send(new GetActiveUserSessionsRequest());

    [Authorize]
    [HttpDelete("session")]
    public async Task<ApiResult<OperationResult>> RevokeSession(RevokeUserSessionRequest request)
        => await mediator.Send(request);

    [Authorize]
    [HttpDelete("other-sessions")]
    public async Task<ApiResult<OperationResult>> RevokeOtherSessions()
        => await mediator.Send(new RevokeOtherUserSessionsRequest());

    [Authorize]
    [HttpGet("sign-out")]
    public async Task<ApiResult<bool>> SignOut()
        => await mediator.Send(new SignOutUserRequest(httpContextAccessor.GetJwtToken()));

    [HttpPost("refresh-token")]
    public async Task<ApiResult<GenerateRefreshTokenResponse>> RefreshToken(GenerateRefreshTokenRequest request)
        => await mediator.Send(request);

    [HttpPost("register")]
    public async Task<ApiResult<OperationResult>> Register(RegisterUserRequest request)
        => await mediator.Send(request);

    [Authorize]    
    [HttpPost("is-authenticated")]
    public ApiResult<bool> IsAuthenticated()
        => true;

    [HttpPost("user-check")]
    public async Task<ApiResult<UserNameCheckResponse>> UserNameCheck(UserNameCheckRequest request)
         => await mediator.Send(request);

    [Authorize]
    [HttpPost("user-info")]    
    public async Task<ApiResult<GetUserResponse?>> UserInfo(GetUserRequest request)
        => await mediator.Send(request);

    [HttpPost("forget-password-options")]
    public async Task<ApiResult<GetForgetPasswordOptionResponse>> GetForgetPasswordOptions(GetForgetPasswordOptionRequest request)
        => await mediator.Send(request);

    [HttpPost("forget-password")]
    public async Task<ApiResult<ForgetPasswordResponse>> SendForgetPassword(ForgetPasswordRequest request)
        => await mediator.Send(request);

    [Authorize]
    [HttpPost("change-password")]
    public async Task<ApiResult<SignInUserResponse>> ChangePassword(ChangePasswordByOldPasswordRequest request)
        => await mediator.Send(request);

    [HttpPost("change-password-by-token")]
    public async Task<ApiResult<ChangePasswordByTokenResponse>> ChangePasswordByToken(ChangePasswordByTokenRequest request)
        => await mediator.Send(request);

    [Authorize]
    [HttpPost("change-email")]
    public async Task<ApiResult<OperationResult>> ChangeEmail(ChangeEmailRequest request)
        => await mediator.Send(request);

    [Authorize]
    [HttpPost("change-phone-number")]
    public async Task<ApiResult<OperationResult>> ChangePhoneNumber(ChangePhoneNumberRequest request)
        => await mediator.Send(request);
}