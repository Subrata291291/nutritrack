import { useState, useCallback, useRef } from 'react';
import { recipesService } from '@services/recipes.service';
import type { MealPlanDay } from 'types/meal-plan';
import type { ShoppingListItem } from 'types/meal-plan';

const unitPattern = /^([\d.]+)\s*(g|kg|ml|l|cup|cups|tbsp|tsp|oz|lb|pound|pounds|piece|pieces|clove|cloves|slice|slices|can|cans|bunch|pinch|dash|to taste)?$/i;

const produceKeywords = ['tomato', 'onion', 'garlic', 'spinach', 'kale', 'lettuce', 'cucumber', 'bell pepper', 'broccoli', 'cauliflower', 'carrot', 'celery', 'zucchini', 'mushroom', 'avocado', 'lemon', 'lime', 'herb', 'basil', 'cilantro', 'parsley', 'mint', 'oregano', 'thyme', 'rosemary', 'ginger', 'jalape', 'chili', 'scallion', 'green onion', 'shallot', 'sweet potato', 'potato', 'squash', 'eggplant', 'cabbage', 'arugula', 'bean sprout', 'pea', 'corn', 'fruit', 'apple', 'banana', 'berry', 'blueberry', 'strawberry', 'mixed greens', 'sprout'];

const proteinKeywords = ['chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'shrimp', 'tofu', 'egg', 'egg white', 'turkey', 'lamb', 'bacon', 'sausage', 'ground', 'steak', 'breast', 'thigh', 'drumstick', 'wing', 'cod', 'tilapia', 'halibut', 'tuna', 'seafood', 'scallop', 'mussel', 'clam', 'protein'];

const dairyKeywords = ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'sour cream', 'cottage cheese', 'parmesan', 'mozzarella', 'cheddar', 'feta', 'ricotta', 'ghee', 'half-and-half'];

const grainsKeywords = ['rice', 'pasta', 'bread', 'flour', 'oat', 'quinoa', 'couscous', 'noodle', 'tortilla', 'wrap', 'bagel', 'cereal', 'granola', 'barley', 'bulgur', 'cornmeal', 'cracker', 'panko', 'breadcrumb'];

const spiceKeywords = ['salt', 'pepper', 'cumin', 'paprika', 'turmeric', 'cinnamon', 'nutmeg', 'clove', 'allspice', 'bay leaf', 'chili powder', 'garlic powder', 'onion powder', 'oregano', 'basil', 'thyme', 'rosemary', 'sage', 'dill', 'coriander', 'cardamom', 'mustard', 'ketchup', 'mayo', 'sauce', 'vinegar', 'oil', 'olive oil', 'coconut oil', 'sesame oil', 'soy sauce', 'hot sauce'];

function categorizeIngredient(name: string): ShoppingListItem['category'] {
  const lower = name.toLowerCase().trim();
  if (spiceKeywords.some((k) => lower.includes(k))) return 'spices';
  if (produceKeywords.some((k) => lower.includes(k))) return 'produce';
  if (proteinKeywords.some((k) => lower.includes(k))) return 'proteins';
  if (dairyKeywords.some((k) => lower.includes(k))) return 'dairy';
  if (grainsKeywords.some((k) => lower.includes(k))) return 'grains';
  return 'other';
}

interface ParsedQuantity {
  value: number;
  unit: string;
}

function parseQuantity(qty: string): ParsedQuantity | null {
  const match = qty.trim().match(unitPattern);
  if (!match) return null;
  return {
    value: parseFloat(match[1]) || 0,
    unit: (match[2] || 'piece').toLowerCase(),
  };
}

function formatQuantity(value: number, unit: string): string {
  if (unit === 'piece') return value === 1 ? '1 piece' : `${value} pieces`;
  return `${value} ${unit}`;
}

function mergeQuantities(existing: string, incoming: string): string {
  const parsedExisting = parseQuantity(existing);
  const parsedIncoming = parseQuantity(incoming);
  if (parsedExisting && parsedIncoming && parsedExisting.unit === parsedIncoming.unit) {
    return formatQuantity(parsedExisting.value + parsedIncoming.value, parsedExisting.unit);
  }
  return `${existing} + ${incoming}`;
}

interface LocalShoppingItem {
  id: number;
  name: string;
  quantity: string;
  category: ShoppingListItem['category'];
  checked: boolean;
}

interface ShoppingListState {
  loading: boolean;
  error: string | null;
  items: LocalShoppingItem[];
  generated: boolean;
}

const STORAGE_KEY = 'nutritrack_grocery_checks';

function loadChecked(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveChecked(checked: Record<string, boolean>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  } catch {
    /* noop */
  }
}

export function useShoppingList() {
  const [state, setState] = useState<ShoppingListState>({
    loading: false,
    error: null,
    items: [],
    generated: false,
  });
  const checkedRef = useRef<Record<string, boolean>>(loadChecked());

  const generate = useCallback(async (days: MealPlanDay[]) => {
    setState({ loading: true, error: null, items: [], generated: false });
    try {
      const recipeIds = new Set<number>();
      days.forEach((day) => day.meals.forEach((meal) => {
        if (meal.recipe?.id) recipeIds.add(meal.recipe.id);
      }));

      if (recipeIds.size === 0) {
        setState({ loading: false, error: null, items: [], generated: true });
        return;
      }

      const recipeDetails = await Promise.all(
        [...recipeIds].map((id) => recipesService.getRecipeDetail(id)),
      );

      const ingredientMap = new Map<string, { quantity: string; category: ShoppingListItem['category'] }>();
      let idCounter = 1;

      recipeDetails.forEach((recipe) => {
        recipe.ingredients.forEach((ing) => {
          const key = ing.name.toLowerCase().trim();
          const cat = categorizeIngredient(ing.name);
          if (ingredientMap.has(key)) {
            const existing = ingredientMap.get(key)!;
            existing.quantity = mergeQuantities(existing.quantity, ing.quantity);
          } else {
            ingredientMap.set(key, { quantity: ing.quantity, category: cat });
          }
        });
      });

      const checked = checkedRef.current;
      const items: LocalShoppingItem[] = [];
      ingredientMap.forEach((val, key) => {
        const name = key.charAt(0).toUpperCase() + key.slice(1);
        items.push({
          id: idCounter++,
          name,
          quantity: val.quantity,
          category: val.category,
          checked: checked[name] || false,
        });
      });

      items.sort((a, b) => {
        const catOrder = ['produce', 'proteins', 'dairy', 'grains', 'spices', 'other'];
        const ai = catOrder.indexOf(a.category);
        const bi = catOrder.indexOf(b.category);
        if (ai !== bi) return ai - bi;
        return a.name.localeCompare(b.name);
      });

      setState({ loading: false, error: null, items, generated: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate grocery list.';
      setState({ loading: false, error: message, items: [], generated: false });
    }
  }, []);

  const toggleChecked = useCallback((itemId: number) => {
    setState((prev) => {
      const items = prev.items.map((item) => {
        if (item.id !== itemId) return item;
        const updated = { ...item, checked: !item.checked };
        checkedRef.current[updated.name] = updated.checked;
        saveChecked(checkedRef.current);
        return updated;
      });
      return { ...prev, items };
    });
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, items: [], generated: false });
  }, []);

  return {
    ...state,
    generate,
    toggleChecked,
    reset,
  };
}