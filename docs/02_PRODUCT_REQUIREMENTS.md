# 02_PRODUCT_REQUIREMENTS.md

# WashGo Product Requirements Document (PRD)

## Project Overview

WashGo is a modern on-demand laundry pickup and delivery platform designed for Cambodia, beginning with Siem Reap and later expanding nationwide.

The platform connects customers, laundry shops, delivery riders, and administrators into one integrated ecosystem.

Customers can schedule laundry pickup, track orders in real time, pay digitally or with cash, and receive their clean clothes without visiting a laundry shop.

Laundry shops receive and manage orders digitally, riders handle logistics, and administrators oversee the entire platform.

The goal is to create the most trusted, convenient, and scalable laundry service platform in Cambodia.

---

# Vision

To become Cambodia's leading digital laundry marketplace by simplifying the entire laundry process through technology.

---

# Mission

Provide a fast, transparent, and reliable laundry service while helping local laundry businesses grow digitally.

---

# Target Users

## Customer

People who need laundry pickup and delivery.

Examples:

- University students
- Working professionals
- Families
- Hotels
- Airbnb owners
- Tourists

---

## Laundry Shop

Businesses that wash, dry clean, and iron clothes.

They receive orders from the platform and update processing status.

---

## Rider

Delivery personnel responsible for:

- Picking up laundry
- Delivering laundry to shops
- Returning completed orders to customers

---

## Administrator

Platform managers responsible for:

- Managing users
- Managing shops
- Monitoring riders
- Handling disputes
- Viewing reports
- Managing commissions
- Platform configuration

---

# Business Model

Revenue sources include:

- Commission per completed order
- Delivery fee
- Premium shop subscriptions (future)
- Promotional advertising (future)
- Business partnerships

---

# Supported Platforms

## Phase 1

Customer Mobile App (iOS & Android)

Rider Mobile App (iOS & Android)

Laundry Shop Web Dashboard

Admin Web Dashboard

---

# Customer Features

## Authentication

- Register
- Login
- Forgot password
- Social login (future)

---

## Profile

- Personal information
- Phone verification
- Saved addresses
- Multiple pickup locations

---

## Laundry Order

Customer can:

- Select laundry service
- Choose laundry shop
- Schedule pickup
- Choose delivery time
- Add notes
- Upload photos if needed

---

## Order Tracking

Real-time order status.

Example:

Order Created

↓

Rider Assigned

↓

Rider Picking Up

↓

Laundry Received

↓

Washing

↓

Drying

↓

Ironing

↓

Quality Check

↓

Ready for Delivery

↓

Out for Delivery

↓

Completed

---

## Notifications

Push notifications

SMS (future)

Email (future)

---

## Payments

Support:

- Cash on Delivery
- KHQR
- Credit/Debit Card (future)
- Digital Wallet (future)

---

## Ratings

Customers can rate:

- Laundry Shop
- Rider

---

## Order History

View:

- Previous orders
- Receipts
- Payments
- Ratings

---

# Rider Features

- Login
- Accept order
- Reject order
- Navigation
- Pickup confirmation
- Delivery confirmation
- Earnings
- Daily income
- Order history
- Availability toggle

---

# Laundry Shop Features

Dashboard includes:

- Incoming orders
- Active orders
- Completed orders

Manage:

- Services
- Prices
- Estimated completion time
- Business hours
- Employees

Update laundry status in real time.

---

# Admin Features

## Dashboard

Statistics

Revenue

Orders

Active riders

Active shops

Customer growth

---

## User Management

Customers

Riders

Laundry Shops

Admins

---

## Order Management

Monitor all active orders.

Manual assignment if necessary.

Handle complaints.

---

## Financial Management

Delivery fees

Commissions

Shop payouts

Rider payouts

Refund management

---

## Promotions

Coupons

Discount campaigns

Referral program

---

## Analytics

Revenue reports

Order trends

Peak hours

Popular services

Customer retention

Shop performance

Rider performance

---

# Laundry Services

Examples:

- Wash & Fold
- Wash & Iron
- Dry Cleaning
- Iron Only
- Blanket Cleaning
- Shoe Cleaning
- Curtain Cleaning

---

# Order Status Workflow

Pending

↓

Confirmed

↓

Rider Assigned

↓

Picked Up

↓

At Laundry Shop

↓

Processing

↓

Ready

↓

Out for Delivery

↓

Delivered

↓

Completed

---

# Non-Functional Requirements

## Performance

- Fast loading
- Responsive UI
- Minimal waiting time

---

## Security

- JWT Authentication
- HTTPS
- Password encryption
- Role-based authorization
- Secure payment integration

---

## Scalability

Support expansion to multiple Cambodian cities without major architectural changes.

---

## Reliability

- High availability
- Automatic backups
- Error logging
- Monitoring

---

## Accessibility

Support both Khmer and English.

---

# Future Features

- AI stain detection
- AI price estimation from photos
- Subscription laundry plans
- Business accounts
- Live rider tracking
- Smart order recommendations
- Loyalty points
- Gift cards
- Laundry locker pickup
- Franchise management
- Multi-country support

---

# Success Metrics

- Customer retention rate
- Monthly active users
- Completed orders
- Average delivery time
- Customer satisfaction
- Rider acceptance rate
- Laundry shop satisfaction
- Platform revenue
- Order completion rate
- App store ratings

---

# MVP Scope (Version 1)

The first release should include:

- Customer registration and login
- Laundry shop registration and approval
- Rider registration and approval
- Place laundry orders
- Pickup scheduling
- Order tracking
- Rider assignment
- Laundry status updates
- KHQR and Cash on Delivery payments
- Push notifications
- Ratings and reviews
- Admin dashboard
- Laundry shop dashboard
- Rider application
- Customer application

Everything outside this list should be treated as a future enhancement and should not delay the MVP launch.
