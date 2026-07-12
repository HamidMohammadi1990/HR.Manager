import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Legend,
  Tooltip,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Badge } from '@/components/ui/Badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  MetricCard,
  PageHeader,
} from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import {
  attendanceTrendData,
  dashboardStats,
  departmentDistribution,
  monthLabels,
  payrollBarData,
  quickActions,
  recentActivities,
  recentHrActivities,
} from '@/data/mock/dashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Legend,
  Tooltip,
);

const primaryColor = 'oklch(0.6 0.25 275)';
const primaryColorLight = 'oklch(0.6 0.25 275 / 0.2)';

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true } },
};

export default function DashboardPage() {
  return (
    <div className="flex-1 p-4 lg:p-6">
      <PageHeader title="داشبورد" description="خوش آمدید به پنل مدیریت منابع انسانی" />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <MetricCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            iconClassName={stat.iconBg}
            icon={<Icon name={stat.icon} className={`size-6 ${stat.iconColor}`} />}
          />
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>روند حضور</CardTitle>
            <CardDescription>آمار حضور ۶ ماه اخیر</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <Line
                data={{
                  labels: monthLabels,
                  datasets: [
                    {
                      label: 'حضور',
                      data: attendanceTrendData,
                      borderColor: primaryColor,
                      backgroundColor: primaryColorLight,
                      tension: 0.4,
                      fill: true,
                    },
                  ],
                }}
                options={chartOptions}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>حقوق و دستمزد</CardTitle>
            <CardDescription>مقایسه پرداخت ماهانه (میلیون تومان)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <Bar
                data={{
                  labels: monthLabels,
                  datasets: [
                    {
                      label: 'حقوق (میلیون)',
                      data: payrollBarData,
                      backgroundColor: primaryColor,
                      borderRadius: 8,
                    },
                  ],
                }}
                options={chartOptions}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>فعالیت‌های اخیر منابع انسانی</CardTitle>
                <a href="#" className="text-primary text-sm hover:underline">
                  مشاهده همه
                </a>
              </div>
            </CardHeader>
            <CardContent>
              <div className="table-wrapper">
                <table className="table">
                  <thead className="table-header">
                    <tr>
                      <th className="table-head">شماره</th>
                      <th className="table-head">کارمند</th>
                      <th className="table-head">نوع فعالیت</th>
                      <th className="table-head">وضعیت</th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    {recentHrActivities.map((activity) => (
                      <tr key={activity.id} className="table-row">
                        <td className="table-cell font-medium">{activity.id}</td>
                        <td className="table-cell">{activity.employee}</td>
                        <td className="table-cell">{activity.type}</td>
                        <td className="table-cell">
                          <Badge variant={activity.statusVariant}>{activity.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>توزیع بخش‌ها</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <Doughnut
                  data={{
                    labels: departmentDistribution.labels,
                    datasets: [
                      {
                        data: departmentDistribution.data,
                        backgroundColor: [
                          primaryColor,
                          'oklch(0.7 0.15 160)',
                          'oklch(0.65 0.2 220)',
                          'oklch(0.75 0.18 80)',
                        ],
                        borderWidth: 0,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'bottom', rtl: true },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>اقدامات سریع</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.label}
                    variant="outline"
                    className="flex h-auto flex-col items-center gap-2 border-dashed p-3"
                  >
                    <div className={`flex size-8 items-center justify-center rounded-lg ${action.iconBg}`}>
                      <Icon name={action.icon} className={`size-4 ${action.iconColor}`} />
                    </div>
                    <span className="text-xs font-medium">{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>فعالیت‌های اخیر</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.text} className="flex gap-3">
                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-full ${activity.iconBg}`}
                    >
                      <Icon name={activity.icon} className={`size-4 ${activity.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-sm">{activity.text}</p>
                      <p className="text-muted-foreground text-xs">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
