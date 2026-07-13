using JavidHrm.Common.Models;
using JavidHrm.Common.Extensions;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts;
using JavidHrm.Application.Contracts.Persistence;
using JavidHrm.Application.Contracts.Infrastructure;

namespace JavidHrm.Application.Features.Users.Commands;

public class ChangePhoneNumberHandler
    : IRequestHandler<ChangePhoneNumberRequest, OperationResult>
{
    private readonly IUnitOfWork uow;
    private readonly ISmsService smsService;
    private readonly IUserRepository userRepository;
    private readonly ICurrentUserContext currentUser;

    public ChangePhoneNumberHandler(
        IUnitOfWork uow,
        ISmsService smsService,
        IUserRepository userRepository,
        ICurrentUserContext currentUser)
    {
        this.uow = uow;
        this.smsService = smsService;
        this.userRepository = userRepository;
        this.currentUser = currentUser;
    }

    public async Task<OperationResult> Handle(ChangePhoneNumberRequest request, CancellationToken cancellationToken)
    {
        var existOtherUser = await userRepository.VerifyRepeatPhoneAsync(request.PhoneNumber);
        if (existOtherUser)
            return ErrorModel.Create("MobileIsUsedByAnotherUser");

        var isConfirm = await smsService.VerifyTokenAsync(request.Token, request.PhoneNumber);
        if (!isConfirm)
            return ErrorModel.Create("ActivationCodeIsNotCorrect");

        var userId = currentUser.UserId;
        var user = await userRepository.FindAsync(userId, cancellationToken);
        if (user is null)
            return ErrorModel.Create("UserNotFound");

        user.UpdatePhoneNumber(request.PhoneNumber);
        user.ConfirmPhoneNumber();

        if (user.UserName.IsMobile())
            user.UpdateUserName(request.PhoneNumber);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult;

        return OperationResult.Success();
    }
}