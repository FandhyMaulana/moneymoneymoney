# Money Manager App Frontend Design Document

---

# 1. Project Overview

## Vision

Montra is a modern financial management web application focused on simplicity, clarity, usability, and long-term maintainability.

The application combines:

- Apple-inspired minimalism
- Linear-inspired clean productivity UI
- Budggt-inspired modern finance dashboard experience

The frontend must be:

- Responsive
- Scalable
- Maintainable
- Accessible
- Performance-focused
- Enterprise-grade

---

# 2. Design Philosophy

## Core Principles

- Minimal but expressive
- Premium visual feel
- Spacious layout
- Smooth interactions
- Consistent component behavior
- Dark-first experience
- Mobile-first responsiveness
- Readability over decoration

## User Experience Goals

Users should feel:

- Focused
- Organized
- Calm
- Productive
- In control of their finances

Avoid:

- Cluttered interfaces
- Excessive colors
- Heavy gradients
- Over-animation
- Inconsistent spacing
- Visual noise
- AI-slop dashboard design

---

# 3. Technology Stack

## Frontend

- Next.js 15
- TypeScript
- TailwindCSS
- shadcn/ui
- Framer Motion
- Zustand
- TanStack Query
- Axios
- React Hook Form
- Zod

## Architecture

- Feature-Based Modular Architecture
- Component-Based UI Design
- Service Layer Pattern
- Typed API Integration
- Centralized Server State Management

---

# 4. Frontend Architecture

## Architectural Principles

- Separation of Concerns
- Reusable UI Components
- Centralized API Layer
- Strongly Typed DTOs
- Isolated Business Logic
- Predictable State Management
- Backend as Source of Truth

## Rules

- Never call API directly inside UI pages
- Never hardcode colors inside components
- Never mix business logic with presentation logic
- Prefer composition over inheritance
- Keep components focused and reusable
- Never calculate financial balances solely on frontend
- Never trust client-calculated financial values

---

# 5. Folder Structure

```txt
src/
├── app/
│
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── transaction/
│   ├── wallet/
│   ├── budget/
│   ├── analytics/
│   ├── recurring/
│   └── settings/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── charts/
│   ├── forms/
│   ├── tables/
│   └── shared/
│
├── services/
│
├── stores/
│
├── hooks/
│
├── providers/
│
├── config/
│
├── types/
│
├── lib/
│
├── utils/
│
├── styles/
│   ├── globals.css
│   ├── tokens.css
│   └── theme.css
│
└── constants/
```

---

# 6. Visual Direction

## Design Inspirations

- Apple
- Linear
- Budggt

## UI Characteristics

- Clean dark dashboard
- Soft layered surfaces
- Large spacing
- Rounded surfaces
- Minimal visual noise
- Elegant typography hierarchy
- Data readability prioritized over decoration

## Glassmorphism Usage

Glassmorphism should be:

- Subtle
- Limited
- Carefully layered

Use glass surfaces only for:

- Hero sections
- Dashboard highlights
- Floating quick action panels

Avoid:

- Full glass UI
- Excessive blur
- Transparent transaction tables
- Low-contrast cards

---

# 7. Color System

## Primary Palette

Primary:

- #7C3AED

Secondary:

- #A78BFA

Accent:

- #22C55E

Danger:

- #EF4444

Warning:

- #F59E0B

## Background Colors

Light Mode:

- Background: #F8FAFC
- Card: #FFFFFF

Dark Mode:

- Background: #020617
- Surface: #0F172A
- Elevated Surface: #111827

## Text Colors

Light:

- Primary: #0F172A
- Secondary: #475569

Dark:

- Primary: #F8FAFC
- Secondary: #CBD5E1

---

# 8. Typography System

## Font Family

- Inter

## Typography Rules

- Use whitespace for hierarchy
- Avoid excessive font weights
- Prioritize readability
- Consistent heading scales
- Avoid dense financial layouts

## Heading Scale

- h1: 36px
- h2: 30px
- h3: 24px
- h4: 20px
- body: 16px
- small: 14px

---

# 9. Spacing System

## Base Unit

- 4px

## Scale

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

## Rules

- Prefer whitespace over borders
- Maintain visual breathing room
- Avoid cramped dashboard layouts

---

# 10. Border Radius System

Cards:

- 24px

Buttons:

- 14px

Inputs:

- 16px

Modal:

- 28px

Tables:

- 20px

---

# 11. Shadow System

## Rules

- Soft shadows only
- Avoid aggressive dark shadows
- Use layered shadows for depth

## Example

```css
box-shadow:
  0 4px 20px rgba(0, 0, 0, 0.08),
  0 2px 8px rgba(0, 0, 0, 0.04);
```

---

# 12. Dark Mode Strategy

## Approach

