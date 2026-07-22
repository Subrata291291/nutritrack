import type { ShoppingList } from 'types/meal-plan';

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
  shoppingList: ShoppingList | null;
  weekStart: string;
}

function CategorySection({ category, items }: { category: string; items: { id: number; name: string; quantity: string; checked: boolean }[] }) {
  if (items.length === 0) return null;

  return (
    <div>
      <h4 className="text-sm font-semibold text-on-surface mb-2">{categoryLabels[category] || category}</h4>
      <div className="space-y-1">
        {items.map((item) => (
          <label key={item.id} className="flex items-center gap-3 p-1.5 rounded hover:bg-surface-container-low cursor-pointer">
            <input
              type="checkbox"
              defaultChecked={item.checked}
              className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
            />
            <span className={`text-sm ${item.checked ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
              {item.name}
            </span>
            <span className="text-xs text-on-surface-variant ml-auto">{item.quantity}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function ShoppingListModal({ isOpen, onClose, shoppingList, weekStart }: ShoppingListModalProps) {
  if (!isOpen) return null;

  const categories = shoppingList
    ? [...new Set(shoppingList.items.map((i) => i.category))]
    : [];

  const formatWeek = () => {
    const start = new Date(weekStart);
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${start.toLocaleDateString('en-US', opts)} - ${end.toLocaleDateString('en-US', opts)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-6 pb-4 border-b border-outline-variant/40">
          <div>
            <h2 className="text-headline-md font-semibold text-on-surface">Shopping List</h2>
            <p className="text-sm text-on-surface-variant">{formatWeek()}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {!shoppingList || shoppingList.items.length === 0 ? (
            <p className="text-sm text-on-surface-variant text-center py-4">No items in your shopping list yet.</p>
          ) : (
            categories.map((cat) => (
              <CategorySection key={cat} category={cat} items={shoppingList.items.filter((i) => i.category === cat)} />
            ))
          )}
        </div>
        <div className="flex gap-3 p-6 pt-4 border-t border-outline-variant/40">
          <button className="flex-1 py-3 bg-surface-container-low text-on-surface-variant text-sm font-semibold rounded-xl border border-outline-variant hover:bg-surface-container transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-base">print</span>
            Print
          </button>
          <button className="flex-1 py-3 bg-primary text-on-primary text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-base">send</span>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
