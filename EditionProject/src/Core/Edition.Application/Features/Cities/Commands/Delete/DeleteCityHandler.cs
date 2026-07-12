using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.Cities.Commands;

public class DeleteCityHandler
    (ICityRepository cityRepository, IUnitOfWork uow)
    : IRequestHandler<DeleteCityRequest, OperationResult>
{
    public async Task<OperationResult> Handle(DeleteCityRequest request, CancellationToken cancellationToken)
    {
        var city = await cityRepository.FindAsync(request.Id);
        if (city is null)
            return ErrorModel.Create("InvalidId");

        city.DeActive();

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult;

        return OperationResult.Success();
    }
}