import { type InputHTMLAttributes, forwardRef, type ReactNode } from 'react';
import { cn } from '@utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  suffix?: string;
  rightElement?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, suffix, rightElement, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-on-surface">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full px-4 py-2.5 text-sm text-on-surface bg-background border-2 rounded-xl transition-colors duration-150 placeholder:text-on-surface-variant/50 focus-visible:outline-none focus-visible:border-primary',
              error ? 'border-error' : 'border-outline hover:border-on-surface-variant/50',
              suffix && 'pr-12',
              className
            )}
            {...props}
          />
          {rightElement ? (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          ) : suffix ? (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">
              {suffix}
            </span>
          ) : null}
        </div>
        {error && <p className="text-xs text-error">{error}</p>}
        {hint && !error && <p className="text-xs text-on-surface-variant">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
