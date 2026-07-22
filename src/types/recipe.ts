export interface Recipe {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  caloriesPerServing: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  fiberGrams: number;
  tags: string[];
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  tips?: string;
  isPro?: boolean;
}

export interface RecipeIngredient {
  id: number;
  name: string;
  quantity: string;
  checked?: boolean;
}

export interface RecipeInstruction {
  step: number;
  title: string;
  description: string;
}
