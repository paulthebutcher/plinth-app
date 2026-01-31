# Marketing Landing Page Specification

> **URL**: `/` (root)
> **Purpose**: Convert visitors to signups
> **Design System**: See [DESIGN_SPEC_V2.md](./DESIGN_SPEC_V2.md)

---

## Page Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. NAVIGATION (fixed)                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. HERO + ANIMATED DIAGRAM                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. SOCIAL PROOF BAR                                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. PROBLEM SECTION                                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ 5. INSIGHT SECTION (dark)                                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ 6. HOW IT WORKS                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ 7. OUTCOMES GRID                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ 8. COMPARISON TABLE                                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ 9. FOUNDER NOTE (dark)                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ 10. FINAL CTA                                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ 11. FOOTER                                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Navigation

**Behavior**: Fixed top, transparent over hero, white + shadow on scroll

```tsx
// Pseudo-structure
<nav className="fixed top-0 w-full z-50 transition-all duration-200">
  <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
    <Logo />
    <div className="hidden md:flex items-center gap-8">
      <NavLink href="#how-it-works">How it Works</NavLink>
      <NavLink href="#pricing">Pricing</NavLink>
      <NavLink href="/login">Login</NavLink>
      <Button variant="primary" size="sm">Get Started</Button>
    </div>
    <MobileMenuButton className="md:hidden" />
  </div>
</nav>
```

**Scroll behavior**:
```tsx
const scrolled = useScrollPosition() > 100;
// When scrolled: bg-white shadow-sm border-b border-gray-100
// When not scrolled: bg-transparent
```

**Nav link hover**: Underline slides in from left (CSS)
```css
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary);
  transition: width 200ms ease-out;
}
.nav-link:hover::after {
  width: 100%;
}
```

---

## 2. Hero Section

**Layout**: Full viewport, centered content, diagram below

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│                                                                              │
│                    Strategic rigor without the retainer.                     │
│                                                                              │
│           From question to defensible recommendation in 10 minutes.          │
│                                                                              │
│                      [Analyze Your First Decision →]                         │
│                                                                              │
│                         No credit card required                              │
│                                                                              │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                      │    │
│  │                    [ ANIMATED DIAGRAM ]                              │    │
│  │                         (400px height)                               │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│                              ↓ (scroll indicator)                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Typography**:
- Headline: `text-5xl md:text-6xl font-bold text-zinc-900 tracking-tight`
- Subhead: `text-xl text-zinc-600 max-w-xl mx-auto`
- Caption: `text-sm text-zinc-500`

**CTA Button**:
```tsx
<Button size="lg" className="h-14 px-10 text-lg">
  Analyze Your First Decision
  <ArrowRight className="ml-2 h-5 w-5" />
</Button>
```

**Background**: Subtle radial gradient
```css
.hero-bg {
  background: radial-gradient(ellipse at center top, #FFF7ED 0%, #FFFFFF 50%);
}
```

**Animations** (staggered on load):
```tsx
// Use framer-motion
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};
```

---

## 3. Animated Hero Diagram

### Concept

A flowing network visualization showing:
- **Evidence nodes** flowing in from the edges
- **Converging** into a central **synthesis point**
- **Outputting** a structured **recommendation**

This represents: scattered information → Plinth analysis → clear decision

### Structure

```
         ┌───┐                              ┌───┐
         │ E │ ─────────┐          ┌─────── │ E │
         └───┘          │          │        └───┘
                        ▼          ▼
┌───┐                 ┌──────────────┐                 ┌───┐
│ E │ ───────────────▶│              │◀─────────────── │ E │
└───┘                 │   PLINTH     │                 └───┘
                      │   ┌────┐     │
┌───┐                 │   │ ✓  │     │                 ┌───┐
│ E │ ───────────────▶│   └────┘     │◀─────────────── │ E │
└───┘                 │              │                 └───┘
                      └──────┬───────┘
                             │
                             ▼
                      ┌──────────────┐
                      │ RECOMMENDATION│
                      │   72% conf.   │
                      └──────────────┘

E = Evidence node (small circle)
```

### Technical Specification

