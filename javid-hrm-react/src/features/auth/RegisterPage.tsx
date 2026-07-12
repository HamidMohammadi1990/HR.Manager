import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { AuthLayout } from './AuthLayout';

const STEPS = [
  { number: '۱', label: 'اطلاعات اولیه', active: true },
  { number: '۲', label: 'تأیید هویت', active: false },
  { number: '۳', label: 'تکمیل ثبت‌نام', active: false },
];

export default function RegisterPage() {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <AuthLayout variant="custom" className="bg-background min-h-screen">
      <div className="bg-card sticky top-0 z-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="mx-auto flex max-w-2xl items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.number} className="contents">
                <div className="flex items-center gap-2">
                  <div
                    className={
                      step.active
                        ? 'bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full text-sm font-semibold'
                        : 'bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-full text-sm font-semibold'
                    }
                  >
                    {step.number}
                  </div>
                  <span
                    className={
                      step.active
                        ? 'hidden text-sm font-medium sm:inline'
                        : 'text-muted-foreground hidden text-sm sm:inline'
                    }
                  >
                    {step.label}
                  </span>
                </div>
                {index < STEPS.length - 1 && <div className="bg-muted mx-2 h-0.5 flex-1" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">ایجاد حساب کاربری جدید</CardTitle>
              <CardDescription>برای شروع، لطفاً اطلاعات زیر را وارد کنید</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="fname" className="label">
                      نام
                    </label>
                    <Input id="fname" type="text" placeholder="نام خود را وارد کنید" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lname" className="label">
                      نام خانوادگی
                    </label>
                    <Input id="lname" type="text" placeholder="نام خانوادگی" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="label">
                    ایمیل
                  </label>
                  <div className="relative">
                    <Icon
                      name="material-symbols--mail"
                      className="text-muted-foreground absolute top-1/2 left-3 size-5 -translate-y-1/2"
                    />
                    <Input
                      id="email"
                      type="email"
                      className="ps-10"
                      placeholder="example@domain.com"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="label">
                    شماره موبایل
                  </label>
                  <div className="relative">
                    <Icon
                      name="lucide:phone"
                      className="text-muted-foreground absolute top-1/2 left-3 size-5 -translate-y-1/2"
                    />
                    <Input
                      id="phone"
                      type="tel"
                      className="ps-10"
                      placeholder="09123456789"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="password" className="label">
                      رمز عبور
                    </label>
                    <Input
                      id="password"
                      type="password"
                      className="placeholder:text-right"
                      placeholder="حداقل ۸ کاراکتر"
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirm" className="label">
                      تکرار رمز عبور
                    </label>
                    <Input
                      id="confirm"
                      type="password"
                      className="placeholder:text-right"
                      placeholder="تکرار رمز عبور"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="bg-muted/30 flex items-start gap-3 rounded-xl p-4">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                  />
                  <label htmlFor="terms" className="text-muted-foreground text-sm">
                    با ثبت‌نام،{' '}
                    <Link to="/terms" className="text-primary hover:underline">
                      قوانین و مقررات
                    </Link>{' '}
                    و{' '}
                    <Link to="/privacy" className="text-primary hover:underline">
                      حریم خصوصی
                    </Link>{' '}
                    را می‌پذیرم
                  </label>
                </div>

                <Button type="submit" className="w-full">
                  ثبت‌نام و ادامه
                  <Icon
                    name="material-symbols--arrow-back"
                    className="size-5 rotate-180"
                  />
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-muted-foreground mt-6 text-center text-sm">
            قبلاً ثبت‌نام کرده‌اید؟{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              ورود به حساب
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
