export interface WeightEntry {
  date: string;
  weightKg: number;
  trend?: number;
}

export interface WeightAnalytics {
  currentWeight: number;
  startWeight: number;
  targetWeight: number;
  weeklyChange: number;
  projectedGoalDate: string;
  entries: WeightEntry[];
}

export interface MacroConsistency {
  date: string;
  calorieAdherence: number;
  proteinAdherence: number;
  carbsAdherence: number;
  fatsAdherence: number;
}

export interface Insight {
  id: number;
  type: 'energy' | 'nutrition' | 'sleep' | 'consistency';
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface Milestone {
  id: number;
  title: string;
  description: string;
  icon: string;
  achieved: boolean;
  progress?: number;
}
