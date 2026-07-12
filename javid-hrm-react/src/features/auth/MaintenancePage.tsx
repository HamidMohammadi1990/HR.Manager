import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { AuthLayout } from './AuthLayout';

const MAINTENANCE_ITEMS = [
  'بهبود عملکرد سیستم',
  'اعمال به‌روزرسانی‌های امنیتی',
  'تعمیر و نگهداری برنامه‌ریزی شده',
];

export default function MaintenancePage() {
  return (
    <AuthLayout
      variant="custom"
      className="from-primary/5 via-background to-accent/5 flex min-h-screen items-center justify-center bg-gradient-to-br p-4"
    >
      <div className="w-full max-w-xl text-center">
        <div className="relative mb-8">
          <div className="text-primary/10 text-[120px] leading-none font-black">🔧</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="from-primary to-accent flex size-20 items-center justify-center rounded-full bg-gradient-to-br shadow-lg">
              <Icon
                name="material-symbols--construction"
                className="text-primary-foreground size-10"
              />
            </div>
          </div>
        </div>

        <div className="mb-6 space-y-3">
          <h1 className="text-foreground text-2xl font-bold">حالت تعمیر و نگهداری</h1>
          <p className="text-muted-foreground mx-auto max-w-sm text-sm">
            سیستم در حال به‌روزرسانی است. به زودی به خدمات عادی باز خواهیم گشت.
          </p>
        </div>

        <div className="bg-muted/30 mx-auto mb-6 max-w-sm rounded-lg p-4">
          <div className="mb-2 flex items-start gap-2">
            <Icon name="material-symbols--info" className="text-primary mt-0.5 size-4" />
            <div className="text-start text-xs">
              <p className="mb-1 font-medium">چه کاری انجام می‌دهیم:</p>
              <ul className="text-muted-foreground space-y-0.5">
                {MAINTENANCE_ITEMS.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col justify-center gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="from-primary to-accent text-primary-foreground flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r px-4 py-2 font-medium transition-all duration-300 hover:shadow-md"
          >
            <Icon name="material-symbols--refresh" className="size-4" />
            بررسی مجدد
          </button>
          <a
            href="mailto:support@example.com"
            className="bg-card text-card-foreground hover:border-primary flex items-center justify-center gap-2 rounded-lg border px-4 py-2 font-medium transition-all duration-300 hover:shadow-md"
          >
            <Icon name="material-symbols--mail" className="size-4" />
            تماس با پشتیبانی
          </a>
          <Link
            to="/help"
            className="bg-card text-card-foreground hover:border-primary flex items-center justify-center gap-2 rounded-lg border px-4 py-2 font-medium transition-all duration-300 hover:shadow-md"
          >
            <Icon name="material-symbols--help" className="size-4" />
            راهنما
          </Link>
        </div>

        <p className="text-muted-foreground text-xs">
          برای اطلاعات بیشتر با تیم پشتیبانی تماس بگیرید.
        </p>
      </div>
    </AuthLayout>
  );
}
