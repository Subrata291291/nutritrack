import { Outlet, useLocation } from 'react-router-dom';
import { cn } from '@utils/cn';

export function AuthShell() {
  const { pathname } = useLocation();
  const isLogin = pathname === '/login';

  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex items-center justify-center p-4 sm:p-6">
      {/* Premium decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Base gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-tertiary/[0.03]" />

        {/* Large glowing orbs */}
        <div className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/8 to-primary/[0.02] blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-48 -left-48 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-tertiary/8 to-tertiary/[0.02] blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-gradient-to-br from-secondary/6 to-secondary/[0.01] blur-[80px] animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-gradient-to-tl from-primary/5 to-transparent blur-[90px] animate-pulse" style={{ animationDuration: '9s' }} />

        {/* Floating accent circles */}
        <div className="absolute top-[15%] right-[20%] w-3 h-3 rounded-full bg-primary/20 blur-[1px] animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-[25%] left-[15%] w-2 h-2 rounded-full bg-tertiary/30 blur-[1px] animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-[30%] right-[25%] w-2.5 h-2.5 rounded-full bg-secondary/25 blur-[1px] animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-[20%] left-[20%] w-1.5 h-1.5 rounded-full bg-primary/20 blur-[1px] animate-float" style={{ animationDelay: '4.5s' }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }} />

        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: 'radial-gradient(circle, currentColor 0.5px, transparent 0.5px)',
          backgroundSize: '20px 20px',
        }} />

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/40" />
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
        <div className="relative bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] backdrop-blur-sm overflow-hidden before:absolute before:inset-0 before:rounded-2xl before:p-[1px] before:bg-gradient-to-b before:from-white/[0.06] before:to-transparent before:pointer-events-none">
          {/* Accent bar */}
          <div className="relative h-1 w-full bg-gradient-to-r from-primary/60 via-primary/30 to-transparent" />
          <div className="relative p-6 sm:p-8">
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
