import { useEffect, useCallback } from 'react';
import { Modal } from '@components/shared/Modal';
import { Button } from '@components/ui/Button';
import { ShoppingListCategory } from './ShoppingListCategory';
import { useShoppingList } from '../hooks/useShoppingList';
import type { MealPlanDay } from 'types/meal-plan';

const categoryLabels: Record<string, string> = {
  produce: 'Produce',
  proteins: 'Proteins',
  dairy: 'Dairy',
  grains: 'Grains',
  spices: 'Spices',
  other: 'Other',
};

interface ShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  days: MealPlanDay[];
}

export function ShoppingListModal({ isOpen, onClose, days }: ShoppingListModalProps) {
  const { loading, error, items, generated, generate, toggleChecked, reset } = useShoppingList();

  useEffect(() => {
    if (isOpen && !generated && !loading) {
      generate(days);
    }
  }, [isOpen, generated, loading, generate, days]);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const categories = [...new Set(items.map((i) => i.category))].sort((a, b) => {
    const order = ['produce', 'proteins', 'dairy', 'grains', 'spices', 'other'];
    return order.indexOf(a) - order.indexOf(b);
  });

  return (
    <Modal open={isOpen} onClose={handleClose} title="Shopping List" className="max-w-lg">
      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-[36px] text-secondary animate-spin">sync</span>
            <p className="text-label-sm text-on-surface-variant">Building grocery list...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="flex flex-col items-center py-8 gap-3">
          <span className="material-symbols-outlined text-[40px] text-error/60">error</span>
          <p className="text-body-md text-on-surface-variant font-semibold">Failed to generate list</p>
          <p className="text-label-sm text-on-surface-variant text-center">{error}</p>
          <div className="flex gap-2 mt-2">
            <Button variant="ghost" size="sm" onClick={handleClose}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={() => generate(days)}>
              <span className="material-symbols-outlined text-sm">refresh</span>
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && generated && items.length === 0 && (
        <div className="flex flex-col items-center py-8 gap-2">
          <span className="material-symbols-outlined text-[40px] text-on-surface-variant/40">shopping_cart</span>
          <p className="text-body-md text-on-surface-variant font-semibold">No items needed</p>
          <p className="text-label-sm text-on-surface-variant text-center">
            Your meal plan doesn't have any recipes with ingredients yet.
          </p>
        </div>
      )}

      {/* Items */}
      {!loading && !error && items.length > 0 && (
        <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
          {categories.map((cat) => (
            <ShoppingListCategory
              key={cat}
              label={categoryLabels[cat] || cat}
              icon={cat}
              items={items.filter((i) => i.category === cat)}
              onToggle={toggleChecked}
            />
          ))}
        </div>
      )}

      {/* Footer */}
      {!loading && !error && generated && (
        <div className="flex gap-3 mt-4 pt-4 border-t border-outline-variant/40">
          <Button variant="outline" onClick={handlePrint} className="flex-1">
            <span className="material-symbols-outlined text-sm">print</span>
            Print
          </Button>
          <Button variant="ghost" onClick={handleClose} className="flex-1">
            Close
          </Button>
        </div>
      )}
    </Modal>
  );
}