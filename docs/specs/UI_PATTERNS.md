# UI/UX Patterns Specification

## Overview

Plinth's design is inspired by **Spotify** (bold typography, high contrast), **ClickUp** (organized density, task-oriented), and **FullStory** (clean data visualization, professional SaaS). The result should feel like a premium tool for strategic leaders.

---

## Design Principles

1. **Organized density** - Pack information efficiently without feeling cluttered
2. **Clear hierarchy** - Most important things are most prominent
3. **Confident typography** - Bold headings, readable body
4. **Purposeful animation** - Subtle, meaningful transitions
5. **Dark mode native** - Design for dark first, light as alternative

---

## Color System

### Brand Colors

```css
/* Primary - Confident blue */
--primary-50: #E6F1FF;
--primary-100: #CCE4FF;
--primary-200: #99C9FF;
--primary-300: #66ADFF;
--primary-400: #3392FF;
--primary-500: #0077FF;  /* Primary brand */
--primary-600: #005FCC;
--primary-700: #004799;
--primary-800: #003066;
--primary-900: #001833;

/* Neutral - Warm grays */
--neutral-50: #FAFAFA;
--neutral-100: #F4F4F5;
--neutral-200: #E4E4E7;
--neutral-300: #D4D4D8;
--neutral-400: #A1A1AA;
--neutral-500: #71717A;
--neutral-600: #52525B;
--neutral-700: #3F3F46;
--neutral-800: #27272A;
--neutral-900: #18181B;
--neutral-950: #0F0F10;
```

### Semantic Colors

```css
/* Status */
--success: #10B981;  /* Green */
--warning: #F59E0B;  /* Amber */
--error: #EF4444;    /* Red */
--info: #3B82F6;     /* Blue */

/* Decision status */
--status-draft: #71717A;
--status-in-review: #F59E0B;
--status-committed: #10B981;
--status-archived: #A1A1AA;

/* Evidence strength */
--strength-strong: #10B981;
--strength-moderate: #F59E0B;
--strength-weak: #EF4444;

/* Quality score */
--quality-low: #EF4444;      /* 0-40 */
--quality-medium: #F59E0B;   /* 40-70 */
--quality-high: #10B981;     /* 70-100 */
```

### Theme Configurations

**Dark Mode (Default)**
```css
--background: #0F0F10;
--background-secondary: #18181B;
--background-tertiary: #27272A;
--foreground: #FAFAFA;
--foreground-muted: #A1A1AA;
--border: #3F3F46;
--border-subtle: #27272A;
```

**Light Mode**
```css
--background: #FFFFFF;
--background-secondary: #FAFAFA;
--background-tertiary: #F4F4F5;
--foreground: #18181B;
--foreground-muted: #71717A;
--border: #E4E4E7;
--border-subtle: #F4F4F5;
```

---

## Typography

### Font Stack

```css
/* Primary - Clean sans-serif */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Mono - For code/data */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Scale (Spotify-inspired boldness)

```css
/* Headings - Bold and confident */
--text-4xl: 2.25rem;   /* 36px - Page titles */
--text-3xl: 1.875rem;  /* 30px - Section headers */
--text-2xl: 1.5rem;    /* 24px - Card titles */
--text-xl: 1.25rem;    /* 20px - Subsection */
--text-lg: 1.125rem;   /* 18px - Large body */
--text-base: 1rem;     /* 16px - Body */
--text-sm: 0.875rem;   /* 14px - Secondary */
--text-xs: 0.75rem;    /* 12px - Captions */

/* Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Usage

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Page title | 4xl | Bold | foreground |
| Section header | 2xl | Semibold | foreground |
| Card title | lg | Semibold | foreground |
| Body text | base | Normal | foreground |
| Secondary text | sm | Normal | foreground-muted |
| Label | sm | Medium | foreground-muted |
| Badge | xs | Medium | varies |

---

## Spacing

### Scale

```css
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Application

| Context | Spacing |
|---------|---------|
| Page padding | space-6 (mobile), space-8 (desktop) |
| Section gap | space-8 |
| Card padding | space-4 (mobile), space-6 (desktop) |
| Between cards | space-4 |
| Form field gap | space-4 |
| Inline items | space-2 |

---

## Layout

### Page Structure (ClickUp-inspired)

```
┌────────────────────────────────────────────────────────────────────────┐
│  ┌──────────┐  ┌─────────────────────────────────────────────────┐    │
│  │          │  │  HEADER                                         │    │
│  │          │  │  ┌─────────────────────────────────────────────┐│    │
│  │          │  │  │ Page Title               Actions / Profile  ││    │
│  │          │  │  └─────────────────────────────────────────────┘│    │
│  │  SIDEBAR │  └─────────────────────────────────────────────────┘    │
│  │          │  ┌─────────────────────────────────────────────────┐    │
│  │  240px   │  │                                                 │    │
│  │          │  │  MAIN CONTENT                                   │    │
│  │  (fixed) │  │                                                 │    │
│  │          │  │  Max width: 1200px                              │    │
│  │          │  │  Centered with padding                          │    │
│  │          │  │                                                 │    │
│  │          │  │                                                 │    │
│  │          │  │                                                 │    │
│  └──────────┘  └─────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────────────┘
```

### Sidebar Navigation

```
┌──────────────────────┐
│  🎯 Plinth           │  ← Logo
│                      │
│  ──────────────────  │
│                      │
│  📋 Decisions        │  ← Primary nav (bold when active)
│  👥 Team             │
│  ⚙️ Settings         │
│                      │
│  ──────────────────  │
│                      │
│  RECENT              │  ← Section label (xs, muted)
│  · CRM Selection     │  ← Recent items
│  · Market Entry UK   │
│  · Q4 Prioritization │
│                      │
│                      │
│  ──────────────────  │
│                      │
│  [+ New Decision]    │  ← Primary CTA at bottom
│                      │
└──────────────────────┘
```

### Content Area Grid

```css
/* Decision canvas - responsive grid */
.decision-canvas {
  display: grid;
  grid-template-columns: 1fr;  /* Mobile: single column */
  gap: var(--space-6);
}

@media (min-width: 1024px) {
  .decision-canvas {
    grid-template-columns: 2fr 1fr;  /* Desktop: main + sidebar */
  }
}
```

---

## Components

### Cards (FullStory-inspired)

**Standard Card**
```
┌─────────────────────────────────────────────────────────────────┐
│  Card Title                                          [Actions]  │
│                                                                 │
│  Card content goes here. Can include text, lists, or           │
│  nested components.                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

```css
.card {
  background: var(--background-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: var(--space-5);
}

.card:hover {
  border-color: var(--border);
}

.card-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-3);
}
```

**Decision Card (List View)**
```
┌─────────────────────────────────────────────────────────────────┐
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  CRM Platform Selection                                    │ │
│  │  Should we build or buy a CRM for enterprise sales?       │ │
│  │                                                            │ │
│  │  [Draft]  ·  3 options  ·  5 evidence  ·  Updated 2h ago  │ │
│  │                                                            │ │
│  │  ████████████████░░░░  72%                                │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Buttons

**Primary Button**
```css
.btn-primary {
  background: var(--primary-500);
  color: white;
  font-weight: var(--font-medium);
  padding: var(--space-2) var(--space-4);
  border-radius: 8px;
  transition: background 150ms ease;
}

.btn-primary:hover {
  background: var(--primary-600);
}

.btn-primary:disabled {
  background: var(--neutral-600);
  cursor: not-allowed;
}
```

**Secondary Button**
```css
.btn-secondary {
  background: transparent;
  color: var(--foreground);
  border: 1px solid var(--border);
  /* ... */
}

.btn-secondary:hover {
  background: var(--background-tertiary);
}
```

**Ghost Button**
```css
.btn-ghost {
  background: transparent;
  color: var(--foreground-muted);
  /* ... */
}

.btn-ghost:hover {
  color: var(--foreground);
  background: var(--background-tertiary);
}
```

**Button Sizes**
```css
.btn-sm { padding: var(--space-1) var(--space-3); font-size: var(--text-sm); }
.btn-md { padding: var(--space-2) var(--space-4); font-size: var(--text-base); }
.btn-lg { padding: var(--space-3) var(--space-6); font-size: var(--text-lg); }
```

### Status Badges

```
[Draft]  [In Review]  [Committed]  [Archived]
```

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-2);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  border-radius: 6px;
}

.badge-draft {
  background: var(--neutral-800);
  color: var(--neutral-300);
}

.badge-in-review {
  background: rgba(245, 158, 11, 0.15);
  color: var(--warning);
}

.badge-committed {
  background: rgba(16, 185, 129, 0.15);
  color: var(--success);
}
```

### Form Inputs

```css
.input {
  width: 100%;
  background: var(--background-tertiary);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-base);
  color: var(--foreground);
  transition: border-color 150ms ease;
}

.input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(0, 119, 255, 0.15);
}

.input::placeholder {
  color: var(--foreground-muted);
}

.input-error {
  border-color: var(--error);
}

.input-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--foreground-muted);
  margin-bottom: var(--space-2);
}
```

### Progress Indicators

**Quality Score Bar**
```
Quality: 72%
████████████████████░░░░░░░░
```

```css
.progress-bar {
  height: 8px;
  background: var(--background-tertiary);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 300ms ease;
}

.progress-fill[data-quality="low"] { background: var(--quality-low); }
.progress-fill[data-quality="medium"] { background: var(--quality-medium); }
.progress-fill[data-quality="high"] { background: var(--quality-high); }
```

