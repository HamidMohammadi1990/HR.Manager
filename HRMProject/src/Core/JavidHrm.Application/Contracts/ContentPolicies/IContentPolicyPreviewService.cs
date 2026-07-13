using JavidHrm.Domain.Dtos.ContentPolicies;

namespace JavidHrm.Application.Contracts.ContentPolicies;

public interface IContentPolicyPreviewService
{
    Task<ContentPolicyPreviewResultDto?> PreviewAsync(
        PreviewContentPolicyRequestDto request,
        CancellationToken cancellationToken = default);

    Task<ContentPolicyMergeCompareResultDto?> CompareMergeAsync(
        CompareContentPolicyMergeRequestDto request,
        CancellationToken cancellationToken = default);
}
