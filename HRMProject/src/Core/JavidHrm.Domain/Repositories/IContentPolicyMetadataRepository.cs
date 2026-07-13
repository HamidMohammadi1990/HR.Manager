using JavidHrm.Domain.Dtos.ContentPolicies;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Domain.Repositories;

public interface IContentPolicyMetadataRepository
{
    IReadOnlyList<ContentPolicyEntityTypeOptionDto> GetEntityTypes();
    IReadOnlyList<ContentPolicySchemaPropertyDto> GetEntitySchema(GetContentPolicyEntitySchemaRequestDto request);
    IReadOnlyList<ContentPolicyOperator> GetAllowedOperators(GetContentPolicyPropertyOperatorsRequestDto request);
    IReadOnlyList<ContentPolicyContextPathDto> GetContextPaths();
    ContentPolicyRuleValidationResultDto ValidateRules(ValidateContentPolicyRulesRequestDto request);
}
