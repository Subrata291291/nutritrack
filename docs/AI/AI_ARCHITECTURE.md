# AI Architecture

## Purpose

This document defines how Artificial Intelligence integrates with NutriTrack.

Its purpose is to establish clear architectural boundaries between deterministic business logic, the AI service, the frontend, and the backend.

AI should enhance the user experience by generating recommendations, meal plans, coaching, and insights. AI must never replace deterministic calculations or business rules.

---

# Architecture Overview

```
                        User

                         │

                         ▼

                React Frontend (Vite)

                         │

                  REST API / JWT

                         │

                         ▼

                WordPress Backend

             (Custom Plugin + ACF)

                         │

      ┌──────────────────┴──────────────────┐

      │                                     │

      ▼                                     ▼

Nutrition Engine                  AI Service (FastAPI)

(Business Rules)                     Gemini/OpenAI

      │                                     │

      └───────────────┬─────────────────────┘

                      ▼

                Structured JSON

                      ▼

                 React UI
```

---

# Core Principles

The architecture separates deterministic logic from generative AI.

## Deterministic Systems

Responsible for

- Authentication
- User Profile
- BMI
- BMR
- TDEE
- Daily Calories
- Macronutrients
- Water Goal
- Progress Tracking
- Validation
- Permissions
- Security

These systems must always produce identical results for identical inputs.

No Large Language Model should calculate these values.

---

## AI Systems

Responsible for

- Personalized Meal Plans
- Recipe Recommendations
- Grocery Lists
- Coaching
- Nutrition Advice
- Healthy Alternatives
- Weekly Reviews
- Habit Analysis
- Motivation
- Educational Content

AI generates recommendations only.

AI never owns business logic.

---

# System Responsibilities

## React Frontend

Responsible for

- User Interface
- Forms
- Charts
- State Management
- API Calls
- Loading States
- Error States

The frontend never communicates directly with Gemini or OpenAI.

All AI requests pass through the backend.

---

## WordPress Backend

Responsible for

- Authentication
- JWT
- User Data
- Custom Post Types
- Recipes
- Food Library
- Meal Plans
- Nutrition Log
- Weight Entries
- Validation
- Permissions

WordPress is the source of truth for application data.

---

## Nutrition Engine

Responsible for deterministic calculations.

Examples

- BMI
- BMR
- TDEE
- Calories
- Protein
- Carbohydrates
- Fat
- Water Goal
- Nutrition Score

The Nutrition Engine never calls an AI model.

---

## AI Service (FastAPI)

Responsible for

- Prompt construction
- Context preparation
- Calling Gemini/OpenAI
- Parsing AI responses
- Validating response format
- Returning structured JSON

The AI Service must remain stateless.

Business data remains in WordPress.

---

# AI Request Flow

```
User

↓

React

↓

WordPress API

↓

FastAPI

↓

Build Prompt

↓

Gemini / OpenAI

↓

Validate Response

↓

Return JSON

↓

React UI
```

---

# Prompt Construction

Every prompt should contain

## System Context

Defines

- AI role
- Behavioral rules
- Output requirements

---

## User Context

Includes

- Goal
- Age
- Gender
- Height
- Weight
- Activity Level
- Dietary Preferences
- Allergies
- Cuisine Preferences

Only include the minimum information required for the task.

---

## Nutrition Context

Includes

- Calorie Target
- Protein Target
- Carbohydrate Target
- Fat Target
- Water Goal

These values are calculated by the Nutrition Engine.

Never ask AI to calculate them.

---

## Historical Context

May include

- Recent Meals
- Weight Trend
- Nutrition Summary
- Meal Consistency

Only include relevant history.

Avoid unnecessary prompt length.

---

## User Request

Examples

Generate

- Weekly Meal Plan
- Grocery List
- Healthy Alternatives
- Weekly Coaching
- Recipe Suggestions

---

# AI Response Format

Every response should be valid JSON.

Example

```json
{
  "success": true,
  "recommendations": [],
  "summary": "",
  "warnings": [],
  "confidence": 0.91
}
```

The AI Service should validate and normalize responses before returning them.

---

# AI Features

## Meal Planning

Input

- User Profile
- Goals
- Calories
- Macros
- Preferences

Output

- 7-Day Meal Plan

---

## Recipe Recommendation

Input

- Preferences
- Nutrition Targets

Output

- Recipe IDs
- Serving Sizes
- Notes

---

## Grocery List

Input

- Meal Plan

Output

- Consolidated Ingredient List

---

## Weekly Coach

Input

- Nutrition Log
- Weight Trend
- Goal Progress

Output

- Summary
- Encouragement
- Action Items

---

## Healthy Alternatives

Input

- Selected Food

Output

- Better Options
- Nutritional Comparison

---

# Data Ownership

WordPress owns

- Users
- Recipes
- Foods
- Meal Plans
- Weight
- Logs
- Goals

AI owns

- Temporary recommendations

AI recommendations should only become persistent after user confirmation.

---

# Security

Never expose

- API Keys
- JWT Secrets
- Internal Prompts
- System Instructions

API keys should exist only on the server.

---

# Privacy

Only send data required for the request.

Avoid sending unnecessary personal information.

Do not include authentication credentials in AI prompts.

Follow data minimization principles.

---

# Error Handling

Handle

- AI Timeout
- Invalid JSON
- Empty Response
- Rate Limit
- Network Failure
- Unsupported Request

Fallback gracefully with user-friendly messages.

---

# Performance

- Cache repeated AI requests where appropriate.
- Minimize prompt size.
- Reuse deterministic results.
- Avoid duplicate API calls.
- Use asynchronous processing for long-running tasks.

---

# Scalability

The AI Service should support multiple providers.

Current

- Gemini

Future

- OpenAI
- Anthropic Claude
- Local LLMs
- Azure OpenAI

The provider should be configurable without changing business logic.

---

# Future AI Modules

Planned capabilities

- Voice Nutrition Coach
- Image-Based Food Recognition
- Barcode Scanner
- Smart Grocery Optimization
- Exercise Recommendations
- Habit Detection
- Predictive Goal Forecasting
- Personalized Challenges
- Health Risk Detection
- Multi-Agent Coaching

---

# Development Rules

- AI is an assistant, not the source of truth.
- Never replace deterministic calculations with AI.
- Always validate AI output before use.
- Store only user-approved AI results.
- Keep prompts modular and reusable.
- Make AI provider-agnostic.
- Ensure all AI-generated data is traceable to the originating request.

---

# Acceptance Criteria

The architecture is complete when

- React communicates only with backend APIs.
- WordPress remains the source of truth.
- Nutrition Engine performs all deterministic calculations.
- AI Service handles all LLM interactions.
- AI responses are validated before reaching the UI.
- API keys are never exposed to the client.
- The system supports multiple AI providers.
- User-approved AI outputs can be persisted safely.
- All modules follow the responsibilities defined in this document.