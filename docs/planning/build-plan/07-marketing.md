# Phase M: Marketing Landing Page

> **Priority**: Can be built in parallel with Phase 1
> **URL**: `/` (root)
> **Spec**: [MARKETING_LANDING.md](../../design/MARKETING_LANDING.md)

---

## Overview

Build the marketing landing page at the root URL. This is a static marketing page (no auth required) that converts visitors to signups.

**Key features**:
- Animated hero diagram (evidence → synthesis → recommendation)
- Problem/solution narrative
- Comparison table
- CTA to signup/login

---

## Prerequisites

- [ ] Phase 0 complete (project running)
- [ ] `framer-motion` installed
- [ ] Marketing layout created (no sidebar/auth)

---

## Prompts

### Prompt M.1: Marketing Layout

```
Create a marketing layout for public pages that don't require authentication.

Read docs/design/MARKETING_LANDING.md for the full spec.

Create:
1. src/app/(marketing)/layout.tsx
   - No sidebar
   - No auth check
   - Just renders children

2. Move or update the root page to use this layout

The marketing pages should be completely separate from the authenticated app pages.
```

**Verify**: Visit `/` — should render without auth redirect

---

### Prompt M.2: Navigation Component

```
Build the marketing navigation component.

Read docs/design/MARKETING_LANDING.md section "1. Navigation" for the spec.

Create src/components/marketing/Nav.tsx:
- Fixed position at top
- Transparent background initially
- White background + shadow when scrolled (use scroll listener)
- Logo (wordmark "Plinth")
- Nav links: How it Works, Pricing, Login
- CTA button: "Get Started" (links to /login or /signup)
- Mobile: hamburger menu with slide-out panel

Use the design tokens from docs/design/DESIGN_SPEC_V2.md:
- Primary orange: #F97316
- Text: zinc-900, zinc-600
- Background when scrolled: white with shadow-sm

Add the nav link hover effect: underline slides in from left on hover.
```

**Verify**: Nav appears, scrolls correctly, mobile menu works

---

### Prompt M.3: Hero Section (Static)

```
Build the hero section without the animated diagram (we'll add that next).

Read docs/design/MARKETING_LANDING.md section "2. Hero Section" for the spec.

Create src/components/marketing/Hero.tsx:
- Full viewport height (min-h-screen)
- Centered content
- Headline: "Strategic rigor without the retainer."
- Subhead: "From question to defensible recommendation in 10 minutes."
- CTA button: "Analyze Your First Decision" with arrow icon
- Caption: "No credit card required"
- Subtle radial gradient background (white to orange-50)

Add staggered fade-in animations with framer-motion:
- Headline fades up first
- Subhead 100ms later
- Button 200ms later

Leave a placeholder div for the animated diagram (we'll build it separately).
```

**Verify**: Hero renders with animations, CTA links to signup

---

### Prompt M.4: Hero Diagram (Animated)

```
Build the animated hero diagram showing evidence flowing into synthesis.

Read docs/design/MARKETING_LANDING.md section "3. Animated Hero Diagram" for the complete spec.

Create src/components/marketing/HeroDiagram.tsx:
- SVG-based, viewBox="0 0 800 400"
- 8 evidence nodes around the edges (small circles with Lucide icons)
- Curved connection paths from evidence to center
- Central synthesis node (larger circle with Sparkles icon)
- Output recommendation card below

Animation sequence (use framer-motion):
1. Evidence nodes fade in + scale (staggered, starting at 0.2s)
2. Connection paths draw in (0.6s)
3. Synthesis node appears (0.8s)
4. Synthesis icon fades in (1.2s)
5. Output line draws down (1.3s)
6. Recommendation card fades in (1.5s)
7. Glow ring on synthesis pulses infinitely
8. Optional: particles flow along paths

Responsive:
- Mobile: Show simplified 3-node version
- Desktop: Full 8-node diagram

Respect prefers-reduced-motion: show final state without animation.

Use these colors:
- Evidence nodes: white with gray-200 border
- Connections: gray-200, dashed
- Synthesis: white with orange-500 border
- Recommendation: white with emerald-500 border
```

**Verify**: Diagram animates on load, looks good on mobile

