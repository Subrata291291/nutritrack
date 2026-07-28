# Dashboard Feature Specification

## Purpose

The Dashboard is the central hub of NutriTrack.

It provides users with a personalized overview of their nutrition, health progress, meal tracking, hydration, and activity.

Every authenticated user who has completed onboarding should land on the Dashboard after logging in.

---

# Goals

The Dashboard should allow users to

- View today's nutrition summary
- Track calorie progress
- Monitor macronutrients
- Track hydration
- View weight progress
- Access today's meal plan
- View recent activity
- Receive personalized insights
- Navigate quickly to other features

---

# User Flow

```
Login

↓

Authentication

↓

Onboarding Complete?

↓

YES

↓

Dashboard

↓

Track Progress

↓

Log Meals

↓

Update Weight

↓

View Insights
```

---

# Dashboard Layout

```
-------------------------------------------------------

Header

-------------------------------------------------------

Welcome Card

-------------------------------------------------------

Daily Calories

Protein

Carbs

Fat

Water

-------------------------------------------------------

Today's Meals

-------------------------------------------------------

Meal Plan

-------------------------------------------------------

Weight Progress

-------------------------------------------------------

Nutrition Summary

-------------------------------------------------------

Quick Actions

-------------------------------------------------------

Recent Activity

-------------------------------------------------------

AI Insights (Future)

-------------------------------------------------------
```

---

# Sections

## Welcome Card

Display

- User Name
- Current Goal
- Daily Motivation

Example

Good Morning, John 👋

Goal

Lose Weight

---

## Daily Calories

Display

- Daily Target
- Consumed
- Remaining

Visual

Circular Progress

Example

Target

2200 kcal

Consumed

1450 kcal

Remaining

750 kcal

---

## Macronutrients

Display

Protein

Carbohydrates

Fat

For each

Target

Consumed

Remaining

Progress Bar

---

## Water Tracker

Display

Daily Goal

Current Intake

Progress

Quick Add Buttons

+250ml

+500ml

+1L

---

## Today's Meals

Display

Breakfast

Lunch

Dinner

Snacks

Each meal shows

- Calories
- Time
- Status

Button

Log Meal

---

## Meal Plan

Display

Today's planned meals

Breakfast

Lunch

Dinner

Snack

Buttons

View Plan

Edit Plan

---

## Weight Progress

Display

Current Weight

Target Weight

Weekly Trend

Weight Chart

---

## Nutrition Summary

Display

Calories

Protein

Carbs

Fat

Fiber

Water

Micronutrients (Future)

---

## Quick Actions

Buttons

Log Food

Add Weight

Drink Water

Browse Recipes

Meal Planner

Food Library

Settings

---

## Recent Activity

Display

Latest meal logs

Water updates

Weight entries

Meal changes

Newest first

---

## AI Insights (Future)

Display

Daily Tip

Nutrition Suggestions

Healthy Alternatives

Weekly Recommendation

Meal Reminder

---

# Components

```
Dashboard

├── WelcomeCard

├── CaloriesCard

├── MacroCard

├── WaterCard

├── MealsCard

├── MealPlanCard

├── WeightCard

├── SummaryCard

├── QuickActions

├── ActivityCard

└── AIInsightsCard
```

---

# React Structure

```
src/

features/

dashboard/

components/

pages/

hooks/

services/

types/

widgets/
```

---

# API Endpoints

## Get Dashboard

GET

/dashboard

---

## Refresh Dashboard

GET

/dashboard/refresh

---

## Get Daily Summary

GET

/dashboard/summary

---

## Get Recent Activity

GET

/dashboard/activity

---

# Sample Response

```json
{
    "success": true,
    "data": {
        "daily_goal": {
            "calories": 2200
        },
        "macros": {
            "protein": 160,
            "carbs": 220,
            "fat": 60
        },
        "water": {
            "goal": 3000,
            "current": 1750
        },
        "recent_meals": [],
        "weight": {},
        "meal_plan": {},
        "activity": []
    }
}
```

---

# Data Sources

Dashboard combines data from

- User Profile
- Onboarding
- Meal Entries
- Weight Entries
- Meal Plans
- Water Tracking

Dashboard does not store data.

It generates a real-time view from backend APIs.

---

# Nutrition Engine Integration

Dashboard receives

- BMI
- BMR
- TDEE
- Daily Calories
- Protein Target
- Carb Target
- Fat Target
- Water Goal

These values come from deterministic calculations.

---

# AI Integration

Future AI widgets

- Daily Motivation
- Healthy Meal Suggestions
- Nutrition Tips
- Weekly Summary
- Meal Swaps
- Personalized Coaching

AI provides recommendations only.

It does not modify dashboard data.

---

# State Management

Dashboard state should include

- Loading
- Error
- Dashboard Data
- Meal Summary
- Water Summary
- Weight Summary
- Activity Feed

---

# Loading States

Show skeleton loaders for

- Cards
- Charts
- Meal List
- Activity Feed

---

# Empty States

Display friendly messages when

- No meals logged
- No weight history
- No meal plan
- No activity

Example

"You haven't logged any meals today. Start by adding your breakfast."

---

# Error Handling

Handle

- Network failures
- Unauthorized access
- API timeout
- Missing data
- Partial responses

Display retry option.

---

# Accessibility

- Keyboard navigation
- Screen reader support
- Focus management
- Accessible charts
- Color contrast compliance

---

# Performance

- Lazy load charts
- Cache dashboard data
- Avoid duplicate API requests
- Refresh only changed widgets

---

# Future Enhancements

- Weekly Dashboard
- Monthly Analytics
- Goal Achievement Badges
- Habit Tracking
- Sleep Tracking
- Exercise Summary
- Smart Widgets
- Drag-and-Drop Dashboard
- Wearable Device Integration

---

# Acceptance Criteria

The feature is complete when

- Dashboard loads after login.
- Data is personalized.
- Daily calorie progress is displayed.
- Macro progress updates correctly.
- Water tracking works.
- Weight progress is displayed.
- Meal plan is visible.
- Recent activity is shown.
- Loading and error states are implemented.
- APIs follow API_CONTRACT.md.
- Dashboard matches the approved UI.
- No hardcoded production data exists.