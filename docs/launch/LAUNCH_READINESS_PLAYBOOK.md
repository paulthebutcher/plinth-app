# Launch Readiness Playbook

**For:** Solo founder releasing a SaaS to validate interest
**Goal:** Learn fast, minimize risk, avoid over-engineering
**Timeline:** 1-2 weeks to execute

---

## Executive Summary

You're releasing a product to see if anyone cares. This is not a "launch" in the traditional sense—it's an experiment. Your job is to:

1. Make it safe enough that you won't regret putting it out there
2. Make it observable enough that you'll actually learn something
3. Make it controllable enough that you can pull the plug if needed

Everything else can wait.

---

## Phase 1: Expectation Setting (Day 1)

### Non-Negotiables

**1.1 Add "Preview" / "Beta" / "Early Access" Label**

Put it everywhere users will see it:
- Landing page header
- Dashboard footer
- Email signatures
- Share links

**Why:** Sets expectations. Users forgive bugs in betas. They don't forgive bugs in "products."

**Implementation:**
```tsx
// Simple banner component
<div className="bg-primary-100 text-primary-800 text-sm py-2 px-4 text-center">
  🚧 Early Preview — Things may break. <a href="/feedback">Share feedback</a>
</div>
```

**1.2 Create a "What This Is / What This Isn't" Section**

On your landing page or /about, explicitly state:

| ✅ What Plinth Does | ❌ What Plinth Doesn't Do (Yet) |
|---------------------|--------------------------------|
| Helps you think through strategic decisions | Replace human judgment |
| Surfaces relevant evidence from the web | Guarantee accuracy of sources |
| Generates structured analysis briefs | Provide financial or legal advice |
| Works for product/strategy decisions | Handle highly regulated decisions |

**Why:** Pre-empts misuse, complaints, and disappointment.

**1.3 Add a Simple Disclaimer**

Footer or settings page:

> "Plinth is an AI-powered research assistant. It may produce inaccurate or incomplete information. Always verify important decisions with appropriate experts. This is an early preview—features and availability may change."

**Why:** Legal protection + honest expectation setting.

---

## Phase 2: Safety & Abuse Controls (Days 2-3)

### Non-Negotiables

**2.1 Authentication Required**

✅ Already have this with Supabase Auth.

Verify:
- [ ] Can't access any decision data without login
- [ ] Can't trigger analysis without login
- [ ] Public share links work but don't expose edit capabilities

**2.2 Basic Rate Limiting**

Add rate limiting to expensive operations:

| Endpoint | Limit | Why |
|----------|-------|-----|
| POST /api/decisions | 10/hour per user | Prevent spam creation |
| POST /api/decisions/[id]/analyze | 5/hour per user | AI costs money |
| POST /api/auth/signup | 5/hour per IP | Prevent bot signups |

**Implementation option (simple):**
```typescript
// In-memory rate limiter (good enough for now)
// Add to API routes that trigger AI

const rateLimits = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = rateLimits.get(key)

  if (!entry || now > entry.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= limit) return false
  entry.count++
  return true
}
```

**Why:** One abusive user can cost you hundreds in API bills. This stops that.

**2.3 AI Cost Caps**

Set spending alerts on your AI provider dashboards:
- OpenAI: Set monthly budget limit + alert at 50%
- Exa/Tavily: Check if they have usage limits

**Why:** You will forget to check. Automated alerts save you.

### Nice-to-Haves (Skip for Now)

- ❌ CAPTCHA on signup (wait until you see bot abuse)
- ❌ Email verification required (adds friction, not worth it yet)
- ❌ IP-based blocking (overkill for preview)

---

## Phase 3: Error Visibility & Reliability (Days 3-4)

### Non-Negotiables

**3.1 Error Monitoring (Sentry)**

You need to know when things break before users tell you.

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Configure to:
- Capture all unhandled errors
- Capture failed API routes
- NOT capture user PII in breadcrumbs

**Why:** Without this, you're flying blind. Users won't report most errors—they'll just leave.

**3.2 Inngest Dashboard Monitoring**

Inngest Cloud gives you visibility into:
- Failed function runs
- Stuck jobs
- Event flow

