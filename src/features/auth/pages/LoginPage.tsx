import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
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
      <div className="text-center mb-2">
        <h2 className="text-[32px] font-bold text-on-surface mb-1">Welcome back</h2>
        <p className="text-base text-on-surface-variant">Sign in to continue your health journey</p>
      </div>
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
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register('password')}
        />
        {errors.root && (
          <p className="text-sm text-error bg-error-container p-3 rounded-lg">{errors.root.message}</p>
        )}
        <div className="flex justify-end">
          <button type="button" className="text-sm font-semibold text-primary hover:underline">
            Forgot password?
          </button>
        </div>
        <Button type="submit" fullWidth loading={isLoading}>
          Sign In
        </Button>
      </form>
      <p className="text-center text-sm text-on-surface-variant">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary font-semibold hover:underline">Create one</Link>
      </p>
    </div>
  );
}
