using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.Banks.Queries;

public class GetBankHandler
    (IBankRepository bankRepository, IBankMapperService mapper)
    : IRequestHandler<GetBankRequest, OperationResult<GetBankResponse?>>
{
    public async Task<OperationResult<GetBankResponse?>> Handle(GetBankRequest request, CancellationToken cancellationToken)
    {
        var bank = await bankRepository.GetAsNoTrackingAsync(request.Id);
        if (bank is null)
            return ErrorModel.Create("InvalidId");

        var result = mapper.Map(bank);
        return result;
    }
}
