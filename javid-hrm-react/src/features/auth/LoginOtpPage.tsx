import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';
import { useCountdown } from '@/hooks/useClock';
import { formatPersianNumber } from '@/lib/utils';
import { AuthCard, AuthLayout } from './AuthLayout';
import { useOtpInput } from './hooks/useOtpInput';

const OTP_LENGTH = 4;
const RESEND_SECONDS = 120;

export default function LoginOtpPage() {
  const [otpError, setOtpError] = useState('');
  const { seconds, reset, isExpired } = useCountdown(RESEND_SECONDS);

  const handleSubmit = useCallback((value: string) => {
    if (value) {
      setOtpError('');
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
    setOtpError('');
  };

  const formattedTime = `${formatPersianNumber(Math.floor(seconds / 60))}:${formatPersianNumber(
    String(seconds % 60).padStart(2, '0'),
  )}`;

  return (
    <AuthLayout variant="grid">
      <AuthCard>
        <div className="relative w-full">
          <div className="absolute top-6 right-4">
            <Link
              to="/login"
              className="xs:text-sm text-muted-foreground hover:text-card-foreground flex items-center gap-0.5 duration-300 hover:gap-1.5"
            >
              <Icon name="lucide:chevron-right" className="size-5" />
              مرحله قبل
            </Link>
          </div>

          <div className="flex flex-col items-center justify-center gap-1 px-4 py-6">
            <div className="bg-secondary mb-3 flex size-14 items-center justify-center rounded-full">
              <Icon name="lucide:user" className="size-7" />
            </div>
            <h1 className="text-card-foreground text-lg font-semibold">کد تایید را وارد کنید</h1>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
          >
            <div className="px-6 pb-6">
              <div className="space-y-2">
                <div className="flex justify-center gap-6" dir="ltr">
                  {Array.from({ length: OTP_LENGTH }, (_, index) => (
                    <Input
                      key={index}
                      className="data-filled:border-border-light focus:border-border-light size-14 rounded-lg text-center text-lg duration-200 sm:size-14"
                      {...getInputProps(index)}
                    />
                  ))}
                </div>
                {otpError && <p className="text-warning h-5 text-sm">{otpError}</p>}
              </div>
            </div>

            <ul className="mb-6 space-y-3 px-6 text-sm">
              <li>
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
              </li>
              <li>
                <Link to="/login" className="link">
                  ورود با کلمه عبور
                  <Icon name="lucide:chevron-left" className="size-4.5" />
                </Link>
              </li>
            </ul>

            <div className="border-t p-6">
              <Button type="button" className="w-full" onClick={handleConfirm}>
                تایید
              </Button>
            </div>
          </form>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
