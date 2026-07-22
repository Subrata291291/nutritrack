import { cn } from '@utils/cn';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  highlighted?: boolean;
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export function Card({ children, className, padding = 'md', highlighted }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface-container-lowest rounded-2xl border border-outline',
        highlighted && 'border-primary shadow-sm',
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
