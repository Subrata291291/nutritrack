# AI Agent Workflow

## Purpose

This document defines the standard workflow that every AI coding agent must follow when working on the NutriTrack codebase.

The objective is to ensure consistency, maintainability, traceability, and high-quality implementations regardless of which AI model or coding assistant is used.

This workflow applies to all development tasks, including new features, bug fixes, refactoring, testing, and documentation.

---

# Core Principles

Every implementation should be

- Understandable
- Predictable
- Reproducible
- Incremental
- Testable
- Documented

AI should never make assumptions when project documentation already defines the expected behavior.

---

# Development Lifecycle

Every task must follow this sequence.

```
Receive Task

↓

Read Documentation

↓

Analyze Existing Code

↓

Identify Impact

↓

Create Implementation Plan

↓

Wait for Approval (if required)

↓

Implement Changes

↓

Run Validation

↓

Update Documentation

↓

Generate Summary
```

---

# Step 1 — Read Documentation

Before writing or modifying code, the agent must review the relevant project documentation.

Always read

- AI_CONTEXT.md
- SYSTEM_ARCHITECTURE.md
- DATABASE.md
- API_CONTRACT.md
- DEVELOPMENT_RULES.md

Additionally, read the relevant feature document.

Examples

Authentication

↓

FEATURES/AUTHENTICATION.md

Meal Planner

↓

FEATURES/MEAL_PLANNER.md

Weight Tracker

↓

FEATURES/WEIGHT_TRACKER.md

Never begin implementation without understanding the documented requirements.

---

# Step 2 — Analyze Existing Code

Before creating new files or components, inspect the current codebase.

Determine

- Existing architecture
- Folder structure
- Naming conventions
- Shared components
- Existing hooks
- Existing services
- Existing API clients
- Existing utility functions

Prefer extending existing functionality over creating duplicate implementations.

---

# Step 3 — Identify Impact

Evaluate which areas are affected.

Examples

Frontend

Backend

API

Database

Authentication

Routing

Validation

Documentation

Testing

Avoid making unrelated changes.

---

# Step 4 — Create an Implementation Plan

Before writing code, prepare a concise implementation plan.

The plan should include

- Objective
- Files to modify
- Files to create
- API changes
- Database changes
- Risks
- Dependencies
- Testing approach

Do not begin implementation until the plan is complete.

---

# Step 5 — Implementation

Follow existing project conventions.

Requirements

- Small, focused commits
- Reusable components
- Strong typing
- Consistent naming
- No duplicated logic
- Minimal side effects

Avoid unnecessary architectural changes.

---

# Step 6 — Validation

After implementation, verify

- Feature works correctly
- No existing functionality is broken
- API responses match API_CONTRACT.md
- Validation rules are enforced
- Error handling is complete
- Accessibility is maintained

Fix issues before considering the task complete.

---

# Step 7 — Testing

Every implementation should include appropriate testing.

Testing may include

- Unit tests
- Integration tests
- Component tests
- Manual verification

Critical business logic must always have automated tests.

---

# Step 8 — Documentation

If implementation changes project behavior, update the corresponding documentation.

Examples

API changes

↓

API_CONTRACT.md

Database changes

↓

DATABASE.md

Feature behavior

↓

Relevant FEATURES document

Architecture changes

↓

SYSTEM_ARCHITECTURE.md

Documentation should always reflect the current implementation.

---

# Step 9 — Final Summary

At the end of every task, generate a summary including

- Objective completed
- Files modified
- Files created
- APIs added or changed
- Database changes
- Documentation updated
- Testing performed
- Remaining work (if any)

---

# Coding Standards

All generated code should

- Be modular
- Be readable
- Use descriptive names
- Avoid unnecessary abstraction
- Follow project linting rules
- Follow formatting rules
- Use TypeScript where applicable

---

# React Guidelines

- Prefer functional components.
- Use hooks instead of class components.
- Keep components focused on a single responsibility.
- Reuse existing UI components whenever possible.
- Avoid prop drilling when a shared state solution already exists.
- Keep presentation separate from business logic.

---

# WordPress Guidelines

- Use the existing plugin architecture.
- Respect WordPress coding standards.
- Sanitize and validate all input.
- Escape output appropriately.
- Enforce capability checks.
- Use REST API endpoints consistently.

---

# API Guidelines

- Follow API_CONTRACT.md.
- Return consistent response structures.
- Use appropriate HTTP status codes.
- Validate all incoming data.
- Handle errors gracefully.

---

# Database Guidelines

- Avoid duplicate data.
- Maintain referential integrity.
- Use migrations or versioned schema updates where applicable.
- Preserve backward compatibility whenever possible.

---

# AI Integration Guidelines

When implementing AI features

- Use the AI Service only.
- Never expose provider API keys.
- Validate AI responses.
- Use structured JSON.
- Keep prompts modular.
- Do not store AI output automatically without user confirmation where applicable.

---

# Refactoring Rules

Refactoring should

- Preserve behavior.
- Improve readability.
- Reduce duplication.
- Increase maintainability.

Avoid mixing refactoring with unrelated feature work unless explicitly requested.

---

# Bug Fix Workflow

For bug fixes

1. Reproduce the issue.
2. Identify the root cause.
3. Apply the smallest effective fix.
4. Verify the fix.
5. Ensure no regressions.

Do not introduce unrelated improvements during a bug-fix task.

---

# Performance Checklist

Before completing a task, verify

- No unnecessary renders
- Efficient API usage
- Lazy loading where appropriate
- No duplicated requests
- Reasonable bundle impact

---

# Security Checklist

Always verify

- Authentication
- Authorization
- Input validation
- Output escaping
- Secret management
- Rate limiting (where applicable)

Never commit secrets or credentials.

---

# Accessibility Checklist

Verify

- Keyboard navigation
- Screen reader compatibility
- Form labels
- Focus management
- Color contrast
- Semantic HTML

Accessibility issues should be addressed as part of implementation, not postponed.

---

# Definition of Done

A task is complete only when

- Requirements are implemented.
- Code follows project standards.
- Existing functionality is unaffected.
- Tests pass.
- Documentation is updated.
- API contracts remain valid.
- Accessibility requirements are satisfied.
- Security requirements are met.
- Performance considerations are reviewed.
- Final summary is generated.

---

# Workflow Rules

Always

- Read documentation first.
- Reuse existing code.
- Keep changes focused.
- Test before completion.
- Update documentation when behavior changes.
- Explain assumptions clearly.

Never

- Skip documentation review.
- Bypass validation.
- Duplicate functionality.
- Introduce breaking changes without approval.
- Expose secrets.
- Modify unrelated modules.

---

# Acceptance Criteria

The workflow is considered successful when

- Every implementation follows a documented process.
- Code quality remains consistent across contributors.
- Documentation stays synchronized with the codebase.
- AI-generated code is predictable and maintainable.
- New contributors can understand the development process by following this document.