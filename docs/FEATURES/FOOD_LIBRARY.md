# Food Library Feature Specification

## Purpose

The Food Library is NutriTrack's centralized nutrition database.

It stores all food items along with their nutritional information, serving sizes, categories, and metadata.

The Food Library serves as the primary source of truth for nutrition-related data throughout the application.

---

# Goals

The Food Library should allow users to

- Browse foods
- Search foods
- Filter foods
- View nutrition information
- Compare foods
- Save favorite foods
- Add foods to meals
- Use foods in recipes
- Access personalized recommendations (Future)

---

# User Flow

```
Dashboard

↓

Food Library

↓

Browse Foods

↓

Search / Filter

↓

View Food Details

↓

Choose Serving Size

↓

Add to Meal

↓

Nutrition Log Updated
```

---

# Pages

## Food Library

Purpose

Browse all available foods.

Features

- Search Bar
- Category Filter
- Nutrition Filter
- Favorites Filter
- Recently Used
- Pagination

---

## Food Details

Display

- Food Image
- Food Name
- Category
- Brand (Optional)
- Serving Sizes
- Nutrition Facts
- Ingredients (if available)
- Allergens
- Tags

Actions

- Add to Meal
- Add to Favorites
- Compare Food
- View Similar Foods

---

# Categories

Examples

- Fruits
- Vegetables
- Dairy
- Meat
- Seafood
- Eggs
- Grains
- Rice
- Pasta
- Bread
- Nuts
- Seeds
- Oils
- Snacks
- Beverages
- Desserts
- Fast Food
- Supplements

Categories should be configurable from WordPress.

---

# Search

Users should search by

- Name
- Brand
- Category
- Nutrition Value
- Tags

Search should support

- Partial Matching
- Typo Tolerance (Future)
- Instant Search

---

# Filters

Users should filter by

Category

Calories

Protein

Carbohydrates

Fat

Fiber

Sugar

Sodium

Diet

Examples

- Vegan
- Vegetarian
- Keto
- Gluten Free

---

# Nutrition Information

Every food should contain

Basic Information

- Name
- Image
- Category
- Brand

Nutrition

- Calories
- Protein
- Carbohydrates
- Fat
- Fiber
- Sugar
- Sodium

Micronutrients

- Vitamin A
- Vitamin C
- Vitamin D
- Calcium
- Iron
- Potassium

Serving Information

- Serving Size
- Unit
- Weight (grams)

---

# Components

```
FoodLibrary

├── SearchBar

├── CategoryFilter

├── NutritionFilter

├── FoodGrid

├── FoodCard

├── FoodDetailModal

├── NutritionFacts

├── ServingSelector

├── FavoriteButton

└── Pagination
```

---

# React Structure

```
src/

features/

food-library/

components/

pages/

hooks/

services/

types/

validation/
```

---

# API Endpoints

## Get Foods

GET

/foods

Supports

- Pagination
- Search
- Sorting
- Filtering

---

## Get Food

GET

/foods/{id}

---

## Search Foods

GET

/foods/search

Query Parameters

- keyword
- category
- diet
- calories
- protein

---

## Favorite Food

POST

/foods/{id}/favorite

---

## Remove Favorite

DELETE

/foods/{id}/favorite

---

# Sample Response

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "Chicken Breast",
      "category": "Meat",
      "serving_size": "100g",
      "nutrition": {
        "calories": 165,
        "protein": 31,
        "carbs": 0,
        "fat": 3.6
      }
    }
  ]
}
```

---

# Database Fields

Each food item should store

- Name
- Slug
- Featured Image
- Category
- Brand
- Description
- Serving Size
- Unit
- Calories
- Protein
- Carbohydrates
- Fat
- Fiber
- Sugar
- Sodium
- Cholesterol
- Vitamins
- Minerals
- Allergens
- Tags
- Status

---

# Relationships

Food Item

↓

Meal Entry

↓

Recipe

↓

Meal Plan

A single food can be used in multiple recipes and meal entries.

---

# Dashboard Integration

Food data contributes to

- Daily Calories
- Macro Totals
- Nutrition Summary
- Meal History

---

# Nutrition Log Integration

Users can

- Select food
- Choose serving size
- Log quantity

The Nutrition Log automatically calculates totals based on the selected serving.

---

# Recipe Integration

Recipes should reference Food Items instead of duplicating nutrition values.

This keeps nutritional information consistent across the application.

---

# AI Integration

Future AI features

- Smart Food Suggestions
- Healthier Alternatives
- Frequently Used Foods
- Personalized Food Recommendations
- Grocery Suggestions

The AI may recommend foods but should never modify nutrition values.

---

# Loading States

Display skeleton loaders while

- Loading food list
- Loading food details
- Performing search

---

# Empty States

Display friendly messages when

- No foods found
- No favorites
- Search returned no results

Example

"No foods match your search. Try a different keyword."

---

# Error Handling

Handle

- API failures
- Network issues
- Invalid food ID
- Empty responses

Allow retry when appropriate.

---

# Accessibility

- Keyboard navigation
- Screen reader support
- Focus management
- Accessible search
- High contrast support

---

# Performance

- Server-side pagination
- Debounced search
- Image lazy loading
- API caching
- Infinite scrolling (Future)

---

# Future Enhancements

- Barcode Scanner
- Food Image Recognition
- USDA Nutrition Database Integration
- Open Food Facts Integration
- AI Food Search
- Offline Food Cache
- Custom User Foods
- Recently Scanned Foods
- Voice Food Search

---

# Acceptance Criteria

The feature is complete when

- Users can browse foods.
- Search and filters work correctly.
- Food details display accurate nutrition information.
- Serving size selection updates nutrition values.
- Foods can be added to meals.
- Favorites work correctly.
- APIs follow API_CONTRACT.md.
- Loading and error states are implemented.
- UI matches the approved design.
- No duplicate nutrition data exists.