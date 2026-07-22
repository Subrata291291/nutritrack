import type { Insight, WeightAnalytics } from 'types/insights';

interface QuickStatsProps {
  insights?: Insight[];
  weightAnalytics?: WeightAnalytics | null;
}

function InsightCard({ icon, iconBg, iconColor, label, value, subtext, subtextColor }: {
  icon: string; iconBg: string; iconColor: string; label: string; value: string; subtext: string; subtextColor: string;
}) {
  return (
    <div className="col-span-12 md:col-span-4 bg-surface-container-low rounded-xl p-6 flex items-center gap-6 border border-outline-variant">
      <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center ${iconColor}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="text-xs text-on-surface-variant uppercase font-bold tracking-widest">{label}</p>
        <p className="text-[24px] font-bold">{value}</p>
        <p className={`text-xs ${subtextColor}`}>{subtext}</p>
      </div>
    </div>
  );
}

const iconMap: Record<string, string> = {
  energy: 'bolt',
  nutrition: 'restaurant',
  sleep: 'nightlight',
  consistency: 'trending_up',
};

const colorMap: Record<string, { bg: string; text: string }> = {
  energy: { bg: 'bg-[#ffddb8]/20', text: 'text-tertiary' },
  nutrition: { bg: 'bg-primary-container/20', text: 'text-primary' },
  sleep: { bg: 'bg-[#d5e3fd]/30', text: 'text-secondary' },
  consistency: { bg: 'bg-primary-container/20', text: 'text-primary' },
};

export function QuickStats({ insights = [], weightAnalytics }: QuickStatsProps) {
  const cards: Array<{
    icon: string; iconBg: string; iconColor: string; label: string; value: string; subtext: string; subtextColor: string;
  }> = [];

  if (weightAnalytics && weightAnalytics.entries.length > 0) {
    const current = weightAnalytics.currentWeight;
    const change = weightAnalytics.weeklyChange;
    cards.push({
      icon: 'monitor_weight',
      iconBg: 'bg-primary-container/20',
      iconColor: 'text-primary',
      label: 'Current Weight',
      value: `${current.toFixed(1)} kg`,
      subtext: change !== 0
        ? `${change > 0 ? '+' : ''}${change.toFixed(1)}kg this week`
        : 'Stable this week',
      subtextColor: change !== 0 ? 'text-primary' : 'text-on-surface-variant',
    });
  }

  if (insights.length > 0) {
    for (const insight of insights.slice(0, 3)) {
      const icon = iconMap[insight.type] || 'lightbulb';
      const colors = colorMap[insight.type] || { bg: 'bg-surface-container-highest', text: 'text-on-surface' };
      cards.push({
        icon,
        iconBg: colors.bg,
        iconColor: colors.text,
        label: insight.title,
        value: '',
        subtext: insight.description,
        subtextColor: 'text-on-surface-variant',
      });
    }
  }

  if (cards.length === 0) {
    return (
      <div className="col-span-12 bg-surface-container-low rounded-xl p-6 text-center text-on-surface-variant text-sm border border-outline-variant">
        No stats available yet. Start tracking to see your insights.
      </div>
    );
  }

  return (
    <>
      {cards.map((card) => (
        <InsightCard key={card.label} {...card} />
      ))}
    </>
  );
}
