using JavidHrm.Common.Models;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Application.Services.ContentPolicies;
using JavidHrm.Domain.Dtos.ContentPolicies;

namespace JavidHrm.Application.Features.ContentPolicyRules.Commands;

public class CreateContentPolicyRuleHandler
    (
        IUnitOfWork uow,
        IContentPolicyRepository contentPolicyRepository,
        IContentPolicyRuleRepository contentPolicyRuleRepository,
        ContentPolicyRuleValidator ruleValidator,
        IContentPolicyCache contentPolicyCache)
    : IRequestHandler<CreateContentPolicyRuleRequest, OperationResult<CreateContentPolicyRuleResponse>>
{
    public async Task<OperationResult<CreateContentPolicyRuleResponse>> Handle(CreateContentPolicyRuleRequest request, CancellationToken cancellationToken)
    {
        var policy = await contentPolicyRepository.FindAsync(request.PolicyId, cancellationToken);
        if (policy is null)
            return OperationResult<CreateContentPolicyRuleResponse>.Fail();

        var ruleDto = new ContentPolicyRuleDto(
            request.FieldPath,
            request.Operator,
            request.ValueType,
            request.Value,
            request.SortOrder,
            request.RuleGroup);

        var errors = ruleValidator.ValidateRules(policy.EntityType, [ruleDto]);
        if (errors.Count > 0)
            return OperationResult<CreateContentPolicyRuleResponse>.Fail();

        var rule = ContentPolicyRule.CreateForPolicy(
            request.PolicyId,
            request.FieldPath,
            request.Operator,
            request.ValueType,
            request.Value,
            request.SortOrder,
            request.RuleGroup);

        contentPolicyRuleRepository.Add(rule);
        var saveResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveResult.IsSuccess)
            return OperationResult<CreateContentPolicyRuleResponse>.Fail();

        await contentPolicyCache.InvalidateAllAsync(cancellationToken);
        return new CreateContentPolicyRuleResponse { Id = rule.Id };
    }
}
