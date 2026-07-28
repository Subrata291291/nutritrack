interface SwapMealButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function SwapMealButton({ onClick, loading, disabled }: SwapMealButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="flex items-center gap-1 text-label-xs font-semibold text-secondary hover:text-secondary/80 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      title="Swap meal with AI alternatives"
    >
      <span className="material-symbols-outlined text-[12px]">
        {loading ? 'hourglass_top' : 'sync_alt'}
      </span>
      Swap
    </button>
  );
}