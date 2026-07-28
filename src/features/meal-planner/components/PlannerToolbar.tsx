interface PlannerToolbarProps {
  selectedDay: string;
  onCopyPreviousDay?: () => void;
  onDuplicateDay?: () => void;
  onClearDay?: () => void;
}

export function PlannerToolbar({ selectedDay: _selectedDay, onCopyPreviousDay, onDuplicateDay, onClearDay }: PlannerToolbarProps) {
  const actions = [
    { key: 'copy', label: 'Copy Previous Day', icon: 'content_copy', onClick: onCopyPreviousDay },
    { key: 'duplicate', label: 'Duplicate Day', icon: 'repeat', onClick: onDuplicateDay },
    { key: 'clear', label: 'Clear Day', icon: 'delete_sweep', onClick: onClearDay },
  ] as const;

  return (
    <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
      {actions.map(({ key, label, icon, onClick }) => (
        <button
          key={key}
          onClick={onClick}
          disabled={!onClick}
          className={`flex-none py-2 px-3.5 text-label-sm font-semibold rounded-xl border transition-all flex items-center gap-1.5 ${
            onClick
              ? 'bg-surface-container-lowest text-on-surface border-outline-variant shadow-sm hover:bg-surface-container-low active:scale-95'
              : 'bg-surface-container-low text-on-surface-variant/40 border-outline-variant/40 cursor-not-allowed'
          }`}
          title={!onClick ? `${label} (backend not available)` : label}
        >
          <span className="material-symbols-outlined text-base">{icon}</span>
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}