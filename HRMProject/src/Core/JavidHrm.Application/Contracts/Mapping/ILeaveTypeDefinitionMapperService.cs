using JavidHrm.Application.Features.LeaveTypeDefinitions.Queries;
using JavidHrm.Domain.Dtos.LeaveTypeDefinitions;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;

namespace JavidHrm.Application.Contracts.Mapping;

public interface ILeaveTypeDefinitionMapperService : IMapper
{
    GetAllLeaveTypeDefinitionRequestDto Map(GetAllLeaveTypeDefinitionRequest model);
    SearchLeaveTypeDefinitionRequestDto Map(SearchLeaveTypeDefinitionRequest model);
    GetLeaveTypeDefinitionResponse Map(LeaveTypeDefinition model);
    PagedResult<GetAllLeaveTypeDefinitionResponse> Map(PagedResult<GetAllLeaveTypeDefinitionResponseDto> model);
    PagedResult<SearchLeaveTypeDefinitionResponse> Map(PagedResult<SearchLeaveTypeDefinitionResponseDto> model);
}
