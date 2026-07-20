using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Dtos.Users;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Models.Dtos;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Features.Users.Queries;

namespace JavidHrm.Application.Mappings;

public class UserMapperService : IUserMapperService
{
    public GetAllUserRequestDto Map(GetAllUserRequest model)
    {
        return new GetAllUserRequestDto
        {
            Email = model.Email,
            CityId = model.CityId,
            Gender = model.Gender,
            IsActive = model.IsActive,
            LastName = model.LastName,
            UserName = model.UserName,
            FirstName = model.FirstName,
            Pagination = model.Pagination,
            PhoneNumber = model.PhoneNumber,
            LoginPermission = model.LoginPermission,
            EmailConfirmed = model.EmailConfirmed,
            PhoneNumberConfirmed = model.PhoneNumberConfirmed,
            Search = model.Search
        };
    }

    public GetUserResponse Map(User model, string? cityName = null)
    {
        return new GetUserResponse
        {
            Id = model.Id,
            Email = model.Email,
            Gender = model.Gender,
            UserName = model.UserName,
            FirstName = model.FirstName,
            LastName = model.LastName,
            PhoneNumber = model.PhoneNumber,
            CityId = model.CityId,
            CityName = cityName,
            IsActive = model.IsActive,
            LoginPermission = model.LoginPermission,
            LastLoginDateOnUtc = model.LastLoginDateOnUtc,
            EmailConfirmed = model.EmailConfirmed,
            PhoneNumberConfirmed = model.PhoneNumberConfirmed,
        };
    }

    public PagedResult<GetAllUserResponse> Map(PagedResult<GetAllUserDto> model)
    {
        var items = model
            .Items
            .Select(x => new GetAllUserResponse
            {
                Id = x.Id,
                Email = x.Email,
                CityId = x.CityId,
                CityName = x.CityName,
                FirstName = x.FirstName,
                LastName = x.LastName,
                Gender = x.Gender,
                UserName = x.UserName,
                IsActive = x.IsActive,
                PhoneNumber = x.PhoneNumber,
                EmailConfirmed = x.EmailConfirmed,
                LoginPermission = x.LoginPermission,
                AccessFailedCount = x.AccessFailedCount,
                LastLoginDateOnUtc = x.LastLoginDateOnUtc,
                PhoneNumberConfirmed = x.PhoneNumberConfirmed
            })
            .ToList();

        return PagedResult<GetAllUserResponse>.Create(items, model);
    }

    public GetForgetPasswordOptionResponse Map(string userName, List<ForgetPasswordOptionDto> options)
    {
        return new GetForgetPasswordOptionResponse
        {
            Options = options,
            Username = userName
        };
    }

    public UserNameCheckResponse Map(bool hasAccount, bool isPhoneNumber)
    {
        return new UserNameCheckResponse
        {
            HasAccount = hasAccount,
            IsPhoneNumber = isPhoneNumber
        };
    }
}