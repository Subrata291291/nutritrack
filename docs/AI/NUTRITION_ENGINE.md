# Nutrition Engine Specification

## Purpose

The Nutrition Engine is the deterministic calculation layer of NutriTrack.

Its responsibility is to calculate health metrics, nutrition targets, hydration goals, progress indicators, and business rules using scientifically accepted formulas and configurable application settings.

The Nutrition Engine must never depend on an AI model.

---

# Objectives

The Nutrition Engine is responsible for

- Body Mass Index (BMI)
- Basal Metabolic Rate (BMR)
- Total Daily Energy Expenditure (TDEE)
- Daily Calorie Target
- Macronutrient Targets
- Water Intake Goal
- Nutrition Score
- Goal Progress
- Weight Progress
- Meal Completion Metrics

---

# Core Principles

- Deterministic
- Stateless
- Testable
- Configurable
- Provider Independent
- Reusable
- Unit Tested

Given identical input, the engine must always return identical output.

---

# Inputs

The engine receives

## User Profile

- Age
- Gender
- Height
- Weight

---

## Lifestyle

- Activity Level

Examples

- Sedentary
- Lightly Active
- Moderately Active
- Very Active
- Athlete

---

## Goals

Supported goals

- Lose Weight
- Maintain Weight
- Gain Weight

---

## Preferences

May include

- Daily Water Goal Override
- Macro Preference
- Medical Restrictions

These preferences modify output without changing calculation formulas.

---

# BMI

Formula

```
BMI = Weight (kg) / Height² (m²)
```

Classification

| BMI | Category |
|------|----------|
| <18.5 | Underweight |
| 18.5–24.9 | Healthy |
| 25–29.9 | Overweight |
| ≥30 | Obesity |

---

# BMR

Use the Mifflin–St Jeor Equation.

## Male

```
BMR = (10 × Weight)
    + (6.25 × Height)
    - (5 × Age)
    + 5
```

---

## Female

```
BMR = (10 × Weight)
    + (6.25 × Height)
    - (5 × Age)
    - 161
```

Height in centimeters.

Weight in kilograms.

---

# Activity Multipliers

| Activity | Multiplier |
|-----------|------------|
| Sedentary | 1.20 |
| Lightly Active | 1.375 |
| Moderately Active | 1.55 |
| Very Active | 1.725 |
| Athlete | 1.90 |

---

# TDEE

Formula

```
TDEE = BMR × Activity Multiplier
```

Round to the nearest whole number.

---

# Goal Adjustment

## Weight Loss

Default

```
TDEE − 500 kcal
```

Configurable

-250

-500

-750

---

## Maintain

```
TDEE
```

---

## Weight Gain

Default

```
TDEE + 300 kcal
```

Configurable

+250

+300

+500

---

# Daily Calorie Target

```
Calories = Goal Adjusted TDEE
```

Never return a value below configurable safety limits.

---

# Macronutrient Targets

Default distribution

| Macro | Percentage |
|---------|------------|
| Protein | 30% |
| Carbohydrates | 40% |
| Fat | 30% |

Convert percentages into grams.

---

## Protein

```
Protein Calories = Calories × %

Protein Grams = Protein Calories / 4
```

---

## Carbohydrates

```
Carb Calories = Calories × %

Carb Grams = Carb Calories / 4
```

---

## Fat

```
Fat Calories = Calories × %

Fat Grams = Fat Calories / 9
```

---

# Water Intake

Default

```
35 ml × Weight
```

Examples

70 kg

↓

2450 ml

Allow manual override in user settings.

---

# Nutrition Score

Purpose

Provide a daily adherence score.

Range

0–100

Inputs

- Calories
- Protein
- Carbohydrates
- Fat
- Water
- Meal Completion

Suggested weighting

| Metric | Weight |
|---------|--------|
| Calories | 30% |
| Protein | 25% |
| Carbohydrates | 15% |
| Fat | 15% |
| Water | 10% |
| Meal Completion | 5% |

Score calculation rules should be configurable.

---

# Weight Progress

Calculate

- Current Weight
- Starting Weight
- Goal Weight
- Difference
- Percentage Complete

Example

```
Start

90 kg

↓

Current

84 kg

↓

Goal

75 kg
```

Progress

```
6 / 15 = 40%
```

---

# Meal Completion

Track

- Planned Meals
- Logged Meals
- Skipped Meals

Completion

```
Logged / Planned
```

---

# Weekly Metrics

Calculate

- Average Calories
- Average Protein
- Average Water
- Average Weight
- Meal Consistency

---

# Monthly Metrics

Calculate

- Weight Change
- Average Calories
- Nutrition Score
- Water Average
- Goal Progress

---

# Validation

Validate

Age

- 13–120

Height

- 100–250 cm

Weight

- 20–500 kg

Reject invalid values with meaningful errors.

Validation thresholds should be configurable.

---

# Output

Example

```json
{
  "bmi": 25.6,
  "bmi_category": "Overweight",
  "bmr": 1725,
  "tdee": 2674,
  "calories": 2174,
  "protein": 163,
  "carbohydrates": 217,
  "fat": 72,
  "water": 2800
}
```

---

# Performance

The Nutrition Engine should

- Execute synchronously
- Avoid external API calls
- Cache reusable calculations where appropriate
- Be suitable for real-time requests

---

# Configuration

All configurable values should be stored outside source code.

Examples

- Activity multipliers
- Goal adjustments
- Macro ratios
- Water formula
- Validation limits
- Nutrition score weights

---

# Testing

Every calculation must have automated unit tests.

Required test coverage

- BMI
- BMR
- TDEE
- Calories
- Protein
- Carbohydrates
- Fat
- Water
- Progress
- Nutrition Score

Edge cases

- Minimum values
- Maximum values
- Decimal rounding
- Invalid inputs

---

# Integration Points

The Nutrition Engine provides data to

- Dashboard
- Meal Planner
- Nutrition Log
- Weight Tracker
- Insights
- AI Service

The AI Service consumes Nutrition Engine outputs but never recalculates them.

---

# Future Enhancements

Planned deterministic calculations

- Lean Body Mass
- Body Fat Percentage (when measurements are available)
- Ideal Weight Range
- Maintenance Calorie Bands
- Micronutrient Targets
- Exercise Calorie Estimates
- Resting Heart Rate Metrics
- Sleep Recommendations (rule-based)

---

# Development Rules

- Never call an LLM from the Nutrition Engine.
- Keep formulas isolated from UI code.
- All constants must be configurable.
- Every calculation must be reproducible.
- Document all formulas with references.
- Prefer pure functions over stateful services.
- Version formulas when business rules change.

---

# Acceptance Criteria

The Nutrition Engine is complete when

- BMI is calculated correctly.
- BMR follows the Mifflin–St Jeor equation.
- TDEE uses configurable activity multipliers.
- Goal adjustments produce valid calorie targets.
- Macronutrient goals are calculated accurately.
- Water goals are generated correctly.
- Nutrition Score is deterministic.
- Validation rejects invalid input.
- All calculations are unit tested.
- The engine has no dependency on AI providers.