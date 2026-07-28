interface ShoppingListItemProps {
  name: string;
  quantity: string;
  checked: boolean;
  onToggle: () => void;
}

export function ShoppingListItem({ name, quantity, checked, onToggle }: ShoppingListItemProps) {
  return (
    <label className="flex items-center gap-3 py-1.5 px-1 rounded-lg hover:bg-surface-container-low cursor-pointer transition-colors group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
      />
      <span className={`text-sm flex-1 ${checked ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
        {name}
      </span>
      <span className={`text-xs font-medium ${checked ? 'text-on-surface-variant/50' : 'text-on-surface-variant'}`}>
        {quantity}
      </span>
    </label>
  );
}