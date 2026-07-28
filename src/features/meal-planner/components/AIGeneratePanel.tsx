import { Button } from '@components/ui/Button';

interface AIGeneratePanelProps {
  loading: boolean;
  error: string | null;
  planGenerated: boolean;
  warningCount: number;
  overallConfidence: number | null;
  onGenerate: () => void;
  onRetry: () => void;
  onReset: () => void;
}

export function AIGeneratePanel({
  error,
  planGenerated,
  warningCount,
  overallConfidence,
  onRetry,
  onReset,
}: AIGeneratePanelProps) {
  if (planGenerated) {
    return (
      <div className="flex gap-2">
        {overallConfidence !== null && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary text-label-sm font-semibold">
            <span className="material-symbols-outlined text-sm">psychology</span>
            {(overallConfidence * 100).toFixed(0)}%
          </div>
        )}
        {warningCount > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-label-sm font-semibold">
            <span className="material-symbols-outlined text-sm">warning</span>
            {warningCount}
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 rounded-xl bg-error-container/20 border border-error/20">
        <div className="flex items-center gap-2 flex-1">
          <span className="material-symbols-outlined text-error text-sm">error</span>
          <p className="text-label-sm text-error font-medium">{error}</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
          <Button variant="ghost" size="sm" onClick={onReset}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return null;
}