# Weight Tracker Feature Specification

## Purpose

The Weight Tracker allows users to record and monitor their body weight over time.

It provides visual progress tracking, goal monitoring, trend analysis, and historical records to help users stay motivated and evaluate their nutrition plan.

The Weight Tracker integrates with the Dashboard, Nutrition Engine, Insights, and future AI Coaching modules.

---

# Goals

The Weight Tracker should allow users to

- Record weight entries
- View weight history
- Monitor progress toward target weight
- Visualize trends using charts
- Edit weight records
- Delete weight records
- Compare current weight with goals
- View BMI changes
- Analyze long-term progress

---

# User Flow

```
Dashboard

↓

Weight Tracker

↓

Add Weight

↓

Save Entry

↓

Nutrition Engine

↓

Dashboard Updated

↓

Insights Updated

↓

Goal Progress Updated
```

---

# Pages

## Weight Tracker

Purpose

Display current weight, goal progress, and weight history.

Sections

- Current Weight
- Goal Weight
- Progress Chart
- Weight History
- Statistics

---

## Add Weight

Fields

- Date
- Time
- Weight
- Notes (Optional)

Actions

- Save
- Cancel

Validation

- Positive value
- Reasonable range
- Required date
- Required weight

---

## Edit Weight

Allow users to update

- Weight
- Date
- Time
- Notes

---

# Dashboard Widgets

Display

Current Weight

↓

Target Weight

↓

Weight Difference

↓

Goal Percentage

↓

Weekly Trend

↓

BMI

---

# Charts

Display

Daily

Weekly

Monthly

Yearly

Chart Types

- Line Chart
- Progress Chart

Future

- Body Fat Chart
- Muscle Mass Chart
- Body Measurements

---

# Statistics

Display

- Current Weight
- Starting Weight
- Goal Weight
- Weight Lost
- Weight Gained
- Average Weekly Change
- BMI
- Estimated Goal Date

---

# Components

```
WeightTracker

├── WeightSummary

├── ProgressChart

├── WeightHistory

├── AddWeightModal

├── EditWeightModal

├── StatisticsCard

├── GoalProgress

├── WeightTimeline

└── DeleteConfirmation
```

---

# React Structure

```
src/

features/

weight-tracker/

components/

pages/

hooks/

services/

types/

validation/
```

---

# API Endpoints

## Get Weight History

GET

/weights

Supports

- Pagination
- Date Range

---

## Add Weight

POST

/weights

---

## Update Weight

PUT

/weights/{id}

---

## Delete Weight

DELETE

/weights/{id}

---

## Get Statistics

GET

/weights/statistics

---

# Sample Request

```json
{
  "date": "2026-08-04",
  "time": "08:30",
  "weight": 82.4,
  "notes": "Morning measurement"
}
```

---

# Sample Response

```json
{
  "success": true,
  "data": {
    "current_weight": 82.4,
    "goal_weight": 72,
    "starting_weight": 88,
    "bmi": 26.9,
    "progress": 41
  }
}
```

---

# Database Fields

Each weight entry should store

- User ID
- Date
- Time
- Weight
- BMI
- Notes
- Created At
- Updated At

Future

- Body Fat Percentage
- Muscle Mass
- Waist
- Chest
- Hips
- Neck
- Progress Photos

---

# Relationships

Weight Entry

↓

Nutrition Engine

↓

Dashboard

↓

Insights

↓

AI Coach

---

# Dashboard Integration

Dashboard displays

- Current Weight
- Goal Weight
- Progress Percentage
- Weekly Trend
- BMI

---

# Nutrition Engine Integration

Every new weight entry recalculates

- BMI
- BMR
- TDEE
- Daily Calories
- Macronutrient Targets

These calculations use deterministic formulas.

---

# Insights Integration

Generate

- Weekly Progress
- Monthly Progress
- Goal Achievement Rate
- Trend Analysis

---

# AI Integration

Future AI capabilities

- Predict goal completion date
- Detect unhealthy trends
- Suggest calorie adjustments
- Recommend activity changes
- Provide motivational coaching

AI should analyze weight data only.

AI must never modify historical records.

---

# Validation

Each entry must include

- Valid date
- Valid weight

Weight must be

- Greater than 20 kg
- Less than 500 kg

These limits should be configurable.

---

# Loading States

Display loading while

- Fetching history
- Saving entry
- Updating entry
- Deleting entry
- Loading charts

---

# Empty States

Examples

"No weight entries yet."

"Add your first weight to start tracking progress."

---

# Error Handling

Handle

- API failures
- Invalid values
- Unauthorized access
- Network timeout

Provide retry functionality.

---

# Accessibility

- Keyboard navigation
- Screen reader support
- Accessible charts
- Proper labels
- Focus management

---

# Performance

- Lazy load historical data
- Cache statistics
- Optimize chart rendering
- Paginate history

---

# Future Enhancements

- Progress photos
- Body measurements
- Body fat tracking
- Muscle mass tracking
- Smart scales integration
- Apple Health integration
- Google Fit integration
- Fitbit integration
- Garmin integration
- Weight prediction
- Goal forecasting

---

# Acceptance Criteria

The feature is complete when

- Users can add weight entries.
- Users can edit and delete entries.
- Weight history is displayed correctly.
- Charts visualize progress over time.
- BMI updates automatically.
- Dashboard reflects the latest weight.
- Nutrition targets recalculate after weight changes.
- APIs follow API_CONTRACT.md.
- Loading and error states are implemented.
- UI matches the approved design.
- AI analyzes weight trends without modifying historical data.