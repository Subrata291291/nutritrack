# NutriTrack Database & Data Model

## Purpose

This document defines every major entity used by NutriTrack.

It should be treated as the source of truth for all future development.

Every API, frontend page, AI feature, and backend module should follow this document.

---

# System Overview

NutriTrack stores data in WordPress using:

- WordPress Users
- Custom Post Types
- Advanced Custom Fields
- User Meta

The frontend must never assume database structure.

All communication happens through the NutriTrack API plugin.

---

# Main Entities

The system currently consists of the following entities.

1. User
2. Recipe
3. Food Item
4. Meal Entry
5. Meal Plan
6. Weight Entry

Future entities

7. Grocery List
8. AI Recommendation
9. Nutrition Report
10. Achievement
11. User Goal History

---

# Entity Relationship

```

User

├── Profile

├── Meal Entries

├── Weight Entries

├── Meal Plans

├── Dashboard

└── AI Recommendations

Recipe

├── Ingredients

├── Nutrition

├── Category

└── Meal Plans

Food Item

├── Nutrition

└── Meal Entries

Meal Plan

├── Breakfast

├── Lunch

├── Dinner

└── Snacks

```

---

# User

Source

WordPress User

Purpose

Stores authentication and user profile.

Current Fields

- ID
- Email
- Username
- Password

Future Profile Fields

- First Name
- Last Name
- Age
- Gender
- Height
- Weight
- Target Weight
- Activity Level
- Goal
- Dietary Preference
- Allergies
- Medical Conditions
- Budget Preference
- Preferred Cuisine
- Cooking Skill
- Daily Water Goal
- Daily Calorie Goal

---

# Recipe

Source

Custom Post Type

Purpose

Stores reusable meals.

Current Fields

- Title
- Featured Image
- Category
- Prep Time
- Cook Time
- Servings
- Calories
- Protein
- Carbs
- Fat
- Ingredients
- Instructions

Future Fields

- Difficulty
- Cuisine
- Meal Type
- AI Generated
- AI Confidence
- Allergens
- Cost Estimate
- Sustainability Score

---

# Food Item

Source

Custom Post Type

Purpose

Stores individual foods.

Examples

Apple

Chicken Breast

Rice

Milk

Current Fields

- Name
- Calories
- Protein
- Carbs
- Fat

Future Fields

- Barcode
- Brand
- Serving Sizes
- Micronutrients
- Glycemic Index
- Food Category

---

# Meal Entry

Purpose

Stores foods eaten by users.

Fields

- User
- Date
- Meal Type
- Recipe
- Food Items
- Calories
- Protein
- Carbs
- Fat
- Water Intake

---

# Meal Plan

Purpose

Stores personalized meal schedules.

Fields

- User
- Week
- Monday
- Tuesday
- Wednesday
- Thursday
- Friday
- Saturday
- Sunday

Each day contains

Breakfast

Lunch

Dinner

Snack

---

# Weight Entry

Purpose

Tracks weight history.

Fields

- User
- Date
- Weight
- BMI
- Body Fat (future)

---

# Dashboard Data

Dashboard does not store data.

Dashboard is generated dynamically.

Data comes from

- User
- Meal Entries
- Weight Entries
- Meal Plans

Dashboard should calculate

- Remaining Calories
- Remaining Protein
- Remaining Carbs
- Remaining Fat
- Water Progress
- Weight Progress

---

# AI Data

AI should never overwrite existing user data.

AI generates recommendations only.

Future AI Objects

Meal Recommendation

Recipe Recommendation

Shopping List

Nutrition Advice

Weekly Summary

Daily Coach

Food Alternatives

These objects should be stored separately.

---

# Relationships

One User

↓

Many Meal Entries

↓

Many Weight Entries

↓

Many Meal Plans

↓

Many AI Recommendations

Recipe

↓

Many Meal Plans

↓

Many Meal Entries

Food Item

↓

Many Meal Entries

---

# Source of Truth

User Profile

↓

WordPress User Meta

Recipe

↓

WordPress CPT

Food Item

↓

WordPress CPT

Meal Entry

↓

WordPress CPT

Meal Plan

↓

WordPress CPT

Weight Entry

↓

WordPress CPT

AI Recommendations

↓

Future AI Service

---

# Ownership Rules

React

Owns

- UI
- Routing
- Forms

WordPress

Owns

- Database
- Authentication
- Business Logic

AI

Owns

- Recommendations
- Coaching
- Suggestions

---

# Important Rules

Never duplicate user data.

Never calculate business logic in React.

Never modify WordPress data directly from React.

Always use REST APIs.

Never store calculated dashboard values permanently.

Dashboard values should always be generated dynamically.

AI should recommend.

WordPress should persist.

React should render.