import type { LeaveRequestDto } from '@/services/api';

export const LEAVE_STATUS = { Pending: 1, Approved: 2, Rejected: 3 } as const;

export const LEAVE_APPROVAL_STEP_STATUS = {
  Pending: 1,
  Approved: 2,
  Rejected: 3,
  Skipped: 4,
} as const;

type LeaveRequestModifiableFields = Pick<
  LeaveRequestDto,
  'Status' | 'CurrentApprovalStepOrder' | 'TotalApprovalSteps' | 'ApprovalSteps'
>;

/** Editable only while pending and before any approval step is completed */
export function canModifyLeaveRequest(request: LeaveRequestModifiableFields): boolean {
  if (request.Status !== LEAVE_STATUS.Pending) return false;

  if (
    request.TotalApprovalSteps != null &&
    request.CurrentApprovalStepOrder != null &&
    request.CurrentApprovalStepOrder > 1
  ) {
    return false;
  }

  if (
    request.ApprovalSteps?.some(
      (step) => step.Status === LEAVE_APPROVAL_STEP_STATUS.Approved,
    )
  ) {
    return false;
  }

  return true;
}
