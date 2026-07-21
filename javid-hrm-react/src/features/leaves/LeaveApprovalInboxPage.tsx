import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Avatar,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  MetricCard,
  PageHeader,
} from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Textarea } from '@/components/ui/Textarea';
import { Dialog } from '@/components/layout/Dialog';
import { useDisclosure } from '@/hooks';
import {
  approveLeaveRequest,
  getApiErrorMessage,
  getLeaveApprovalInbox,
  getLeaveRequest,
  rejectLeaveRequest,
  type LeaveApprovalInboxItemDto,
  type LeaveRequestDto,
} from '@/services/api';
import { LEAVE_TYPE_UNIT_HOUR, getPersonName } from '@/lib/hrLabels';
import { formatApprovalProgress, LeaveApprovalTimeline } from '@/features/leaves/LeaveApprovalTimeline';

const PAGE_SIZE = 10;

function getPersonLabel(item: Pick<LeaveApprovalInboxItemDto, 'UserFirstName' | 'UserLastName' | 'EmployeeCode'>) {
  return getPersonName(item.UserFirstName, item.UserLastName, item.EmployeeCode);
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]![0]}${parts[1]![0]}`;
  return name.slice(0, 2) || '—';
}

function isHourlyLeaveUnit(unit: number) {
  return unit === LEAVE_TYPE_UNIT_HOUR;
}

function formatDateFa(iso: string) {
  return new Date(iso).toLocaleDateString('fa-IR');
}

function formatTimeFa(iso: string) {
  return new Date(iso).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
}

function formatDateRange(start: string, end: string, leaveTypeUnit: number) {
  if (isHourlyLeaveUnit(leaveTypeUnit)) {
    return `${formatDateFa(start)} • ${formatTimeFa(start)} – ${formatTimeFa(end)}`;
  }
  return `${formatDateFa(start)} – ${formatDateFa(end)}`;
}

export default function LeaveApprovalInboxPage() {
  const detailDialog = useDisclosure();
  const actionDialog = useDisclosure();

  const [items, setItems] = useState<LeaveApprovalInboxItemDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [comment, setComment] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [selectedItem, setSelectedItem] = useState<LeaveApprovalInboxItemDto | null>(null);
  const [detailLeave, setDetailLeave] = useState<LeaveRequestDto | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalCount / PAGE_SIZE)),
    [totalCount],
  );

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await getLeaveApprovalInbox({
        Pagination: { PageNumber: pageNumber, PageSize: PAGE_SIZE },
      });
      setItems(result.Items);
      setTotalCount(result.TotalCount);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [pageNumber]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function openDetail(item: LeaveApprovalInboxItemDto) {
    setSelectedItem(item);
    setDetailLeave(null);
    setDetailLoading(true);
    detailDialog.open();
    try {
      const leave = await getLeaveRequest(item.LeaveRequestId);
      setDetailLeave(leave);
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setDetailLoading(false);
    }
  }

  function openAction(item: LeaveApprovalInboxItemDto, type: 'approve' | 'reject') {
    setSelectedItem(item);
    setActionType(type);
    setComment('');
    setFormError('');
    actionDialog.open();
  }

  async function handleActionSubmit(event: FormEvent) {
    event.preventDefault();
    if (!selectedItem) return;

    setIsSubmitting(true);
    setFormError('');
    setActionId(selectedItem.LeaveRequestId);
    try {
      if (actionType === 'approve') {
        await approveLeaveRequest(selectedItem.LeaveRequestId, comment.trim() || undefined);
      } else {
        await rejectLeaveRequest(selectedItem.LeaveRequestId, comment.trim() || undefined);
      }
      actionDialog.close();
      detailDialog.close();
      setSelectedItem(null);
      setDetailLeave(null);
      await loadData();
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
      setActionId(null);
    }
  }

  return (
    <div className="flex-1 p-4 lg:p-6">
      <PageHeader
        title="کارتابل تأیید مرخصی"
        description="درخواست‌هایی که منتظر تأیید یا رد شما هستند"
        actions={
          <Link
            to="/leaves"
            className="border-input bg-background hover:bg-muted inline-flex h-9 items-center gap-2 rounded-md border px-4 text-sm font-medium"
          >
            <Icon name="material-symbols:beach-access" className="size-4" />
            همه مرخصی‌ها
          </Link>
        }
      />

      {error && (
        <div className="text-destructive bg-destructive/10 mb-6 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <MetricCard
          icon={<Icon name="material-symbols:inbox" className="text-primary size-5" />}
          iconClassName="bg-primary/10"
          label="در انتظار اقدام شما"
          value={String(totalCount)}
        />
        <MetricCard
          icon={<Icon name="material-symbols:account-tree" className="size-5 text-amber-500" />}
          iconClassName="bg-amber-500/10"
          label="صفحه جاری"
          value={`${pageNumber} از ${totalPages}`}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>درخواست‌های در صف تأیید</CardTitle>
          <CardDescription>
            تأیید به ترتیب زنجیره مدیریتی انجام می‌شود؛ هر مرحله پس از تأیید مرحله قبل فعال می‌شود.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="table-wrapper">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-head">پرسنل</th>
                  <th className="table-head">بخش</th>
                  <th className="table-head">نوع</th>
                  <th className="table-head">بازه</th>
                  <th className="table-head">پیشرفت</th>
                  <th className="table-head w-44">عملیات</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {isLoading ? (
                  <tr className="table-row">
                    <td colSpan={6} className="table-cell text-muted-foreground py-8 text-center text-sm">
                      در حال بارگذاری...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr className="table-row">
                    <td colSpan={6} className="table-cell text-muted-foreground py-8 text-center text-sm">
                      درخواستی در کارتابل شما نیست
                    </td>
                  </tr>
                ) : (
                  items.map((item) => {
                    const personName = getPersonLabel(item);
                    const isBusy = actionId === item.LeaveRequestId;
                    const progress = formatApprovalProgress(
                      item.CurrentApprovalStepOrder,
                      item.TotalApprovalSteps,
                    );

                    return (
                      <tr key={`${item.LeaveRequestId}-${item.StepOrder}`} className="table-row">
                        <td className="table-cell">
                          <div className="flex items-center gap-2">
                            <Avatar initials={getInitials(personName)} size="sm" />
                            <span className="text-sm font-medium">{personName}</span>
                          </div>
                        </td>
                        <td className="table-cell text-sm">{item.DepartmentName}</td>
                        <td className="table-cell text-sm">{item.LeaveTypeName}</td>
                        <td className="table-cell text-sm">
                          {formatDateRange(item.StartDate, item.EndDate, item.LeaveTypeUnit)}
                        </td>
                        <td className="table-cell">
                          <div className="flex flex-col gap-1">
                            {progress && (
                              <Badge variant="alert" className="w-fit text-xs">
                                {progress}
                              </Badge>
                            )}
                            {item.IsHrPoolStep && (
                              <span className="text-muted-foreground text-xs">منابع انسانی</span>
                            )}
                          </div>
                        </td>
                        <td className="table-cell">
                          <div className="flex flex-wrap items-center gap-1">
                            <Button
                              size="icon-sm"
                              className="bg-emerald-500 text-white hover:bg-emerald-600"
                              disabled={isBusy}
                              onClick={() => openAction(item, 'approve')}
                              title="تأیید"
                            >
                              <Icon name="material-symbols:check" className="size-4" />
                            </Button>
                            <Button
                              size="icon-sm"
                              className="bg-red-500 text-white hover:bg-red-600"
                              disabled={isBusy}
                              onClick={() => openAction(item, 'reject')}
                              title="رد"
                            >
                              <Icon name="material-symbols:close" className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => void openDetail(item)}
                              title="جزئیات"
                            >
                              <Icon name="material-symbols:visibility" className="size-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="card-footer flex flex-wrap items-center justify-between border-t px-4 py-3">
            <p className="text-muted-foreground text-sm">
              نمایش {items.length > 0 ? (pageNumber - 1) * PAGE_SIZE + 1 : 0} تا{' '}
              {(pageNumber - 1) * PAGE_SIZE + items.length} از {totalCount}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-sm"
                disabled={pageNumber <= 1 || isLoading}
                onClick={() => setPageNumber((page) => Math.max(1, page - 1))}
              >
                <Icon name="material-symbols:chevron-right" className="size-4" />
              </Button>
              <Button variant="default" size="sm">
                {pageNumber}
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                disabled={pageNumber >= totalPages || isLoading}
                onClick={() => setPageNumber((page) => page + 1)}
              >
                <Icon name="material-symbols:chevron-left" className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={actionDialog.isOpen} onClose={actionDialog.close} className="max-w-md">
        <button type="button" className="dialog-close" onClick={actionDialog.close}>
          <Icon name="material-symbols:close" className="size-4" />
        </button>
        <form onSubmit={(event) => void handleActionSubmit(event)}>
          <div className="dialog-header">
            <h3 className="dialog-title">
              {actionType === 'approve' ? 'تأیید درخواست مرخصی' : 'رد درخواست مرخصی'}
            </h3>
            <p className="dialog-description">
              {selectedItem ? getPersonLabel(selectedItem) : ''}
            </p>
          </div>
          {formError && <p className="text-destructive px-6 text-sm">{formError}</p>}
          <div className="space-y-4 px-6 py-4">
            <div className="space-y-2">
              <label className="label">توضیحات (اختیاری)</label>
              <Textarea
                rows={3}
                placeholder="یادداشت برای ثبت در گردش تأیید..."
                value={comment}
                onChange={(event) => setComment(event.target.value)}
              />
            </div>
          </div>
          <div className="dialog-footer">
            <Button type="button" variant="outline" onClick={actionDialog.close}>
              انصراف
            </Button>
            <Button
              type="submit"
              variant={actionType === 'approve' ? 'default' : 'destructive'}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'در حال پردازش...'
                : actionType === 'approve'
                  ? 'تأیید'
                  : 'رد درخواست'}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog open={detailDialog.isOpen} onClose={detailDialog.close} className="max-w-lg">
        <button type="button" className="dialog-close" onClick={detailDialog.close}>
          <Icon name="material-symbols:close" className="size-4" />
        </button>
        {selectedItem && (
          <>
            <div className="dialog-header">
              <h3 className="dialog-title">جزئیات و گردش تأیید</h3>
              <p className="dialog-description">{getPersonLabel(selectedItem)}</p>
            </div>
            <div className="space-y-4 px-6 py-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground text-xs">نوع</div>
                  <div className="font-medium">{selectedItem.LeaveTypeName}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">بازه</div>
                  <div className="font-medium">
                    {formatDateRange(
                      selectedItem.StartDate,
                      selectedItem.EndDate,
                      selectedItem.LeaveTypeUnit,
                    )}
                  </div>
                </div>
              </div>
              {selectedItem.Reason && (
                <div className="text-sm">
                  <div className="text-muted-foreground mb-1 text-xs">دلیل</div>
                  <p>{selectedItem.Reason}</p>
                </div>
              )}
              <div>
                <div className="mb-3 text-sm font-medium">زنجیره تأیید</div>
                {detailLoading ? (
                  <p className="text-muted-foreground text-sm">در حال بارگذاری گردش تأیید...</p>
                ) : (
                  <LeaveApprovalTimeline steps={detailLeave?.ApprovalSteps ?? []} />
                )}
              </div>
            </div>
            <div className="dialog-footer">
              <Button variant="outline" onClick={detailDialog.close}>
                بستن
              </Button>
              <Button
                className="bg-emerald-500 text-white hover:bg-emerald-600"
                onClick={() => {
                  detailDialog.close();
                  openAction(selectedItem, 'approve');
                }}
              >
                تأیید
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  detailDialog.close();
                  openAction(selectedItem, 'reject');
                }}
              >
                رد
              </Button>
            </div>
          </>
        )}
      </Dialog>
    </div>
  );
}