**Canvas**: SVG-based, responsive
```tsx
<svg
  viewBox="0 0 800 400"
  className="w-full max-w-4xl mx-auto"
  preserveAspectRatio="xMidYMid meet"
>
  {/* Background grid (subtle) */}
  <GridPattern />

  {/* Evidence nodes */}
  {evidenceNodes.map(node => (
    <EvidenceNode key={node.id} {...node} />
  ))}

  {/* Connection paths */}
  {connections.map(conn => (
    <ConnectionPath key={conn.id} {...conn} />
  ))}

  {/* Central synthesis node */}
  <SynthesisNode />

  {/* Output recommendation */}
  <RecommendationNode />
</svg>
```

### Evidence Nodes

**Appearance**: Small circles with icons
```tsx
interface EvidenceNode {
  id: string;
  x: number;
  y: number;
  icon: 'search' | 'file' | 'chart' | 'globe' | 'users';
  delay: number; // stagger animation
}

const EvidenceNode = ({ x, y, icon, delay }) => (
  <motion.g
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.4, ease: "easeOut" }}
  >
    {/* Outer glow */}
    <circle cx={x} cy={y} r="24" fill="#FFF7ED" />
    {/* Main circle */}
    <circle cx={x} cy={y} r="20" fill="white" stroke="#E5E7EB" strokeWidth="2" />
    {/* Icon (Lucide) */}
    <Icon x={x - 10} y={y - 10} size={20} className="text-zinc-400" />
  </motion.g>
);
```

**Node positions** (8 evidence nodes):
```tsx
const evidenceNodes = [
  { id: 'e1', x: 50,  y: 80,  icon: 'search', delay: 0.2 },
  { id: 'e2', x: 120, y: 40,  icon: 'file',   delay: 0.3 },
  { id: 'e3', x: 50,  y: 200, icon: 'chart',  delay: 0.4 },
  { id: 'e4', x: 100, y: 320, icon: 'globe',  delay: 0.5 },
  { id: 'e5', x: 750, y: 60,  icon: 'users',  delay: 0.3 },
  { id: 'e6', x: 700, y: 160, icon: 'file',   delay: 0.4 },
  { id: 'e7', x: 750, y: 280, icon: 'search', delay: 0.5 },
  { id: 'e8', x: 680, y: 360, icon: 'chart',  delay: 0.6 },
];
```

### Connection Paths

**Appearance**: Curved lines from evidence to center
```tsx
const ConnectionPath = ({ from, to, delay }) => {
  // Calculate bezier curve
  const midX = (from.x + to.x) / 2;
  const path = `M ${from.x} ${from.y} Q ${midX} ${from.y} ${to.x} ${to.y}`;

  return (
    <motion.path
      d={path}
      fill="none"
      stroke="#E5E7EB"
      strokeWidth="2"
      strokeDasharray="4 4"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ delay, duration: 0.8, ease: "easeInOut" }}
    />
  );
};
```

**Animated particles** (optional enhancement):
```tsx
// Small dots traveling along paths
const Particle = ({ path, delay }) => (
  <motion.circle
    r="4"
    fill="#F97316"
    initial={{ offsetDistance: "0%" }}
    animate={{ offsetDistance: "100%" }}
    transition={{
      delay,
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }}
    style={{ offsetPath: `path("${path}")` }}
  />
);
```

### Central Synthesis Node

**Appearance**: Larger circle with Plinth branding
```tsx
const SynthesisNode = () => (
  <motion.g
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.8, duration: 0.5 }}
  >
    {/* Outer glow ring */}
    <motion.circle
      cx={400} cy={180} r="80"
      fill="none"
      stroke="#F97316"
      strokeWidth="2"
      strokeOpacity="0.3"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1.1 }}
      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
    />

    {/* Main circle */}
    <circle cx={400} cy={180} r="60" fill="white" stroke="#F97316" strokeWidth="3" />

    {/* Inner icon or logo */}
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2 }}
    >
      <Sparkles x={400 - 16} y={180 - 16} size={32} className="text-orange-500" />
    </motion.g>

    {/* "Analyzing" text */}
    <text x={400} y={260} textAnchor="middle" className="text-sm fill-zinc-500">
      Analyzing...
    </text>
  </motion.g>
);
```

### Recommendation Output

