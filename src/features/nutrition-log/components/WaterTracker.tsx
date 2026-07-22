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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGlasses(Math.min(Math.round(initialWaterMl / mlPerGlass), totalGlasses));
  }, [initialWaterMl]);

  const handleUpdate = (newGlasses: number) => {
    setGlasses(newGlasses);
    if (onUpdate) {
      onUpdate(newGlasses * mlPerGlass);
    }
  };

  const toggleGlass = (idx: number) => {
    if (idx < glasses) {
      handleUpdate(idx);
    } else {
      handleUpdate(idx + 1);
    }
  };

  const addWater = (ml: number) => {
    const additionalGlasses = Math.round(ml / mlPerGlass);
    handleUpdate(Math.min(glasses + additionalGlasses, totalGlasses));
  };

  const currentLiters = ((glasses * mlPerGlass) / 1000).toFixed(1);
  const targetLiters = ((totalGlasses * mlPerGlass) / 1000).toFixed(1);

  return (
    <section className="bg-surface-container-low border border-outline-variant rounded-xl p-md shadow-sm relative overflow-hidden">
      <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
        <span className="material-symbols-outlined text-[120px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-md">
          <h3 className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">Water Intake</h3>
          <span className="font-headline-md text-body-lg font-bold text-primary">{currentLiters} / {targetLiters} L</span>
        </div>
        <div className="grid grid-cols-4 gap-sm mb-lg">
          {Array.from({ length: totalGlasses }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => toggleGlass(idx)}
              className={`w-full h-12 rounded-lg border-2 flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
                idx < glasses
                  ? 'bg-primary/20 border-primary'
                  : 'bg-surface-container-highest border-outline-variant group'
              }`}
            >
              <span
                className={`material-symbols-outlined ${idx < glasses ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`}
                style={{ fontVariationSettings: idx < glasses ? "'FILL' 1" : "'FILL' 0" }}
              >
                water_drop
              </span>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => addWater(250)} className="flex-1 bg-surface-container-highest py-2 rounded-lg font-label-sm text-label-sm hover:bg-outline-variant/30 transition-all">+ 250ml</button>
          <button onClick={() => addWater(500)} className="flex-1 bg-surface-container-highest py-2 rounded-lg font-label-sm text-label-sm hover:bg-outline-variant/30 transition-all">+ 500ml</button>
        </div>
      </div>
    </section>
  );
}
