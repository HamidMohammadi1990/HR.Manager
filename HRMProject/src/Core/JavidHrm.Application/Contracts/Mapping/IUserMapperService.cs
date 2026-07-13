using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Dtos.Users;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Models.Dtos;
using JavidHrm.Application.Features.Users.Queries;

namespace JavidHrm.Application.Contracts.Mapping;

public interface IUserMapperService : IMapper
{
    GetUserResponse Map(User model);
    PagedResult<GetAllUserResponse> Map(PagedResult<GetAllUserDto> model);
    GetAllUserRequestDto Map(GetAllUserRequest model);
    GetForgetPasswordOptionResponse Map(string userName, List<ForgetPasswordOptionDto> options);
    UserNameCheckResponse Map(bool hasAccount, bool isPhoneNumber);
}