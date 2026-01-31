# Phase 5: Launch (Week 10)

**Goal**: First customers onboarded, critical bugs fixed.

**Status**: ⏳ Not Started

---

## 5.1 Launch Prep

**🔧 External Setup:**

1. **Configure Custom Domain in Vercel:**
   - Go to Vercel → Your Project → Settings → Domains
   - Add `myplinth.com`
   - Vercel will show required DNS records

2. **Update DNS Records (at your registrar):**
   - Add `A` record: `76.76.21.21` (or Vercel's current IP)
   - Add `CNAME` record: `cname.vercel-dns.com` for `www`
   - Wait for DNS propagation

3. **Update Supabase Auth Redirect URLs:**
   - Go to Supabase → Authentication → URL Configuration
   - Add `https://myplinth.com/**` to Redirect URLs
   - Update Site URL to `https://myplinth.com`

4. **Update Environment Variables:**
   - Update `NEXT_PUBLIC_APP_URL` to `https://myplinth.com`

5. **Verify SSL Certificate:**
   - Vercel auto-provisions SSL
   - Visit `https://myplinth.com` to verify

6. **Test Email Delivery:**
   - Ensure Resend domain is verified
   - Send test invitation email

**Windsurf Prompt:**
```
Final launch preparations:
1. Run full E2E test suite
2. Set up domain (myplinth.com) in Vercel
3. Verify SSL certificate
4. Deploy main branch to production
5. Verify Sentry and analytics are receiving data
6. Create a demo account with completed example analysis

Test all critical paths manually (see checklist below).
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Final QA pass | All P0 flows work | E2E: full regression | |
| 🔧 Domain setup | myplinth.com points to Vercel | N/A | |
| 🔧 SSL verified | HTTPS works, no warnings | Manual: SSL check | |
| 🔧 Production deploy | `main` branch live | N/A | |
| 🔧 Monitoring verified | Sentry receiving, analytics working | Manual: verify | |

---

## 5.2 First Customers

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Create demo account | Seeded with completed analysis | N/A | |
| 🔧 Onboard 3-5 users | Real users complete first analysis | N/A | |
| 🔧 Collect feedback | Document issues, improvements | N/A | |
| 💻 Fix critical bugs | P0 bugs fixed within 24h | N/A | |

---

## Launch Checklist

### Pre-Launch (Day Before)

- [ ] All E2E tests passing
- [ ] All integration tests passing
- [ ] Lighthouse score >80 on all pages
- [ ] Security headers verified
- [ ] Rate limiting tested
- [ ] Sentry configured and receiving test errors
- [ ] Vercel Analytics enabled
- [ ] Production Supabase project created
- [ ] Production environment variables set
- [ ] DNS configured and propagated
- [ ] SSL certificate active

### Launch Day

- [ ] Deploy main branch to production
- [ ] Verify all critical paths work (see below)
- [ ] Monitor Sentry for errors
- [ ] Monitor Vercel Analytics for traffic
- [ ] Create demo account with example analysis

### Post-Launch (First Week)

- [ ] Onboard 3-5 beta users
- [ ] Collect and document feedback
- [ ] Fix any P0 bugs within 24 hours
- [ ] Fix P1 bugs within 48 hours
- [ ] Document P2/P3 for post-MVP backlog

---

## Critical Path Testing

### Happy Path: New User (Evidence-First Flow)

1. Visit myplinth.com
2. Click "Sign Up"
3. Enter email/password
4. Verify email (or skip if disabled)
5. Complete onboarding (name org)
6. Click "Analyze a Decision"
7. **Frame**: Enter decision question, set type/horizon/stakes
8. **Context**: Add constraints (optional), click "Start Analysis"
9. **Watch**: See live progress as AI scans evidence
10. **Review Options**: See AI-generated options with evidence grounding
11. **Review Mapping**: See evidence supporting/contradicting each option
12. **Review Scoring**: See confidence breakdown (6 factors)
13. **Review Recommendation**: See primary + hedge + decision changers
14. View generated brief
15. Share brief publicly
16. Copy and visit share link

### Happy Path: Invited User

1. Receive invitation email
2. Click accept link
3. Create account (or login if existing)
4. Land on dashboard with org already set
5. View shared decisions
6. Add comment on decision

### Error Cases to Test

- [ ] Invalid email format
- [ ] Password too short
- [ ] Duplicate email signup
- [ ] Expired invitation link
- [ ] Invalid share link
- [ ] Session expiry mid-action
- [ ] Network error during analysis
- [ ] AI service timeout (should show partial results)
- [ ] Scraping failures (should continue with available data)

---

## Emergency Contacts

| Service | Issue Type | Contact |
|---------|------------|---------|
| Vercel | Deployment, DNS | support@vercel.com |
| Supabase | Database, Auth | support@supabase.io |
| OpenAI | API limits | platform.openai.com/help |
| Exa | Search API | support@exa.ai |
| Firecrawl | Scraping API | support@firecrawl.dev |
| Resend | Email delivery | support@resend.com |
| Inngest | Background jobs | support@inngest.com |

---

## Rollback Plan

If critical issues discovered post-launch:

1. **Immediate**: Revert Vercel deployment to previous version
   ```bash
   # In Vercel dashboard: Deployments → Previous → Promote to Production
   ```

2. **Database rollback** (if needed):
   - Use Supabase PITR to restore to pre-launch state
   - Document exact timestamp of issue

3. **Communication**:
   - Email affected users
   - Update status page (if exists)

---

## Phase 5 Milestone

**App live, first customers using it.**

### Success Metrics

- [ ] 3-5 users complete their first analysis
- [ ] Average confidence score >60% on recommendations
- [ ] At least 1 decision brief shared
- [ ] User feedback NPS >7
- [ ] Zero P0 bugs after first week
- [ ] <5 P1 bugs after first week

---

## Debugging Notes

*Add notes here as you work through this phase:*

```
<!-- Example:
2024-02-20: Users not receiving verification emails
- Issue: Supabase Site URL still pointing to localhost
- Fix: Updated to https://myplinth.com
-->
```

---

**Previous Phase:** [05-team-polish.md](./05-team-polish.md)
**Reference:** [99-reference.md](./99-reference.md)