**Action:** Check Inngest dashboard once daily during first week.

**3.3 Simple Health Check**

Create `/api/health` that returns:
```json
{
  "status": "ok",
  "timestamp": "2024-02-01T...",
  "checks": {
    "database": "ok",
    "inngest": "ok"
  }
}
```

**Why:** Lets you quickly verify the app is running. Can be used for uptime monitoring later.

### Nice-to-Haves (Skip for Now)

- ❌ Uptime monitoring service (just check manually for now)
- ❌ Detailed performance metrics
- ❌ Log aggregation service

---

## Phase 4: Analytics & Usage Signal (Days 4-5)

### Non-Negotiables

**4.1 The Only Metrics That Matter**

Track these and nothing else:

| Metric | What It Tells You | How to Track |
|--------|-------------------|--------------|
| **Signups** | Are people curious? | Database count |
| **Analyses Started** | Are they trying the core feature? | Database count |
| **Analyses Completed** | Does it work well enough? | Database count where status = 'completed' |
| **Briefs Viewed** | Do they care about output? | Simple page view event |
| **Briefs Shared** | Is it valuable enough to share? | Database count where is_shared = true |
| **Return Visits** | Do they come back? | Vercel Analytics |

**4.2 Vercel Analytics (Free Tier)**

Enable in Vercel dashboard. Gives you:
- Page views
- Unique visitors
- Top pages
- Referrers

**Why:** Zero-config, privacy-friendly, answers "is anyone using this?"

**4.3 Simple Event Tracking (Optional but Valuable)**

If you want slightly more detail, add PostHog or Plausible. Track only:
- `analysis_started`
- `analysis_completed`
- `brief_shared`

**Do NOT track:**
- Every click
- Scroll depth
- Mouse movements
- Session recordings (yet)

**Why:** You need signal, not noise. More data ≠ better decisions at this stage.

---

## Phase 5: Feedback Loops (Days 5-6)

### Non-Negotiables

**5.1 One-Click Feedback Widget**

Add a persistent "Feedback" button that opens a simple form:

```
How's it going?
[ 😕 Frustrated ] [ 😐 Meh ] [ 🙂 Good ] [ 🤩 Love it ]

What's on your mind? (optional)
[                    ]

[Submit]
```

Store in database or send to Notion/Airtable.

**Why:** Captures sentiment at the moment of truth. Optional text prevents empty submissions while not requiring effort.

**5.2 Exit Intent for Abandoned Analyses**

If someone starts a decision but doesn't complete analysis:
- Don't interrupt them
- Send a follow-up email 24h later: "You started analyzing [decision]. Want to pick up where you left off? Hit reply if you got stuck."

**Why:** People who started but didn't finish are your highest-value feedback source.

**5.3 Email for Completers**

After someone views their first brief:
- Wait 2-3 days
- Send: "You used Plinth to analyze [decision]. Was it helpful? Reply with your honest take—I read every response."

**Why:** Post-usage reflection is more valuable than in-moment feedback.

### Nice-to-Haves (Skip for Now)

- ❌ NPS surveys (too formal for preview)
- ❌ In-app surveys (too interruptive)
- ❌ User interviews (do these after you have 10+ active users)

---

## Phase 6: Onboarding (Days 6-7)

### Non-Negotiables

**6.1 First-Run Must Accomplish**

After signup, the user must understand:
1. What Plinth does (30 seconds)
2. How to start their first analysis (obvious CTA)
3. What to expect (timing, output format)

**Implementation:** Simple welcome modal or page:

```
Welcome to Plinth 👋

Plinth helps you make better strategic decisions by:
1. Scanning the web for relevant evidence
2. Generating structured options
3. Producing a decision brief you can share

Your first analysis takes 5-8 minutes to run.

[Analyze Your First Decision →]
```

**6.2 Empty State That Guides**

Dashboard with no decisions should show:

```
No decisions yet

Plinth works best for strategic questions like:
• "Should we expand into the EU market?"
• "Should we build feature X or Y?"
• "Should we acquire company Z?"

[+ Analyze a Decision]
```

**Why:** Reduces "what do I do?" confusion.

