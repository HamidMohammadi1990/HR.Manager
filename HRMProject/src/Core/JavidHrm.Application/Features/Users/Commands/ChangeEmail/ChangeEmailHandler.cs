using JavidHrm.Common.Models;
using JavidHrm.Common.Extensions;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts;
using JavidHrm.Application.Contracts.Persistence;
using JavidHrm.Application.Contracts.Infrastructure;

namespace JavidHrm.Application.Features.Users.Commands;

public class ChangeEmailHandler
    : IRequestHandler<ChangeEmailRequest, OperationResult>
{
    private readonly IUnitOfWork uow;
    private readonly IEmailService emailService;
    private readonly IUserRepository userRepository;
    private readonly ICurrentUserContext currentUser;

    public ChangeEmailHandler(
        IUnitOfWork uow,
        IEmailService emailService,
        IUserRepository userRepository,
        ICurrentUserContext currentUser)
    {
        this.uow = uow;
        this.emailService = emailService;
        this.userRepository = userRepository;
        this.currentUser = currentUser;
    }

    public async Task<OperationResult> Handle(ChangeEmailRequest request, CancellationToken cancellationToken)
    {
        var existOtherUser = await userRepository.VerifyRepeatEmailAsync(request.Email);
        if (existOtherUser)
            return ErrorModel.Create("EmailIsUsedByAnotherUser");

        var isConfirm = await emailService.VerifyTokenAsync(request.Token, request.Email);
        if (!isConfirm)
            return ErrorModel.Create("ActivationCodeIsNotCorrect");

        var userId = currentUser.UserId;
        var user = await userRepository.FindAsync(userId, cancellationToken);
        if (user is null)
            return ErrorModel.Create("UserNotFound");

        user.UpdateEmail(request.Email);
        user.ConfirmEmail();

        if (user.UserName.IsEmail())
            user.UpdateUserName(request.Email);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult;

        return OperationResult.Success();
    }
}