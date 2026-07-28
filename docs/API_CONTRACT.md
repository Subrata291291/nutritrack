# NutriTrack API Contract

## Purpose

This document defines the communication contract between the React frontend and the WordPress backend.

Every API endpoint should follow this specification.

The frontend must never access the database directly.

All communication happens through the NutriTrack API Plugin.

---

# API Principles

- REST API only
- JSON Request
- JSON Response
- JWT Authentication
- Consistent response format
- Proper HTTP Status Codes
- Versioned endpoints

Base URL

/wp-json/nutritrack/v1/

---

# Authentication

Current Authentication

JWT Authentication for WP REST API

Login

POST

/auth/login

Response

```json
{
    "success": true,
    "token": "...",
    "user": {
        "id": 1,
        "email": "...",
        "name": "..."
    }
}
```

Protected Requests

Authorization

```
Bearer JWT_TOKEN
```

---

# User APIs

## Register

POST

/users/register

Purpose

Create new user.

---

## Login

POST

/auth/login

Purpose

Authenticate user.

---

## Logout

POST

/auth/logout

Purpose

Destroy session.

---

## Get Profile

GET

/profile

Purpose

Return complete user profile.

---

## Update Profile

PUT

/profile

Purpose

Update user information.

---

# Onboarding APIs

## Save Onboarding

POST

/onboarding

Purpose

Save onboarding information.

Payload

```json
{
    "age": 28,
    "gender": "male",
    "height": 175,
    "weight": 82,
    "goal": "lose_weight",
    "activity_level": "moderate"
}
```

Response

```json
{
    "success": true
}
```

---

# Dashboard

GET

/dashboard

Purpose

Return dashboard data.

Response

```json
{
    "daily_goal": {},
    "macros": {},
    "water": {},
    "recent_meals": [],
    "progress": {}
}
```

Dashboard must always be generated dynamically.

---

# Recipes

## Get Recipes

GET

/recipes

Supports

- Pagination
- Search
- Category
- Tags

---

## Get Recipe

GET

/recipes/{id}

Returns

Complete recipe details.

---

## Search Recipes

GET

/recipes/search

Query Parameters

keyword

category

goal

diet

---

# Food Items

## List Foods

GET

/foods

---

## Get Food

GET

/foods/{id}

---

## Search Foods

GET

/foods/search

---

# Meal Planner

GET

/meal-plans

Returns

Current meal plan.

---

POST

/meal-plans

Creates meal plan.

---

PUT

/meal-plans/{id}

Updates meal plan.

---

DELETE

/meal-plans/{id}

Deletes meal plan.

---

# Meal Entries

GET

/meals

Returns

User meal history.

---

POST

/meals

Log meal.

---

PUT

/meals/{id}

Update meal.

---

DELETE

/meals/{id}

Delete meal.

---

# Weight Tracking

GET

/weights

Returns

Weight history.

---

POST

/weights

Create entry.

---

PUT

/weights/{id}

Update.

---

DELETE

/weights/{id}

Delete.

---

# Insights

GET

/insights

Returns

Weekly

Monthly

Yearly summaries.

---

# Settings

GET

/settings

Returns

User preferences.

---

PUT

/settings

Updates

User settings.

---

# Standard Response

Every successful response should follow

```json
{
    "success": true,
    "message": "",
    "data": {}
}
```

Collection responses

```json
{
    "success": true,
    "count": 25,
    "data": []
}
```

Error response

```json
{
    "success": false,
    "message": "Validation failed",
    "errors": {}
}
```

---

# HTTP Status Codes

200 OK

201 Created

204 Deleted

400 Validation Error

401 Unauthorized

403 Forbidden

404 Not Found

422 Validation Failed

500 Internal Server Error

---

# Future AI APIs

The AI service will not be called directly by React.

React

↓

WordPress

↓

AI Service

Future endpoints

POST

/ai/generate-meal-plan

POST

/ai/recommend-recipes

POST

/ai/generate-shopping-list

POST

/ai/daily-coach

POST

/ai/weekly-summary

POST

/ai/food-substitution

POST

/ai/nutrition-analysis

---

# AI Response Format

AI should always return structured JSON.

Example

```json
{
    "success": true,
    "data": {
        "recommendations": [],
        "summary": "",
        "confidence": 0.94
    }
}
```

No markdown.

No plain text.

No HTML.

Always valid JSON.

---

# API Rules

Never bypass the plugin.

Never expose database structure.

Never expose ACF directly.

Always validate user ownership.

Always validate JWT.

Always sanitize input.

Always escape output.

Always return consistent JSON.

Always version new endpoints.

Never break backward compatibility.