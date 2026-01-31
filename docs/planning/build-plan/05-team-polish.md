# Phase 4: Team & Polish (Weeks 8-9)

**Goal**: Multi-user collaboration, UX refinement, production readiness.

**Status**: ⏳ Not Started

> **Architecture Reference**: See [DESIGN_SPEC_V2.md](../../design/DESIGN_SPEC_V2.md) for component specs.

---

## 4.1 Team Management (Week 8)

**🔧 External Setup (do this first):**

1. **Create Resend Account:**
   - Go to resend.com → Sign up
   - Get API key from dashboard
   - Add to `.env.local`:
     ```env
     RESEND_API_KEY=re_...
     ```

2. **Verify Email Domain (recommended for production):**
   - Go to Resend → Domains → Add Domain
   - Add your domain (e.g., `myplinth.com`)
   - Add the DNS records Resend provides
   - Wait for verification

3. **Add to Vercel Environment Variables**

**Windsurf Prompt:**
```
Read docs/design/DESIGN_SPEC_V2.md (Settings pages).

Create team management:
1. app/(dashboard)/settings/team/page.tsx - Team settings page
2. components/settings/member-list.tsx - List members with roles
3. components/settings/invite-member-modal.tsx - Invite form
4. lib/email/invitation.ts - Email template using Resend
5. app/(auth)/invite/[token]/page.tsx - Accept invitation page
6. app/api/organizations/members/route.ts - List/invite members
7. app/api/organizations/members/[id]/route.ts - Update/remove member
8. app/api/invitations/[token]/accept/route.ts - Accept invitation

Roles: admin, member, viewer
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Team settings page | List members, roles | Component: list | |
| 💻 Invite member flow | Email input, role select, send | E2E: invite flow | |
| 💻 Invitation email | Sends via Resend | Integration: email | |
| 💻 Accept invitation | Joins org, lands on dashboard | E2E: accept flow | |
| 💻 Remove member | Admin can remove (not self) | Integration: removal | |
| 💻 Change role | Admin can change member role | Integration: role change | |

---

## 4.2 Comments (Week 8)

**Windsurf Prompt:**
```
Read docs/design/DESIGN_SPEC_V2.md (Brief page).

Create commenting system:
1. components/collaboration/comments-panel.tsx - Collapsible sidebar
2. components/collaboration/comment-thread.tsx - Threaded display
3. components/collaboration/comment-form.tsx - Add comment input
4. app/api/decisions/[id]/comments/route.ts - CRUD endpoints

Comments can target: decision (general), evidence, option, recommendation
Support threaded replies via parent_id.
Show commenter name and timestamp.
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Comments panel | Collapsible sidebar/panel | Component: panel | |
| 💻 Add comment | Text input, submit | Component: form | |
| 💻 Reply to comment | Threaded replies | Component: threading | |
| 💻 Delete comment | Author/admin can delete | Integration: delete | |
| 💻 Comment on element | Target specific item | Component: targeting | |

---

## 4.3 Onboarding (Week 8)

**Windsurf Prompt:**
```
Read docs/design/DESIGN_SPEC_V2.md (Onboarding flow).

Create onboarding experience for v2 flow:
1. components/onboarding/welcome-screen.tsx - Post-signup welcome
2. components/onboarding/org-setup-form.tsx - Name org, role
3. components/onboarding/first-decision-guide.tsx - Guide through framing
4. lib/utils/onboarding-state.ts - Track completion in user metadata

Onboarding steps:
1. Welcome (explain value prop)
2. Organization setup (name org)
3. Start first analysis (enter decision question)
4. Watch analysis run (explain what's happening)
5. Review results (tour the output)
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Welcome screen | Post-signup welcome | Component: screen | |
| 💻 Org setup screen | Name org | Component: form | |
| 💻 First decision guided | Walk through framing | E2E: onboarding | |
| 💻 Analysis explainer | Explain what AI is doing | Component: explainer | |
| 💻 Track onboarding state | Store in user metadata | Integration: state | |

---

## 4.4 UI Polish (Week 8-9)

**Windsurf Prompt:**
```
Read docs/design/DESIGN_SPEC_V2.md (Design system section).

Polish the UI across the app:
1. Add empty states to all list components
2. Add skeleton loading states to all pages
3. Implement toast notifications for success/error
4. Verify dark mode works everywhere
5. Add keyboard shortcuts for common actions
6. Test and fix responsive layout for tablet