**Appearance**: Card-like output below synthesis
```tsx
const RecommendationNode = () => (
  <motion.g
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.5, duration: 0.5 }}
  >
    {/* Connection line from synthesis */}
    <motion.line
      x1={400} y1={240} x2={400} y2={300}
      stroke="#10B981"
      strokeWidth="3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 1.3, duration: 0.3 }}
    />

    {/* Recommendation card */}
    <rect
      x={300} y={310}
      width={200} height={70}
      rx="12"
      fill="white"
      stroke="#10B981"
      strokeWidth="2"
    />

    {/* Checkmark */}
    <circle cx={330} cy={345} r="14" fill="#10B981" />
    <CheckIcon x={330 - 8} y={345 - 8} size={16} className="text-white" />

    {/* Text */}
    <text x={355} y={340} className="text-sm font-medium fill-zinc-900">
      Recommendation
    </text>
    <text x={355} y={360} className="text-xs fill-zinc-500">
      72% confidence
    </text>
  </motion.g>
);
```

### Full Animation Timeline

| Time | Element | Animation |
|------|---------|-----------|
| 0.0s | Page load | - |
| 0.2s | Evidence nodes | Fade in + scale (staggered 0.1s each) |
| 0.6s | Connection paths | Draw in (staggered) |
| 0.8s | Synthesis node | Fade in + scale |
| 1.0s | Particles | Start flowing along paths |
| 1.2s | Synthesis icon | Fade in |
| 1.3s | Output line | Draw down |
| 1.5s | Recommendation | Fade in + slide up |
| 2.0s+ | Glow ring | Pulse (infinite) |
| 2.0s+ | Particles | Flow (infinite) |

### Responsive Behavior

```tsx
// Mobile: Stack vertically, simpler animation
// Tablet: Smaller scale
// Desktop: Full diagram

const DiagramContainer = () => {
  const isMobile = useMediaQuery('(max-width: 640px)');

  if (isMobile) {
    return <SimplifiedDiagram />; // 3 nodes → center → output
  }

  return <FullDiagram />;
};
```

### Reduced Motion

```tsx
const prefersReducedMotion = useReducedMotion();

// If reduced motion, show final state immediately without animation
const animationProps = prefersReducedMotion
  ? { initial: false }
  : { initial: "hidden", animate: "visible" };
```

---

## 4. Social Proof Bar

```tsx
<section className="py-12 bg-gray-50 border-y border-gray-100">
  <div className="max-w-5xl mx-auto px-6">
    <p className="text-sm text-zinc-500 text-center uppercase tracking-wide mb-8">
      Trusted by teams at
    </p>
    <div className="flex items-center justify-center gap-12 opacity-60">
      {/* Grayscale logos, ~32px height */}
      <Logo1 />
      <Logo2 />
      <Logo3 />
      <Logo4 />
    </div>
  </div>
</section>
```

**If no logos yet**, use placeholder text:
```tsx
<p className="text-center text-zinc-600">
  Built for product leaders, strategy teams, and executives who can't afford to guess.
</p>
```

---

## 5. Problem Section

**Layout**: Two columns on desktop

```tsx
<section className="py-24 bg-white">
  <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-start">

    {/* Left: Headline + body */}
    <div>
      <h2 className="text-4xl font-bold text-zinc-900 mb-6">
        The way you make strategic decisions is broken.
      </h2>
      <p className="text-lg text-zinc-600 mb-4">
        You're expected to make calls that shape the next 18 months —
        with a half-day of research, three conflicting opinions, and a deadline.
      </p>
      <p className="text-lg text-zinc-600">
        Six months later, someone asks: <em>"Why did we do this again?"</em>
      </p>
    </div>

    {/* Right: Problem cards */}
    <div className="space-y-4">
      <ProblemCard
        icon={Users}
        title="Hire consultants"
        description="$500k, 8 weeks, tell you what you already suspected"
      />
      <ProblemCard
        icon={Search}
        title="DIY research"
        description="Find evidence that confirms what you wanted to believe"
      />
      <ProblemCard
        icon={Heart}
        title="Trust your gut"
        description="Works until it doesn't — and you can't explain why"
      />
      <ProblemCard
        icon={Grid3x3}
        title="Use a framework"
        description="A 2x2 matrix doesn't do the research for you"
      />
    </div>

  </div>
</section>
```

