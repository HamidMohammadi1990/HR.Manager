import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Avatar,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  PageHeader,
  ProgressBar,
  StatCard,
} from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import {
  leaveBalances,
  leaveHistory,
  leaveMetrics,
  leaveQuickActions,
  leaveStatsBreakdown,
  leaveTypeOptions,
  leaveTypes,
  pendingApprovals,
  upcomingLeaves,
} from '@/data/mock/leaves';
import { getAllLeaveRequests, getApiErrorMessage, type LeaveRequestDto } from '@/services/api';
import { LEAVE_STATUS_LABELS, LEAVE_TYPE_LABELS, getPersonName } from '@/lib/hrLabels';

const quickActionColors: Record<string, string> = {
  blue: 'border-blue-500/30 hover:border-blue-500/60 hover:bg-blue-500/5 text-blue-500',
  emerald: 'border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/5 text-emerald-500',
  violet: 'border-violet-500/30 hover:border-violet-500/60 hover:bg-violet-500/5 text-violet-500',
  amber: 'border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/5 text-amber-500',
};

const typeColors: Record<string, { bg: string; text: string }> = {
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
  red: { bg: 'bg-red-500/10', text: 'text-red-500' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-500' },
};

export default function LeavesPage() {
  const [requests, setRequests] = useState<LeaveRequestDto[]>([]);
  const [apiError, setApiError] = useState('');
  const [apiLoading, setApiLoading] = useState(true);

  useEffect(() => {
    void getAllLeaveRequests({ Pagination: { PageNumber: 1, PageSize: 20 } })
      .then((r) => setRequests(r.Items ?? []))
      .catch((err) => setApiError(getApiErrorMessage(err)))
      .finally(() => setApiLoading(false));
  }, []);

  return (
    <div className="flex-1 p-4 lg:p-6">
      <PageHeader
        title="مدیریت مرخصی‌ها"
        description="درخواست، تایید و پیگیری مرخصی‌های پرسنل"
        actions={
          <>
            <Button variant="outline">
              <Icon name="material-symbols:calendar-month" className="size-4" />
              تقویم مرخصی
            </Button>
            <Button variant="default">
              <Icon name="material-symbols:add" className="size-4" />
              درخواست مرخصی
            </Button>
          </>
        }
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>درخواست‌های مرخصی (API)</CardTitle>
          <CardDescription>داده واقعی از `api/v1/admin/leave-request/get-all`</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {apiError && <p className="text-destructive px-4 py-3 text-sm">{apiError}</p>}
          <div className="table-wrapper">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-head">پرسنل</th>
                  <th className="table-head">نوع</th>
                  <th className="table-head">از</th>
                  <th className="table-head">تا</th>
                  <th className="table-head">وضعیت</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {apiLoading ? (
                  <tr className="table-row"><td colSpan={5} className="table-cell text-center py-6 text-sm text-muted-foreground">در حال بارگذاری...</td></tr>
                ) : requests.length === 0 ? (
                  <tr className="table-row"><td colSpan={5} className="table-cell text-center py-6 text-sm text-muted-foreground">درخواستی ثبت نشده</td></tr>
                ) : (
                  requests.map((r) => (
                    <tr key={r.Id} className="table-row">
                      <td className="table-cell text-sm">{getPersonName(r.UserFirstName, r.UserLastName, r.EmployeeCode)}</td>
                      <td className="table-cell text-sm">{LEAVE_TYPE_LABELS[r.LeaveType] ?? r.LeaveType}</td>
                      <td className="table-cell text-sm">{new Date(r.StartDate).toLocaleDateString('fa-IR')}</td>
                      <td className="table-cell text-sm">{new Date(r.EndDate).toLocaleDateString('fa-IR')}</td>
                      <td className="table-cell"><Badge variant="secondary">{LEAVE_STATUS_LABELS[r.Status] ?? r.Status}</Badge></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {leaveMetrics.map((metric) => (
            <StatCard key={metric.label} {...metric} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="material-symbols:add-circle" className="size-5 text-blue-500" />
                درخواست مرخصی جدید
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">نوع مرخصی</label>
                  <Select defaultValue={leaveTypeOptions[0]}>
                    {leaveTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium">از تاریخ</label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">تا تاریخ</label>
                    <Input type="date" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">توضیحات</label>
                  <Textarea rows={3} placeholder="دلیل مرخصی..." />
                </div>
                <Button className="w-full bg-blue-500 text-white hover:bg-blue-600">
                  <Icon name="material-symbols:send" className="size-4" />
                  ارسال درخواست
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="material-symbols:account-balance-wallet" className="size-5 text-emerald-500" />
                موجودی مرخصی
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaveBalances.map((balance) => (
                  <div key={balance.label}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">{balance.label}</span>
                      <span className="text-sm font-bold">{balance.used}</span>
                    </div>
                    <ProgressBar value={balance.progress} colorClass={balance.color} />
                    <div className="text-muted-foreground mt-1 text-xs">{balance.remaining}</div>
                  </div>
                ))}
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="mb-1 text-sm font-medium">انتقال به سال بعد</div>
                  <div className="text-muted-foreground text-xs">حداکثر ۵ روز قابل انتقال</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="material-symbols:category" className="size-5 text-violet-500" />
                انواع مرخصی
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaveTypes.map((type) => (
                  <div
                    key={type.title}
                    className="hover:bg-muted/30 flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors"
                  >
                    <div
                      className={`flex size-8 items-center justify-center rounded-full ${typeColors[type.color].bg}`}
                    >
                      <Icon name={type.icon} className={`size-4 ${typeColors[type.color].text}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{type.title}</p>
                      <p className="text-muted-foreground text-xs">{type.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="material-symbols:pending" className="size-5 text-amber-500" />
                  درخواست‌های در انتظار تایید
                </CardTitle>
                <CardDescription>مرخصی‌هایی که نیاز به تایید شما دارند</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingApprovals.map((approval) => (
                    <div
                      key={approval.name}
                      className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar initials={approval.initials} gradient={approval.gradient} />
                          <div>
                            <div className="text-sm font-medium">{approval.name}</div>
                            <div className="text-muted-foreground text-xs">{approval.role}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="text-xs" variant="destructive">
                            در انتظار
                          </Badge>
                          <span className="text-muted-foreground text-xs">{approval.time}</span>
                        </div>
                      </div>
                      <div className="mb-3 grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-muted-foreground text-xs">نوع مرخصی</div>
                          <div className="text-sm font-medium">{approval.type}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-xs">تاریخ</div>
                          <div className="text-sm font-medium">{approval.dates}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-xs">مدت</div>
                          <div className="text-sm font-medium">{approval.duration}</div>
                        </div>
                      </div>
                      <div className="text-muted-foreground mb-3 text-sm">{approval.reason}</div>
                      <div className="flex items-center gap-2">
                        <Button className="bg-emerald-500 text-xs text-white hover:bg-emerald-600">
                          <Icon name="material-symbols:check" className="size-3" />
                          تایید
                        </Button>
                        <Button className="bg-red-500 text-xs text-white hover:bg-red-600">
                          <Icon name="material-symbols:close" className="size-3" />
                          رد
                        </Button>
                        <Button variant="outline" size="sm">
                          جزئیات
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="material-symbols:event-upcoming" className="size-5 text-blue-500" />
                  مرخصی‌های آینده
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingLeaves.map((leave) => (
                    <div
                      key={leave.name}
                      className="hover:bg-muted/30 flex items-center gap-4 rounded-lg p-3 transition-colors"
                    >
                      <div
                        className={`flex size-12 items-center justify-center rounded-full bg-gradient-to-br font-bold text-white ${leave.gradient}`}
                      >
                        {leave.day}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{leave.name}</div>
                        <div className="text-muted-foreground text-sm">{leave.detail}</div>
                      </div>
                      <div className="text-muted-foreground text-sm">{leave.dates}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="material-symbols:calendar-view-month" className="size-5 text-indigo-500" />
                  تقویم دی ۱۴۰۳
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map((day) => (
                    <div key={day} className="text-muted-foreground p-2 font-medium">
                      {day}
                    </div>
                  ))}
                  {['۱', '۲', '۳', '۴', '۵', '۶'].map((d) => (
                    <div key={`w1-${d}`} className="text-muted-foreground p-2">
                      {d}
                    </div>
                  ))}
                  <div className="rounded bg-blue-500/10 p-2 font-medium text-blue-600">۷</div>
                  {['۸', '۹', '۱۰', '۱۱', '۱۲', '۱۳'].map((d) => (
                    <div key={`w2-${d}`} className="text-muted-foreground p-2">
                      {d}
                    </div>
                  ))}
                  <div className="rounded bg-emerald-500/10 p-2 font-medium text-emerald-600">۱۴</div>
                  {['۱۵', '۱۶', '۱۷'].map((d) => (
                    <div key={`leave-${d}`} className="rounded bg-emerald-500/10 p-2 font-medium text-emerald-600">
                      {d}
                    </div>
                  ))}
                  {['۱۸', '۱۹', '۲۰', '۲۱', '۲۲', '۲۳', '۲۴', '۲۵', '۲۶', '۲۷', '۲۸', '۲۹', '۳۰', '۳۱', '۱', '۲', '۳', '۴'].map(
                    (d) => (
                      <div key={`rest-${d}`} className="text-muted-foreground p-2">
                        {d}
                      </div>
                    ),
                  )}
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="size-2 rounded-full bg-blue-500" />
                    <span>امروز</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="size-2 rounded-full bg-emerald-500" />
                    <span>مرخصی</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="material-symbols:analytics" className="size-5 text-cyan-500" />
                  آمار مرخصی
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="mx-auto mb-2 flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 text-lg font-bold text-white">
                      ۸۵%
                    </div>
                    <div className="text-sm font-medium">استفاده از مرخصی</div>
                    <div className="text-muted-foreground text-xs">ماه جاری</div>
                  </div>
                  <div className="space-y-2">
                    {leaveStatsBreakdown.map((stat) => (
                      <div key={stat.label} className="flex items-center justify-between text-sm">
                        <span>{stat.label}</span>
                        <span className="font-medium">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>اقدامات سریع</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {leaveQuickActions.map((action) => (
                    <button
                      key={action.label}
                      type="button"
                      className={`flex flex-col items-center gap-2 rounded-lg border border-dashed p-3 transition-all ${quickActionColors[action.color]}`}
                    >
                      <Icon name={action.icon} className="size-5" />
                      <span className="text-xs font-medium">{action.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="material-symbols:history" className="size-5 text-gray-500" />
              تاریخچه مرخصی‌ها
            </CardTitle>
            <CardDescription>مرخصی‌های تایید شده و رد شده اخیر</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    {['کارمند', 'نوع', 'تاریخ', 'مدت', 'وضعیت', 'تایید کننده'].map((col) => (
                      <th key={col} className="text-muted-foreground p-3 text-start text-xs font-medium">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leaveHistory.map((row) => (
                    <tr key={row.name} className="hover:bg-muted/30 border-b transition-colors last:border-b-0">
                      <td className="p-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Avatar initials={row.initials} gradient={row.gradient} size="sm" />
                          {row.name}
                        </div>
                      </td>
                      <td className="p-3 text-sm">{row.type}</td>
                      <td className="p-3 text-sm">{row.dates}</td>
                      <td className="p-3 text-sm">{row.duration}</td>
                      <td className="p-3 text-sm">
                        <Badge variant={row.statusVariant}>{row.status}</Badge>
                      </td>
                      <td className="p-3 text-sm">{row.approver}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
