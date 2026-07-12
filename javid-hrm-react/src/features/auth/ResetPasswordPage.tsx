import { FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';
import { Card, CardContent } from '@/components/ui/Card';
import { AuthLayout } from './AuthLayout';

const PASSWORD_REQUIREMENTS = [
  { label: 'حداقل ۸ کاراکتر', met: false },
  { label: 'یک حرف بزرگ و کوچک', met: true },
  { label: 'یک عدد', met: false },
  { label: 'یک کاراکتر خاص', met: false },
];

export default function ResetPasswordPage() {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <AuthLayout variant="plain">
      <div className="w-full max-w-md">
        <Card>
          <CardContent className="p-8">
            <div className="relative mx-auto mb-6 size-20">
              <div className="bg-primary/10 absolute inset-0 animate-ping rounded-full" />
              <div className="from-primary relative flex size-20 items-center justify-center rounded-full bg-gradient-to-br to-violet-600">
                <Icon name="material-symbols--lock-open" className="size-10 text-white" />
              </div>
            </div>

            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold">تعیین رمز عبور جدید</h1>
              <p className="text-muted-foreground text-sm">
                رمز عبور قوی انتخاب کنید که قبلاً استفاده نکرده‌اید
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="new-password" className="label">
                  رمز عبور جدید
                </label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="حداقل ۸ کاراکتر"
                  dir="ltr"
                />
                <div className="mt-2 flex gap-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-muted h-1 flex-1 rounded-full" />
                  ))}
                </div>
                <p className="text-muted-foreground text-xs">قدرت رمز: متوسط</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirm-password" className="label">
                  تکرار رمز عبور
                </label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="رمز عبور را مجدداً وارد کنید"
                  dir="ltr"
                />
              </div>

              <div className="bg-muted/20 space-y-2 rounded-xl border p-4">
                <p className="mb-3 text-sm font-medium">رمز عبور باید شامل موارد زیر باشد:</p>
                {PASSWORD_REQUIREMENTS.map((req) => (
                  <div key={req.label} className="flex items-center gap-2 text-sm">
                    <Icon
                      name="material-symbols--check-circle"
                      className={
                        req.met
                          ? 'size-4 text-emerald-600'
                          : 'text-muted-foreground size-4'
                      }
                    />
                    <span className={req.met ? undefined : 'text-muted-foreground'}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>

              <Button type="submit" className="w-full">
                <Icon name="material-symbols--check" className="size-5" />
                تغییر رمز عبور
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
}
