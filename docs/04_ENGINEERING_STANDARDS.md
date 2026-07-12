# WashGo — Engineering Standards

Version: 1.0

Last Updated: July 2026

---

# Purpose

This document defines the engineering standards, coding conventions, project architecture, and development workflow for WashGo.

Every contributor must follow these standards to ensure the project remains consistent, maintainable, scalable, and production-ready.

This document serves as the engineering source of truth for the entire project.

---

# Engineering Philosophy

WashGo is not being developed as a typical university project.

It is being engineered as if it were a real startup preparing for production.

Every decision should prioritize:

- Maintainability
- Scalability
- Readability
- Consistency
- Performance
- Simplicity

Quality is more important than speed.

---

# Technology Stack

## Mobile

React Native

Expo

TypeScript

Expo Router

---

## Backend

ASP.NET Core Web API

---

## Database

Microsoft SQL Server

---

## State Management

Zustand

---

## Networking

Axios

React Query (Future)

---

## Notifications

Firebase Cloud Messaging

---

## Maps

Google Maps SDK

---

## Version Control

Git

GitHub

---

# Project Architecture

The project follows a feature-independent, component-driven architecture.

Business logic must remain separated from UI.

Navigation must remain separated from application logic.

Theme must remain centralized.

Mock data should remain isolated.

---

# Folder Structure

```
WashGo/

app/

assets/
    fonts/
    icons/
    images/

src/

    components/
        ui/
        common/
        laundry/
        order/

    constants/

    data/

    hooks/

    lib/

    services/

    store/

    theme/

    types/

    utils/

docs/
```

---

# Folder Responsibilities

## app/

Contains only Expo Router pages.

No business logic.

No reusable components.

---

## components/

Reusable UI components.

Components should never depend on specific screens.

---

## services/

API calls.

Authentication.

Backend communication.

No UI.

---

## store/

Global application state.

Only Zustand stores.

---

## theme/

Colors

Typography

Spacing

Radius

Shadows

Theme exports

---

## constants/

Application constants.

Enums.

Configuration values.

---

## hooks/

Reusable custom hooks.

---

## data/

Mock JSON data.

Only temporary until backend integration.

---

## utils/

Helper functions.

Formatting.

Validation.

Calculations.

---

## types/

TypeScript interfaces.

Enums.

Models.

---

# Coding Principles

Always:

Write reusable code.

Keep components small.

Separate UI from logic.

Avoid duplication.

Prefer composition over inheritance.

Prefer readability over cleverness.

---

# Naming Conventions

## Components

PascalCase

```
PrimaryButton.tsx

LaundryCard.tsx

OrderTimeline.tsx
```

---

## Hooks

camelCase

```
useAuth.ts

useLocation.ts

useOrders.ts
```

---

## Utilities

camelCase

```
formatPrice.ts

calculateDistance.ts
```

---

## Constants

UPPER_SNAKE_CASE where appropriate.

---

## Types

PascalCase

```
Order.ts

Laundry.ts

User.ts
```

---

# Component Rules

Components should:

Receive data through props.

Avoid global state unless necessary.

Never fetch API data directly.

Remain reusable.

Support future theming.

---

# Screen Rules

Screens should:

Contain layout only.

Call hooks.

Use reusable components.

Never contain duplicated UI.

---

# State Management

Local State

useState

Global State

Zustand

Server State

React Query (Future)

---

# API Rules

Every endpoint belongs inside services/.

Never call fetch directly inside components.

Example

```
services/

authService.ts

orderService.ts

laundryService.ts
```

---

# Theme Rules

Never hardcode:

Colors

Spacing

Font sizes

Radius

Shadows

Everything must come from:

```
theme/
```

---

# Styling Rules

Prefer:

StyleSheet.create()

Never use inline styles unless dynamic.

Use theme values.

---

# Performance

Avoid unnecessary renders.

Use memoization when needed.

Lazy load screens.

Optimize FlatLists.

Use optimized images.

---

# Error Handling

Never silently fail.

Display user-friendly messages.

Log errors appropriately.

Handle network failures gracefully.

---

# Accessibility

Support readable font sizes.

Use accessible touch targets.

Provide accessibility labels.

Maintain sufficient color contrast.

---

# Git Workflow

Main Branch

main

Development Branch

develop

Feature Branches

feature/home-screen

feature/design-system

feature/order-tracking

Bug Fixes

fix/login-validation

---

# Commit Convention

Examples

```
feat: add laundry card component

feat: implement splash screen

fix: correct button alignment

refactor: simplify theme exports

docs: update product requirements
```

---

# Code Review Checklist

Before merging:

✔ No duplicated code

✔ Uses theme tokens

✔ Uses reusable components

✔ Strong TypeScript typing

✔ No unnecessary dependencies

✔ No console logs

✔ Responsive layout

✔ Naming conventions followed

---

# Development Workflow

Every feature follows:

Requirements

↓

Architecture

↓

Component Design

↓

Implementation

↓

Testing

↓

Review

↓

Commit

---

# AI Development Guidelines

AI is used as an engineering assistant.

AI-generated code must always be reviewed before acceptance.

Never merge generated code without understanding it.

Developers remain responsible for the final implementation.

---

# Long-Term Goal

The codebase should be easy for a new developer to understand without requiring extensive explanation.

Every file should have a clear purpose.

Every folder should have a clear responsibility.

Every feature should be easy to extend.

The project should remain maintainable as it grows from a thesis into a production-ready application.

---

# Engineering Motto

Build once.

Reuse everywhere.

Think long-term.

Keep it simple.

Build with pride.