Create reusable components:
- components/ui/empty-state.tsx
- components/ui/skeleton-*.tsx
- components/ui/error-boundary.tsx
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Empty states | All sections have helpful empty states | Component: empty | |
| 💻 Loading skeletons | All pages have skeleton loading | Component: skeletons | |
| 💻 Error handling | User-friendly error messages | Component: errors | |
| 💻 Responsive design | Works on tablet | Manual: responsive | |
| 💻 Keyboard navigation | Tab order, shortcuts | Manual: keyboard | |
| 💻 Dark mode | Theme applied consistently | Component: theme | |

---

## 4.5 Performance & Monitoring (Week 9)

**🔧 External Setup:**

1. **Create Sentry Account:**
   - Go to sentry.io → Sign up
   - Create a new project (Next.js)
   - Get your DSN
   - Add to `.env.local`:
     ```env
     NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
     SENTRY_AUTH_TOKEN=sntrys_...
     ```

2. **Enable Vercel Analytics:**
   - Go to Vercel → Your Project → Analytics tab
   - Click "Enable"

3. **Add Sentry to Vercel Environment Variables**

**Windsurf Prompt:**
```
Set up monitoring and optimize performance:
1. Set up Sentry for error tracking (lib/sentry.ts)
2. Add Vercel Analytics
3. Review and optimize database queries
4. Configure React Query caching
5. Run Lighthouse audit and fix issues

Create:
- lib/sentry.ts - Sentry initialization
- instrumentation.ts - Next.js instrumentation
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 🔧 Set up Sentry | Errors reported | Integration: capture | |
| 🔧 Set up Vercel Analytics | Page views tracked | N/A | |
| 💻 Optimize queries | No N+1 queries | Integration: query | |
| 💻 Add caching | React Query tuned | Manual: cache | |
| 💻 Lighthouse audit | Score >80 | Manual: Lighthouse | |

---

## 4.6 Production Readiness (Week 9)

**🔧 External Setup:**

1. **Enable Supabase Point-in-Time Recovery (PITR):**
   - Go to Supabase Dashboard → Database → Backups
   - Enable PITR (requires Pro plan - $25/month)

2. **Create Production Supabase Project (if not done):**
   - Create separate `plinth-production` project
   - Run migrations: `npx supabase db push`
   - Update Vercel production environment variables

3. **Review API Key Permissions:**
   - OpenAI: Set spending limits
   - Exa: Check usage limits
   - Firecrawl: Check usage limits

**Windsurf Prompt:**
```
Prepare for production:
1. Set up environment variables properly (staging vs prod)
2. Implement rate limiting
3. Add security headers (CSP, HSTS, etc.)
4. Create /privacy and /terms pages

Create:
- middleware.ts updates for security headers
- app/(public)/privacy/page.tsx
- app/(public)/terms/page.tsx
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 🔧 Environment config | Staging vs prod separated | N/A | |
| 🔧 Database backups | Supabase PITR enabled | N/A | |
| 💻 Rate limiting | Implemented | Integration: limits | |
| 💻 Security headers | CSP, HSTS configured | Manual: security | |
| 💻 Privacy policy page | `/privacy` exists | N/A | |
| 💻 Terms of service page | `/terms` exists | N/A | |

---

## Phase 4 Milestone

**App production-ready. Multi-user works. Polish complete.**

### Checklist
- [ ] Can invite team members via email
- [ ] Invitation emails send successfully
- [ ] New members can accept invitations
- [ ] Roles (admin/member/viewer) work correctly
- [ ] Comments work on decisions
- [ ] Threaded replies work
- [ ] Onboarding flow guides new users through analysis
- [ ] All empty states implemented
- [ ] All loading states implemented
- [ ] Error handling is user-friendly
- [ ] Sentry capturing errors
- [ ] Vercel Analytics tracking
- [ ] Lighthouse score >80
- [ ] Rate limiting active
- [ ] Security headers configured
- [ ] Privacy/Terms pages exist

---

## Debugging Notes

*Add notes here as you work through this phase:*

```
<!-- Example:
2024-02-15: Invitation emails going to spam
- Issue: No SPF/DKIM records
- Fix: Added DNS records from Resend
-->
```

---

**Previous Phase:** [04-outputs.md](./04-outputs.md)
**Next Phase:** [06-launch.md](./06-launch.md)
