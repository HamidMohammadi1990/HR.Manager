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
import {
  departmentOverviews,
  employeeLeaveRequests,
  employeeQuickActions,
  employees,
  hrMetrics,
  lifecycleItems,
  performanceMetrics,
  recruitmentStages,
  todayAttendanceSummary,
  trainingCourses,
} from '@/data/mock/employees';

const quickActionColors: Record<string, string> = {
  blue: 'border-blue-500/30 hover:border-blue-500/60 hover:bg-blue-500/5 text-blue-500',
  emerald: 'border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/5 text-emerald-500',
  violet: 'border-violet-500/30 hover:border-violet-500/60 hover:bg-violet-500/5 text-violet-500',
  amber: 'border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/5 text-amber-500',
};

export default function EmployeesPage() {
  return (
    <div className="flex-1 p-4 lg:p-6">
      <PageHeader
        title="مدیریت پرسنل"
        description="پروفایل، عملکرد و سازماندهی کارکنان"
        actions={
          <>
            <Button variant="outline">
              <Icon name="material-symbols:analytics" className="size-4" />
              گزارش منابع انسانی
            </Button>
            <Button variant="default">
              <Icon name="material-symbols:person-add" className="size-4" />
              استخدام جدید
            </Button>
          </>
        }
      />

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {hrMetrics.map((metric) => (
            <StatCard key={metric.label} {...metric} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-4 xl:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="lucide:building-2" className="size-5 text-blue-500" />
                  واحدهای سازمانی
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {departmentOverviews.map((dept) => (
                    <div
                      key={dept.name}
                      className={`rounded-lg border p-3 ${dept.borderColor} ${dept.bgColor}`}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">{dept.name}</span>
                        <Badge variant={dept.badgeVariant}>{dept.count}</Badge>
                      </div>
                      <ProgressBar value={dept.progress} colorClass={dept.progressColor} />
                      <p className="text-muted-foreground mt-1 text-xs">{dept.note}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>اقدامات سریع</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {employeeQuickActions.map((action) => (
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

          <div className="xl:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="material-symbols:group" className="size-5 text-emerald-500" />
                  دایرکتوری کارکنان
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Icon
                      name="material-symbols:search"
                      className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2"
                    />
                    <Input className="h-8 ps-9" placeholder="جستجو در کارکنان..." />
                  </div>
                  <Button variant="outline" size="sm">
                    <Icon name="material-symbols:filter-list" className="size-4" />
                    فیلتر
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {employees.map((employee) => (
                    <div
                      key={employee.id}
                      className="hover:bg-muted/30 flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors"
                    >
                      <Avatar initials={employee.initials} gradient={employee.gradient} size="lg" />
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="font-medium">{employee.name}</span>
                          <Badge variant={employee.statusVariant}>{employee.status}</Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">{employee.role}</p>
                        <div className="text-muted-foreground mt-1 flex items-center gap-4 text-xs">
                          <span>{employee.department}</span>
                          <span>•</span>
                          <span>{employee.experience}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Icon name="material-symbols:visibility" className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="material-symbols:trending-up" className="size-5 text-indigo-500" />
                عملکرد کارکنان
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceMetrics.map((metric) => (
                  <div key={metric.label}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{metric.label}</span>
                      <span className="font-medium">{metric.value}</span>
                    </div>
                    <ProgressBar value={metric.progress} colorClass={metric.color} height="md" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="material-symbols:school" className="size-5 text-violet-500" />
                آموزش و توسعه
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trainingCourses.map((course) => (
                  <div
                    key={course.title}
                    className="hover:bg-muted/30 flex items-center gap-3 rounded-lg p-3 transition-colors"
                  >
                    <div className={`flex size-10 items-center justify-center rounded-lg ${course.iconBg}`}>
                      <Icon name={course.icon} className={`size-5 ${course.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{course.title}</p>
                      <p className="text-muted-foreground text-xs">{course.detail}</p>
                    </div>
                    <Badge variant={course.badgeVariant}>{course.badge}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="material-symbols:schedule" className="size-5 text-emerald-500" />
                حضور امروز
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayAttendanceSummary.map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between rounded-lg p-2 ${item.bg}`}
                  >
                    <span className="text-sm">{item.label}</span>
                    <span className={`font-medium ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="material-symbols:event-note" className="size-5 text-blue-500" />
                درخواست‌های مرخصی
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {employeeLeaveRequests.map((request) => (
                  <div
                    key={request.type}
                    className="hover:bg-muted/30 flex items-center gap-3 rounded-lg p-2 transition-colors"
                  >
                    <div className={`flex size-8 items-center justify-center rounded-full ${request.iconBg}`}>
                      <Icon name={request.icon} className={`size-4 ${request.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{request.type}</p>
                      <p className="text-muted-foreground text-xs">{request.employee}</p>
                    </div>
                    {request.action === 'review' ? (
                      <Button variant="outline" size="sm">
                        بررسی
                      </Button>
                    ) : (
                      <Badge variant={request.badgeVariant}>{request.badge}</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="material-symbols:timeline" className="size-5 text-indigo-500" />
                چرخه زندگی کارکنان
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lifecycleItems.map((item) => (
                  <div key={item.title} className="flex items-center gap-3">
                    <div className={`flex size-8 items-center justify-center rounded-full ${item.iconBg}`}>
                      <Icon name={item.icon} className={`size-4 ${item.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-muted-foreground text-xs">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="material-symbols:group-add" className="size-5 text-emerald-500" />
              خط لوله استخدام
            </CardTitle>
            <CardDescription>روند جذب و استخدام نیروی جدید</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
              {recruitmentStages.map((stage) => (
                <div key={stage.label} className="text-center">
                  <div className={`mb-2 text-2xl font-bold ${stage.textColor}`}>{stage.count}</div>
                  <div className="text-muted-foreground text-sm">{stage.label}</div>
                  <div className="bg-muted mt-2 h-2 w-full rounded-full">
                    <div
                      className={`h-2 rounded-full ${stage.color}`}
                      style={{ width: `${stage.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
