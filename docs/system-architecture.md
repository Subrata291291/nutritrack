# NutriTrack System Architecture

## Purpose

This document describes the complete technical architecture of NutriTrack.

Every AI coding agent must understand this architecture before modifying the project.

Do not redesign the architecture unless explicitly instructed.

---

# High-Level Architecture

NutriTrack follows a Headless CMS architecture.

```
                        User

                         │

                         ▼

               React Frontend (Vite)

                         │

                    JWT Token

                         │

                         ▼

             WordPress REST API

                         │

                         ▼

              NutriTrack API Plugin

                         │

        ┌────────────────────────────┐
        │                            │
        ▼                            ▼

 Advanced Custom Fields         WordPress Database

        │                            │
        └──────────────┬─────────────┘
                       │
                       ▼

                  JSON Response

                       │

                       ▼

                 React Components
```

---

# Frontend

Project Location

```
D:\OneDrive\Desktop\react-nutritrack
```

Technology

- React
- TypeScript
- Vite
- TailwindCSS

Responsibilities

- User Interface
- Authentication
- API Communication
- State Management
- Routing
- Form Validation
- Dashboard Rendering

The frontend should never directly access the database.

Every request must go through the REST API.

---

# Backend

Project Location

```
C:\MAMP\htdocs\nutritrack
```

Technology

- WordPress
- Custom Plugin
- ACF Pro
- JWT Authentication

Responsibilities

- Authentication
- Data Storage
- Business Logic
- REST APIs
- Custom Post Types
- User Metadata

WordPress acts as the Headless CMS.

---

# Authentication Flow

Current authentication uses

JWT Authentication for WP REST API

Flow

```
User Login

↓

React

↓

JWT Login Endpoint

↓

WordPress

↓

JWT Token

↓

React Local Storage

↓

Protected API Requests
```

All authenticated requests should include

Authorization

```
Bearer {JWT_TOKEN}
```

---

# Current Data Flow

Example

User opens Dashboard

```
Dashboard Page

↓

React API Service

↓

GET Dashboard Endpoint

↓

NutriTrack Plugin

↓

WordPress

↓

JSON

↓

Dashboard UI
```

React should never calculate business logic.

The backend is responsible for returning structured data.

---

# WordPress Responsibilities

WordPress manages

- Recipes
- Food Items
- Meal Entries
- Meal Plans
- Weight Entries
- User Metadata

WordPress is the single source of truth.

---

# React Responsibilities

React should

- Render UI
- Display API data
- Submit forms
- Handle loading states
- Handle error states
- Manage navigation

React should not contain duplicated business logic.

---

# Existing User Flow

```
Register

↓

Login

↓

JWT Token

↓

Onboarding

↓

Dashboard

↓

Recipes

↓

Meal Planner

↓

Nutrition Log

↓

Insights

↓

Settings
```

---

# Onboarding Flow

Current onboarding collects

- Age
- Gender
- Height
- Weight
- Activity Level
- Goal

Future onboarding will also include

- Dietary Preference
- Allergies
- Medical Conditions
- Budget
- Preferred Cuisine
- Cooking Skill

---

# Current Recipe System

Recipes are currently created manually.

Admin creates

Recipe

↓

WordPress

↓

React displays recipe

Current recipes are static content managed through WordPress.

---

# Future AI Recipe System

Future architecture

```
Admin

↓

Generate Recipe

↓

AI

↓

Draft

↓

Admin Approval

↓

Publish

↓

Recipe Library
```

AI should never automatically publish recipes.

All AI-generated recipes require human approval.

---

# Current Dashboard

Dashboard currently displays

- Calories
- Macros
- Water
- Weight
- Meals
- Progress

Future versions will use real user data.

No hardcoded values should remain.

---

# Planned AI Architecture

AI will be implemented as an independent service.

Future architecture

```
React

↓

WordPress

↓

AI Service

↓

Gemini

↓

Structured JSON

↓

WordPress

↓

React
```

The AI service should never communicate directly with React.

React communicates only with WordPress.

WordPress communicates with the AI service.

---

# AI Responsibilities

The AI service will provide

- Meal Recommendations
- Recipe Recommendations
- Grocery Lists
- Daily Coaching
- Weekly Reports
- Healthy Alternatives
- Personalized Advice

The AI service should always return structured JSON.

Never return formatted text unless explicitly requested.

---

# Mathematical Calculations

These calculations should NEVER use AI

- BMI
- BMR
- TDEE
- Calories
- Protein
- Carbohydrates
- Fat
- Water

Use deterministic formulas.

---

# Future Data Flow

```
User

↓

Onboarding

↓

WordPress

↓

Nutrition Engine

↓

AI Recommendation Engine

↓

Meal Plan

↓

Recipes

↓

Dashboard

↓

Meal Log

↓

Insights
```

---

# Development Principles

Always extend the existing architecture.

Never duplicate APIs.

Never redesign existing pages.

Prefer reusable components.

Prefer reusable services.

Keep business logic inside backend services.

Return structured JSON.

Use TypeScript types.

Use modular architecture.

Always maintain backward compatibility.

Document every major architectural change.