**Problem Card**:
```tsx
const ProblemCard = ({ icon: Icon, title, description }) => (
  <motion.div
    className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-xl
               hover:border-red-200 hover:bg-red-50/50 transition-colors"
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
  >
    <div className="p-2 bg-gray-100 rounded-lg">
      <Icon className="h-5 w-5 text-zinc-400" />
    </div>
    <div>
      <h3 className="font-semibold text-zinc-900">{title}</h3>
      <p className="text-sm text-zinc-500">{description}</p>
    </div>
  </motion.div>
);
```

---

## 6. Insight Section (Dark)

**Layout**: Full-width dark background, centered content

```tsx
<section className="py-24 bg-zinc-900">
  <div className="max-w-4xl mx-auto px-6 text-center">

    <h2 className="text-4xl font-bold text-white mb-6">
      The problem isn't your judgment.<br />
      <span className="text-orange-400">It's the process.</span>
    </h2>

    <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
      Most decision tools start with "What are your options?" That's backwards.
    </p>

    {/* Comparison diagram */}
    <div className="grid md:grid-cols-2 gap-8 mt-12">

      {/* Others: Options first */}
      <div className="bg-zinc-800 rounded-2xl p-8 text-left">
        <p className="text-sm uppercase tracking-wide text-zinc-500 mb-4">Others</p>
        <h3 className="text-xl font-semibold text-zinc-300 mb-6">Options First</h3>
        <div className="space-y-4">
          <Step text="What do you think?" muted />
          <Arrow />
          <Step text="Find supporting evidence" muted />
          <Arrow />
          <Step text="Confirmation bias" bad />
        </div>
      </div>

      {/* Plinth: Evidence first */}
      <div className="bg-zinc-800 rounded-2xl p-8 text-left border-2 border-orange-500/50">
        <p className="text-sm uppercase tracking-wide text-orange-400 mb-4">Plinth</p>
        <h3 className="text-xl font-semibold text-white mb-6">Evidence First</h3>
        <div className="space-y-4">
          <Step text="What does the data say?" highlight />
          <Arrow orange />
          <Step text="Generate grounded options" highlight />
          <Arrow orange />
          <Step text="Surprising insights" good />
        </div>
      </div>

    </div>

  </div>
</section>
```

---

## 7. How It Works

```tsx
<section id="how-it-works" className="py-24 bg-white">
  <div className="max-w-5xl mx-auto px-6">

    <h2 className="text-3xl font-bold text-zinc-900 text-center mb-4">
      Three steps. No templates.
    </h2>
    <p className="text-lg text-zinc-600 text-center mb-16 max-w-xl mx-auto">
      Describe your decision. Get rigorous analysis. Export a defensible brief.
    </p>

    <div className="grid md:grid-cols-3 gap-8">
      <StepCard
        number={1}
        icon={Target}
        title="Frame the decision"
        description={`"Should we enter the mid-market with a lighter compliance offering?"`}
      />
      <StepCard
        number={2}
        icon={Sparkles}
        title="Get the analysis"
        description="Evidence gathered. Options generated. Tradeoffs surfaced. Confidence scored."
      />
      <StepCard
        number={3}
        icon={FileText}
        title="Export the brief"
        description="A document you can share, defend, and revisit when someone asks why."
      />
    </div>

    <div className="text-center mt-12">
      <Button variant="ghost" className="text-orange-600 hover:text-orange-700">
        See a sample brief →
      </Button>
    </div>

  </div>
</section>
```

**Step Card**:
```tsx
const StepCard = ({ number, icon: Icon, title, description }) => (
  <motion.div
    className="bg-white border border-gray-200 rounded-2xl p-8 text-center
               hover:shadow-lg hover:border-gray-300 transition-all"
    whileHover={{ y: -4 }}
  >
    {/* Number badge */}
    <div className="w-12 h-12 bg-orange-500 text-white rounded-full
                    flex items-center justify-center text-xl font-bold mx-auto mb-6">
      {number}
    </div>

    <Icon className="h-8 w-8 text-zinc-400 mx-auto mb-4" />

    <h3 className="text-xl font-semibold text-zinc-900 mb-3">{title}</h3>
    <p className="text-zinc-600">{description}</p>
  </motion.div>
);
```

