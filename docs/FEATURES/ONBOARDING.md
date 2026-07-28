# Onboarding Feature Specification

## Purpose

The Onboarding module collects the user's personal information, health profile, and nutrition goals.

This information is used to personalize the entire NutriTrack experience.

Every authenticated user should complete onboarding before accessing the dashboard.

---

# Goals

The onboarding process should:

- Collect essential user information
- Calculate nutrition targets
- Save user preferences
- Personalize recommendations
- Enable dashboard generation

---

# User Flow

```
Register

↓

Login

↓

Start Onboarding

↓

Personal Information

↓

Health Information

↓

Lifestyle

↓

Goals

↓

Review

↓

Save

↓

Dashboard
```

---

# Multi-Step Flow

The onboarding process consists of six steps.

### Step 1 – Personal Information

Collect

- First Name
- Last Name
- Date of Birth
- Gender

Validation

- All fields required
- Age must be greater than 13

---

### Step 2 – Body Measurements

Collect

- Height
- Current Weight
- Target Weight

Units

Height

- cm

Weight

- kg

Validation

- Positive values only

---

### Step 3 – Lifestyle

Collect

- Activity Level

Options

- Sedentary
- Lightly Active
- Moderately Active
- Very Active
- Athlete

Collect

- Workout Days Per Week

Validation

0–7

---

### Step 4 – Goal

Select

- Lose Weight
- Maintain Weight
- Gain Weight
- Build Muscle
- Improve Fitness

---

### Step 5 – Food Preferences

Collect

Diet

- None
- Vegetarian
- Vegan
- Keto
- Paleo

Allergies

- Milk
- Eggs
- Peanuts
- Seafood
- Soy
- Wheat
- Tree Nuts

Preferred Cuisine

Examples

- Indian
- Chinese
- Italian
- Mediterranean
- Mexican

Cooking Skill

- Beginner
- Intermediate
- Advanced

Daily Budget

Optional

---

### Step 6 – Review

Display

- Personal Information
- Measurements
- Activity
- Goal
- Preferences

Buttons

- Edit
- Finish

---

# Pages

## Welcome

Purpose

Introduce NutriTrack.

Buttons

- Start Setup

---

## Onboarding Wizard

Contains

Progress Indicator

↓

Step Form

↓

Previous Button

↓

Next Button

↓

Save

---

# Components

```
Onboarding

├── ProgressBar

├── StepIndicator

├── PersonalInfoForm

├── BodyMeasurementsForm

├── LifestyleForm

├── GoalForm

├── PreferenceForm

├── ReviewCard

└── NavigationButtons
```

---

# React Structure

```
src/

features/

onboarding/

components/

pages/

hooks/

services/

types/

validation/
```

---

# API Endpoints

Save Onboarding

POST

/onboarding

Get Onboarding

GET

/onboarding

Update Onboarding

PUT

/onboarding

---

# Sample Request

```json
{
  "gender": "male",
  "age": 29,
  "height": 175,
  "weight": 82,
  "target_weight": 72,
  "activity_level": "moderate",
  "goal": "lose_weight",
  "diet": "vegetarian"
}
```

---

# Sample Response

```json
{
  "success": true,
  "message": "Profile saved successfully.",
  "data": {
    "completed": true
  }
}
```

---

# Database Fields

Store

- Age
- Gender
- Height
- Weight
- Target Weight
- Activity Level
- Goal
- Diet
- Allergies
- Cuisine
- Cooking Skill
- Budget

---

# Nutrition Engine

After onboarding completes, calculate

- BMI
- BMR
- TDEE
- Daily Calories
- Protein Goal
- Carbohydrate Goal
- Fat Goal
- Water Goal

These values are calculated using formulas, not AI.

---

# Dashboard Integration

The dashboard should use onboarding data to display

- Daily calorie target
- Macro targets
- Goal progress
- Personalized welcome message

---

# AI Integration

Future AI features will use onboarding data to generate

- Meal Plans
- Recipe Suggestions
- Grocery Lists
- Nutrition Coaching
- Weekly Insights

The AI should never modify onboarding information.

---

# Validation Rules

Required

- Gender
- Height
- Weight
- Goal
- Activity Level

Optional

- Allergies
- Budget
- Cuisine

---

# Error Handling

Handle

- Missing fields
- Invalid values
- API errors
- Network failures

Show user-friendly messages.

---

# Loading States

Show loading during

- Save
- Update
- Initial data fetch

Disable buttons while saving.

---

# Accessibility

- Keyboard navigation
- Proper labels
- Screen reader support
- Focus management
- High color contrast

---

# Future Enhancements

- Progress autosave
- Import data from Apple Health
- Import data from Google Fit
- Wearable integration
- Multi-language support

---

# Acceptance Criteria

The feature is complete when:

- Users can complete all onboarding steps.
- Progress is validated before continuing.
- Data is saved successfully.
- Existing data loads for editing.
- Nutrition targets are calculated.
- Dashboard receives onboarding data.
- APIs follow API_CONTRACT.md.
- TypeScript types are complete.
- Loading and error states are implemented.
- UI matches the approved design.