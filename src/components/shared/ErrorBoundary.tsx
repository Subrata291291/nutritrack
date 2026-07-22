import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <span className="material-symbols-outlined text-5xl text-error mb-4">error</span>
          <h3 className="text-lg font-semibold text-on-surface mb-1">Something went wrong</h3>
          <p className="text-sm text-on-surface-variant mb-4">{this.state.error?.message || 'An unexpected error occurred.'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-primary text-on-primary text-sm font-semibold rounded-xl hover:opacity-90"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