---

### Prompt M.5: Problem Section

```
Build the problem section with the "broken decisions" messaging.

Read docs/design/MARKETING_LANDING.md section "5. Problem Section" for the spec.

Create src/components/marketing/ProblemSection.tsx:
- Two-column layout (text left, cards right)
- Headline: "The way you make strategic decisions is broken."
- Body text about incomplete research and "why did we do this"
- 4 problem cards on the right:
  1. Hire consultants - $500k, 8 weeks
  2. DIY research - confirmation bias
  3. Trust your gut - not defensible
  4. Use a framework - doesn't do research

Problem cards:
- White background, gray-200 border, rounded-xl
- Icon + title + description
- Hover: border turns red-200, background red-50/50
- Animate: fade + slide from right on scroll into view

Use framer-motion whileInView for scroll animations.
```

**Verify**: Cards animate on scroll, hover states work

---

### Prompt M.6: Insight Section (Dark)

```
Build the insight section explaining evidence-first approach.

Read docs/design/MARKETING_LANDING.md section "6. Insight Section" for the spec.

Create src/components/marketing/InsightSection.tsx:
- Dark background (zinc-900)
- Centered headline: "The problem isn't your judgment. It's the process."
- "It's the process" in orange-400
- Subtext about "options first" being backwards

Two-column comparison:
- Left card: "Options First" (others) - muted styling
  - Steps: What do you think? → Find supporting evidence → Confirmation bias (red)
- Right card: "Evidence First" (Plinth) - highlighted with orange border
  - Steps: What does the data say? → Generate grounded options → Surprising insights (green)

Animate the step arrows drawing in on scroll.
```

**Verify**: Dark section renders, comparison is clear

---

### Prompt M.7: How It Works

```
Build the "three steps" section.

Read docs/design/MARKETING_LANDING.md section "7. How It Works" for the spec.

Create src/components/marketing/HowItWorks.tsx:
- Section id="how-it-works" (for nav link)
- Headline: "Three steps. No templates."
- 3 step cards in a row:
  1. Frame the decision (Target icon)
  2. Get the analysis (Sparkles icon)
  3. Export the brief (FileText icon)

Step cards:
- White background, gray-200 border, rounded-2xl
- Orange number badge (1, 2, 3) at top
- Icon below number
- Title + description
- Hover: lift up slightly (y: -4), shadow increases
- Stagger fade-in on scroll

Link at bottom: "See a sample brief →" (ghost style)
```

**Verify**: Cards animate, hover lift works, nav link scrolls here

---

### Prompt M.8: Outcomes Grid

```
Build the outcomes grid section.

Read docs/design/MARKETING_LANDING.md section "8. Outcomes Grid" for the spec.

Create src/components/marketing/OutcomesGrid.tsx:
- Gray-50 background
- Headline: "Not features. Outcomes."
- 6 outcome cards in 2x3 grid (3 cols on desktop)

Outcome cards:
1. Evidence from 50+ sources - Search icon
2. Options you didn't think of - Lightbulb icon
3. Transparent confidence scores - BarChart3 icon
4. Explicit tradeoff acknowledgment - Scale icon
5. A shareable brief - FileText icon
6. Post-decision tracking - Eye icon

Card style:
- White background, rounded-xl, p-6
- Orange icon at top
- Title + short description
- Hover: shadow-md appears

Stagger fade-in on scroll.
```

**Verify**: Grid responsive, cards animate

---

### Prompt M.9: Comparison Table

```
Build the comparison table.

Read docs/design/MARKETING_LANDING.md section "9. Comparison Table" for the spec.

Create src/components/marketing/ComparisonTable.tsx:
- Headline: "Not a template. Not a chatbot. Not a 6-month engagement."
- Responsive table with horizontal scroll on mobile

Columns: Feature | Consultants | DIY | Templates | Plinth (highlighted)

Rows:
- Does the research: ✓ | ✗ | ✗ | ✓
- Evidence before options: ✓ | ✗ | ✗ | ✓
- Transparent reasoning: ~ | ✗ | ✗ | ✓
- Defensible artifact: ✓ | ✗ | ✗ | ✓
- Time to recommendation: 8 weeks | Days | Hours | 10 min ★
- Cost: $50k-500k | Your time | Free | $$$

Styling:
- Plinth column: orange-50 background, orange header
- Checkmarks: emerald-500
- X marks: red-400
- Star highlights: orange-500

Animate rows fading in sequentially on scroll.
```

