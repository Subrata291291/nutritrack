interface ExerciseWidgetProps {
  steps: number;
}

export function ExerciseWidget({ steps }: ExerciseWidgetProps) {
  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm">
      <div className="flex items-center gap-md mb-md">
        <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center">
          <span className="material-symbols-outlined">fitness_center</span>
        </div>
        <div>
          <h3 className="font-label-md text-label-md">Exercise</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{steps > 0 ? `${steps.toLocaleString()} steps today` : 'No activity logged yet'}</p>
        </div>
      </div>
      <button className="w-full py-2 border border-outline-variant rounded-lg font-label-sm text-label-sm hover:bg-surface-container transition-all">Log Activity</button>
    </section>
  );
}