---

## 8. Outcomes Grid

```tsx
<section className="py-24 bg-gray-50">
  <div className="max-w-5xl mx-auto px-6">

    <h2 className="text-3xl font-bold text-zinc-900 text-center mb-4">
      Not features. Outcomes.
    </h2>
    <p className="text-lg text-zinc-600 text-center mb-16 max-w-xl mx-auto">
      What you actually walk away with.
    </p>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <OutcomeCard
        icon={Search}
        title="Evidence from 50+ sources"
        description="Stop wondering what you missed."
      />
      <OutcomeCard
        icon={Lightbulb}
        title="Options you didn't think of"
        description="Escape your own assumptions."
      />
      <OutcomeCard
        icon={BarChart3}
        title="Transparent confidence scores"
        description="Know how sure you should be — and why."
      />
      <OutcomeCard
        icon={Scale}
        title="Explicit tradeoff acknowledgment"
        description="Defend your reasoning months later."
      />
      <OutcomeCard
        icon={FileText}
        title="A shareable brief"
        description="Align stakeholders without a 40-slide deck."
      />
      <OutcomeCard
        icon={Eye}
        title="Post-decision tracking"
        description="Know when your assumptions change."
      />
    </div>

  </div>
</section>
```

**Outcome Card**:
```tsx
const OutcomeCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white rounded-xl p-6 hover:shadow-md transition-shadow">
    <Icon className="h-6 w-6 text-orange-500 mb-4" />
    <h3 className="font-semibold text-zinc-900 mb-2">{title}</h3>
    <p className="text-sm text-zinc-600">{description}</p>
  </div>
);
```

---

## 9. Comparison Table

```tsx
<section className="py-24 bg-white">
  <div className="max-w-4xl mx-auto px-6">

    <h2 className="text-3xl font-bold text-zinc-900 text-center mb-4">
      Not a template. Not a chatbot. Not a 6-month engagement.
    </h2>
    <p className="text-lg text-zinc-600 text-center mb-12">
      See how Plinth compares.
    </p>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-4 px-4 text-left text-sm font-medium text-zinc-500">Feature</th>
            <th className="py-4 px-4 text-center text-sm font-medium text-zinc-500">Consultants</th>
            <th className="py-4 px-4 text-center text-sm font-medium text-zinc-500">DIY</th>
            <th className="py-4 px-4 text-center text-sm font-medium text-zinc-500">Templates</th>
            <th className="py-4 px-4 text-center text-sm font-medium text-orange-600 bg-orange-50 rounded-t-lg">
              Plinth
            </th>
          </tr>
        </thead>
        <tbody>
          <ComparisonRow
            feature="Does the research"
            values={['yes', 'no', 'no', 'yes']}
          />
          <ComparisonRow
            feature="Evidence before options"
            values={['yes', 'no', 'no', 'yes']}
          />
          <ComparisonRow
            feature="Transparent reasoning"
            values={['sometimes', 'no', 'no', 'yes']}
          />
          <ComparisonRow
            feature="Defensible artifact"
            values={['yes', 'no', 'no', 'yes']}
          />
          <ComparisonRow
            feature="Time to recommendation"
            values={['8 weeks', 'Days', 'Hours', '10 min']}
            highlight="10 min"
          />
          <ComparisonRow
            feature="Cost"
            values={['$50k-500k', 'Your time', 'Free', '$$$']}
          />
        </tbody>
      </table>
    </div>

  </div>
</section>
```

---

## 10. Founder Note (Dark)

```tsx
<section className="py-24 bg-zinc-900">
  <div className="max-w-3xl mx-auto px-6 text-center">

    {/* Large quote marks */}
    <span className="text-6xl text-orange-500/30">"</span>

    <blockquote className="text-2xl text-white font-medium mb-8 -mt-8">
      I've sat in the rooms where these decisions get made — and watched
      smart people make bad calls because they didn't have time to do the work.
      <br /><br />
      Plinth is the tool I wished existed.
    </blockquote>

    <div className="flex items-center justify-center gap-4">
      <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
        P
      </div>
      <div className="text-left">
        <p className="font-medium text-white">Paul Butcher</p>
        <p className="text-sm text-zinc-500">Founder</p>
      </div>
    </div>

  </div>
</section>
```

