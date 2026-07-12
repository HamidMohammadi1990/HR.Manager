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
  StatCard,
} from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import {
  attendanceLeaveRequests,
  attendanceMetrics,
  attendancePolicies,
  attendanceQuickActions,
  liveFeedItems,
  monthlyReportStats,
  overtimeSummary,
  todaySummary,
  weeklyAttendance,
} from '@/data/mock/attendance';
import { useClock } from '@/hooks';

const quickActionColors: Record<string, string> = {
  blue: 'border-blue-500/30 hover:border-blue-500/60 hover:bg-blue-500/5 text-blue-500',
  emerald: 'border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/5 text-emerald-500',
  violet: 'border-violet-500/30 hover:border-violet-500/60 hover:bg-violet-500/5 text-violet-500',
  amber: 'border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/5 text-amber-500',
};

const policyColors: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-500' },
};

export default function AttendancePage() {
  const { time, date } = useClock();

  return (
    <div className="flex-1 p-4 lg:p-6">
      <PageHeader
        title="مدیریت حضور و غیاب"
        description="ثبت تردد، مرخصی‌ها و گزارش‌های زمانی"
        actions={
          <>
            <Button variant="outline">
              <Icon name="material-symbols:calendar-month" className="size-4" />
              تقویم کاری
            </Button>
            <Button variant="default">
              <Icon name="material-symbols:add" className="size-4" />
              ثبت تردد
            </Button>
          </>
        }
      />

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {attendanceMetrics.map((metric) => (
            <StatCard key={metric.label} {...metric} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="material-symbols:schedule" className="size-5 text-blue-500" />
                ساعت دیجیتال
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="mb-4 text-4xl font-bold text-blue-600">{time}</div>
                <div className="text-muted-foreground mb-6 text-sm">{date}</div>
                <div className="grid grid-cols-2 gap-3">
                  <Button className="bg-emerald-500 text-white hover:bg-emerald-600">
                    <Icon name="material-symbols:login" className="size-4" />
                    ورود
                  </Button>
                  <Button className="bg-red-500 text-white hover:bg-red-600">
                    <Icon name="material-symbols:logout" className="size-4" />
                    خروج
                  </Button>
                </div>
                <div className="bg-muted/30 mt-4 rounded-lg p-3">
                  <div className="mb-1 text-sm font-medium">وضعیت امروز</div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    <span>ورود: ۸:۴۵</span>
                    <span className="mx-2">•</span>
                    <span>خروج: -</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>اقدامات سریع</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {attendanceQuickActions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    className={`flex flex-col items-center gap-2 rounded-lg border border-dashed p-4 transition-all ${quickActionColors[action.color]}`}
                  >
                    <Icon name={action.icon} className="size-5" />
                    <span className="text-xs font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="material-symbols:today" className="size-5 text-indigo-500" />
                خلاصه امروز
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaySummary.map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm">{item.label}</span>
                    <span className={`font-medium ${item.color ?? ''}`}>{item.value}</span>
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
                  <Icon name="material-symbols:live-tv" className="size-5 text-emerald-500" />
                  تردد زنده
                </CardTitle>
                <CardDescription>آخرین فعالیت‌های حضور و غیاب</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {liveFeedItems.map((item) => (
                    <div
                      key={`${item.name}-${item.time}`}
                      className={`flex items-center gap-3 rounded-lg border p-3 ${item.borderColor} ${item.bgColor}`}
                    >
                      <Avatar initials={item.initials} gradient={item.gradient} />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{item.name}</div>
                        <div className="text-muted-foreground text-xs">{item.action}</div>
                      </div>
                      <div className={`text-xs font-medium ${item.timeColor}`}>{item.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="material-symbols:bar-chart" className="size-5 text-indigo-500" />
                  نمودار هفتگی
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-4">
                  {weeklyAttendance.map((day) => (
                    <div key={day.day} className="text-center">
                      <div className="text-muted-foreground mb-2 text-xs">{day.day}</div>
                      <div
                        className={`rounded-t ${day.isToday ? 'bg-blue-500' : 'bg-emerald-500'}`}
                        style={{ height: `${day.height}px` }}
                      />
                      <div className="mt-1 text-xs font-medium">{day.count}</div>
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
                  <Icon name="material-symbols:event-note" className="size-5 text-blue-500" />
                  درخواست‌های مرخصی
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {attendanceLeaveRequests.map((request) => (
                    <div
                      key={request.name}
                      className={`rounded-lg border p-3 ${request.borderColor} ${request.bgColor}`}
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-medium">{request.name}</span>
                        <Badge variant={request.statusVariant}>{request.status}</Badge>
                      </div>
                      <div className="text-muted-foreground text-xs">{request.detail}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="material-symbols:more-time" className="size-5 text-violet-500" />
                  اضافه کاری ماه جاری
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overtimeSummary.map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-sm">{item.label}</span>
                      <span className={`font-medium ${item.highlight ? 'text-violet-600' : ''}`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="material-symbols:policy" className="size-5 text-cyan-500" />
                  سیاست‌های حضور
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {attendancePolicies.map((policy) => (
                    <div
                      key={policy.title}
                      className="hover:bg-muted/30 flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors"
                    >
                      <div
                        className={`flex size-8 items-center justify-center rounded-full ${policyColors[policy.color].bg}`}
                      >
                        <Icon
                          name={policy.icon}
                          className={`size-4 ${policyColors[policy.color].text}`}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{policy.title}</p>
                        <p className="text-muted-foreground text-xs">{policy.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="material-symbols:calendar-view-month" className="size-5 text-rose-500" />
              گزارش ماهانه دی ۱۴۰۳
            </CardTitle>
            <CardDescription>آمار حضور و غیاب ماه جاری</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {monthlyReportStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div
                    className={`mx-auto mb-3 flex size-16 items-center justify-center rounded-full bg-gradient-to-br text-lg font-bold text-white ${stat.gradient}`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium">{stat.label}</div>
                  <div className="text-muted-foreground text-xs">{stat.note}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
