import { useState } from 'react';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { AddRecipeModal } from './AddRecipeModal';
import type { Recipe } from 'types/recipe';

interface QuickActionsProps {
  recipe: Recipe;
}

export function QuickActions({ recipe }: QuickActionsProps) {
  const [servings, setServings] = useState(1);
  const [modal, setModal] = useState<'log' | 'plan' | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const inStock = recipe.ingredients.filter((i) => i.checked !== false).map((i) => i.name);
  const buyList = recipe.ingredients.filter((i) => i.checked === false).map((i) => i.name);

  return (
    <>
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-on-surface mb-4">Quick Actions</h3>

        {/* Servings picker */}
        <div className="flex items-center justify-between bg-surface-container-low rounded-lg px-3 py-2 mb-3">
          <span className="text-sm text-on-surface-variant font-medium">Servings</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setServings((s) => Math.max(1, s - 1))}
              className="w-7 h-7 rounded-full border border-outline-variant flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">remove</span>
            </button>
            <span className="text-sm font-bold w-4 text-center">{servings}</span>
            <button
              onClick={() => setServings((s) => s + 1)}
              className="w-7 h-7 rounded-full border border-outline-variant flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <Button fullWidth onClick={() => setModal('log')}>
            Add to Daily Log
          </Button>
          <Button fullWidth variant="secondary" onClick={() => setModal('plan')}>
            Add to Meal Plan
          </Button>
        </div>

        {/* Toast notification */}
        {toast && (
          <div className={`mt-3 px-3 py-2.5 rounded-lg text-sm flex items-start gap-2 ${
            toast.type === 'success'
              ? 'bg-primary-container/30 text-primary'
              : 'bg-error-container/30 text-error'
          }`}>
            <span className="material-symbols-outlined text-[16px] mt-0.5 flex-shrink-0">
              {toast.type === 'success' ? 'check_circle' : 'error'}
            </span>
            {toast.msg}
          </div>
        )}

        {recipe.ingredients.length > 0 && (
          <div className="mt-5 pt-4 border-t border-outline">
            <h4 className="text-sm font-semibold text-on-surface mb-3">Pantry Check</h4>
            <div className="space-y-2">
              {inStock.length > 0 && (
                <div className="flex items-start gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span className="text-on-surface-variant">In Stock</span>
                  <span className="ml-auto text-on-surface-variant text-right text-xs">{inStock.join(', ')}</span>
                </div>
              )}
              {buyList.length > 0 && (
                <div className="flex items-start gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-error mt-1.5 flex-shrink-0" />
                  <span className="text-on-surface-variant">Buy Soon</span>
                  <span className="ml-auto text-on-surface-variant text-right text-xs">{buyList.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Modal */}
      {modal && (
        <AddRecipeModal
          recipe={recipe}
          mode={modal}
          servings={servings}
          onClose={() => setModal(null)}
          onSuccess={(msg) => showToast('success', msg)}
          onError={(msg) => showToast('error', msg)}
        />
      )}
    </>
  );
}
