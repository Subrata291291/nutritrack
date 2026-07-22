import { cn } from '@utils/cn';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon = 'inbox', title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">{icon}</span>
      <h3 className="text-lg font-semibold text-on-surface mb-1">{title}</h3>
      {description && <p className="text-sm text-on-surface-variant max-w-xs mb-4">{description}</p>}
      {action}
    </div>
  );
}
