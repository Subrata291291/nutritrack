import { useState } from 'react';
import { ShoppingListItem } from './ShoppingListItem';

interface ShoppingListCategoryProps {
  label: string;
  icon: string;
  items: { id: number; name: string; quantity: string; checked: boolean }[];
  onToggle: (itemId: number) => void;
}

const categoryIcons: Record<string, string> = {
  produce: 'eco',
  proteins: 'set_meal',
  dairy: 'egg',
  grains: 'grain',
  spices: 'travel_explore',
  other: 'category',
};

export function ShoppingListCategory({ label, icon, items, onToggle }: ShoppingListCategoryProps) {
  const [collapsed, setCollapsed] = useState(false);
  if (items.length === 0) return null;

  const checkedCount = items.filter((i) => i.checked).length;

  return (
    <div>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 w-full text-left mb-1.5 group"
      >
        <span className="material-symbols-outlined text-[16px] text-secondary">
          {collapsed ? 'chevron_right' : 'expand_more'}
        </span>
        <span className="material-symbols-outlined text-[16px] text-secondary">{categoryIcons[icon] || 'category'}</span>
        <span className="text-sm font-semibold text-on-surface">{label}</span>
        <span className="text-xs text-on-surface-variant ml-auto">
          {checkedCount}/{items.length}
        </span>
      </button>
      {!collapsed && (
        <div className="ml-2 space-y-0.5 border-l-2 border-outline-variant/20 pl-3">
          {items.map((item) => (
            <ShoppingListItem
              key={item.id}
              name={item.name}
              quantity={item.quantity}
              checked={item.checked}
              onToggle={() => onToggle(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}