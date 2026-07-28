import { cn } from '@utils/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 pt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={cn(
          'px-4 py-2 text-sm font-semibold rounded-full border transition-colors',
          currentPage <= 1
            ? 'bg-surface-container-low text-on-surface-variant/50 border-outline-variant cursor-not-allowed'
            : 'bg-surface-container-low text-on-surface-variant border-outline-variant hover:bg-surface-container'
        )}
      >
        Previous
      </button>
      <span className="text-sm text-on-surface-variant px-2">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={cn(
          'px-4 py-2 text-sm font-semibold rounded-full border transition-colors',
          currentPage >= totalPages
            ? 'bg-surface-container-low text-on-surface-variant/50 border-outline-variant cursor-not-allowed'
            : 'bg-surface-container-low text-on-surface-variant border-outline-variant hover:bg-surface-container'
        )}
      >
        Next
      </button>
    </div>
  );
}