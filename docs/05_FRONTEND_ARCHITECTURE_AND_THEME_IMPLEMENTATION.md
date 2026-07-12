# WashGo — Frontend Architecture & Theme Implementation

Version: 1.0

Last Updated: July 2026

---

# Purpose

This document defines how the WashGo Design System is implemented in React Native using Expo Router and TypeScript.

It establishes the frontend architecture, theme implementation strategy, reusable component structure, and coding principles that every developer must follow.

The objective is to ensure consistency, scalability, maintainability, and production-quality code.

---

# Frontend Stack

Framework

React Native

Development Platform

Expo SDK (Latest)

Language

TypeScript

Routing

Expo Router

State Management

Zustand

HTTP Client

Axios

Future

React Query

Notifications

Firebase Cloud Messaging

Maps

Google Maps SDK

Icons

Lucide React Native

Animations

React Native Reanimated

---

# Architecture Philosophy

The frontend follows a layered architecture.

Business Logic

↓

Reusable Components

↓

Screens

↓

Routing

Every screen should be composed from reusable UI components.

Screens should contain as little logic as possible.

---

# Project Structure

```
app/

src/

assets/

docs/
```

---

# app/

Contains only Expo Router pages.

Example

```
app/

(auth)/

(tabs)/

laundry/

orders/

profile/

_layout.tsx
```

No business logic belongs here.

---

# src/

Contains the application source code.

```
src/

theme/

components/

services/

store/

constants/

hooks/

types/

utils/

data/
```

---

# Theme Layer

The theme layer provides every design token used throughout the application.

```
theme/

colors.ts

spacing.ts

radius.ts

typography.ts

shadows.ts

theme.ts

index.ts
```

---

# colors.ts

Contains:

Primary

Secondary

Accent

Background

Surface

Text

Border

Status Colors

Never hardcode colors elsewhere.

---

# spacing.ts

Contains the spacing scale.

Example

```
4
8
12
16
20
24
32
40
48
64
```

Every margin and padding must come from this file.

---

# radius.ts

Border radius tokens.

Small

Medium

Large

XL

Circle

---

# typography.ts

Defines

Font Family

Font Sizes

Line Heights

Weights

Letter Spacing

Every text component must use typography tokens.

---

# shadows.ts

Shadow presets

Small

Medium

Large

No custom shadows should be created elsewhere.

---

# theme.ts

Combines every design token into one global theme object.

---

# index.ts

Exports the entire theme.

Importing should look like:

```
import { Colors, Typography } from "@/src/theme";
```

---

# Component Architecture

Components are grouped by responsibility.

```
components/

ui/

common/

laundry/

order/
```

---

# ui/

Contains generic UI.

Button

Input

Card

Avatar

Chip

Badge

Divider

Loading

---

# common/

Reusable shared widgets.

Header

Bottom Navigation

Section Title

Empty State

Search Bar

Modal

---

# laundry/

Laundry-specific components.

Laundry Card

Service Card

Review Card

Price Card

Laundry Gallery

---

# order/

Order-specific components.

Timeline

Status Card

Order Summary

Tracking Card

Pickup Card

Delivery Card

---

# Styling Rules

Always use

StyleSheet.create()

Never hardcode

Colors

Spacing

Radius

Font Sizes

Shadows

Use the theme.

---

# Design Tokens

Every component should only use values from

theme/

Never create random values.

Example

Correct

padding: Spacing.md

Incorrect

padding: 17

---

# Responsive Design

Layouts should adapt to

Small Phones

Large Phones

Tablets (future)

Avoid fixed heights whenever possible.

---

# Icons

Preferred

Lucide React Native

Fallback

Expo Vector Icons

Use outline icons.

Maintain consistent stroke width.

---

# Images

Store inside

assets/images/

Do not place images inside components.

Optimize image size.

---

# Fonts

Store inside

assets/fonts/

Load fonts globally.

---

# Mock Data

Temporary mock data lives inside

src/data/

No mock data inside screens.

---

# State Management

Component State

useState

Global State

Zustand

Server State

React Query (Future)

---

# Services

API communication belongs inside

services/

Never call fetch() inside screens.

---

# Error Handling

Never silently fail.

Display friendly messages.

Handle network failures gracefully.

---

# Performance

Lazy load routes.

Memoize expensive components.

Optimize FlatLists.

Avoid unnecessary renders.

---

# Accessibility

Minimum touch target

44px

Readable text

Good contrast

Accessibility labels

Keyboard support where applicable

---

# Development Order

Theme

↓

Design Tokens

↓

UI Components

↓

Common Components

↓

Feature Components

↓

Screens

↓

Navigation

↓

Business Logic

↓

Backend Integration

---

# Phase One Components

PrimaryButton

SecondaryButton

TextInput

SearchBar

Card

Badge

Chip

Divider

Avatar

Loading

Empty State

---

# First Screen

The first screen developed is NOT the Home Screen.

The first screen is

DesignSystemScreen

This screen displays

Typography

Colors

Buttons

Inputs

Cards

Badges

Chips

Icons

Spacing

It serves as the internal component gallery for WashGo.

---

# Long-Term Goal

The frontend should feel like a professional design system similar to those used by Uber, Airbnb, Stripe, and Linear.

Every new screen should be built by assembling reusable components rather than creating new UI from scratch.

The codebase should remain clean, scalable, and easy for new developers to understand.

---

# Frontend Motto

Design once.

Build once.

Reuse everywhere.

Consistency over complexity.

Think like a product team.
