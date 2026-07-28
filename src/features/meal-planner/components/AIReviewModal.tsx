import { Modal } from '@components/shared/Modal';
import { Button } from '@components/ui/Button';
import { DayReviewPanel } from './DayReviewPanel';
import type { AIGeneratedPlan } from 'types/ai-meal-plan';

interface AIReviewModalProps {
  open: boolean;
  plan: AIGeneratedPlan | null;
  warnings: string[];
  onApprove: () => void;
  onCancel: () => void;
  onRegenerate: () => void;
  regenerating: boolean;
  saving: boolean;
  saveError: string | null;
  failedDates: string[];
  showConfirm: boolean;
  onConfirmSave: () => void;
  onCancelConfirm: () => void;
  onRetrySave: () => void;
}

export function AIReviewModal({
  open,
  plan,
  warnings,
  onApprove,
  onCancel,
  onRegenerate,
  regenerating,
  saving,
  saveError,
  failedDates,
  showConfirm,
  onConfirmSave,
  onCancelConfirm,
  onRetrySave,
}: AIReviewModalProps) {
  return (
    <Modal open={open} onClose={saving ? () => {} : onCancel} title="AI-Generated Meal Plan" className="max-w-3xl">
      {warnings.length > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-sm">info</span>
            <span className="text-label-sm font-semibold text-amber-700 dark:text-amber-300">Review Warnings</span>
          </div>
          {warnings.map((w, i) => (
            <p key={i} className="text-label-sm text-amber-600 dark:text-amber-400 ml-6">{w}</p>
          ))}
        </div>
      )}

      {saveError && (
        <div className="mb-4 p-3 rounded-xl bg-error-container/20 border border-error/20">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="material-symbols-outlined text-error text-sm">error</span>
            <span className="text-label-sm font-semibold text-error">Save Failed</span>
          </div>
          <p className="text-label-sm text-error ml-6">{saveError}</p>
          {failedDates.length > 0 && (
            <p className="text-label-sm text-error ml-6 mt-1">
              Failed dates: {failedDates.join(', ')}
            </p>
          )}
        </div>
      )}

      <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
        {plan?.days.map((day, i) => (
          <DayReviewPanel key={day.date} day={day} index={i} />
        ))}
      </div>

      {plan && (
        <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-outline-variant/40">
          <span className="material-symbols-outlined text-primary text-sm">psychology</span>
          <span className="text-label-sm font-semibold text-on-surface">
            Overall Confidence: {(plan.overallConfidence * 100).toFixed(0)}%
          </span>
        </div>
      )}

      {showConfirm ? (
        <div className="mt-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant">
          <p className="text-body-md font-semibold text-on-surface mb-1">
            Save this generated meal plan?
          </p>
          <p className="text-label-sm text-on-surface-variant mb-4">
            This will replace your current meal plan for the week.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={onCancelConfirm} disabled={saving}>
              Cancel
            </Button>
            <Button variant="primary" onClick={onConfirmSave} loading={saving}>
              <span className="material-symbols-outlined text-sm">save</span>
              Save
            </Button>
          </div>
        </div>
      ) : saveError ? (
        <div className="flex gap-3 mt-4 pt-4 border-t border-outline-variant/40">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onRetrySave} className="ml-auto">
            <span className="material-symbols-outlined text-sm">refresh</span>
            Retry
          </Button>
        </div>
      ) : (
        <div className="flex gap-3 mt-4 pt-4 border-t border-outline-variant/40">
          <Button variant="ghost" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button variant="outline" onClick={onRegenerate} loading={regenerating} disabled={saving}>
            <span className="material-symbols-outlined text-sm">refresh</span>
            Regenerate
          </Button>
          <Button variant="primary" onClick={onApprove} className="ml-auto" disabled={saving}>
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Approve
          </Button>
        </div>
      )}
    </Modal>
  );
}