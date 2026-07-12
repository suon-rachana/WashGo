# 03_DESIGN_SYSTEM.md

You are a Senior Product Designer, Design System Architect, and React Native UI Engineer.

Using the existing **01_PROJECT_FOUNDATION.md** and **02_PRODUCT_REQUIREMENTS.md** as project context, create the complete Design System for **WashGo**.

This document will serve as the **single source of truth** for all designers and developers throughout the project.

---

# Project

WashGo is a premium on-demand laundry pickup and delivery platform connecting:

- Customers
- Riders
- Laundry Shops
- Administrators

Platforms:

- React Native (iOS & Android)
- Admin Web Dashboard
- Laundry Shop Dashboard
- Marketing Website

---

# Design Vision

Create a design language that feels:

- Premium
- Modern
- Minimal
- Spacious
- Clean
- Fast
- Trustworthy
- Friendly
- Professional

Avoid:

- Cartoon styling
- Cute mascots
- Cat-themed branding
- Heavy gradients
- Visual clutter

The interface should feel similar to:

- Uber
- Grab
- Airbnb
- Stripe
- Linear
- Apple Human Interface Guidelines

---

# Brand Personality

Define:

- Brand values
- Voice and tone
- Emotional experience
- Brand keywords
- User perception
- Visual identity principles

---

# Color System

Use the following palette.

Primary

#3A4EFB

Secondary

#33A4FA

Accent

#E3FF3B

Dark

#252943

Background

#F8FAFC

Surface

#FFFFFF

Create semantic color tokens for:

Primary

Secondary

Accent

Success

Warning

Error

Information

Background

Surface

Border

Divider

Primary Text

Secondary Text

Placeholder

Disabled

Overlay

Shadow

Light Theme

Dark Theme

Include:

- Hex values
- Usage guidelines
- Accessibility recommendations
- Contrast considerations (WCAG AA)

---

# Typography

Primary Font:

Poppins

Fallback:

Inter

Define a complete type scale:

Display

Headline

Title

Subtitle

Body

Caption

Button

Label

Specify:

- Font size
- Weight
- Line height
- Letter spacing
- Recommended usage

---

# Spacing System

Use an 8-point grid.

Define spacing tokens and explain where each should be used:

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

80

96

128

---

# Border Radius

Create radius tokens:

XS

SM

MD

LG

XL

Pill

Circular

Include usage examples.

---

# Shadows & Elevation

Define elevation levels for:

Flat

Card

Dropdown

Bottom Sheet

Dialog

Floating Button

Overlay

Specify:

- Offset
- Blur
- Opacity
- Typical use cases

---

# Icons

Recommend:

Material Symbols Rounded

Specify:

- Sizes
- Stroke weight
- Usage
- Filled vs outlined
- Consistency rules

---

# Buttons

Design the following variants:

Primary

Secondary

Outlined

Ghost

Text

Danger

Success

Loading

Disabled

Floating Action Button

Icon Button

For each include:

- Default
- Hover (web)
- Pressed
- Focus
- Disabled
- Loading

---

# Inputs

Define components for:

Text Field

Password

Phone Number

OTP

Search

Dropdown

Date Picker

Checkbox

Radio

Switch

Slider

Text Area

For each include:

- States
- Validation
- Error behavior
- Accessibility

---

# Cards

Create reusable card patterns:

Laundry Shop Card

Order Card

Pickup Card

Delivery Card

Promotion Card

Wallet Card

Address Card

Payment Card

Notification Card

Profile Card

Specify:

- Padding
- Radius
- Shadow
- Layout
- Content hierarchy

---

# Badges & Chips

Design:

Status Badge

Notification Badge

Order Status Chip

Filter Chip

Selection Chip

Category Chip

Include color usage for statuses such as Pending, Accepted, Processing, Ready, Delivering, Completed, and Cancelled.

---

# Navigation

Define navigation standards for:

Customer App

Rider App

Laundry Dashboard

Admin Dashboard

Include:

Bottom Navigation

Sidebar

Top App Bar

Search

Back Navigation

Navigation hierarchy

---

# Screen Layout Rules

Specify:

Safe area handling

Maximum content width

Padding

Margins

Scrollable areas

Floating buttons

Cards

Lists

Tables

Forms

Empty states

Loading states

Error states

---

# Component Guidelines

Document design principles for:

Consistency

Spacing

Alignment

Hierarchy

Feedback

Motion

Touch targets

Accessibility

Responsiveness

Reuse

Naming conventions

---

# React Native Implementation Notes

Provide implementation guidance including:

- Design tokens structure
- Theme organization
- Color constants
- Typography constants
- Spacing constants
- Radius constants
- Shadow utilities
- Component folder structure
- Reusable UI component strategy
- Dark mode implementation
- Accessibility best practices
- Performance considerations
- Recommended libraries where appropriate

---

# Deliverable

Produce a polished **03_DESIGN_SYSTEM.md** document in Markdown.

The document should be approximately **8,000–12,000 words**, professionally organized with headings, tables, implementation guidance, and examples. It should be detailed enough that designers can build a complete Figma library and developers can implement the UI consistently in React Native and on the web without ambiguity.
