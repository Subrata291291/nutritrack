import { useState, useEffect } from 'react';

interface WaterTrackerProps {
  initialWaterMl: number;
  onUpdate?: (waterMl: number) => void;
}

export function WaterTracker({ initialWaterMl, onUpdate }: WaterTrackerProps) {
  const totalGlasses = 8;
  const mlPerGlass = 375;
  const [glasses, setGlasses] = useState(Math.min(Math.round(initialWaterMl / mlPerGlass), totalGlasses));

  useEffect(() => {
    setGlasses(Math.min(Math.round(initialWaterMl / mlPerGlass), totalGlasses));
  }, [initialWaterMl]);

  const handleUpdate = (newGlasses: number) => {
    setGlasses(newGlasses);
    onUpdate?.(newGlasses * mlPerGlass);
  };

  const toggleGlass = (idx: number) => {
    if (idx < glasses) {
      handleUpdate(idx);
    } else {
      handleUpdate(idx + 1);
    }
  };

  const addWater = (ml: number) => {
    handleUpdate(Math.min(glasses + Math.round(ml / mlPerGlass), totalGlasses));
  };

  const currentLiters = ((glasses * mlPerGlass) / 1000).toFixed(1);
  const targetLiters = ((totalGlasses * mlPerGlass) / 1000).toFixed(1);
  const pct = Math.round((glasses / totalGlasses) * 100);

  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
      <div className="px-xl pt-xl pb-lg">
        <div className="flex items-center justify-between mb-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-info" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
            </div>
            <div>
              <h3 className="text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">Water</h3>
              <p className="text-body-sm text-on-surface-variant">{currentLiters}L / {targetLiters}L</p>
            </div>
          </div>
          <div className="relative w-14 h-14">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="23" fill="none" strokeWidth="5" className="stroke-surface-container-highest" />
              <circle cx="28" cy="28" r="23" fill="none" strokeWidth="5" className="stroke-info" strokeLinecap="round"
                strokeDasharray={`${(pct / 100) * 144.5} 144.5`} style={{ transition: 'stroke-dasharray 0.5s ease' }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-label-sm font-bold text-info">{pct}%</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-8 gap-1.5">
          {Array.from({ length: totalGlasses }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => toggleGlass(idx)}
              className={`h-10 rounded-lg border-2 flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
                idx < glasses
                  ? 'bg-info/15 border-info shadow-sm shadow-info/10'
                  : 'bg-surface-container border-outline-variant/60'
              }`}
              title={`${idx + 1} glass${idx + 1 > 1 ? 'es' : ''}`}
            >
              <span className={`material-symbols-outlined text-[16px] ${idx < glasses ? 'text-info' : 'text-on-surface-variant/40'}`}
                style={{ fontVariationSettings: idx < glasses ? "'FILL' 1" : "'FILL' 0" }}>
                water_drop
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex border-t border-outline-variant/50">
        <button onClick={() => addWater(250)} className="flex-1 py-2.5 text-label-sm font-semibold text-on-surface-variant hover:bg-info/[0.03] hover:text-info transition-colors border-r border-outline-variant/50">+ 250ml</button>
        <button onClick={() => addWater(500)} className="flex-1 py-2.5 text-label-sm font-semibold text-on-surface-variant hover:bg-info/[0.03] hover:text-info transition-colors">+ 500ml</button>
      </div>
    </section>
  );
}