Use semantic design tokens.

Never hardcode colors directly inside components.

## Example

```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #0f172a;
}

.dark {
  --bg-primary: #020617;
  --text-primary: #f8fafc;
}
```

## Rules

- Maintain WCAG contrast
- Reduce eye strain
- Preserve visual hierarchy
- Avoid pure black backgrounds

---

# 13. Responsive Design

## Breakpoints

- Mobile: 320px
- Tablet: 768px
- Laptop: 1024px
- Desktop: 1440px

## Responsive Rules

- Mobile-first approach
- Sidebar collapses on tablet/mobile
- Bottom navigation for mobile
- Charts become horizontally scrollable
- Tables use responsive wrappers
- Avoid fixed widths

---

# 14. Layout Structure

## Desktop Layout

- Left Sidebar
- Top Header
- Main Content Area
- Floating Quick Actions

## Mobile Layout

- Top Navigation
- Bottom Navigation
- Stacked Cards
- Simplified Dashboard

---

# 15. Motion & Animation

## Animation Style

- Smooth
- Functional
- Subtle
- Premium feeling

## Duration

- 150ms - 300ms

## Rules

- Avoid excessive bounce
- Use fade and scale transitions
- Motion must support usability
- Avoid distracting dashboard motion

## Recommended Animations

- Fade In
- Scale Hover
- Smooth Sidebar Transition
- Skeleton Loading

---

# 16. UI Component Standards

## Principles

- Reusable
- Composable
- Accessible
- Isolated

## Rules

- Keep components under 200 lines if possible
- Separate smart and dumb components
- Avoid duplicated styling
- Use variants instead of duplicate components

---

# 17. Transaction Table Standards

## Goals

Transaction tables are a core product experience.

They must prioritize:

- Readability
- Scanability
- Performance
- Responsiveness

## Rules

- Use pagination
- Support sorting
- Use sticky table headers
- Support horizontal overflow on mobile
- Avoid dense rows
- Keep important financial values visible
- Use proper empty states
- Use skeleton loading

## Future Considerations

- Virtual scrolling for large datasets
- Column customization
- Export integration

---

# 18. State Management

## Global State

Use Zustand for:

- Authentication
- User preferences
- Theme state

## Server State

Use TanStack Query for:

- API caching
- Pagination
- Mutations
- Optimistic updates where appropriate
- Background refetching

## Local State

Use component state when possible.

Avoid unnecessary global state.

---

# 19. API Integration Strategy

## Rules

- Never call API directly from page components
- Use centralized service layer
- Use typed request/response DTOs
- Handle errors globally
- Use Axios interceptors
- Keep API logic isolated from UI

## Authentication Strategy

Current backend architecture uses:

- JWT access token authentication

Current frontend strategy:

- Access token handled centrally
- Future refresh-token support should remain extensible
- Backend remains source of truth

## Structure

```txt
services/
├── auth.service.ts
├── transaction.service.ts
├── analytics.service.ts
├── recurring.service.ts
├── budget.service.ts
└── wallet.service.ts
```

---

# 20. Form Standards

## Libraries

- React Hook Form
- Zod

## Rules

- Validate on frontend and backend
- Inline validation errors
- Disable button during submission
- Show loading state
- Prevent duplicate submissions

---

# 21. Error Handling

## Error Types

- Validation Error
- Network Error
- Authentication Error
- Authorization Error
- Unexpected Error

## Strategy

- Centralized toast notification
- Error boundaries
- Friendly error messages
- Retry actions where appropriate
- Avoid exposing raw backend errors to users

---

# 22. Performance Strategy

## Rules

- Lazy load heavy pages
- Use dynamic imports
- Minimize rerenders
- Memoize expensive components
- Paginate large datasets
- Optimize bundle size
- Use skeleton loading instead of layout shift

---

# 23. Accessibility

## Standards

- Keyboard navigation support
- Semantic HTML
- Accessible contrast ratios
- Screen reader support
- Focus visibility

---

# 24. Frontend Security Strategy

## Rules

- Never trust frontend authorization
- Never trust frontend financial calculations
- Backend remains source of truth
- Sanitize user-generated content
- Prevent XSS vulnerabilities
- Avoid exposing sensitive tokens unnecessarily

---

# 25. Future Scalability

## Planned Features

- Multi-currency support
- Offline mode
- Push notifications
- Advanced analytics
- Team/shared budgeting

---

# 26. Design Goals Summary

The frontend should feel:

- Premium
- Modern
- Calm
- Fast
- Elegant
- Focused

The UI should avoid:

- Visual clutter
- Inconsistent spacing
- Excessive animation
- Random colors
- Overcomplicated interactions
- Artificial “AI-generated” fintech aesthetics

Important:
Do not make AI-slop design on this project.
