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
  benefits,
  complianceStats,
  monthlyTrends,
  paymentMethods,
  payrollMetrics,
  payrollQuickActions,
  payrollStatus,
  recentPayslips,
  salaryDistribution,
  salaryGrades,
} from '@/data/mock/payroll';

const quickActionColors: Record<string, string> = {
  blue: 'border-blue-500/30 hover:border-blue-500/60 hover:bg-blue-500/5 text-blue-500',
  emerald: 'border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/5 text-emerald-500',
  violet: 'border-violet-500/30 hover:border-violet-500/60 hover:bg-violet-500/5 text-violet-500',
  amber: 'border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/5 text-amber-500',
};

const itemColors: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-500' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-500' },
  red: { bg: 'bg-red-500/10', text: 'text-red-500' },
};

const payslipActionIcons: Record<string, string> = {
  view: 'material-symbols:visibility',
  download: 'material-symbols:download',
  send: 'material-symbols:mail',
  edit: 'material-symbols:edit',
  approve: 'material-symbols:check-circle',
};

const payslipActionLabels: Record<string, string> = {
  view: 'مشاهده',
  download: 'دانلود',
  send: 'ارسال',
  edit: 'ویرایش',
  approve: 'تایید',
};

export default function PayrollPage() {
  return (
    <div className="flex-1 p-4 lg:p-6">
      <PageHeader
        title="مدیریت حقوق و دستمزد"
        description="محاسبه حقوق، فیش حقوقی و پرداخت‌های پرسنلی"
        actions={
          <>
            <Button variant="outline">
              <Icon name="material-symbols:receipt-long" className="size-4" />
              فیش حقوقی
            </Button>
            <Button variant="default">
              <Icon name="material-symbols:calculate" className="size-4" />
              محاسبه حقوق
            </Button>
          </>
        }
      />

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {payrollMetrics.map((metric) => (
            <StatCard key={metric.label} {...metric} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="material-symbols:calculate" className="size-5 text-blue-500" />
                ماشین حساب حقوق
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">حقوق پایه</label>
                  <Input type="number" placeholder="مبلغ حقوق پایه..." />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">اضافه کاری (ساعت)</label>
                  <Input type="number" placeholder="ساعت اضافه کاری..." />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">پاداش عملکرد</label>
                  <Input type="number" placeholder="مبلغ پاداش..." />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">کسورات بیمه</label>
                  <Input type="number" placeholder="مبلغ بیمه..." />
                </div>
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">خالص دریافتی</span>
                    <span className="text-lg font-bold text-emerald-600">۱۵,۲۵۰,۰۰۰ تومان</span>
                  </div>
                </div>
                <Button className="w-full bg-blue-500 text-white hover:bg-blue-600">
                  <Icon name="material-symbols:receipt" className="size-4" />
                  تولید فیش حقوقی
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="material-symbols:grade" className="size-5 text-emerald-500" />
                ساختار حقوقی
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {salaryGrades.map((grade) => (
                  <div key={grade.grade} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex size-8 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white ${grade.gradient}`}
                      >
                        {grade.grade}
                      </div>
                      <span className="text-sm font-medium">رتبه {grade.grade}</span>
                    </div>
                    <span className="text-sm font-bold">{grade.range}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="material-symbols:pending-actions" className="size-5 text-amber-500" />
                وضعیت پرداخت
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-lg font-bold text-white">
                    {payrollStatus.percent}
                  </div>
                  <div className="text-sm font-medium">پردازش شده</div>
                  <div className="text-muted-foreground text-xs">{payrollStatus.processed}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>تایید شده</span>
                    <span className="font-medium text-emerald-600">{payrollStatus.approved}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>در انتظار</span>
                    <span className="font-medium text-amber-600">{payrollStatus.pending}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>رد شده</span>
                    <span className="font-medium text-red-600">{payrollStatus.rejected}</span>
                  </div>
                </div>
                <Button className="w-full bg-emerald-500 text-white hover:bg-emerald-600">
                  <Icon name="material-symbols:play-arrow" className="size-4" />
                  شروع پردازش
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="material-symbols:receipt-long" className="size-5 text-indigo-500" />
                  فیش‌های حقوقی اخیر
                </CardTitle>
                <CardDescription>فیش حقوقی پرسنل ماه دی ۱۴۰۳</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPayslips.map((payslip) => (
                    <div
                      key={payslip.name}
                      className={`rounded-lg border p-4 ${payslip.borderColor} ${payslip.bgColor}`}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar initials={payslip.initials} gradient={payslip.gradient} />
                          <div>
                            <div className="text-sm font-medium">{payslip.name}</div>
                            <div className="text-muted-foreground text-xs">{payslip.role}</div>
                          </div>
                        </div>
                        <div className="text-left">
                          <div className={`text-sm font-bold ${payslip.netColor}`}>{payslip.net}</div>
                          <div className="text-muted-foreground text-xs">خالص دریافتی</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-xs">
                        <div>
                          <div className="text-muted-foreground">حقوق پایه</div>
                          <div className="font-medium">{payslip.base}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">{payslip.extraLabel}</div>
                          <div className="font-medium">{payslip.extra}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">کسورات</div>
                          <div className="font-medium text-red-600">{payslip.deductions}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">وضعیت</div>
                          <Badge variant={payslip.statusVariant}>{payslip.status}</Badge>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        {payslip.actions.map((action) => (
                          <Button key={action} variant="outline" size="sm">
                            <Icon name={payslipActionIcons[action]} className="size-3" />
                            {payslipActionLabels[action]}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="material-symbols:analytics" className="size-5 text-cyan-500" />
                  تحلیل حقوق و دستمزد
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-4 text-sm font-medium">توزیع حقوق</h4>
                    <div className="space-y-3">
                      {salaryDistribution.map((item) => (
                        <div key={item.range}>
                          <div className="flex items-center justify-between text-sm">
                            <span>{item.range}</span>
                            <span className="font-medium">{item.percent}</span>
                          </div>
                          <ProgressBar value={parseInt(item.percent, 10)} colorClass={item.color} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-4 text-sm font-medium">روند ماهانه</h4>
                    <div className="space-y-3">
                      {monthlyTrends.map((trend) => (
                        <div key={trend.month} className="flex items-center justify-between">
                          <span className="text-sm">{trend.month}</span>
                          <span className="text-sm font-bold">{trend.amount}</span>
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
                <CardTitle className="flex items-center gap-2">
                  <Icon name="material-symbols:calculate" className="size-5 text-red-500" />
                  ماشین حساب مالیات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">درآمد ماهانه</label>
                    <Input type="number" placeholder="مبلغ درآمد..." />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">معافیت‌های مالیاتی</label>
                    <Input type="number" placeholder="مبلغ معافیت..." />
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">مالیات قابل پرداخت</span>
                      <span className="text-lg font-bold text-red-600">۲,۴۵۰,۰۰۰ تومان</span>
                    </div>
                  </div>
                  <Button className="w-full bg-red-500 text-white hover:bg-red-600">
                    <Icon name="material-symbols:info" className="size-4" />
                    جزئیات مالیات
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="material-symbols:redeem" className="size-5 text-emerald-500" />
                  مزایای پرسنلی
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {benefits.map((benefit) => (
                    <div
                      key={benefit.title}
                      className="hover:bg-muted/30 flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors"
                    >
                      <div
                        className={`flex size-8 items-center justify-center rounded-full ${itemColors[benefit.color].bg}`}
                      >
                        <Icon name={benefit.icon} className={`size-4 ${itemColors[benefit.color].text}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{benefit.title}</p>
                        <p className="text-muted-foreground text-xs">{benefit.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="material-symbols:account-balance-wallet" className="size-5 text-cyan-500" />
                  روش‌های پرداخت
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.title}
                      className="hover:bg-muted/30 flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors"
                    >
                      <div
                        className={`flex size-8 items-center justify-center rounded-full ${itemColors[method.color].bg}`}
                      >
                        <Icon name={method.icon} className={`size-4 ${itemColors[method.color].text}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{method.title}</p>
                        <p className="text-muted-foreground text-xs">{method.detail}</p>
                      </div>
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
                  {payrollQuickActions.map((action) => (
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
              <Icon name="material-symbols:verified" className="size-5 text-green-500" />
              انطباق با قوانین
            </CardTitle>
            <CardDescription>وضعیت رعایت قوانین کار و تامین اجتماعی</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {complianceStats.map((stat) => (
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