---

## 11. Final CTA

```tsx
<section className="py-24 bg-gradient-to-b from-white to-orange-50">
  <div className="max-w-2xl mx-auto px-6 text-center">

    <h2 className="text-4xl font-bold text-zinc-900 mb-4">
      Your next big decision is waiting.
    </h2>
    <p className="text-xl text-zinc-600 mb-8">
      Try Plinth free. No credit card. No sales call.
    </p>

    <Button size="lg" className="h-14 px-10 text-lg shadow-lg shadow-orange-500/25">
      Analyze Your First Decision
      <ArrowRight className="ml-2 h-5 w-5" />
    </Button>

  </div>
</section>
```

---

## 12. Footer

```tsx
<footer className="py-16 bg-zinc-900 text-zinc-400">
  <div className="max-w-6xl mx-auto px-6">

    <div className="grid md:grid-cols-4 gap-12 mb-12">

      {/* Brand */}
      <div>
        <Logo className="text-white mb-4" />
        <p className="text-sm">Make better decisions.</p>
      </div>

      {/* Product */}
      <div>
        <h4 className="text-white font-medium mb-4">Product</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="#how-it-works" className="hover:text-white">How it Works</a></li>
          <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
          <li><a href="/changelog" className="hover:text-white">Changelog</a></li>
        </ul>
      </div>

      {/* Company */}
      <div>
        <h4 className="text-white font-medium mb-4">Company</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="/about" className="hover:text-white">About</a></li>
          <li><a href="/blog" className="hover:text-white">Blog</a></li>
          <li><a href="mailto:hello@myplinth.com" className="hover:text-white">Contact</a></li>
        </ul>
      </div>

      {/* Legal */}
      <div>
        <h4 className="text-white font-medium mb-4">Legal</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="/privacy" className="hover:text-white">Privacy</a></li>
          <li><a href="/terms" className="hover:text-white">Terms</a></li>
        </ul>
      </div>

    </div>

    <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-sm">© 2026 Plinth. All rights reserved.</p>
      <div className="flex gap-4">
        <a href="https://twitter.com/plinth" className="hover:text-white">
          <Twitter className="h-5 w-5" />
        </a>
        <a href="https://linkedin.com/company/plinth" className="hover:text-white">
          <Linkedin className="h-5 w-5" />
        </a>
      </div>
    </div>

  </div>
</footer>
```

---

## Animation Summary

| Section | Animation | Trigger |
|---------|-----------|---------|
| Nav | Background fade | Scroll > 100px |
| Hero text | Fade up, staggered | Page load |
| Hero diagram | Complex sequence | Page load |
| Problem cards | Fade + slide right | Scroll into view |
| Insight diagram | Draw lines | Scroll into view |
| Step cards | Fade up, staggered | Scroll into view |
| Outcome cards | Fade up, staggered | Scroll into view |
| Table rows | Fade in sequentially | Scroll into view |
| CTA button | Glow pulse | Always |

---

## File Structure

```
src/
├── app/
│   └── (marketing)/
│       ├── layout.tsx        # Marketing layout (no sidebar)
│       └── page.tsx          # Landing page
├── components/
│   └── marketing/
│       ├── Nav.tsx
│       ├── Hero.tsx
│       ├── HeroDiagram.tsx   # Animated SVG diagram
│       ├── SocialProof.tsx
│       ├── ProblemSection.tsx
│       ├── InsightSection.tsx
│       ├── HowItWorks.tsx
│       ├── OutcomesGrid.tsx
│       ├── ComparisonTable.tsx
│       ├── FounderNote.tsx
│       ├── FinalCTA.tsx
│       └── Footer.tsx
```

---

## Dependencies

```json
{
  "framer-motion": "^10.x",
  "lucide-react": "^0.x"
}
```

---

## Next Steps

1. Create marketing layout (no auth, no sidebar)
2. Build static sections first
3. Add animations with framer-motion
4. Build animated diagram last (most complex)
5. Test responsive behavior
6. Test reduced motion preference
