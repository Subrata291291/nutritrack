import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@utils/cn';
import { useAuth } from '@hooks/useAuth';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      const onboardingDone = localStorage.getItem('onboarding_completed') === 'true';
      navigate(onboardingDone ? '/dashboard' : '/onboarding', { replace: true });
    } catch {
      setError('root', { message: 'Invalid email or password. Please try again.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-headline-md font-bold text-on-surface tracking-tight">Sign in</h2>
        <p className="text-body-md text-on-surface-variant/70 mt-1">Enter your credentials to continue</p>
      </div>

      {/* Social buttons */}
      <div className="flex gap-3">
        <button type="button" className="flex-1 flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-outline-variant/50 bg-transparent hover:bg-surface-container-low active:bg-surface-container-higher transition-all text-sm font-medium text-on-surface-variant">
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Google
        </button>
        <button type="button" className="flex-1 flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-outline-variant/50 bg-transparent hover:bg-surface-container-low active:bg-surface-container-higher transition-all text-sm font-medium text-on-surface-variant">
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
          Apple
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-outline-variant/40" />
        <span className="text-label-sm text-on-surface-variant/40 font-medium">or sign in with email</span>
        <div className="flex-1 h-px bg-outline-variant/40" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          error={errors.password?.message}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-on-surface-variant/60 hover:text-on-surface-variant transition-colors p-1"
              tabIndex={-1}
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility' : 'visibility_off'}
              </span>
            </button>
          }
          {...register('password')}
        />

        {errors.root && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-error-container/80 text-sm text-error">
            <span className="material-symbols-outlined text-[18px] mt-0.5 flex-shrink-0">error</span>
            <span>{errors.root.message}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2.5 cursor-pointer group" onClick={() => setRememberMe(!rememberMe)}>
            <div className={cn(
              'w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0',
              rememberMe
                ? 'bg-primary border-primary shadow-sm shadow-primary/20'
                : 'border-outline-variant group-hover:border-on-surface-variant/50'
            )}>
              {rememberMe && <span className="material-symbols-outlined text-[14px] text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>}
            </div>
            <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth size="lg" loading={isLoading}>
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-on-surface-variant">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors">Create one</Link>
      </p>
    </div>
  );
}
