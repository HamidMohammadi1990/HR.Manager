import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';
import { Card, CardContent } from '@/components/ui/Card';
import { useCountdown } from '@/hooks/useClock';
import { formatPersianNumber } from '@/lib/utils';
import { AuthLayout } from './AuthLayout';
import { useOtpInput } from './hooks/useOtpInput';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 90;

export default function TwoFactorPage() {
  const { seconds, reset, isExpired } = useCountdown(RESEND_SECONDS);

  const handleSubmit = useCallback((value: string) => {
    if (value) {
      // Handle 2FA verification
    }
  }, []);

  const { getValue, getInputProps, reset: resetOtp } = useOtpInput({
    length: OTP_LENGTH,
    onComplete: handleSubmit,
  });

  const handleConfirm = () => {
    const value = getValue();
    if (value) handleSubmit(value);
  };

  const handleResend = () => {
    if (!isExpired) return;
    reset();
    resetOtp();
  };

  const formattedTime = `${formatPersianNumber(Math.floor(seconds / 60))}:${formatPersianNumber(
    String(seconds % 60).padStart(2, '0'),
  )}`;

  return (
    <AuthLayout variant="plain">
      <div className="w-full max-w-lg">
        <Card>
          <CardContent className="p-8">
            <div className="relative mx-auto mb-6 size-24">
              <div className="absolute inset-0 animate-pulse rounded-full bg-emerald-500/20" />
              <div className="relative flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600">
                <Icon name="material-symbols--verified-user" className="size-12 text-white" />
              </div>
            </div>

            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold">تأیید دو مرحله‌ای</h1>
              <p className="text-muted-foreground text-sm">
                کد ۶ رقمی ارسال شده به{' '}
                <span className="text-foreground font-medium">09123456789</span> را وارد کنید
              </p>
            </div>

            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleConfirm();
              }}
            >
              <div className="flex justify-center gap-6" dir="ltr">
                {Array.from({ length: OTP_LENGTH }, (_, index) => (
                  <Input
                    key={index}
                    className="data-filled:border-border-light focus:border-border-light size-14 rounded-lg text-center text-lg duration-200 sm:size-14"
                    {...getInputProps(index)}
                  />
                ))}
              </div>

              <div className="text-center">
                {!isExpired ? (
                  <p className="text-muted-foreground text-sm select-none">
                    زمان باقی‌مانده تا ارسال مجدد{' '}
                    <span className="font-bold">{formattedTime}</span>
                  </p>
                ) : (
                  <button type="button" className="link" onClick={handleResend}>
                    ارسال مجدد کد تایید
                    <Icon name="lucide:chevron-left" className="size-4.5" />
                  </button>
                )}
              </div>

              <Button type="submit" className="w-full">
                <Icon name="material-symbols--check-circle" className="size-5" />
                تأیید و ادامه
              </Button>
            </form>

            <div className="mt-8 border-t pt-6">
              <p className="text-muted-foreground mb-4 text-center text-sm">
                روش‌های جایگزین دریافت کد
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Icon name="material-symbols--sms" className="size-4" />
                  پیامک
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Icon name="material-symbols--mail" className="size-4" />
                  ایمیل
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-muted-foreground mt-6 text-center text-sm">
          <Link to="/login" className="text-primary hover:underline">
            بازگشت به ورود
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
