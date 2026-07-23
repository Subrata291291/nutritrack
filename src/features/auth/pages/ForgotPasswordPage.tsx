import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('user_login', email);

      const res = await fetch(
        `${import.meta.env.VITE_WP_API_URL?.replace('/wp-json', '')}/wp-login.php?action=lostpassword`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
        }
      );

      if (res.ok) {
        setSent(true);
      } else {
        setError('Could not find an account with that email address.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="space-y-6 text-center py-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 ring-1 ring-primary/20 mb-2">
          <span className="material-symbols-outlined text-[32px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
        </div>
        <div>
          <h2 className="text-headline-md font-bold text-on-surface tracking-tight">Check your email</h2>
          <p className="text-body-md text-on-surface-variant/70 mt-2">
            We've sent a password reset link to <strong className="text-on-surface">{email}</strong>
          </p>
        </div>
        <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors mt-2">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-headline-md font-bold text-on-surface tracking-tight">Reset your password</h2>
        <p className="text-body-md text-on-surface-variant/70 mt-1">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-error-container/80 text-sm text-error">
            <span className="material-symbols-outlined text-[18px] mt-0.5 flex-shrink-0">error</span>
            <span>{error}</span>
          </div>
        )}
        <Button type="submit" fullWidth size="lg" loading={loading}>
          Send reset link
        </Button>
      </form>
      <p className="text-center text-sm text-on-surface-variant">
        Remember your password?{' '}
        <Link to="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">Sign in</Link>
      </p>
    </div>
  );
}