**Verify**: Table scrolls on mobile, Plinth column highlighted

---

### Prompt M.10: Founder Note & Final CTA

```
Build the founder note and final CTA sections.

Read docs/design/MARKETING_LANDING.md sections "10. Founder Note" and "11. Final CTA" for the spec.

Create src/components/marketing/FounderNote.tsx:
- Dark background (zinc-900)
- Large decorative quote mark in orange-500/30
- Quote: "I've sat in the rooms where these decisions get made..."
- Author: Paul Butcher, Founder
- Small avatar circle with "P" initial

Create src/components/marketing/FinalCTA.tsx:
- Gradient background (white to orange-50)
- Headline: "Your next big decision is waiting."
- Subtext: "Try Plinth free. No credit card. No sales call."
- Large CTA button with glow shadow
- Button should have subtle pulse animation on the glow
```

**Verify**: Both sections render, CTA button has glow effect

---

### Prompt M.11: Footer

```
Build the marketing footer.

Read docs/design/MARKETING_LANDING.md section "12. Footer" for the spec.

Create src/components/marketing/Footer.tsx:
- Dark background (zinc-900)
- 4-column layout on desktop:
  1. Logo + "Make better decisions."
  2. Product: How it Works, Pricing, Changelog
  3. Company: About, Blog, Contact
  4. Legal: Privacy, Terms
- Divider line (zinc-800)
- Bottom: Copyright + social icons (Twitter, LinkedIn)

All links are zinc-400, hover to white.
Social icons use Lucide: Twitter, Linkedin
```

**Verify**: Footer responsive, links work

---

### Prompt M.12: Assemble Landing Page

```
Assemble all marketing components into the landing page.

Update src/app/(marketing)/page.tsx:

Import and render all sections in order:
1. Nav (in layout, not page)
2. Hero (with HeroDiagram)
3. SocialProof (or placeholder text for now)
4. ProblemSection
5. InsightSection
6. HowItWorks
7. OutcomesGrid
8. ComparisonTable
9. FounderNote
10. FinalCTA
11. Footer

Ensure:
- Scroll is smooth between sections
- All animations trigger correctly
- Mobile responsive
- Nav links scroll to correct sections

Test the full page from top to bottom.
```

**Verify**: Full page works, all sections visible, animations smooth

---

### Prompt M.13: Performance & Polish

```
Polish the landing page for production.

1. Add metadata to the page:
   - Title: "Plinth - Strategic rigor without the retainer"
   - Description: "From question to defensible recommendation in 10 minutes."
   - OG image (create a simple one or use placeholder)

2. Ensure all images/icons are optimized

3. Add smooth scroll behavior:
   html { scroll-behavior: smooth; }

4. Test reduced motion preference:
   @media (prefers-reduced-motion: reduce) { ... }

5. Verify Lighthouse score:
   - Performance > 90
   - Accessibility > 90
   - SEO > 90

6. Test on:
   - Mobile Safari
   - Chrome desktop
   - Firefox

Fix any issues found during testing.
```

**Verify**: Lighthouse scores good, works across browsers

---

## Checklist

- [ ] M.1 Marketing layout
- [ ] M.2 Navigation
- [ ] M.3 Hero (static)
- [ ] M.4 Hero diagram (animated)
- [ ] M.5 Problem section
- [ ] M.6 Insight section
- [ ] M.7 How it works
- [ ] M.8 Outcomes grid
- [ ] M.9 Comparison table
- [ ] M.10 Founder note & CTA
- [ ] M.11 Footer
- [ ] M.12 Assemble page
- [ ] M.13 Polish & performance

---

## Dependencies

```bash
npm install framer-motion
```

---

## Notes

- This can be built in parallel with Phase 1 (Decision Engine)
- The CTA buttons should link to `/login` or `/signup`
- Social proof logos can be added later when available
- Sample brief link can be a modal or separate page (future)