**6.3 Example Decision (Optional but Powerful)**

Pre-populate a demo decision with completed analysis that users can explore.

**Why:** Shows the end state. People understand better by seeing than reading.

---

## Phase 7: Data & Privacy Hygiene (Day 7)

### Non-Negotiables

**7.1 Privacy Policy (Required)**

You need one even without payments. Use a generator like:
- Termly (free tier)
- Iubenda (free tier)
- Or write a simple one covering:
  - What data you collect (email, decision content)
  - How you use it (provide the service, improve product)
  - Who you share with (AI providers for analysis)
  - How to delete (email you)

Link in footer.

**7.2 Terms of Service (Required)**

Cover:
- This is a preview/beta
- No guarantees of accuracy
- You can terminate accounts
- Content is user's responsibility
- AI-generated content disclaimer

**7.3 Data Deletion Path**

Users must be able to delete their data. Options:
- **Minimum:** "Email support@yourapp.com to delete your account"
- **Better:** Settings page with "Delete Account" button

**Why:** Legal requirement in most jurisdictions. Also just respectful.

### Nice-to-Haves (Skip for Now)

- ❌ GDPR cookie consent banner (no tracking cookies = no banner needed)
- ❌ Data processing agreements
- ❌ SOC2 compliance

---

## Phase 8: Control & Shutdown Readiness (Day 8)

### Non-Negotiables

**8.1 Feature Flags (Simple Version)**

Add environment variables that let you disable features:

```env
FEATURE_SIGNUPS_ENABLED=true
FEATURE_ANALYSIS_ENABLED=true
FEATURE_SHARING_ENABLED=true
```

```typescript
// In your code
if (process.env.FEATURE_SIGNUPS_ENABLED !== 'true') {
  return NextResponse.json({ error: 'Signups temporarily disabled' }, { status: 503 })
}
```

**Why:** If something goes wrong, you can disable it in 30 seconds via Vercel dashboard.

**8.2 Maintenance Mode**

Create a simple maintenance page and a flag to show it:

```env
MAINTENANCE_MODE=false
```

When true, all routes redirect to `/maintenance`:

```
🔧 Plinth is temporarily down for maintenance.

We'll be back shortly. Follow @yourtwitter for updates.
```

**8.3 Database Backup Awareness**

Know how to restore your database:
- Supabase has Point-in-Time Recovery
- Know where to find it: Dashboard → Database → Backups

**Why:** If you accidentally corrupt data, you need to recover.

**8.4 "Kill All Sessions" Capability**

If you discover a security issue:
- Supabase: Auth → Users → can revoke all sessions
- Or: Change JWT secret (nuclear option, logs everyone out)

---

## Phase 9: Success Criteria (Define Before Launch)

### Non-Negotiables

**9.1 Define Your Experiment**

Before you launch, write down:

**Hypothesis:** "People will use an AI tool to help them make better strategic decisions."

**Success Signals (First 30 Days):**
- [ ] 50+ signups
- [ ] 20+ analyses completed
- [ ] 5+ briefs shared
- [ ] 3+ unprompted positive feedback messages
- [ ] 1+ person asks "when can I pay for this?"

**Failure Signals:**
- [ ] <10 signups despite reasonable distribution
- [ ] <5 completed analyses (tool doesn't work or isn't compelling)
- [ ] Negative feedback about core value prop (not bugs)

**9.2 What Signals Matter**

| Signal | Weight | Notes |
|--------|--------|-------|
| Completed analyses | **High** | Core engagement metric |
| Return usage (2+ analyses) | **Very High** | Retention signal |
| Unprompted shares/referrals | **Very High** | Product-market fit signal |
| Bug reports | Medium | Shows engagement |
| Feature requests | Low | Often noise |
| Complaints about speed | Low | Expected for AI |

**9.3 What to Ignore**

- Vanity metrics (page views, time on site)
- One-off negative feedback (sample size of 1)
- Feature requests from non-users
- Comparisons to enterprise tools
- "Why don't you have X?" from people who didn't try it

---

## Phase 10: Emotional & Decision Discipline (Ongoing)

### Non-Negotiables

