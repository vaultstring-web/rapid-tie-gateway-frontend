# VaultString Payment Gateway - Frontend Development Guide

## Design System Overview

Our design system is built on three core foundations:

### 1. Colors
- **Primary Green (#448a33)** - Dominant brand color with 9 shades
- **Primary Blue (#3b5a65)** - Secondary brand color with 9 shades
- **Semantic Colors** - Success, Error, Warning, Info states (WCAG 2.1 AA compliant)
- **Neutral Grayscale** - 11 steps from white to black
- **Dark Mode** - Dedicated dark theme variants

### 2. Typography
- **Font Family**: Inter (primary), Roboto Mono (monospace)
- **Scale**: h1-h6, body (large/regular/small), caption, button, label
- **Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)

### 3. Spacing
- **Base Unit**: 4px grid system
- **Scale**: xs (4px) to 4xl (80px)
- **Layout**: Container widths, section spacing, grid gaps

## Using the Design System

### Theme Access
```typescript
import { useTheme } from '@/styles/ThemeProvider'
import { theme } from '@/styles/theme'

// In components
const MyComponent = () => {
  const theme = useTheme()
  return (
    <div style={{ color: theme.colors.primary.green[500] }}>
      Themed content
    </div>
  )
}

// For static usage
const styles = {
  backgroundColor: theme.colors.primary.blue[500]
}
Tailwind Classes
All design tokens are available as Tailwind classes:

jsx
// Colors
<div className="bg-primary-green-500 text-neutral-0">
<div className="border-semantic-error-main">
<div className="text-neutral-900">

// Typography
<h1 className="text-h1">Heading 1</h1>
<p className="text-body">Regular body text</p>
<span className="text-caption">Caption text</span>

// Spacing
<div className="p-md m-lg gap-xl">
<div className="mt-section-sm mb-section-md">

// Shadows
<div className="shadow-md hover:shadow-lg">

// Border Radius
<div className="rounded-lg rounded-xl">
Component Examples
Button
jsx
<button className="btn-primary">Primary Button</button>
<button className="btn-secondary btn-large">Large Secondary</button>
<button className="btn-danger btn-small">Small Danger</button>
<button className="btn-success">Success Button</button>
Card
jsx
<div className="card">
  <h3 className="text-h5">Card Title</h3>
  <p className="text-body">Card content</p>
</div>

<div className="card card-dsa-pending">
  <h3 className="text-h5">Pending DSA Request</h3>
</div>
Form
jsx
<div>
  <label className="label label-required">Email</label>
  <input className="input" type="email" />
  <span className="helper-text">We'll never share your email</span>
</div>

<div>
  <label className="label">Password</label>
  <input className="input input-error" type="password" />
  <span className="error-text">Password is required</span>
</div>
Badges
jsx
<span className="badge badge-success">Completed</span>
<span className="badge badge-pending">Pending</span>
<span className="badge badge-error">Failed</span>
<span className="badge badge-info">Info</span>
Layout
jsx
<div className="sidebar">
  <div className="sidebar-item active">Dashboard</div>
  <div className="sidebar-item">Transactions</div>
</div>

<div className="main-content">
  <div className="kpi-grid">
    <div className="analytics-card">
      <p className="analytics-title">Revenue</p>
      <p className="analytics-value">MWK 1.2M</p>
    </div>
  </div>
</div>
Upload Zone
jsx
<div className="upload-zone">
  <p>Drag & drop files here</p>
  <p className="text-caption text-neutral-600">or click to browse</p>
</div>
Modal
jsx
<div className="modal-backdrop">
  <div className="modal">
    <div className="modal-header">
      <h3 className="text-h5">Modal Title</h3>
      <button>×</button>
    </div>
    <div className="modal-body">
      Modal content
    </div>
    <div className="modal-footer">
      <button className="btn-secondary">Cancel</button>
      <button className="btn-primary">Confirm</button>
    </div>
  </div>
</div>
Responsive Design
Use the responsive hooks:

typescript
import { useBreakpoints } from '@/hooks/useResponsive'

const MyComponent = () => {
  const { isMobile, isTablet, isDesktop } = useBreakpoints()
  
  return (
    <div>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
      {isDesktop && <DesktopView />}
    </div>
  )
}
Or Tailwind responsive classes:

jsx
<div className="text-body mobile:text-body-sm desktop:text-body-lg">
  Responsive text
</div>

<div className="grid grid-cols-1 mobile:grid-cols-2 desktop:grid-cols-4">
  Responsive grid
</div>

**file structure**
src/
├── app/                    # Next.js App Router
├── components/             # Reusable components
│   ├── cards/              # Card components
│   ├── forms/              # Form components
│   ├── layout/             # Layout components
│   ├── tables/             # Table components
│   ├── charts/             # Chart components
│   └── ui/                 # Basic UI components
├── hooks/                  # Custom hooks
│   └── useResponsive.ts    # Responsive design hooks
├── lib/                    # Utilities
│   ├── api/                # API client
│   ├── utils/              # Helper functions
│   └── constants/          # Constants
├── services/               # API service layers
├── stores/                 # Zustand stores
├── styles/                 # Design system
│   ├── tokens/             # Design tokens
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── spacing.ts
│   ├── theme.ts            # Theme configuration
│   ├── ThemeProvider.tsx   # Theme context provider
│   └── globals.css         # Global styles
└── types/                  # TypeScript types