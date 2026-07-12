using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.Banks.Commands;

public class UpdateBankHandler
    (IBankRepository bankRepository, IUnitOfWork uow, IBankMapperService mapper)
    : IRequestHandler<UpdateBankRequest, OperationResult>
{
    public async Task<OperationResult> Handle(UpdateBankRequest request, CancellationToken cancellationToken)
    {
        var bank = await bankRepository.FindAsync(request.Id);
        if (bank is null)
            return ErrorModel.Create("InvalidId");

        bank.Title = request.Title;
        bank.Icon = request.Icon;
        bank.IsActive = request.IsActive;

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult;

        return OperationResult.Success();
    }
}
