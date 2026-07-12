import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';
import { Card, CardContent } from '@/components/ui/Card';
import { AuthLayout, AuthSeparator } from './AuthLayout';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <AuthLayout variant="gradient">
      <div className="relative w-full max-w-md">
        <Card>
          <CardContent className="p-8">
            <div className="from-primary mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br to-violet-600">
              <Icon name="material-symbols--lock-reset" className="size-8 text-white" />
            </div>

            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold">فراموشی رمز عبور</h1>
              <p className="text-muted-foreground text-sm">
                نگران نباشید! ایمیل خود را وارد کنید تا لینک بازیابی برایتان ارسال شود
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="email" className="label">
                  ایمیل یا شماره موبایل
                </label>
                <div className="relative">
                  <Icon
                    name="material-symbols--mail"
                    className="text-muted-foreground absolute top-1/2 left-3 size-5 -translate-y-1/2"
                  />
                  <Input
                    id="email"
                    type="text"
                    className="ps-10"
                    placeholder="example@domain.com"
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <p className="text-muted-foreground text-xs">
                  لینک بازیابی به این آدرس ارسال می‌شود
                </p>
              </div>

              <Button type="submit" className="w-full">
                <Icon name="material-symbols--send" className="size-5" />
                ارسال لینک بازیابی
              </Button>

              <AuthSeparator />

              <Link
                to="/login"
                className="button inline-flex w-full items-center justify-center gap-2"
                {...{ variant: 'outline' }}
              >
                <Icon name="material-symbols--arrow-back" className="size-5" />
                بازگشت به صفحه ورود
              </Link>
            </form>

            {submitted && (
              <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <div className="flex items-start gap-3">
                  <Icon
                    name="material-symbols--check-circle"
                    className="mt-0.5 size-5 shrink-0 text-emerald-600"
                  />
                  <div className="text-sm">
                    <p className="mb-1 font-medium text-emerald-600">ایمیل ارسال شد!</p>
                    <p className="text-emerald-700/80">
                      لطفاً صندوق ورودی خود را بررسی کنید. اگر ایمیل را مشاهده نکردید، پوشه
                      spam را نیز بررسی نمایید.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-muted-foreground mt-6 text-center text-sm">
          به کمک نیاز دارید؟{' '}
          <Link to="/help" className="text-primary hover:underline">
            تماس با پشتیبانی
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
