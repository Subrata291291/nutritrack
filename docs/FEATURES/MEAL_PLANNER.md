# Meal Planner Feature Specification

## Purpose

The Meal Planner helps users organize and manage their daily and weekly meals based on their nutrition goals, dietary preferences, and lifestyle.

It serves as the central planning module of NutriTrack and integrates with Recipes, Food Library, Nutrition Log, Dashboard, and the Nutrition Engine.

Future AI features will enhance meal planning with intelligent recommendations, but the core planner must function without AI.

---

# Goals

The Meal Planner should allow users to

- Plan meals for the week
- Plan meals for individual days
- Add recipes
- Add food items
- View nutrition totals
- Edit meals
- Remove meals
- Duplicate meal plans
- Generate grocery lists
- Track adherence (Future)

---

# User Flow

```
Dashboard

↓

Meal Planner

↓

Select Date

↓

Breakfast

↓

Lunch

↓

Dinner

↓

Snack

↓

Save Plan

↓

Nutrition Engine

↓

Dashboard Updated

↓

Nutrition Log
```

---

# Planner Views

## Daily View

Display

- Breakfast
- Lunch
- Dinner
- Snacks

Show

- Calories
- Protein
- Carbs
- Fat

---

## Weekly View

Display

Monday

Tuesday

Wednesday

Thursday

Friday

Saturday

Sunday

Each day shows

- Planned meals
- Nutrition summary

---

# Meal Types

Supported meal types

- Breakfast
- Morning Snack
- Lunch
- Afternoon Snack
- Dinner
- Evening Snack

Meal types should be configurable.

---

# Meal Card

Each planned meal displays

- Recipe Image
- Recipe Name
- Calories
- Protein
- Carbohydrates
- Fat
- Servings

Actions

- Edit
- Remove
- Replace
- View Recipe
- Log Meal

---

# Planner Actions

Users can

- Add Recipe
- Add Food Item
- Replace Meal
- Remove Meal
- Copy Previous Day
- Duplicate Week
- Clear Day
- Clear Week

---

# Nutrition Summary

For each day display

Target

Consumed

Remaining

Calories

Protein

Carbohydrates

Fat

Fiber

Water Goal

---

# Grocery List Integration

Generate shopping list from

Selected Week

↓

Recipes

↓

Food Items

↓

Combined Ingredient List

Duplicate ingredients should be merged.

---

# Components

```
MealPlanner

├── Calendar

├── WeeklyPlanner

├── DailyPlanner

├── MealCard

├── MealSlot

├── NutritionSummary

├── GroceryButton

├── DaySelector

├── WeekSelector

├── AddMealModal

├── ReplaceMealModal

└── PlannerToolbar
```

---

# React Structure

```
src/

features/

meal-planner/

components/

pages/

hooks/

services/

types/

validation/
```

---

# API Endpoints

## Get Meal Plan

GET

/meal-plans

Supports

- Date
- Week

---

## Create Meal Plan

POST

/meal-plans

---

## Update Meal Plan

PUT

/meal-plans/{id}

---

## Delete Meal Plan

DELETE

/meal-plans/{id}

---

## Copy Meal Plan

POST

/meal-plans/copy

---

## Generate Grocery List

POST

/meal-plans/grocery-list

---

# Sample Response

```json
{
  "success": true,
  "data": {
    "week": "2026-08-03",
    "days": [
      {
        "date": "2026-08-03",
        "breakfast": [],
        "lunch": [],
        "dinner": [],
        "snacks": [],
        "nutrition": {
          "calories": 2100,
          "protein": 145,
          "carbs": 210,
          "fat": 65
        }
      }
    ]
  }
}
```

---

# Database Fields

Store

- User ID
- Date
- Week
- Meal Type
- Recipe IDs
- Food Item IDs
- Servings
- Notes
- Status

---

# Relationships

Meal Plan

↓

Recipes

↓

Food Items

↓

Nutrition Engine

↓

Dashboard

↓

Nutrition Log

---

# Nutrition Engine Integration

After every planner update

Recalculate

- Calories
- Protein
- Carbohydrates
- Fat
- Fiber
- Water Goal

Dashboard updates automatically.

---

# Dashboard Integration

Display

Today's Meals

Today's Nutrition

Remaining Calories

Quick Actions

---

# Nutrition Log Integration

Users can

- Log planned meal
- Skip meal
- Replace meal
- Edit serving

Logging a meal updates

- Dashboard
- Nutrition Summary
- Activity Feed

---

# Recipe Integration

Meals should primarily use recipes.

Users may also add individual food items.

Recipes always reference Food Library items.

---

# AI Integration

Future AI features

Generate Weekly Meal Plan

Generate Daily Meal Plan

Adjust Plan Based On

- User Goal
- Allergies
- Budget
- Preferred Cuisine
- Available Ingredients

Suggest Meal Swaps

Generate Grocery List

Meal Variety Suggestions

AI should generate recommendations only.

Users must confirm changes before they are saved.

---

# Validation

Meal Plan

Must contain

- Date
- Meal Type
- At least one Recipe or Food Item

Prevent duplicate meal entries for the same slot unless explicitly allowed.

---

# Loading States

Display loading while

- Fetching planner
- Saving planner
- Updating meals
- Generating grocery list

---

# Empty States

Examples

"No meals planned for today."

"Start by adding breakfast."

"No weekly meal plan yet."

---

# Error Handling

Handle

- API failures
- Invalid recipe
- Invalid food item
- Network timeout
- Unauthorized access

Allow retry.

---

# Accessibility

- Keyboard navigation
- Screen reader support
- Accessible calendar
- Proper focus order
- High contrast support

---

# Performance

- Lazy load weekly data
- Cache planner responses
- Optimistic UI updates where appropriate
- Batch API updates when saving multiple changes

---

# Future Enhancements

- Drag-and-drop meal scheduling
- AI Smart Meal Planning
- Pantry-aware planning
- Budget optimization
- Seasonal recipe suggestions
- Family meal planning
- Shared meal plans
- Calendar synchronization
- Offline meal planning

---

# Acceptance Criteria

The feature is complete when

- Users can create daily meal plans.
- Users can create weekly meal plans.
- Recipes and food items can be added to meals.
- Nutrition totals update automatically.
- Grocery lists can be generated.
- Meal plans integrate with Dashboard and Nutrition Log.
- APIs follow API_CONTRACT.md.
- Loading and error states are implemented.
- UI matches the approved design.
- AI-generated plans require user confirmation before saving.