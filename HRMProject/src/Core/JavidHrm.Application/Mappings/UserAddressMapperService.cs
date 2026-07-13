using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Dtos.UserAddresses;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Features.UserAddresses.Queries;

namespace JavidHrm.Application.Mappings;

public class UserAddressMapperService : IUserAddressMapperService
{
    public GetUserAddressResponse Map(UserAddress model)
    {
        return new GetUserAddressResponse
        {
            Id = model.Id,
            Title = model.Title,
            UserId = model.UserId,
            CityId = model.CityId,
            Address = model.Address,
            PostalCode = model.PostalCode,
            PhoneNumber = model.PhoneNumber,
            RecipientFirstName = model.RecipientFirstName,
            RecipientLastName = model.RecipientLastName
        };
    }

    public GetUserAddressesRequestDto Map(GetUserAddressesRequest model, int userId)
    {
        return new GetUserAddressesRequestDto
        {
            Title = model.Title,
            CityId = model.CityId,
            UserId = userId,
            IsActive = model.IsActive,
            PostalCode = model.PostalCode,
            Pagination = model.Pagination
        };
    }

    public GetAllUserAddressRequestDto Map(GetAllUserAddressRequest model)
    {
        return new GetAllUserAddressRequestDto
        {
            Title = model.Title,
            UserId = model.UserId,
            CityId = model.CityId,
            IsActive = model.IsActive,
            PostalCode = model.PostalCode,
            Pagination = model.Pagination,
        };
    }

    public PagedResult<GetAllUserAddressResponse> Map(PagedResult<GetAllUserAddressDto> model)
    {
        var items = model
            .Items
            .Select(x => new GetAllUserAddressResponse
            {
                Id = x.Id,
                Title = x.Title,
                UserId = x.UserId,
                CityId = x.CityId,
                Address = x.Address,
                CityName = x.CityName,
                UserName = x.UserName,
                UserFirstName = x.UserFirstName,
                UserLastName = x.UserLastName,
                PostalCode = x.PostalCode,
                PhoneNumber = x.PhoneNumber,
                RecipientLastName = x.RecipientLastName,
                RecipientFirstName = x.RecipientFirstName
            })
            .ToList();

        return PagedResult<GetAllUserAddressResponse>.Create(items, model);
    }

    public PagedResult<GetUserAddressesResponse> Map(PagedResult<GetUserAddressDto> model)
    {
        var items = model
            .Items
            .Select(x => new GetUserAddressesResponse
            {
                Id = x.Id,
                Title = x.Title,
                UserId = x.UserId,
                CityId = x.CityId,
                Address = x.Address,
                CityName = x.CityName,
                PostalCode = x.PostalCode,
                PhoneNumber = x.PhoneNumber,
                RecipientLastName = x.RecipientLastName,
                RecipientFirstName = x.RecipientFirstName
            })
            .ToList();

        return PagedResult<GetUserAddressesResponse>.Create(items, model);
    }
}