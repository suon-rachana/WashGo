# WashGo — Component Library

Version: 1.0

Last Updated: July 2026

---

# Purpose

This document defines every reusable UI component used throughout WashGo.

The objective is to create a single source of truth for UI implementation.

Every screen within the application must be built using these components whenever possible.

Developers should avoid creating duplicate UI elements.

If a new component is needed, it should first be added to this library before being used throughout the application.

---

# Design Principles

Every component should be:

• Reusable

• Consistent

• Accessible

• Responsive

• Theme-based

• Easy to maintain

Every component should obtain colors, spacing, typography, radius, and shadows from the Theme System.

No component should hardcode visual values.

---

# Folder Structure

```
src/

components/

ui/

common/

laundry/

order/

navigation/

feedback/

profile/
```

---

# Component Categories

## 1. UI Components

Generic components that can be reused anywhere.

These components should have no business logic.

---

### Primary Button

Purpose

Main Call-To-Action button.

Examples

Login

Continue

Confirm Order

Checkout

Properties

- title
- icon
- loading
- disabled
- fullWidth
- onPress

States

Default

Pressed

Disabled

Loading

---

### Secondary Button

Purpose

Alternative button.

Outlined style.

---

### Ghost Button

Purpose

Minimal transparent button.

---

### Icon Button

Purpose

Circular icon actions.

Examples

Back

Favorite

Share

Notifications

---

### Text Input

Supports

Email

Password

Phone

Search

Number

Multiline

States

Focused

Error

Disabled

Filled

---

### Search Bar

Contains

Search Icon

Clear Button

Placeholder

Filter Button (optional)

---

### Checkbox

---

### Radio Button

---

### Switch

---

### Divider

---

### Avatar

Sizes

Small

Medium

Large

XL

Supports

Image

Initials

Placeholder

---

### Badge

Types

Success

Warning

Error

Info

New

---

### Chip

Used for

Categories

Laundry Types

Filters

Tags

---

### Loading Indicator

---

### Skeleton Loader

---

### Empty State

Contains

Illustration

Title

Description

Action Button

---

### Modal

Supports

Confirmation

Alert

Bottom Sheet

---

### Bottom Sheet

---

### Toast

Types

Success

Error

Warning

Info

---

# Common Components

---

### Header

Contains

Title

Back Button

Actions

---

### Section Header

Contains

Title

Subtitle

View All

---

### Banner

Promotional card.

Supports

Image

Gradient

CTA

---

### Carousel

Used for

Promotions

Featured laundries

Advertisements

---

### Rating

Displays

Stars

Score

Review Count

---

### Price

Displays

Currency

Discount

Original Price

---

### Distance Badge

---

### Status Badge

Supports

Pending

Processing

Ready

Delivered

Cancelled

Completed

---

# Laundry Components

---

### Laundry Card

Displays

Image

Name

Rating

Distance

Opening Hours

Price

Pickup Time

Delivery Time

Favorite

---

### Service Card

Displays

Service Name

Description

Estimated Price

Estimated Time

Icon

---

### Review Card

Displays

User

Rating

Review

Date

---

### Laundry Gallery

Displays

Images

Videos (Future)

---

# Order Components

---

### Order Card

Displays

Order Number

Laundry

Status

Date

Total

---

### Order Timeline

Displays

Every order stage

Animated progress

Current step

---

### Tracking Card

Displays

Current Rider

Estimated Arrival

Progress

---

### Pickup Card

Displays

Pickup Address

Time

Notes

---

### Delivery Card

Displays

Delivery Address

Estimated Time

---

### Price Summary

Displays

Laundry Cost

Delivery Fee

Taxes (Future)

Discount

Total

---

# Navigation Components

---

### Bottom Navigation

Tabs

Home

Orders

Notifications

Profile

---

### Top Navigation

---

### Drawer (Future)

---

# Feedback Components

---

### Success Screen

---

### Error Screen

---

### Network Error

---

### Offline Banner

---

### Permission Card

Camera

Location

Notifications

---

# Profile Components

---

### User Card

---

### Address Card

---

### Payment Card

---

### Settings Item

---

# Component Naming

Every component uses PascalCase.

Examples

PrimaryButton

LaundryCard

OrderTimeline

SearchBar

ProfileHeader

---

# Styling Rules

Every component must use

Theme Colors

Spacing Tokens

Typography Tokens

Radius Tokens

Shadow Tokens

Never hardcode

Padding

Margin

Colors

Radius

Font Sizes

Shadows

---

# Component Structure

Every component should contain

Component

Styles

Types

Helper Functions (if needed)

Documentation comments

---

# Accessibility

Support

Screen Readers

Dynamic Font Sizes

Accessible Labels

Large Touch Targets

Color Contrast

---

# Performance

Use memoization where appropriate.

Avoid unnecessary renders.

Avoid deeply nested components.

---

# Future Expansion

New components should always be added here before implementation.

The Component Library should evolve together with the Design System.

---

# Development Order

The following components should be implemented first:

1. PrimaryButton
2. SecondaryButton
3. IconButton
4. TextInput
5. SearchBar
6. Divider
7. Badge
8. Chip
9. Avatar
10. Card
11. EmptyState
12. SkeletonLoader
13. Header
14. SectionHeader
15. Banner
16. LaundryCard
17. ServiceCard
18. OrderCard
19. OrderTimeline
20. BottomNavigation

Only after these components are complete should screen development begin.

---

# Long-Term Goal

The WashGo Component Library should function similarly to a professional design system.

Every screen in the application should be composed from these reusable components instead of creating new UI from scratch.

Consistency, scalability, and maintainability take priority over speed of development.

---

# Component Motto

Design once.

Build once.

Reuse everywhere.
