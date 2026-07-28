# AI Guardrails

## Purpose

This document defines the non-negotiable rules that every AI coding agent must follow while working on the NutriTrack project.

These guardrails protect the architecture, maintainability, security, and business logic of the application.

Every AI-generated implementation must comply with these rules.

---

# Core Philosophy

AI is an engineering assistant.

AI is not

- Product Owner
- System Architect
- Database Designer
- Business Analyst

AI should implement documented requirements.

AI should never invent project requirements.

---

# Rule 1 — Respect Project Documentation

Always follow

- PRODUCT_SPECIFICATION.md
- SYSTEM_ARCHITECTURE.md
- DATABASE.md
- API_CONTRACT.md
- DEVELOPMENT_RULES.md
- AI_CONTEXT.md
- Relevant FEATURE document

If documentation conflicts with existing code, report the inconsistency instead of guessing.

---

# Rule 2 — Never Change Architecture

Do NOT

- Replace React
- Replace WordPress
- Replace FastAPI
- Replace JWT
- Replace the API structure

Architectural changes require explicit approval.

---

# Rule 3 — Never Redesign the UI

AI may

- Build documented screens
- Improve responsiveness
- Fix accessibility
- Fix layout bugs

AI must NOT

- Change colors
- Change branding
- Change typography
- Rearrange layouts
- Replace components

unless explicitly requested.

---

# Rule 4 — Preserve Existing Code

Prefer

- Extend
- Reuse
- Refactor safely

Avoid

- Large rewrites
- Deleting stable functionality
- Renaming APIs without approval
- Breaking backward compatibility

---

# Rule 5 — Deterministic Logic Stays Deterministic

Never use AI for

- BMI
- BMR
- TDEE
- Calories
- Macronutrients
- Water Goals
- Nutrition Score
- Progress Calculations

These belong exclusively to the Nutrition Engine.

---

# Rule 6 — AI Generates Recommendations Only

AI may generate

- Meal Plans
- Recipes
- Grocery Lists
- Coaching
- Educational Content
- Healthy Alternatives
- Weekly Reviews

AI must never directly modify

- User Profile
- Nutrition Log
- Weight History
- Meal History
- Settings

User confirmation is required before persisting AI-generated data.

---

# Rule 7 — Never Expose Secrets

Never expose

- API Keys
- JWT Secrets
- Environment Variables
- Internal Prompts
- Private Endpoints

Secrets belong only on the server.

---

# Rule 8 — Respect the API Contract

Do not

- Rename endpoints
- Change response shapes
- Remove fields
- Modify status codes

unless API_CONTRACT.md is intentionally updated.

---

# Rule 9 — Respect Database Ownership

WordPress owns

- Users
- Recipes
- Foods
- Meal Plans
- Nutrition Logs
- Weight Entries
- Settings

AI never owns persistent business data.

---

# Rule 10 — Avoid Duplicate Code

Before creating

- Components
- Hooks
- Services
- Utilities
- Types

search for existing implementations.

Reuse whenever possible.

---

# Rule 11 — Follow Existing Naming

Respect existing

- Folder names
- File names
- Component names
- API naming
- Database naming
- Type names

Maintain consistency.

---

# Rule 12 — Keep Components Focused

Each component should have a single responsibility.

Avoid

- Large monolithic components
- Mixed UI and business logic
- Deep prop chains when existing state management solves the problem

---

# Rule 13 — Validate Everything

Validate

- User input
- API responses
- AI responses
- Form data
- Route parameters

Never trust external data.

---

# Rule 14 — Accessibility Is Required

Every UI implementation should support

- Keyboard navigation
- Screen readers
- Semantic HTML
- Focus management
- Sufficient color contrast

Accessibility is part of the definition of done.

---

# Rule 15 — Performance Matters

Avoid

- Unnecessary renders
- Duplicate API calls
- Blocking operations
- Oversized bundles

Prefer

- Lazy loading
- Memoization where appropriate
- Efficient caching
- Optimized queries

---

# Rule 16 — Security Comes First

Always enforce

- Authentication
- Authorization
- Input sanitization
- Output escaping
- Permission checks

Never bypass security for convenience.

---

# Rule 17 — Documentation Stays Current

If behavior changes

Update

- API_CONTRACT.md
- DATABASE.md
- SYSTEM_ARCHITECTURE.md
- Feature documentation

Documentation must evolve with the implementation.

---

# Rule 18 — Do Not Guess Requirements

If requirements are unclear

- Ask for clarification
- Present options
- Explain assumptions

Never invent business rules.

---

# Rule 19 — Make Incremental Changes

Prefer

Small

↓

Reviewable

↓

Testable

↓

Deployable

changes over large rewrites.

---

# Rule 20 — Preserve Backward Compatibility

Avoid breaking

- APIs
- Stored data
- Existing user flows
- Frontend contracts

If breaking changes are required

- Explain the impact
- Propose a migration strategy
- Wait for approval

---

# Rule 21 — Testing Is Mandatory

Before considering work complete

Verify

- Happy path
- Validation errors
- Edge cases
- Error handling
- Accessibility
- Performance impact

Critical business logic requires automated tests.

---

# Rule 22 — AI Output Must Be Structured

Whenever AI generates data

- Validate it
- Normalize it
- Return structured JSON
- Reject malformed output

Never pass raw LLM output directly to the UI.

---

# Rule 23 — Data Minimization

When sending data to AI

Include only

- Required profile fields
- Relevant nutrition data
- Necessary historical context

Do not include unnecessary personal information.

---

# Rule 24 — Keep AI Provider Independent

Do not couple business logic to

- Gemini
- OpenAI
- Claude

The AI provider should be replaceable with minimal code changes.

---

# Rule 25 — Explain Significant Decisions

For substantial implementations

Provide

- What changed
- Why it changed
- Trade-offs
- Risks
- Future considerations

This improves maintainability and code reviews.

---

# Decision Hierarchy

When multiple sources exist, follow this order of precedence

1. Explicit User Instructions
2. PRODUCT_SPECIFICATION.md
3. SYSTEM_ARCHITECTURE.md
4. FEATURE Specifications
5. API_CONTRACT.md
6. DATABASE.md
7. DEVELOPMENT_RULES.md
8. AI_CONTEXT.md
9. Existing Codebase
10. AI Preference

Lower-priority sources must never override higher-priority decisions.

---

# Prohibited Actions

AI must never

- Delete production data
- Bypass authentication
- Store plaintext passwords
- Expose secrets
- Fabricate API responses
- Invent undocumented business rules
- Rewrite unrelated modules
- Commit code automatically
- Modify user history without explicit intent
- Ignore validation failures

---

# Definition of Success

An AI-generated implementation is successful when

- It follows project documentation.
- It preserves the architecture.
- It maintains security.
- It is accessible.
- It is testable.
- It is maintainable.
- It avoids unnecessary complexity.
- It keeps documentation synchronized.
- It produces predictable behavior.

---

# Acceptance Criteria

These guardrails are satisfied when every AI-generated contribution

- Respects architectural boundaries.
- Uses deterministic business logic where required.
- Treats AI as a recommendation engine only.
- Preserves API and database contracts.
- Produces reusable, maintainable code.
- Updates documentation alongside implementation.
- Protects user privacy and application security.