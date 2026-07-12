import { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';
import { useAuth } from '@/contexts/AuthContext';
import { getApiErrorMessage } from '@/services/api';
import { AuthCard, AuthLayout } from './AuthLayout';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setUsernameError('');
    setPasswordError('');
    setFormError('');

    if (!username.trim()) {
      setUsernameError('لطفاً شماره موبایل یا ایمیل را وارد کنید');
      return;
    }
    if (!password.trim()) {
      setPasswordError('لطفاً کلمه عبور را وارد کنید');
      return;
    }

    try {
      await signIn({ UserName: username.trim(), Password: password });
      const redirectTo = (location.state as { from?: string } | null)?.from ?? '/';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    }
  };

  return (
    <AuthLayout variant="grid">
      <AuthCard>
        <div className="relative w-full">
          <div className="flex flex-col items-center justify-center gap-1 px-4 py-6">
            <div className="bg-secondary mb-3 flex size-14 items-center justify-center rounded-full">
              <Icon name="lucide:user" className="size-7" />
            </div>
            <h1 className="text-card-foreground text-lg font-semibold">ورود به پنل ادمین</h1>
            <p className="text-center text-neutral-500">
              خوش آمدید. لطفا اطلاعات زیر را پر کنید
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 px-6 pb-6">
              {formError && (
                <p className="text-destructive bg-destructive/10 rounded-lg px-3 py-2 text-sm">
                  {formError}
                </p>
              )}
              <div className="space-y-2">
                <label htmlFor="username" className="sr-only">
                  شماره موبایل و یا ایمیل
                </label>
                <Input
                  id="username"
                  dir="ltr"
                  className="placeholder:text-right"
                  placeholder="شماره موبایل یا ایمیل"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
                {usernameError && (
                  <p className="text-warning h-5 text-sm">{usernameError}</p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="sr-only">
                  کلمه عبور
                </label>
                <Input
                  id="password"
                  type="password"
                  dir="ltr"
                  className="placeholder:text-right"
                  placeholder="کلمه عبور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                {passwordError && (
                  <p className="text-warning h-5 text-sm">{passwordError}</p>
                )}
              </div>
            </div>
            <div className="border-t p-6">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'در حال ورود...' : 'ورود'}
              </Button>
            </div>
          </form>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
