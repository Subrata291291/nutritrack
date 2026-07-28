# NutriTrack AI Context

## Project Overview

NutriTrack is an AI-powered nutrition and meal planning SaaS platform designed to help users build healthier lifestyles through personalized nutrition, meal planning, progress tracking, and intelligent recommendations.

The application provides a modern React frontend while using WordPress as a headless CMS and backend API. The backend exposes REST APIs through a custom WordPress plugin called "NutriTrack API".

The long-term goal is to evolve NutriTrack into a complete AI Nutrition Assistant that can create personalized meal plans, recommend recipes, monitor progress, and provide intelligent coaching.

---

# Project Vision

NutriTrack should become a complete nutrition ecosystem.

The platform should:

- Calculate scientifically accurate nutrition goals.
- Recommend meals based on user preferences.
- Suggest recipes based on nutrition requirements.
- Track daily nutrition.
- Track weight progress.
- Generate weekly meal plans.
- Generate shopping lists.
- Provide AI-powered coaching.
- Continuously adapt recommendations as the user logs meals.

The product is NOT intended to be a chatbot.

The AI should behave as an intelligent nutrition engine working behind the scenes.

---

# Current Architecture

Frontend

- React
- TypeScript
- Vite
- TailwindCSS

Backend

- WordPress
- Custom Plugin: NutriTrack API
- Advanced Custom Fields Pro
- JWT Authentication for WP REST API

Current Development Environment

React Project

D:\OneDrive\Desktop\react-nutritrack

WordPress Project

C:\MAMP\htdocs\nutritrack

Authentication

JWT Authentication for WP REST API

---

# Current Features

The project already contains working UI for:

- User Login
- User Registration
- User Onboarding
- Dashboard
- Nutrition Log
- Recipe Library
- Recipe Details
- Meal Planner
- Insights
- Settings

WordPress contains custom post types for:

- Recipes
- Food Items
- Meal Entries
- Meal Plans
- Weight Entries

A custom plugin called "NutriTrack API" exposes REST endpoints consumed by the React application.

---

# Current Workflow

Current workflow is:

React

↓

JWT Authentication

↓

NutriTrack API Plugin

↓

WordPress Database

↓

Response returned to React

No AI service currently exists.

---

# Product Goal

The primary goal of NutriTrack is NOT to display recipes.

The goal is to help every user receive a completely personalized nutrition experience based on their personal information.

Each user's dashboard should become unique.

---

# User Journey

A new user should experience the following flow:

1. Register
2. Login
3. Complete onboarding
4. System calculates nutrition goals
5. Dashboard is personalized
6. Recipes become personalized
7. Meal plans become personalized
8. Nutrition tracking begins
9. AI continuously improves recommendations

---

# Future AI Vision

After onboarding, NutriTrack should understand:

- Age
- Gender
- Height
- Weight
- Activity Level
- Goal
- Dietary Preferences
- Allergies
- Medical Restrictions
- Budget Preference
- Cooking Skill
- Preferred Cuisine

Using this information the system should generate:

- Personalized calorie goal
- Protein target
- Carbohydrate target
- Fat target
- Water target
- Recommended recipes
- Weekly meal plan
- Grocery list
- Daily coaching
- Weekly nutrition summary
- Healthy food substitutions
- Nutrition insights

---

# AI Philosophy

Artificial Intelligence should NOT replace scientific calculations.

Use deterministic formulas for:

- BMI
- BMR
- TDEE
- Daily Calories
- Macronutrient Calculation

Use AI only for:

- Meal recommendations
- Recipe recommendations
- Meal planning
- Grocery generation
- Nutrition coaching
- Daily motivation
- Weekly summaries
- Food substitutions
- Personalized insights

---

# Development Philosophy

This project follows these principles:

- Keep frontend clean and modular.
- Keep WordPress as the CMS and backend.
- Use REST APIs for communication.
- Keep business logic separate from UI.
- AI should be implemented as an independent service.
- Every feature should be reusable.
- Every API should return structured JSON.

---

# Current Priority

Current priority is NOT adding AI immediately.

The current priority is making every page fully dynamic using existing WordPress APIs.

No page should contain hardcoded data.

After the SaaS works completely, AI features will be introduced incrementally.

---

# Long-Term Modules

Future modules include:

- AI Nutrition Engine
- AI Meal Planner
- AI Recipe Recommendation
- AI Grocery Generator
- AI Daily Coach
- AI Weekly Report
- AI Progress Prediction
- AI Smart Search
- AI Food Scanner
- AI Barcode Scanner
- AI Voice Assistant

---

# Important Development Rules

Never redesign the existing UI unless explicitly requested.

Never replace the current project architecture.

Always reuse existing APIs before creating new ones.

Always extend existing components instead of creating duplicates.

Never hardcode production data.

Preserve the existing React folder structure.

Preserve compatibility with WordPress.

Keep code readable and modular.

Always prefer scalable solutions.

Always explain architectural decisions before making major changes.