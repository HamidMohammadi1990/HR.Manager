using JavidHrm.Common.Models;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.Banks.Commands;

public class CreateBankHandler
    (IUnitOfWork uow, IBankRepository bankRepository, IBankMapperService mapper)
    : IRequestHandler<CreateBankRequest, OperationResult<CreateBankResponse>>
{
    public async Task<OperationResult<CreateBankResponse>> Handle(CreateBankRequest request, CancellationToken cancellationToken)
    {
        var bank = new Bank
        {
            Icon = request.Icon,
            Title = request.Title,
            IsActive = request.IsActive
        };

        bankRepository.Add(bank);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult.ToGenericFailure<CreateBankResponse>();

        return new CreateBankResponse { Id = bank.Id };
    }
}
