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
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <span className="material-symbols-outlined text-5xl text-primary">mail</span>
        </div>
        <h2 className="text-[32px] font-bold text-on-surface">Check your email</h2>
        <p className="text-base text-on-surface-variant">
          We've sent a password reset link to <strong className="text-on-surface">{email}</strong>
        </p>
        <Link to="/login" className="block text-sm font-semibold text-primary hover:underline mt-4">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h2 className="text-[32px] font-bold text-on-surface mb-1">Reset your password</h2>
        <p className="text-base text-on-surface-variant">
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
        {error && <p className="text-sm text-error bg-error-container p-3 rounded-lg">{error}</p>}
        <Button type="submit" fullWidth loading={loading}>
          Send reset link
        </Button>
      </form>
      <p className="text-center text-sm text-on-surface-variant">
        Remember your password?{' '}
        <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
