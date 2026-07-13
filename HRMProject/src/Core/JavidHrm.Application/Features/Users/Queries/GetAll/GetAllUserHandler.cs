using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Application.Common.Extensions;

namespace JavidHrm.Application.Features.Users.Queries.GetAll;

public class GetAllUserHandler
    (IUserRepository userRepository, IUserMapperService mapper, IContentPolicyFilterContext contentPolicyFilterContext)
    : IRequestHandler<GetAllUserRequest, OperationResult<PagedResult<GetAllUserResponse>>>
{
    public async Task<OperationResult<PagedResult<GetAllUserResponse>>> Handle(GetAllUserRequest request, CancellationToken cancellationToken)
    {
        var requestModel = mapper.Map(request);
        var filter = contentPolicyFilterContext.GetContentFilter<Domain.Entities.User>();
        var users = await userRepository.GetAllAsync(requestModel, filter);
        var result = mapper.Map(users);
        return result;
    }
}