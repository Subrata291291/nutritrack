import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '@components/shared/LoadingSpinner';
import { EmptyState } from '@components/shared/EmptyState';
import { AddFoodModal } from '../components/AddFoodModal';
import { foodService } from '@services/food.service';
import type { FoodItem } from 'types/nutrition';

export function FoodDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [food, setFood] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modal, setModal] = useState<'log' | 'plan' | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      if (!id) { if (!cancelled) { setError(true); setLoading(false); } return; }
      try {
        if (!cancelled) { setLoading(true); setError(false); }
        const data = await foodService.getFoodDetail(Number(id));
        if (!cancelled) setFood(data);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetch();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="bg-background min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading food details..." />
      </div>
    );
  }

  if (error || !food) {
    return (
      <div className="bg-background min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <EmptyState icon="error" title="Food not found" description="This food item doesn't exist or has been removed." />
      </div>
    );
  }

  return (
    <>
    <div className="bg-background min-h-[calc(100vh-4rem)]">
      <div className="max-w-4xl mx-auto p-margin-mobile md:p-margin-desktop space-y-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors mb-2">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back
        </button>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden">
          <div className="bg-gradient-to-br from-primary-container/30 to-primary-container/5 h-48 flex items-center justify-center">
            <span className="material-symbols-outlined text-7xl text-primary/30" style={{ fontVariationSettings: "'FILL' 1" }}>{food.icon || 'restaurant'}</span>
          </div>
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {food.category && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-tighter">{food.category}</span>
                )}
              </div>
              <h1 className="text-[32px] font-bold text-on-surface tracking-tight">{food.name}</h1>
              {food.servingSize && (
                <p className="text-sm text-on-surface-variant/70 mt-1">Per {food.servingSize}{food.servingWeightGrams ? ` (${food.servingWeightGrams}g)` : ''}</p>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Calories', value: food.calories, unit: 'kcal', color: 'text-amber-500' },
                { label: 'Protein', value: food.proteinGrams, unit: 'g', color: 'text-emerald-500' },
                { label: 'Carbs', value: food.carbsGrams, unit: 'g', color: 'text-blue-500' },
                { label: 'Fats', value: food.fatsGrams, unit: 'g', color: 'text-purple-500' },
              ].map((stat) => (
                <div key={stat.label} className="bg-surface-container-low/40 rounded-xl p-4 text-center border border-outline-variant/20">
                  <p className="text-xs text-on-surface-variant/60 font-medium mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-on-surface-variant/50">{stat.unit}</p>
                </div>
              ))}
            </div>

            {/* Toast notification */}
            {toast && (
              <div className={`px-4 py-3 rounded-xl text-sm flex items-start gap-2.5 ${
                toast.type === 'success'
                  ? 'bg-primary-container/30 text-primary'
                  : 'bg-error-container/30 text-error'
              }`}>
                <span className="material-symbols-outlined text-[18px] mt-0.5 flex-shrink-0">
                  {toast.type === 'success' ? 'check_circle' : 'error'}
                </span>
                {toast.msg}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setModal('log')}
                className="flex-1 py-3 px-5 bg-primary text-on-primary font-semibold rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add to Daily Log
              </button>
              <button
                onClick={() => setModal('plan')}
                className="flex-1 py-3 px-5 bg-surface-container-low text-on-surface font-semibold rounded-xl border border-outline-variant hover:bg-surface-container active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                Add to Planner
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    {modal && (
      <AddFoodModal
        food={food}
        mode={modal}
        onClose={() => setModal(null)}
        onSuccess={(msg) => showToast('success', msg)}
        onError={(msg) => showToast('error', msg)}
      />
    )}
    </>
  );
}
