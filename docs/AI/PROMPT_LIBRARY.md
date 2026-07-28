# AI Prompt Library

## Purpose

This document contains reusable prompt templates for AI coding assistants working on the NutriTrack project.

Each prompt follows the project's architecture, documentation, and engineering standards.

Before using any prompt, ensure the AI agent has access to the project documentation, especially:

- AI_CONTEXT.md
- SYSTEM_ARCHITECTURE.md
- DATABASE.md
- API_CONTRACT.md
- DEVELOPMENT_RULES.md
- AI_ARCHITECTURE.md
- NUTRITION_ENGINE.md
- AI_GUARDRAILS.md
- Relevant FEATURE document

---

# Prompt 1 — Analyze a Feature

## Use When

Before implementing any feature.

## Prompt

You are an AI software engineer working on the NutriTrack project.

Read the relevant project documentation and analyze the requested feature.

Provide:

- Objective
- Functional requirements
- Non-functional requirements
- Existing code that should be reused
- Components required
- APIs involved
- Database entities involved
- Risks
- Edge cases
- Accessibility considerations
- Testing requirements

Do not write code.

---

# Prompt 2 — Create an Implementation Plan

## Use When

Before development begins.

## Prompt

Based on the project documentation and existing codebase, create a step-by-step implementation plan.

Include

- Files to create
- Files to modify
- API changes
- Database changes
- Component hierarchy
- State management
- Validation
- Testing strategy
- Documentation updates

Do not implement anything.

---

# Prompt 3 — Implement a Feature

## Use When

Building a feature.

## Prompt

Implement the approved feature.

Requirements

- Follow SYSTEM_ARCHITECTURE.md
- Follow API_CONTRACT.md
- Follow DEVELOPMENT_RULES.md
- Follow AI_GUARDRAILS.md
- Reuse existing components
- Keep changes focused
- Preserve backward compatibility
- Use TypeScript
- Write clean, maintainable code
- Add appropriate validation
- Handle loading and error states
- Update documentation if behavior changes

Return

- Summary
- Files changed
- Tests performed
- Remaining work

---

# Prompt 4 — Investigate a Bug

## Use When

Debugging.

## Prompt

Investigate the reported issue.

Provide

- Root cause analysis
- Affected modules
- Reproduction steps
- Potential fixes
- Risks
- Recommended solution

Do not modify code until the root cause is identified.

---

# Prompt 5 — Fix a Bug

## Use When

After root cause analysis.

## Prompt

Fix the identified issue using the smallest effective change.

Requirements

- Preserve existing behavior
- Avoid unrelated refactoring
- Add regression protection
- Update tests if needed

Return

- Root cause
- Fix
- Validation performed

---

# Prompt 6 — Refactor Code

## Use When

Improving maintainability.

## Prompt

Refactor the selected module.

Goals

- Improve readability
- Reduce duplication
- Preserve behavior
- Improve naming
- Simplify logic

Do not introduce new functionality.

---

# Prompt 7 — Generate an API

## Use When

Creating backend endpoints.

## Prompt

Generate API endpoints that follow API_CONTRACT.md.

Requirements

- Input validation
- Authorization
- Consistent responses
- Error handling
- Documentation

Do not change existing endpoint contracts unless requested.

---

# Prompt 8 — Build a React Component

## Use When

Creating UI.

## Prompt

Build the requested React component.

Requirements

- Functional component
- TypeScript
- Accessible
- Responsive
- Reusable
- Follow existing design system
- Handle loading, empty, and error states
- Avoid business logic in presentation components

---

# Prompt 9 — Build a WordPress Feature

## Use When

Backend development.

## Prompt

Implement the requested functionality inside the existing WordPress plugin architecture.

Requirements

- Follow WordPress coding standards
- Sanitize input
- Escape output
- Respect user permissions
- Reuse existing services
- Keep REST endpoints consistent

---

# Prompt 10 — Build a FastAPI Feature

## Use When

AI service development.

## Prompt

Implement the requested FastAPI functionality.

Requirements

- Stateless endpoints
- Pydantic validation
- Structured JSON
- Provider abstraction
- Error handling
- Logging
- Unit tests

Do not embed provider-specific business logic.

---

# Prompt 11 — Generate Unit Tests

## Use When

Testing.

## Prompt

Generate comprehensive unit tests.

Cover

- Happy path
- Validation
- Edge cases
- Error handling
- Boundary values

Aim for high coverage without duplicating production logic.

---

# Prompt 12 — Review Code

## Use When

Code review.

## Prompt

Review the implementation.

Evaluate

- Architecture
- Maintainability
- Performance
- Security
- Accessibility
- Testing
- Documentation

Classify findings as

- Critical
- Major
- Minor
- Suggestion

---

# Prompt 13 — Optimize Performance

## Use When

Performance review.

## Prompt

Analyze the implementation for performance improvements.

Review

- Rendering
- API calls
- Caching
- Memoization
- Bundle size
- Database queries

Recommend improvements without changing behavior.

---

# Prompt 14 — Accessibility Audit

## Use When

Accessibility review.

## Prompt

Audit the feature against accessibility best practices.

Verify

- Keyboard navigation
- Focus management
- Semantic HTML
- ARIA usage
- Labels
- Contrast
- Screen reader compatibility

Provide prioritized recommendations.

---

# Prompt 15 — Security Review

## Use When

Security validation.

## Prompt

Review the implementation for security issues.

Check

- Authentication
- Authorization
- Input validation
- Output escaping
- Secret handling
- Injection risks
- CSRF/XSS considerations
- Rate limiting where applicable

Provide remediation steps.

---

# Prompt 16 — Update Documentation

## Use When

Behavior changes.

## Prompt

Update the affected project documentation.

Review

- Feature documentation
- API contract
- Database schema
- Architecture
- Development rules

Keep documentation synchronized with the implementation.

---

# Prompt 17 — Release Readiness

## Use When

Before merging or deploying.

## Prompt

Review the feature for release readiness.

Verify

- Requirements complete
- Tests pass
- Documentation updated
- No known blockers
- Performance acceptable
- Security reviewed
- Accessibility verified

Provide a Go / No-Go recommendation with reasons.

---

# Prompt Usage Guidelines

Always

- Read the relevant documentation first.
- Reuse existing code where possible.
- Follow the documented architecture.
- Keep changes focused and incremental.
- Explain assumptions.
- Validate outputs.

Never

- Invent undocumented requirements.
- Bypass architecture.
- Expose secrets.
- Rewrite unrelated modules.
- Skip validation or testing.

---

# Recommended Workflow

Feature Request

↓

Analyze Feature

↓

Implementation Plan

↓

Approval

↓

Implement Feature

↓

Generate Tests

↓

Review Code

↓

Accessibility Audit

↓

Security Review

↓

Update Documentation

↓

Release Readiness

---

# Acceptance Criteria

The prompt library is complete when

- Every common development task has a reusable prompt.
- Prompts reinforce project architecture and standards.
- Prompts encourage testing, accessibility, and security.
- Prompts produce consistent, maintainable results across AI coding assistants.