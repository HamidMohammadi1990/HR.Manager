using JavidHrm.Common.Models;
using JavidHrm.Domain.Entities;
using JavidHrm.Common.Extensions;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;
using JavidHrm.Application.Contracts.Infrastructure;

namespace JavidHrm.Application.Features.Users.Commands;

public class RegisterUserHandler
    : IRequestHandler<RegisterUserRequest, OperationResult>
{
    private readonly IUnitOfWork uow;
    private readonly ISmsService smsService;
    private readonly IEmailService emailService;
    private readonly IUserRepository userRepository;

    public RegisterUserHandler(
        IUnitOfWork uow,
        ISmsService smsService,
        IEmailService emailService,
        IUserRepository userRepository)
    {
        this.uow = uow;
        this.smsService = smsService;
        this.emailService = emailService;
        this.userRepository = userRepository;
    }

    public async Task<OperationResult> Handle(RegisterUserRequest request, CancellationToken cancellationToken)
    {
        var isExistsUser = await userRepository.VerifyRepeatPhoneAsync(request.UserName);
        if (isExistsUser)
            return ErrorModel.Create("UserNameIsNotValid");

        var isMobile = request.UserName.IsMobile();
        var verifyTokenResult = isMobile
            ? await smsService.VerifyTokenAsync(request.Token, request.UserName)
            : await emailService.VerifyTokenAsync(request.Token, request.UserName);

        if (!verifyTokenResult)
            return ErrorModel.Create("VerificationCodeIsNotValid");

        var user = User.Create(request.UserName, isMobile ? null : request.UserName, isMobile ? request.UserName : null);

        if (isMobile)
            user.ConfirmPhoneNumber();

        if (!isMobile)
            user.ConfirmEmail();

        userRepository.Add(user);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult;

        return OperationResult.Success();
    }
}