using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.Provinces.Commands;

public class DeleteProvinceHandler
    (IProvinceRepository provinceRepository, IUnitOfWork uow)
    : IRequestHandler<DeleteProvinceRequest, OperationResult>
{
    public async Task<OperationResult> Handle(DeleteProvinceRequest request, CancellationToken cancellationToken)
    {
        var province = await provinceRepository.FindAsync(request.Id);
        if (province is null)
            return ErrorModel.Create("InvalidId");

        province.DeActive();

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult;

        return OperationResult.Success();
    }
}