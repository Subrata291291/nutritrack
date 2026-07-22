import { EmptyState } from '@components/shared/EmptyState';
import type { Insight } from 'types/insights';

interface SmartInsightsProps {
  insights: Insight[];
}

export function SmartInsights({ insights }: SmartInsightsProps) {
  return (
    <section className="col-span-12 lg:col-span-4 bg-inverse-surface text-inverse-on-surface rounded-xl p-lg border border-outline-variant shadow-lg flex flex-col h-full">
      <div className="flex items-center gap-sm mb-lg">
        <span className="material-symbols-outlined text-primary-fixed">auto_awesome</span>
        <h3 className="font-headline-md text-headline-md">Smart Insights</h3>
      </div>
      {insights.length === 0 ? (
        <EmptyState
          icon="auto_awesome"
          title="No insights yet"
          description="Start tracking more consistently to receive personalized insights."
        />
      ) : (
        <div className="space-y-lg flex-1">
          {insights.map((insight) => (
            <div key={insight.id} className="flex gap-md group">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary-fixed">{insight.icon}</span>
              </div>
              <div>
                <p className="font-label-md text-label-md text-white mb-xs">{insight.title}</p>
                <p className="font-body-sm text-body-sm text-inverse-on-surface/80">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
