import { cn } from '@utils/cn';
import type { Milestone as MilestoneData } from 'types/insights';

interface MilestonesProps {
  milestones: MilestoneData[];
}

export function Milestones({ milestones }: MilestonesProps) {
  const pending = milestones.filter(m => !m.achieved);
  const nextMilestone = pending[0];

  return (
    <section className="col-span-12 md:col-span-5 flex flex-col gap-lg">
      <div className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-sm flex-1">
        <div className="flex items-center justify-between mb-lg">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">emoji_events</span>
            <h3 className="font-headline-md text-headline-md text-on-surface">Milestones</h3>
          </div>
        </div>
        <div className="space-y-md">
          {milestones.length === 0 && (
            <p className="text-center text-secondary py-8 font-body-sm text-body-sm">No milestones yet</p>
          )}
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className={cn(
                'flex items-center gap-md p-sm bg-surface-container-low rounded-xl group hover:border-primary-container border border-transparent transition-all',
                !milestone.achieved && 'opacity-60'
              )}
            >
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform',
                milestone.achieved
                  ? 'bg-primary-container/20 text-primary'
                  : 'bg-surface-container-high text-secondary'
              )}>
                <span className="material-symbols-outlined" style={milestone.achieved ? { fontVariationSettings: "'FILL' 1" } : undefined}>{milestone.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-label-md text-label-md text-on-surface truncate">{milestone.title}</p>
                <p className="font-body-sm text-body-sm text-secondary truncate">{milestone.description}</p>
              </div>
              {milestone.achieved ? (
                <span className="material-symbols-outlined text-primary shrink-0">check_circle</span>
              ) : milestone.progress !== undefined ? (
                <div className="w-12 h-1.5 bg-surface-container-high rounded-full overflow-hidden shrink-0">
                  <div className="bg-primary-container h-full rounded-full" style={{ width: `${milestone.progress}%` }} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      {nextMilestone && (
        <div className="bg-primary-container text-on-primary-container rounded-xl p-lg border border-primary relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 opacity-10">
            <span className="material-symbols-outlined" style={{ fontSize: 140 }}>stars</span>
          </div>
          <p className="font-label-sm text-label-sm uppercase tracking-widest mb-xs">Upcoming Milestone</p>
          <h4 className="font-headline-md text-headline-md mb-md">{nextMilestone.title}</h4>
          <p className="font-body-sm text-body-sm mb-lg">{nextMilestone.description}</p>
        </div>
      )}
    </section>
  );
}
