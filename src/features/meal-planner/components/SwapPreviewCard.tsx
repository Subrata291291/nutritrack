import type { SwapAlternative } from 'types/ai-meal-plan';

const mealTypeMeta: Record<string, { icon: string; label: string }> = {
  breakfast: { icon: 'wb_sunny', label: 'Breakfast' },
  lunch: { icon: 'lunch_dining', label: 'Lunch' },
  dinner: { icon: 'dinner_dining', label: 'Dinner' },
  snack: { icon: 'cookie', label: 'Snack' },
};

interface SwapPreviewCardProps {
  alternative: SwapAlternative;
  mealType: string;
  isSelected: boolean;
  isDuplicate: boolean;
  onClick: () => void;
}

export function SwapPreviewCard({ alternative, mealType, isSelected, isDuplicate, onClick }: SwapPreviewCardProps) {
  const meta = mealTypeMeta[mealType] || { icon: 'restaurant', label: mealType };
  return (
    <button
      onClick={onClick}
      disabled={isDuplicate}
      className={`relative w-full text-left bg-surface-container-low rounded-xl p-3 border-l-[3px] transition-all ${
        isDuplicate
          ? 'opacity-40 cursor-not-allowed'
          : isSelected
            ? 'ring-2 ring-secondary shadow-md'
            : 'hover:shadow-sm hover:bg-surface-container-hover'
      }`}
      style={{
        borderLeftColor:
          mealType === 'breakfast' ? '#fbbf24' :
          mealType === 'lunch' ? '#34d399' :
          mealType === 'dinner' ? '#a78bfa' :
          '#fb7185',
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="material-symbols-outlined text-[14px]" style={{
          color:
            mealType === 'breakfast' ? '#fbbf24' :
            mealType === 'lunch' ? '#34d399' :
            mealType === 'dinner' ? '#a78bfa' :
            '#fb7185',
        }}>{meta.icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">{meta.label}</span>
        <span className="text-[10px] ml-auto text-secondary font-semibold">
          {(alternative.confidence * 100).toFixed(0)}%
        </span>
      </div>
      {alternative.imageUrl && (
        <img src={alternative.imageUrl} alt={alternative.recipeName}
          className="w-full h-24 object-cover rounded-lg mb-2" />
      )}
      <p className="text-sm font-semibold text-on-surface truncate">{alternative.recipeName}</p>
      <div className="flex items-center gap-2 mt-1.5 text-label-sm text-on-surface-variant">
        <span className="flex items-center gap-0.5">
          <span className="material-symbols-outlined text-[11px]">local_fire_department</span>
          {alternative.calories}
        </span>
        <span className="w-1 h-1 rounded-full bg-outline-variant/60" />
        <span>P:{alternative.proteinGrams}g</span>
        <span className="w-1 h-1 rounded-full bg-outline-variant/60" />
        <span>C:{alternative.carbsGrams}g</span>
        <span className="w-1 h-1 rounded-full bg-outline-variant/60" />
        <span>F:{alternative.fatsGrams}g</span>
      </div>
      {alternative.reasoning && (
        <p className="text-[10px] text-on-surface-variant/60 mt-1 italic leading-tight">{alternative.reasoning}</p>
      )}
      {isDuplicate && (
        <p className="text-[10px] text-error mt-1 font-semibold">Already used today</p>
      )}
    </button>
  );
}