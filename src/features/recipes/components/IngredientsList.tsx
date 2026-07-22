import { useState } from 'react';
import { Card } from '@components/ui/Card';
import type { RecipeIngredient } from 'types/recipe';

interface IngredientsListProps {
  ingredients: RecipeIngredient[];
}

export function IngredientsList({ ingredients }: IngredientsListProps) {
  const [checked, setChecked] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(ingredients.map((item, idx) => [idx, item.checked !== false]))
  );
  const [copied, setCopied] = useState(false);

  const toggle = (idx: number) =>
    setChecked((prev) => ({ ...prev, [idx]: !prev[idx] }));

  const handleAddAll = async () => {
    const list = ingredients
      .map((item, idx) => `${checked[idx] ? '✓' : '○'} ${item.name}${item.quantity ? ` — ${item.quantity}` : ''}`)
      .join('\n');
    try {
      await navigator.clipboard.writeText(list);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback: open print dialog with the list
      const win = window.open('', '_blank');
      if (win) {
        win.document.write(`<pre style="font-family:sans-serif;padding:24px">${list}</pre>`);
        win.print();
      }
    }
  };

  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <Card padding="lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-on-surface">Ingredients</h3>
        <span className="text-xs text-on-surface-variant bg-surface-container px-2 py-1 rounded-full">
          {checkedCount}/{ingredients.length} checked
        </span>
      </div>
      <ul className="space-y-3">
        {ingredients.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <button
              onClick={() => toggle(idx)}
              className={`mt-0.5 h-5 w-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                checked[idx]
                  ? 'bg-primary border-primary'
                  : 'border-outline-variant hover:border-primary'
              }`}
            >
              {checked[idx] && (
                <span className="material-symbols-outlined text-on-primary text-[14px]">check</span>
              )}
            </button>
            <div className={`transition-opacity ${checked[idx] ? 'opacity-50 line-through' : ''}`}>
              <span className="text-sm text-on-surface">{item.name}</span>
              {item.quantity && (
                <span className="text-xs text-on-surface-variant ml-2">{item.quantity}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={handleAddAll}
        className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary hover:underline transition-colors"
      >
        <span className="material-symbols-outlined text-[16px]">
          {copied ? 'check_circle' : 'content_copy'}
        </span>
        {copied ? 'Copied to clipboard!' : 'Copy Grocery List'}
      </button>
    </Card>
  );
}
