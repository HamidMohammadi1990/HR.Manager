using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Dtos.ContentPolicies;

namespace JavidHrm.Application.Features.ContentPolicyRules.Queries;

public class GetAllContentPolicyRuleHandler
    (IContentPolicyRuleRepository contentPolicyRuleRepository)
    : IRequestHandler<GetAllContentPolicyRuleRequest, OperationResult<PagedResult<GetAllContentPolicyRuleResponse>>>
{
    public async Task<OperationResult<PagedResult<GetAllContentPolicyRuleResponse>>> Handle(GetAllContentPolicyRuleRequest request, CancellationToken cancellationToken)
    {
        var dto = new GetAllContentPolicyRuleRequestDto
        {
            PolicyId = request.PolicyId,
            EntityType = request.EntityType,
            FieldPath = request.FieldPath,
            Operator = request.Operator,
            ValueType = request.ValueType,
            RuleGroup = request.RuleGroup,
            Pagination = request.Pagination
        };

        var rules = await contentPolicyRuleRepository.GetAllAsync(dto, cancellationToken);
        var items = rules.Items
            .Select(x => new GetAllContentPolicyRuleResponse
            {
                Id = x.Id,
                Value = x.Value,
                PolicyId = x.PolicyId,
                Operator = x.Operator,
                FieldPath = x.FieldPath,
                ValueType = x.ValueType,
                SortOrder = x.SortOrder,
                RuleGroup = x.RuleGroup,
                PolicyName = x.Policy.Name,
                EntityType = x.Policy.EntityType
            })
            .ToList();

        return PagedResult<GetAllContentPolicyRuleResponse>.Create(items, rules);
    }
}
