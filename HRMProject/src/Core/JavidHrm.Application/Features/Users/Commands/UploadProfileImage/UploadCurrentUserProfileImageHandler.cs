using JavidHrm.Application.Common.Utilities;
using JavidHrm.Application.Common.Utilities.Contracts;
using JavidHrm.Application.Contracts;
using JavidHrm.Application.Contracts.Persistence;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using MediatR;

namespace JavidHrm.Application.Features.Users.Commands;

public class UploadCurrentUserProfileImageHandler(
    IUserRepository userRepository,
    IUnitOfWork uow,
    ICurrentUserContext currentUser,
    ILocalFileService localFileService)
    : IRequestHandler<UploadCurrentUserProfileImageRequest, OperationResult<UploadProfileImageResponse>>
{
    private const string UploadDirectory = "wwwroot/uploads/avatars";
    private const string PublicUrlPrefix = "/uploads/avatars";
    private const long MaxFileSizeBytes = 2 * 1024 * 1024;

    public async Task<OperationResult<UploadProfileImageResponse>> Handle(
        UploadCurrentUserProfileImageRequest request,
        CancellationToken cancellationToken = default)
    {
        var file = request.File;
        if (file is null || file.Length == 0)
            return ErrorModel.Create("InvalidFile");

        if (file.Length > MaxFileSizeBytes)
            return ErrorModel.CreateLiteral("FileTooLarge", "حداکثر حجم تصویر ۲ مگابایت است.");

        if (!FileValidation.IsValidImageFile(file.FileName))
            return ErrorModel.Create("InvalidFileExtension");

        var userId = currentUser.UserId;
        if (userId <= 0)
            return ErrorModel.Create("AccessDenied");

        var user = await userRepository.FindAsync(userId, cancellationToken);
        if (user is null)
            return ErrorModel.Create("UserNotFound");

        TryDeleteExistingImage(user.ProfileImageUrl);

        var saveResult = await localFileService.SaveFileAsync(file, UploadDirectory);
        if (!saveResult.IsSuccess || string.IsNullOrWhiteSpace(saveResult.Result))
            return ErrorModel.Create("InvalidFile");

        var publicUrl = $"{PublicUrlPrefix}/{saveResult.Result}";
        user.SetProfileImageUrl(publicUrl);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult.ToGenericFailure<UploadProfileImageResponse>();

        return new UploadProfileImageResponse { ProfileImageUrl = publicUrl };
    }

    private void TryDeleteExistingImage(string? profileImageUrl)
    {
        if (string.IsNullOrWhiteSpace(profileImageUrl))
            return;

        var fileName = Path.GetFileName(profileImageUrl);
        if (string.IsNullOrWhiteSpace(fileName))
            return;

        localFileService.DeleteFile(UploadDirectory, fileName);
    }
}
