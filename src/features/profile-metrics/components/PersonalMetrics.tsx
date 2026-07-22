import type { Gender } from 'types/onboarding';

interface PersonalMetricsProps {
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  onChange: (field: 'age' | 'gender' | 'heightCm' | 'weightKg', value: number | Gender) => void;
}

const genderOptions: Gender[] = ['male', 'female', 'non-binary', 'prefer-not-to-say'];

export function PersonalMetrics({ age, gender, heightCm, weightKg, onChange }: PersonalMetricsProps) {
  return (
    <section>
      <h2 className="text-xs font-bold tracking-widest text-on-surface-variant uppercase mb-3">Personal Metrics</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 hover:border-primary transition-colors">
          <label className="text-xs text-on-surface-variant font-medium mb-1 block">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => onChange('age', Number(e.target.value))}
            className="w-full text-lg font-semibold text-on-surface bg-transparent border-none p-0 focus:outline-none focus:ring-0"
          />
          <span className="text-xs text-secondary">yrs</span>
        </div>
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 hover:border-primary transition-colors">
          <label className="text-xs text-on-surface-variant font-medium mb-1 block">Gender</label>
          <select
            value={gender}
            onChange={(e) => onChange('gender', e.target.value as Gender)}
            className="w-full text-lg font-semibold text-on-surface bg-transparent border-none p-0 focus:outline-none focus:ring-0 cursor-pointer"
          >
            {genderOptions.map((g) => (
              <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1).replace('-', ' ')}</option>
            ))}
          </select>
        </div>
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 hover:border-primary transition-colors">
          <label className="text-xs text-on-surface-variant font-medium mb-1 block">Height</label>
          <input
            type="number"
            value={heightCm}
            onChange={(e) => onChange('heightCm', Number(e.target.value))}
            className="w-full text-lg font-semibold text-on-surface bg-transparent border-none p-0 focus:outline-none focus:ring-0"
          />
          <span className="text-xs text-secondary">cm</span>
        </div>
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 hover:border-primary transition-colors">
          <label className="text-xs text-on-surface-variant font-medium mb-1 block">Weight</label>
          <input
            type="number"
            value={weightKg}
            step={0.1}
            onChange={(e) => onChange('weightKg', Number(e.target.value))}
            className="w-full text-lg font-semibold text-on-surface bg-transparent border-none p-0 focus:outline-none focus:ring-0"
          />
          <span className="text-xs text-secondary">kg</span>
        </div>
      </div>
    </section>
  );
}
