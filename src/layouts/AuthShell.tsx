import { Outlet, useLocation } from 'react-router-dom';
import { cn } from '@utils/cn';

export function AuthShell() {
  const { pathname } = useLocation();
  const isLogin = pathname === '/login';

  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex items-center justify-center p-4 sm:p-6">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-tertiary/5 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-primary/3 blur-2xl" />
        <div className="absolute bottom-1/4 right-1/3 w-48 h-48 rounded-full bg-secondary/5 blur-2xl" />
        {/* Dot pattern overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
      </div>

      <div className="relative w-full max-w-[440px]">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 ring-1 ring-primary/20 mb-4 backdrop-blur-sm">
            <span className="material-symbols-outlined text-[28px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>fitness_center</span>
          </div>
          <h1 className="text-[28px] font-bold text-on-surface tracking-tight">NutriTrack</h1>
          <p className="text-sm text-on-surface-variant/70 mt-1">
            {isLogin ? 'Welcome back to your health journey' : 'Start your personalized nutrition journey'}
          </p>
        </div>

        {/* Premium card */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] backdrop-blur-sm overflow-hidden">
          {/* Accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-primary/60 via-primary/40 to-transparent" />
          <div className="p-6 sm:p-8">
            <Outlet />
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-on-surface-variant/40 mt-6">
          &copy; {new Date().getFullYear()} NutriTrack. All rights reserved.
        </p>
      </div>
    </div>
  );
}
