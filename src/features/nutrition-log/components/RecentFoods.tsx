import type { FoodItem } from 'types/nutrition';

interface RecentFoodsProps {
  items: FoodItem[];
  onAddFood: (foodItemId: number) => void;
}

export function RecentFoods({ items, onAddFood }: RecentFoodsProps) {
  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm">
      <h3 className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant mb-md flex items-center justify-between">
        Recent Foods
        <span className="material-symbols-outlined text-[18px]">history</span>
      </h3>
      {items.length === 0 ? (
        <p className="font-body-sm text-body-sm text-on-surface-variant text-center py-4">No recent foods</p>
      ) : (
        <div className="space-y-2">
          {items.map((food) => (
            <button key={food.id} onClick={() => onAddFood(food.id)} className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-surface-container transition-all group">
              <div className="text-left">
                <p className="font-body-sm text-body-sm font-medium">{food.name}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">{food.servingSize} &bull; {food.calories} kcal</p>
              </div>
              <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity">add_circle</span>
            </button>
          ))}
        </div>
      )}
      <button className="mt-md w-full py-2 text-center text-on-surface-variant font-label-sm text-label-sm hover:underline">View all favorites</button>
    </section>
  );
}
