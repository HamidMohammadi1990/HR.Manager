using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.Banks.Commands;

public class DeleteBankHandler
    (IBankRepository bankRepository, IUnitOfWork uow, IBankMapperService mapper)
    : IRequestHandler<DeleteBankRequest, OperationResult>
{
    public async Task<OperationResult> Handle(DeleteBankRequest request, CancellationToken cancellationToken)
    {
        var bank = await bankRepository.FindAsync(request.Id);
        if (bank is null)
            return ErrorModel.Create("InvalidId");

        bankRepository.Remove(bank);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult;

        return OperationResult.Success();
    }
}
