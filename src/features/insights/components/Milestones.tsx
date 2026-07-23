import type { Milestone as MilestoneData } from 'types/insights';

interface MilestonesProps {
  milestones: MilestoneData[];
}

function XpBar({ pct }: { pct: number }) {
  return (
    <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
      <div className="h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 transition-all duration-500"
        style={{ width: `${Math.min(pct, 100)}%` }} />
    </div>
  );
}

export function Milestones({ milestones }: MilestonesProps) {
  const pending = milestones.filter(m => !m.achieved);
  const nextMilestone = pending[0];
  const achieved = milestones.filter(m => m.achieved);
  const totalProgress = milestones.length > 0 ? Math.round((achieved.length / milestones.length) * 100) : 0;

  return (
    <section className="col-span-12 md:col-span-5 flex flex-col gap-lg">
      {/* Quest Log */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="p-xl">
          {/* Header with XP bar */}
          <div className="flex items-start sm:items-center justify-between mb-lg gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-400/5 flex items-center justify-center">
                <span className="material-symbols-outlined text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
              </div>
              <div>
                <h3 className="text-headline-sm sm:text-headline-md font-bold text-on-surface">Milestones</h3>
                <p className="text-body-sm text-on-surface-variant">{achieved.length}/{milestones.length} unlocked</p>
              </div>
            </div>
            {milestones.length > 0 && (
              <div className="flex items-center gap-2 bg-amber-500/10 px-3 py-1.5 rounded-xl flex-shrink-0">
                <span className="material-symbols-outlined text-[16px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                <span className="text-headline-sm font-bold text-on-surface">{totalProgress}%</span>
              </div>
            )}
          </div>

          {/* XP Progress */}
          {milestones.length > 0 && (
            <div className="mb-lg space-y-1.5">
              <div className="flex justify-between text-label-sm">
                <span className="text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-amber-500">bolt</span>
                  XP Progress
                </span>
                <span className="font-semibold text-on-surface">{achieved.length}/{milestones.length}</span>
              </div>
              <XpBar pct={totalProgress} />
            </div>
          )}

          {/* Milestone list — vertical path */}
          <div className="space-y-2">
            {milestones.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-on-surface-variant">
                <span className="material-symbols-outlined text-[48px] opacity-30 mb-2">emoji_events</span>
                <p className="text-body-md">No milestones yet</p>
                <p className="text-label-sm mt-1">Keep tracking to unlock achievements</p>
              </div>
            )}
            {milestones.map((milestone, idx) => {
              const isUnlocked = milestone.achieved;
              const isNext = nextMilestone?.id === milestone.id && !isUnlocked;

              return (
                <div key={milestone.id} className="flex gap-4">
                  {/* Path connector */}
                  <div className="flex flex-col items-center pt-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      isUnlocked
                        ? 'bg-amber-500/15 shadow-sm shadow-amber-500/20'
                        : isNext
                          ? 'bg-surface-container-low border-2 border-dashed border-amber-500/40'
                          : 'bg-surface-container-highest'
                    }`}>
                      {isUnlocked ? (
                        <span className="material-symbols-outlined text-amber-500 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                      ) : (
                        <span className={`material-symbols-outlined text-[20px] ${isNext ? 'text-amber-500/60' : 'text-on-surface-variant/30'}`}>
                          {milestone.icon || 'stars'}
                        </span>
                      )}
                    </div>
                    {idx < milestones.length - 1 && (
                      <div className={`w-0.5 flex-1 min-h-[8px] ${isUnlocked ? 'bg-amber-500/20' : 'bg-outline-variant/30'}`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`flex-1 pb-6 min-w-0 ${isNext ? 'bg-surface-container-low rounded-xl px-4 py-3 -ml-2 border border-amber-500/10' : 'pt-1'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className={`text-body-md font-bold ${isUnlocked ? 'text-on-surface' : isNext ? 'text-on-surface' : 'text-on-surface/50'}`}>
                          {milestone.title}
                        </p>
                        <p className={`text-label-sm ${isUnlocked ? 'text-on-surface-variant' : isNext ? 'text-on-surface-variant' : 'text-on-surface-variant/50'} truncate`}>
                          {milestone.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        {isUnlocked ? (
                          <span className="text-amber-500">
                            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                          </span>
                        ) : isNext ? (
                          <span className="material-symbols-outlined text-[18px] text-amber-500/60">arrow_forward</span>
                        ) : null}
                      </div>
                    </div>
                    {!isUnlocked && milestone.progress !== undefined && (
                      <div className="mt-2">
                        <div className="flex justify-between text-label-sm mb-0.5">
                          <span className="text-on-surface-variant/60">Progress</span>
                          <span className="font-semibold text-on-surface/60">{milestone.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                            style={{ width: `${Math.min(milestone.progress, 100)}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active quest card */}
      {nextMilestone && (
        <div className="rounded-2xl border border-amber-500/20 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.04] to-transparent" />
          <div className="absolute -right-8 -top-8 opacity-[0.06]">
            <span className="material-symbols-outlined text-[120px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
          </div>
          <div className="relative z-10 p-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                <span className="material-symbols-outlined text-[12px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              </span>
              <span className="text-label-sm font-bold uppercase tracking-widest text-amber-600">Active Quest</span>
            </div>
            <h4 className="text-headline-md font-bold text-on-surface mb-1">{nextMilestone.title}</h4>
            <p className="text-body-sm text-on-surface-variant mb-4">{nextMilestone.description}</p>
            {nextMilestone.progress !== undefined && (
              <div className="space-y-1.5 bg-surface-container-low rounded-xl p-4 border border-outline-variant/30">
                <div className="flex justify-between text-label-sm">
                  <span className="text-on-surface-variant">Quest Progress</span>
                  <span className="font-bold text-amber-600">{nextMilestone.progress}%</span>
                </div>
                <XpBar pct={nextMilestone.progress} />
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
