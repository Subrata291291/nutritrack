# NutriTrack Development Rules

## Purpose

This document defines the mandatory development rules for every AI coding agent working on NutriTrack.

Every implementation must follow these rules.

Never ignore them.

---

# Before Writing Code

Always perform these steps before making any changes.

1. Read AI_CONTEXT.md
2. Read SYSTEM_ARCHITECTURE.md
3. Read DATABASE.md
4. Read API_CONTRACT.md
5. Understand the current feature.
6. Explain the implementation plan.
7. Wait for approval if major architectural changes are required.

Never start coding immediately.

---

# General Principles

NutriTrack is a long-term SaaS product.

Every implementation should be scalable.

Avoid temporary solutions.

Always prefer maintainable code.

Write code as if the project will support millions of users.

---

# Existing Code

Always reuse existing code.

Before creating

- Component
- Hook
- Utility
- Service
- API
- Type

Search the existing project.

Never create duplicates.

---

# UI Rules

Never redesign existing UI.

Never change spacing.

Never change typography.

Never change colors.

Never change layout.

Never replace existing components unless requested.

If functionality changes,
keep the UI identical.

---

# React Rules

Use TypeScript.

Use functional components.

Use reusable hooks.

Use reusable services.

Separate UI from business logic.

Keep components small.

Prefer composition over duplication.

Do not hardcode values.

Always use API data.

---

# API Rules

Never bypass WordPress.

Never fetch data directly from the database.

Always use the NutriTrack API.

Every request must use JWT.

Handle

- Loading
- Success
- Error
- Empty State

Never assume API success.

---

# WordPress Rules

Keep WordPress as the CMS.

Do not move business logic into React.

Do not expose ACF directly.

Always validate user ownership.

Always sanitize data.

Always return structured JSON.

---

# AI Rules

AI is NOT responsible for

- BMI
- BMR
- TDEE
- Calories
- Macros

Those use mathematical formulas.

AI is responsible for

- Recommendations
- Coaching
- Meal Planning
- Grocery Lists
- Healthy Alternatives
- Insights

---

# File Rules

Never rename folders.

Never move files without approval.

Never delete code without explanation.

Never remove comments unnecessarily.

Never remove documentation.

---

# Performance

Avoid unnecessary renders.

Avoid duplicated API calls.

Use pagination.

Use lazy loading when appropriate.

Use memoization only when necessary.

---

# Error Handling

Every API request should handle

Loading

Validation

Unauthorized

Network Failure

Timeout

Unexpected Error

Never leave users without feedback.

---

# Security

Validate JWT.

Never trust frontend input.

Escape output.

Sanitize input.

Protect user ownership.

Never expose private information.

---

# Code Quality

Readable code over clever code.

Meaningful variable names.

Meaningful function names.

Small reusable functions.

Avoid deeply nested logic.

Prefer early returns.

Keep functions focused.

---

# Documentation

Whenever new APIs are added

↓

Update API_CONTRACT.md

Whenever database changes

↓

Update DATABASE.md

Whenever architecture changes

↓

Update SYSTEM_ARCHITECTURE.md

Never allow documentation to become outdated.

---

# AI Workflow

Every implementation should follow

Understand

↓

Plan

↓

Implement

↓

Review

↓

Optimize

↓

Document

Never skip planning.

---

# Pull Request Style

Every completed task should include

Summary

Files Changed

Reason

Impact

Future Improvements

Known Limitations

---

# Absolute Rules

Do not redesign the application.

Do not introduce breaking changes.

Do not remove existing functionality.

Do not hardcode production values.

Do not create duplicate components.

Do not ignore documentation.

Always think about long-term maintainability.

Always prefer scalable architecture.

Always explain major decisions.