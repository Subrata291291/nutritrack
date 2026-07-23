import { EmptyState } from '@components/shared/EmptyState';
import type { Insight } from 'types/insights';

interface SmartInsightsProps {
  insights: Insight[];
}

const insightHues = ['#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4'];

export function SmartInsights({ insights }: SmartInsightsProps) {
  return (
    <section className="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
      {/* Notebook-style header with margin bar */}
      <div className="flex gap-0">
        <div className="w-2 bg-gradient-to-b from-amber-400 via-emerald-400 to-violet-400 flex-shrink-0" />
        <div className="flex-1 p-xl pb-lg">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            </div>
            <div>
              <h3 className="text-headline-md font-bold text-on-surface">Smart Insights</h3>
              <p className="text-body-sm text-on-surface-variant">Personalized recommendations</p>
            </div>
          </div>
        </div>
      </div>

      {insights.length === 0 ? (
        <div className="flex-1 flex items-center justify-center pb-xl px-xl">
          <EmptyState
            icon="auto_awesome"
            title="No insights yet"
            description="Start tracking more consistently to receive personalized insights."
          />
        </div>
      ) : (
        <div className="flex-1 space-y-1 px-xl pb-xl">
          {insights.map((insight, idx) => {
            const color = insightHues[idx % insightHues.length];
            return (
              <div key={insight.id}
                className="flex gap-4 p-4 rounded-xl hover:bg-surface-container-low transition-all group border border-transparent hover:border-outline-variant/30"
                style={{ borderLeft: 'none' }}
              >
                {/* Colored index badge */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-label-sm font-bold flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: color }}
                  >
                    {idx + 1}
                  </div>
                  {idx < insights.length - 1 && (
                    <div className="w-px flex-1 bg-outline-variant/40 min-h-[8px]" />
                  )}
                </div>
                <div className="min-w-0 flex-1 pb-4" style={idx < insights.length - 1 ? { borderBottom: '1px solid var(--color-outline-variant)' } : {}}>
                  <p className="text-body-md font-bold text-on-surface mb-0.5">{insight.title}</p>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed">{insight.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      {insights.length > 0 && (
        <div className="px-xl py-4 border-t border-outline-variant/50 flex items-center gap-2 text-label-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px] text-amber-500">lightbulb</span>
          <span>{insights.length} insight{insights.length !== 1 ? 's' : ''} based on your data</span>
        </div>
      )}
    </section>
  );
}
