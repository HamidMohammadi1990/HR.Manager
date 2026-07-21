import { FormEvent, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks';
import { getApiErrorMessage } from '@/services/api';
import { AuthArtCanvas } from './AuthArtCanvas';
import { AuthCard, AuthLayout } from './AuthLayout';

const REMEMBER_USERNAME_KEY = 'javid-hrm.remembered-username';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isLoading } = useAuth();
  const { toggleTheme } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const remembered = localStorage.getItem(REMEMBER_USERNAME_KEY);
    if (remembered) {
      setUsername(remembered);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setUsernameError('');
    setPasswordError('');
    setFormError('');

    if (!username.trim()) {
      setUsernameError('شماره موبایل یا ایمیل را وارد کنید');
      return;
    }
    if (!password.trim()) {
      setPasswordError('رمز عبور را وارد کنید');
      return;
    }

    try {
      await signIn({ UserName: username.trim(), Password: password });
      if (rememberMe) {
        localStorage.setItem(REMEMBER_USERNAME_KEY, username.trim());
      } else {
        localStorage.removeItem(REMEMBER_USERNAME_KEY);
      }
      const redirectTo = (location.state as { from?: string } | null)?.from ?? '/';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    }
  };

  return (
    <AuthLayout variant="grid">
      <AuthArtCanvas />

      <button
        type="button"
        className="button absolute start-4 top-4 z-20"
        data-variant="outline"
        data-size="icon-sm"
        onClick={toggleTheme}
        aria-label="تغییر تم"
      >
        <Icon name="material-symbols:dark-mode-outline" className="size-[1.125rem]" />
      </button>

      <AuthCard className="z-10 w-full sm:max-w-[26rem]">
        <div className="relative w-full">
          <div className="flex flex-col items-center gap-2 px-6 pt-8 pb-2 text-center">
            <div className="from-primary to-primary/70 text-primary-foreground mb-1 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-sm">
              <Icon name="material-symbols:corporate-fare" className="size-7" />
            </div>
            <p className="text-muted-foreground text-xs font-medium tracking-wide">جاوید HRM</p>
            <h1 className="text-card-foreground text-xl font-semibold">ورود به پنل مدیریت</h1>
            <p className="text-muted-foreground max-w-[18rem] text-sm leading-6">
              خوش آمدید. برای ادامه وارد حساب کاربری خود شوید.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 px-6 py-5">
              {formError && (
                <div
                  className="border-destructive/25 bg-destructive/8 text-destructive rounded-lg border px-3 py-2.5 text-sm"
                  role="alert"
                >
                  {formError}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  نام کاربری
                </label>
                <Input
                  id="username"
                  dir="ltr"
                  autoComplete="username"
                  autoFocus
                  className="h-11 placeholder:text-right"
                  placeholder="شماره موبایل یا ایمیل"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
                {usernameError && (
                  <p className="text-destructive text-sm">{usernameError}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="password" className="text-sm font-medium">
                    رمز عبور
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                  >
                    فراموشی رمز؟
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    dir="ltr"
                    autoComplete="current-password"
                    className="h-11 pe-11 placeholder:text-right"
                    placeholder="رمز عبور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground absolute end-3 top-1/2 -translate-y-1/2 transition-colors"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'مخفی کردن رمز' : 'نمایش رمز'}
                    tabIndex={-1}
                  >
                    <Icon
                      name={showPassword ? 'material-symbols:visibility-off' : 'material-symbols:visibility'}
                      className="size-5"
                    />
                  </button>
                </div>
                {passwordError && (
                  <p className="text-destructive text-sm">{passwordError}</p>
                )}
              </div>

              <label className="text-muted-foreground flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                مرا به خاطر بسپار
              </label>
            </div>

            <div className="space-y-4 border-t px-6 py-5">
              <Button type="submit" className="h-11 w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <Icon name="material-symbols:progress-activity" className="size-4 animate-spin" />
                    در حال ورود...
                  </span>
                ) : (
                  'ورود به پنل'
                )}
              </Button>

              <p className="text-muted-foreground text-center text-sm">
                ورود با کد یکبارمصرف؟{' '}
                <Link to="/login-otp" className="text-primary font-medium hover:underline">
                  ادامه با OTP
                </Link>
              </p>
            </div>
          </form>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
