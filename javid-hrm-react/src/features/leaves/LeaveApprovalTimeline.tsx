import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { getPersonName } from '@/lib/hrLabels';
import type { LeaveRequestApprovalStepDto } from '@/services/api';

const APPROVAL_STEP_STATUS = {
  Pending: 1,
  Approved: 2,
  Rejected: 3,
  Skipped: 4,
} as const;

const APPROVAL_STEP_STATUS_LABELS: Record<number, string> = {
  [APPROVAL_STEP_STATUS.Pending]: 'در انتظار',
  [APPROVAL_STEP_STATUS.Approved]: 'تأیید شده',
  [APPROVAL_STEP_STATUS.Rejected]: 'رد شده',
  [APPROVAL_STEP_STATUS.Skipped]: 'رد شده (باقی‌مانده)',
};

function stepBadgeVariant(status: number) {
  if (status === APPROVAL_STEP_STATUS.Approved) return 'success' as const;
  if (status === APPROVAL_STEP_STATUS.Rejected) return 'secondary' as const;
  if (status === APPROVAL_STEP_STATUS.Skipped) return 'secondary' as const;
  return 'alert' as const;
}

function getApproverLabel(step: LeaveRequestApprovalStepDto) {
  if (step.IsHrPool) return 'واحد منابع انسانی';
  const name = getPersonName(step.ApproverFirstName, step.ApproverLastName);
  if (step.ApproverJobTitle) return `${name} — ${step.ApproverJobTitle}`;
  return name || '—';
}

function formatActionDate(iso?: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleString('fa-IR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatApprovalProgress(
  currentStep?: number | null,
  totalSteps?: number | null,
) {
  if (!totalSteps || totalSteps <= 0) return null;
  if (!currentStep) return `تکمیل ${totalSteps} مرحله`;
  return `مرحله ${currentStep} از ${totalSteps}`;
}

interface LeaveApprovalTimelineProps {
  steps: LeaveRequestApprovalStepDto[];
  className?: string;
}

export function LeaveApprovalTimeline({ steps, className = '' }: LeaveApprovalTimelineProps) {
  if (!steps.length) {
    return (
      <p className={`text-muted-foreground text-sm ${className}`}>
        گردش تأیید چندمرحله‌ای برای این درخواست ثبت نشده است.
      </p>
    );
  }

  return (
    <ol className={`space-y-0 ${className}`}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const isCurrent = step.IsCurrent;

        return (
          <li key={step.StepOrder} className="relative flex gap-3 pb-5 last:pb-0">
            {!isLast && (
              <span
                className={`absolute start-[11px] top-6 bottom-0 w-px ${
                  step.Status === APPROVAL_STEP_STATUS.Approved
                    ? 'bg-emerald-500/40'
                    : 'bg-border'
                }`}
              />
            )}
            <span
              className={`relative z-10 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 ${
                step.Status === APPROVAL_STEP_STATUS.Approved
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : step.Status === APPROVAL_STEP_STATUS.Rejected
                    ? 'border-red-500 bg-red-500 text-white'
                    : isCurrent
                      ? 'border-amber-500 bg-amber-500 text-white'
                      : 'border-muted-foreground/30 bg-background text-muted-foreground'
              }`}
            >
              {step.Status === APPROVAL_STEP_STATUS.Approved ? (
                <Icon name="material-symbols:check" className="size-3.5" />
              ) : step.Status === APPROVAL_STEP_STATUS.Rejected ? (
                <Icon name="material-symbols:close" className="size-3.5" />
              ) : (
                <span className="text-[10px] font-bold">{step.StepOrder}</span>
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">{getApproverLabel(step)}</span>
                <Badge variant={stepBadgeVariant(step.Status)} className="text-xs">
                  {APPROVAL_STEP_STATUS_LABELS[step.Status] ?? step.Status}
                </Badge>
                {isCurrent && (
                  <Badge variant="alert" className="text-xs">
                    مرحله جاری
                  </Badge>
                )}
              </div>
              {step.Comment && (
                <p className="text-muted-foreground mt-1 text-sm">{step.Comment}</p>
              )}
              {step.ActionedAtUtc && (
                <p className="text-muted-foreground mt-1 text-xs">
                  {formatActionDate(step.ActionedAtUtc)}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