### Tooltips

```css
.tooltip {
  background: var(--neutral-800);
  color: var(--foreground);
  padding: var(--space-2) var(--space-3);
  border-radius: 6px;
  font-size: var(--text-sm);
  max-width: 250px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
```

### Modals/Dialogs

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                      [×]   │ │
│  │  Modal Title                                               │ │
│  │  ───────────────────────────────────────────────────────  │ │
│  │                                                            │ │
│  │  Modal content goes here.                                  │ │
│  │                                                            │ │
│  │                                                            │ │
│  │  ───────────────────────────────────────────────────────  │ │
│  │                            [Cancel]  [Primary Action]      │ │
│  └───────────────────────────────────────────────────────────┘ │
│  (backdrop: rgba(0, 0, 0, 0.7))                                │
└─────────────────────────────────────────────────────────────────┘
```

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
}

.modal {
  background: var(--background-secondary);
  border: 1px solid var(--border);
  border-radius: 16px;
  max-width: 500px;
  width: 90%;
  max-height: 85vh;
  overflow: auto;
}

.modal-header {
  padding: var(--space-5);
  border-bottom: 1px solid var(--border-subtle);
}

.modal-body {
  padding: var(--space-5);
}

.modal-footer {
  padding: var(--space-5);
  border-top: 1px solid var(--border-subtle);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}
```

---

## Animation & Transitions

### Principles (Spotify-inspired)

- Fast and responsive (150-300ms)
- Subtle easing
- Purpose-driven (guide attention, confirm actions)

### Standard Durations

```css
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;

--ease-default: cubic-bezier(0.4, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
```

### Hover Transitions

```css
/* All interactive elements */
.interactive {
  transition:
    background var(--duration-fast) var(--ease-default),
    border-color var(--duration-fast) var(--ease-default),
    color var(--duration-fast) var(--ease-default);
}
```

### Page Transitions

```css
/* Fade in on route change */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-enter {
  animation: fadeIn var(--duration-normal) var(--ease-out);
}
```

### Skeleton Loading

```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--background-tertiary) 25%,
    var(--background-secondary) 50%,
    var(--background-tertiary) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
}
```

---

## Iconography

### Icon Library

Use **Lucide React** for consistency with shadcn/ui.

### Common Icons

| Action | Icon |
|--------|------|
| Add | `plus` |
| Delete | `trash-2` |
| Edit | `pencil` |
| Close | `x` |
| Menu | `menu` |
| Search | `search` |
| Settings | `settings` |
| User | `user` |
| Team | `users` |
| Decision | `file-text` |
| Options | `layers` |
| Evidence | `file-search` |
| Constraints | `lock` |
| Tradeoffs | `scale` |
| AI | `sparkles` |
| Download | `download` |
| Share | `share-2` |
| External link | `external-link` |

### Icon Sizes

```css
--icon-sm: 16px;
--icon-md: 20px;
--icon-lg: 24px;
--icon-xl: 32px;
```

---

## Responsive Breakpoints

```css
/* Mobile first */
--breakpoint-sm: 640px;   /* Large phones */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large desktops */
```

### Mobile Adaptations

| Element | Desktop | Mobile |
|---------|---------|--------|
| Sidebar | Fixed, visible | Hidden, toggle |
| Page padding | 32px | 16px |
| Decision grid | 2 columns | 1 column |
| Modal width | 500px | Full width |
| Font sizes | Standard | Slightly reduced |

---

## Accessibility

### Requirements

- **Color contrast**: 4.5:1 minimum for text
- **Focus states**: Visible focus rings on all interactive elements
- **Keyboard navigation**: All features accessible via keyboard
- **Screen reader**: Proper ARIA labels and roles
- **Motion**: Respect `prefers-reduced-motion`

### Focus Styles

```css
:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

/* Remove default focus for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Implementation with shadcn/ui

### Theme Configuration

```typescript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... rest of semantic colors
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      },
    },
  },
};
```

### Component Customization

```typescript
// components/ui/button.tsx
// Extend shadcn/ui button with Plinth styling
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        secondary: "bg-transparent border border-border hover:bg-muted",
        ghost: "hover:bg-muted hover:text-foreground",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-base",
        lg: "h-12 px-6 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
```

---

## Design File Reference

For detailed mockups and component library, see:
- Figma: [To be created]
- Storybook: [To be configured during build]

---

## Quick Reference

### When Building New Components

1. Check if shadcn/ui has a base component
2. Apply Plinth color tokens
3. Use standard spacing scale
4. Add appropriate transitions
5. Test dark mode
6. Test mobile responsiveness
7. Add keyboard accessibility
8. Document in Storybook