**10.1 Set a Review Cadence**

- **Daily (Week 1):** Check Sentry for errors, Inngest for failures
- **Weekly:** Review metrics, read all feedback
- **Don't:** Check analytics hourly, refresh signup count constantly

**Why:** Constant checking leads to overreaction. Batched review leads to pattern recognition.

**10.2 The "Wait 48 Hours" Rule**

Before making any change based on feedback:
- Wait 48 hours
- See if the pattern repeats
- Ask: "Would this feedback change if I explained better?"

**Exceptions:** Security issues, data loss bugs, complete feature breakage.

**10.3 Feedback Triage Framework**

When you receive feedback, categorize it:

| Category | Action | Example |
|----------|--------|---------|
| **Bug** | Fix if reproducible | "Analysis stuck at 40%" |
| **Confusion** | Improve copy/UX | "I didn't know what to enter" |
| **Missing table stakes** | Add to backlog | "Can't delete a decision" |
| **Feature request** | Note and ignore (for now) | "Add Slack integration" |
| **Wrong user** | Ignore | "This should work for legal contracts" |

**10.4 Avoid These Traps**

❌ **Don't** pivot based on one user's feedback
❌ **Don't** add features before fixing core bugs
❌ **Don't** respond to feedback immediately (draft, wait, send)
❌ **Don't** compare Day 1 metrics to your imagination
❌ **Don't** apologize for being in beta (you said it was beta)

✅ **Do** thank people for feedback, even negative
✅ **Do** ask clarifying questions before assuming
✅ **Do** celebrate small wins (first share, first return user)
✅ **Do** document learnings, not just metrics

---

## Launch Checklist

### Week 1: Foundation

- [ ] Add "Preview" banner to app
- [ ] Add "What This Is/Isn't" to landing page
- [ ] Add disclaimer to footer
- [ ] Implement basic rate limiting on analyze endpoint
- [ ] Set up OpenAI spending alerts
- [ ] Set up Sentry error monitoring
- [ ] Create /api/health endpoint
- [ ] Enable Vercel Analytics

### Week 2: Polish & Prepare

- [ ] Add feedback widget
- [ ] Set up post-analysis email (manual or automated)
- [ ] Improve empty state on dashboard
- [ ] Add Privacy Policy
- [ ] Add Terms of Service
- [ ] Add "Delete Account" option or instructions
- [ ] Test feature flag toggles
- [ ] Create maintenance page
- [ ] Write down success criteria
- [ ] Tell 3-5 people you're launching

### Launch Day

- [ ] Verify production deploy is working
- [ ] Check Sentry is receiving (throw test error)
- [ ] Check Inngest is processing
- [ ] Do one full analysis yourself
- [ ] Post where your target users are
- [ ] Stop refreshing analytics

### Week 1 Post-Launch

- [ ] Daily: Check Sentry, Inngest, respond to urgent issues
- [ ] Read all feedback (but don't act yet)
- [ ] Note patterns, not individual data points
- [ ] Fix only critical bugs

### Week 4 Review

- [ ] Review success criteria
- [ ] Decide: double down, pivot, or pause
- [ ] Thank early users personally

---

## Quick Reference: What's Required vs Optional

| Item | Required | Optional |
|------|----------|----------|
| Auth on all data access | ✅ | |
| Rate limiting on AI endpoints | ✅ | |
| Error monitoring (Sentry) | ✅ | |
| Basic analytics | ✅ | |
| Privacy Policy | ✅ | |
| Terms of Service | ✅ | |
| Feature flags | ✅ | |
| CAPTCHA | | ❌ (wait for abuse) |
| Email verification | | ❌ (adds friction) |
| NPS surveys | | ❌ (too formal) |
| User interviews | | ❌ (wait for users) |
| Session recordings | | ❌ (overkill) |
| GDPR cookie banner | | ❌ (no tracking cookies) |

---

## Final Thought

This is an experiment, not a launch. Your goal is to learn whether anyone cares, not to build a perfect product.

Ship something safe enough that you won't be embarrassed, observable enough that you'll learn, and controllable enough that you can adjust.

Then watch, listen, and iterate.

Good luck. 🚀
