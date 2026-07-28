# Nutrition Log Feature Specification

## Purpose

The Nutrition Log records the user's actual food consumption throughout the day.

It provides accurate nutrition tracking by logging meals, food items, recipes, water intake, and meal completion status.

The Nutrition Log is the primary source of truth for daily nutrition analytics.

---

# Goals

The Nutrition Log should allow users to

- Log meals
- Log recipes
- Log individual food items
- Track calories
- Track macronutrients
- Track micronutrients
- Track water intake
- Edit logged meals
- Delete logged meals
- View nutrition history

---

# User Flow

```
Dashboard

↓

Log Meal

↓

Search Recipe / Food

↓

Choose Serving

↓

Save

↓

Nutrition Engine

↓

Dashboard Updated

↓

Insights Updated
```

---

# Daily Timeline

Display

Breakfast

↓

Morning Snack

↓

Lunch

↓

Afternoon Snack

↓

Dinner

↓

Evening Snack

Each entry displays

- Time
- Recipe/Food Name
- Calories
- Protein
- Carbohydrates
- Fat
- Water

---

# Logging Methods

Users can log

- Recipe
- Food Item
- Custom Meal
- Quick Calories (Future)

---

# Log Meal

Fields

- Date
- Time
- Meal Type
- Recipe
- Food Item
- Quantity
- Serving Size
- Notes

Actions

- Save
- Cancel

---

# Water Tracking

Users can

Add

- 250 ml
- 500 ml
- 750 ml
- 1000 ml

Or enter a custom amount.

Display

Current Intake

↓

Daily Goal

↓

Remaining

---

# Nutrition Summary

Display

Calories

Protein

Carbohydrates

Fat

Fiber

Sugar

Water

Compare

Consumed

↓

Target

↓

Remaining

---

# Daily History

Users can browse

Today

Yesterday

Last 7 Days

Last 30 Days

Custom Date

---

# Components

```
NutritionLog

├── Timeline

├── MealCard

├── AddMealModal

├── FoodSearch

├── RecipeSearch

├── ServingSelector

├── WaterTracker

├── NutritionSummary

├── DailyHistory

├── EditMealModal

└── DeleteConfirmation
```

---

# React Structure

```
src/

features/

nutrition-log/

components/

pages/

hooks/

services/

types/

validation/
```

---

# API Endpoints

## Get Nutrition Log

GET

/nutrition-log

Supports

- Date
- Week
- Month

---

## Create Meal Entry

POST

/nutrition-log

---

## Update Meal Entry

PUT

/nutrition-log/{id}

---

## Delete Meal Entry

DELETE

/nutrition-log/{id}

---

## Add Water

POST

/nutrition-log/water

---

## Daily Summary

GET

/nutrition-log/summary

---

# Sample Response

```json
{
  "success": true,
  "data": {
    "date": "2026-08-03",
    "calories": {
      "target": 2200,
      "consumed": 1850,
      "remaining": 350
    },
    "protein": {
      "target": 160,
      "consumed": 132
    },
    "meals": [],
    "water": {
      "goal": 3000,
      "current": 2250
    }
  }
}
```

---

# Database Fields

Each nutrition log entry stores

- User ID
- Date
- Time
- Meal Type
- Recipe ID (optional)
- Food Item ID (optional)
- Quantity
- Serving Size
- Calories
- Protein
- Carbohydrates
- Fat
- Fiber
- Water
- Notes

---

# Relationships

Nutrition Log

↓

Food Library

↓

Recipes

↓

Meal Planner

↓

Dashboard

↓

Insights

↓

AI Coach

---

# Dashboard Integration

Dashboard should display

Today's Calories

Today's Macros

Water Progress

Meal Completion

Recent Meals

---

# Meal Planner Integration

Users can

Mark Meal As

- Completed
- Skipped
- Replaced

Completed meals automatically populate the Nutrition Log.

---

# Weight Tracker Integration

Nutrition Log contributes to

- Weight Trends
- Goal Progress
- Weekly Reports

---

# Insights Integration

Generate

Daily Summary

↓

Weekly Summary

↓

Monthly Summary

Using Nutrition Log data.

---

# AI Integration

Future AI features

- Detect unhealthy eating patterns
- Suggest healthier alternatives
- Recommend missing nutrients
- Predict goal achievement
- Provide personalized coaching
- Analyze meal consistency

AI reads Nutrition Log data but never modifies user history.

---

# Validation

Every meal entry must include

- Date
- Meal Type
- At least one Food Item or Recipe
- Valid Serving Size

Prevent invalid quantities.

---

# Loading States

Show loading while

- Fetching log
- Saving meal
- Updating meal
- Deleting meal
- Adding water

---

# Empty States

Examples

"You haven't logged any meals today."

"Start by logging your breakfast."

"No nutrition history found."

---

# Error Handling

Handle

- API failures
- Invalid food
- Invalid recipe
- Unauthorized access
- Network timeout

Provide retry option.

---

# Accessibility

- Keyboard navigation
- Screen reader support
- Accessible forms
- Focus management
- Color contrast compliance

---

# Performance

- Cache daily logs
- Lazy load history
- Debounced food search
- Optimistic UI updates

---

# Future Enhancements

- Barcode meal logging
- AI image-based meal detection
- Voice meal logging
- Offline meal logging
- Smart reminders
- Meal streak tracking
- Habit tracking
- Nutrition export (PDF/CSV)

---

# Acceptance Criteria

The feature is complete when

- Users can log meals.
- Users can log recipes and food items.
- Water tracking works.
- Nutrition totals update automatically.
- Dashboard reflects logged meals.
- Meal Planner integrates with logged meals.
- Daily and historical logs are available.
- APIs follow API_CONTRACT.md.
- Loading and error states are implemented.
- UI matches the approved design.
- AI features consume Nutrition Log data without altering historical records.