using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Application.Services.ContentPolicies;
using JavidHrm.Domain.Dtos.ContentPolicies;

namespace JavidHrm.Application.Features.ContentPolicyRules.Commands;

public class UpdateContentPolicyRuleHandler
    (
        IUnitOfWork uow,
        IContentPolicyRuleRepository contentPolicyRuleRepository,
        ContentPolicyRuleValidator ruleValidator,
        IContentPolicyCache contentPolicyCache)
    : IRequestHandler<UpdateContentPolicyRuleRequest, OperationResult>
{
    public async Task<OperationResult> Handle(UpdateContentPolicyRuleRequest request, CancellationToken cancellationToken)
    {
        var rule = await contentPolicyRuleRepository.FindWithPolicyAsync(request.Id, cancellationToken);
        if (rule is null)
            return OperationResult.Fail();

        var ruleDto = new ContentPolicyRuleDto(
            request.FieldPath,
            request.Operator,
            request.ValueType,
            request.Value,
            request.SortOrder,
            request.RuleGroup);

        var errors = ruleValidator.ValidateRules(rule.Policy.EntityType, [ruleDto]);
        if (errors.Count > 0)
            return OperationResult.Fail();

        rule.Update(
            request.FieldPath,
            request.Operator,
            request.ValueType,
            request.Value,
            request.SortOrder,
            request.RuleGroup);

        var saveResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveResult.IsSuccess)
            return OperationResult.Fail();

        await contentPolicyCache.InvalidateAllAsync(cancellationToken);
        return OperationResult.Success();
    }
}
