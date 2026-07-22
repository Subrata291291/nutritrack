import { Outlet } from 'react-router-dom';

export function AuthShell() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-[32px] font-bold text-primary">NutriTrack</h1>
          <p className="text-base text-on-surface-variant">Your Health Dashboard</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
