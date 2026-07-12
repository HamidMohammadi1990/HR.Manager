import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
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
import {
  budgetAllocation,
  crossDepartmentProjects,
  departmentCommunications,
  departmentGoals,
  departmentMetrics,
  departmentPerformance,
  departmentQuickActions,
  headcountDistribution,
  orgChart,
} from '@/data/mock/departments';

const quickActionColors: Record<string, string> = {
  blue: 'border-blue-500/30 hover:border-blue-500/60 hover:bg-blue-500/5 text-blue-500',
  emerald: 'border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/5 text-emerald-500',
  violet: 'border-violet-500/30 hover:border-violet-500/60 hover:bg-violet-500/5 text-violet-500',
  amber: 'border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/5 text-amber-500',
};

const performanceColors: Record<string, { bg: string; text: string; bar: string }> = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', bar: 'bg-blue-500' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', bar: 'bg-emerald-500' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', bar: 'bg-amber-500' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-500', bar: 'bg-violet-500' },
  red: { bg: 'bg-red-500/10', text: 'text-red-500', bar: 'bg-red-500' },
};

const commColors: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-500' },
};

export default function DepartmentsPage() {
  return (
    <div className="flex-1 p-4 lg:p-6">
      <PageHeader
        title="مدیریت بخش‌ها"
        description="ساختار سازمانی، عملکرد و تخصیص منابع"
        actions={
          <>
            <Button variant="outline">
              <Icon name="material-symbols:account-tree" className="size-4" />
              نمودار سازمانی
            </Button>
            <Button variant="default">
              <Icon name="material-symbols:add" className="size-4" />
              بخش جدید
            </Button>
          </>
        }
      />

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {departmentMetrics.map((metric) => (
            <StatCard key={metric.label} {...metric} />
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="material-symbols:account-tree" className="size-5 text-indigo-500" />
              ساختار سازمانی
            </CardTitle>
            <CardDescription>سلسله مراتب مدیریتی و ارتباط بین بخش‌ها</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-8 flex justify-center">
              <div className="text-center">
                <div className="mx-auto mb-3 flex size-22 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-lg font-bold text-white">
                  مدیرعامل
                </div>
                <div className="text-sm font-medium">{orgChart.ceo.name}</div>
                <div className="text-muted-foreground text-xs">{orgChart.ceo.title}</div>
              </div>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {orgChart.departments.map((dept) => (
                <div key={dept.name} className="text-center">
                  <div
                    className={`mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-gradient-to-br font-bold text-white ${dept.gradient}`}
                  >
                    {dept.abbr}
                  </div>
                  <div className="text-sm font-medium">{dept.name}</div>
                  <div className="text-muted-foreground text-xs">
                    {dept.count} • {dept.manager}
                  </div>
                  <div className="mt-2 flex justify-center">
                    <div className="bg-muted h-px w-8" />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {orgChart.subDepartments.map((sub) => (
                <div key={sub.name} className="text-center">
                  <div
                    className={`mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white ${sub.gradient}`}
                  >
                    {sub.abbr}
                  </div>
                  <div className="text-xs font-medium">{sub.name}</div>
                  <div className="text-muted-foreground text-xs">{sub.count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>عملکرد بخش‌ها</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {departmentPerformance.map((dept) => (
                    <div key={dept.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-8 items-center justify-center rounded-full ${performanceColors[dept.color].bg}`}
                        >
                          <Icon
                            name={dept.icon}
                            className={`size-4 ${performanceColors[dept.color].text}`}
                          />
                        </div>
                        <span className="text-sm font-medium">{dept.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{dept.percent}</span>
                        <div className="bg-muted h-2 w-24 rounded-full">
                          <div
                            className={`h-2 rounded-full ${performanceColors[dept.color].bar}`}
                            style={{ width: `${dept.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="material-symbols:pie-chart" className="size-5 text-emerald-500" />
                  تخصیص منابع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-4 text-sm font-medium">تخصیص بودجه</h4>
                    <div className="space-y-3">
                      {budgetAllocation.map((item) => (
                        <div key={item.name}>
                          <div className="flex items-center justify-between text-sm">
                            <span>{item.name}</span>
                            <span className="font-medium">{item.percent}</span>
                          </div>
                          <ProgressBar value={item.progress} colorClass={item.color} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-4 text-sm font-medium">توزیع نیروی انسانی</h4>
                    <div className="space-y-3">
                      {headcountDistribution.map((item) => (
                        <div key={item.name}>
                          <div className="flex items-center justify-between text-sm">
                            <span>{item.name}</span>
                            <span className="font-medium">{item.count}</span>
                          </div>
                          <ProgressBar value={item.progress} colorClass={item.color} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>اقدامات سریع</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {departmentQuickActions.map((action) => (
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="material-symbols:target" className="size-5 text-indigo-500" />
                  اهداف کلیدی
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {departmentGoals.map((goal) => (
                    <div
                      key={goal.title}
                      className={`rounded-lg border p-3 ${goal.borderColor} ${goal.bgColor}`}
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-medium">{goal.title}</span>
                        <Badge variant={goal.badgeVariant}>{goal.percent}</Badge>
                      </div>
                      <div className="text-muted-foreground text-xs">{goal.target}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="material-symbols:forum" className="size-5 text-rose-500" />
                  ارتباطات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {departmentCommunications.map((comm) => (
                    <div
                      key={comm.title}
                      className="hover:bg-muted/30 flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors"
                    >
                      <div
                        className={`flex size-8 items-center justify-center rounded-full ${commColors[comm.color].bg}`}
                      >
                        <Icon name={comm.icon} className={`size-4 ${commColors[comm.color].text}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{comm.title}</p>
                        <p className="text-muted-foreground text-xs">{comm.detail}</p>
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
              <Icon name="material-symbols:hub" className="size-5 text-cyan-500" />
              همکاری بین بخشی
            </CardTitle>
            <CardDescription>پروژه‌ها و فعالیت‌های مشترک بین بخش‌های مختلف</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {crossDepartmentProjects.map((project) => (
                <div
                  key={project.title}
                  className="cursor-pointer rounded-lg border border-dashed p-4 transition-colors hover:border-cyan-500/50"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Icon name={project.icon} className="size-5 text-cyan-500" />
                    <span className="text-sm font-medium">{project.title}</span>
                  </div>
                  <p className="text-muted-foreground mb-2 text-xs">{project.description}</p>
                  <div className="flex items-center gap-1 text-xs">
                    {project.badges.map((badge) => (
                      <Badge key={badge.label} variant={badge.variant}>
                        {badge.label}
                      </Badge>
                    ))}
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
