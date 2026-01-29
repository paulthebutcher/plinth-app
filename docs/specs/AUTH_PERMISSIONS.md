# Authentication & Permissions Specification

## Overview

Plinth uses Supabase Auth for authentication with organization-based multi-tenancy. Data isolation is enforced at the database level via Row Level Security (RLS).

---

## Authentication Methods

### Supported Methods (MVP)

| Method | Priority | Implementation |
|--------|----------|----------------|
| Email + Password | Required | Supabase Auth native |
| Google OAuth | Required | Supabase Auth native |
| Magic Link | Nice to have | Supabase Auth native |

### Not Supported (MVP)

- SSO/SAML (Enterprise feature, post-MVP)
- Apple/Microsoft OAuth (can add later)
- Phone/SMS auth

---

## User Flows

### 1. Sign Up (New User, No Invite)

```
┌─────────────────────────────────────────────────────────────────┐
│                         SIGN UP FLOW                             │
│                                                                  │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │  Landing    │     │  Sign Up    │     │  Verify     │       │
│  │   Page      │ ──▶ │   Form      │ ──▶ │   Email     │       │
│  └─────────────┘     └─────────────┘     └─────────────┘       │
│                             │                   │                │
│                             │                   │                │
│                             ▼                   ▼                │
│                      ┌─────────────┐     ┌─────────────┐       │
│                      │   Google    │     │  Create     │       │
│                      │   OAuth     │ ──▶ │   Org       │       │
│                      └─────────────┘     └─────────────┘       │
│                                                │                │
│                                                ▼                │
│                                         ┌─────────────┐        │
│                                         │  Onboarding │        │
│                                         │   Flow      │        │
│                                         └─────────────┘        │
│                                                │                │
│                                                ▼                │
│                                         ┌─────────────┐        │
│                                         │  Dashboard  │        │
│                                         └─────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

**Steps:**

1. **Landing Page** → User clicks "Get Started" or "Sign Up"

2. **Sign Up Form**
   ```
   ┌────────────────────────────────────────┐
   │           Create your account          │
   │                                        │
   │  ┌──────────────────────────────────┐ │
   │  │ 🔵 Continue with Google          │ │
   │  └──────────────────────────────────┘ │
   │                                        │
   │  ──────────── or ────────────         │
   │                                        │
   │  Full name                             │
   │  ┌──────────────────────────────────┐ │
   │  │                                  │ │
   │  └──────────────────────────────────┘ │
   │                                        │
   │  Work email                            │
   │  ┌──────────────────────────────────┐ │
   │  │                                  │ │
   │  └──────────────────────────────────┘ │
   │                                        │
   │  Password                              │
   │  ┌──────────────────────────────────┐ │
   │  │                                  │ │
   │  └──────────────────────────────────┘ │
   │  Min 8 characters                      │
   │                                        │
   │  ┌──────────────────────────────────┐ │
   │  │        Create Account            │ │
   │  └──────────────────────────────────┘ │
   │                                        │
   │  Already have an account? Log in      │
   └────────────────────────────────────────┘
   ```

3. **Email Verification** (if email signup)
   - Send verification email via Supabase
   - Show "Check your email" screen
   - Link in email redirects to `/auth/callback?type=signup`

4. **Create Organization**
   ```
   ┌────────────────────────────────────────┐
   │      Set up your organization          │
   │                                        │
   │  Organization name                     │
   │  ┌──────────────────────────────────┐ │
   │  │ Acme Corp                        │ │
   │  └──────────────────────────────────┘ │
   │  This is how your team will see it    │
   │                                        │
   │  ┌──────────────────────────────────┐ │
   │  │          Continue                │ │
   │  └──────────────────────────────────┘ │
   └────────────────────────────────────────┘
   ```

5. **Onboarding Flow** (see ONBOARDING.md)

6. **Dashboard** → Ready to use

**Backend Actions:**
```typescript
// On successful auth (email verified or OAuth)
async function handleNewUser(user: AuthUser) {
  // 1. Create user record
  const userData = await supabase.from('users').insert({
    id: user.id,
    email: user.email,
    full_name: user.user_metadata.full_name,
    role: 'admin', // First user is admin
  });

  // 2. Create organization
  const org = await supabase.from('organizations').insert({
    name: 'My Organization', // Will prompt to change
    slug: generateSlug(user.email),
    plan: 'trial',
  });

  // 3. Link user to org
  await supabase.from('users').update({
    org_id: org.id
  }).eq('id', user.id);

  // 4. Redirect to onboarding
  redirect('/onboarding');
}
```

---

### 2. Sign Up (Via Invitation)

```
┌─────────────────────────────────────────────────────────────────┐
│                      INVITED USER FLOW                           │
│                                                                  │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │  Email      │     │  Accept     │     │  Set        │       │
│  │  Invite     │ ──▶ │  Invite     │ ──▶ │  Password   │       │
│  └─────────────┘     └─────────────┘     └─────────────┘       │
│                             │                   │                │
│                             │                   │                │
│                             ▼                   ▼                │
│                      ┌─────────────┐     ┌─────────────┐       │
│                      │   Google    │     │  Dashboard  │       │
│                      │   OAuth     │ ──▶ │  (in org)   │       │
│                      └─────────────┘     └─────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

**Email Content:**
```
Subject: [Name] invited you to join [Org Name] on Plinth

Hi,

[Inviter Name] has invited you to join [Org Name] on Plinth,
a decision-quality platform for strategic leaders.

[Accept Invitation Button]

This invitation expires in 7 days.

---
Plinth - Make better decisions, faster.
```

**Accept Invite Page** (`/invite/[token]`)
```
┌────────────────────────────────────────┐
│  You've been invited to join           │
│  Acme Corp on Plinth                   │
│                                        │
│  Invited by: Jane Smith                │
│  Your role: Member                     │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ 🔵 Continue with Google          │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ──────────── or ────────────         │
│                                        │
│  Create a password                     │
│  ┌──────────────────────────────────┐ │
│  │                                  │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │      Accept & Join Team         │ │
│  └──────────────────────────────────┘ │
└────────────────────────────────────────┘
```

**Backend Actions:**
```typescript
async function handleInviteAccept(token: string, user: AuthUser) {
  // 1. Validate invitation
  const invite = await supabase
    .from('invitations')
    .select('*')
    .eq('id', token)
    .single();

  if (!invite || invite.expires_at < new Date()) {
    throw new Error('Invalid or expired invitation');
  }

  // 2. Create or update user
  const existingUser = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (existingUser) {
    // User exists - update org (they're switching orgs)
    await supabase.from('users').update({
      org_id: invite.org_id,
      role: invite.role
    }).eq('id', user.id);
  } else {
    // New user
    await supabase.from('users').insert({
      id: user.id,
      email: invite.email,
      org_id: invite.org_id,
      role: invite.role
    });
  }

  // 3. Delete invitation
  await supabase.from('invitations').delete().eq('id', token);

  // 4. Redirect to dashboard
  redirect('/');
}
```

---

### 3. Log In (Returning User)

```
┌────────────────────────────────────────┐
│           Welcome back                 │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ 🔵 Continue with Google          │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ──────────── or ────────────         │
│                                        │
│  Email                                 │
│  ┌──────────────────────────────────┐ │
│  │                                  │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Password                              │
│  ┌──────────────────────────────────┐ │
│  │                                  │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │           Log In                 │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Forgot password?                      │
│  Don't have an account? Sign up       │
└────────────────────────────────────────┘
```

---

### 4. Password Reset

```
User clicks "Forgot password?"
        │
        ▼
┌─────────────────────────────────┐
│  Reset your password            │
│                                 │
│  Email                          │
│  ┌───────────────────────────┐ │
│  │                           │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │   Send Reset Link         │ │
│  └───────────────────────────┘ │
└─────────────────────────────────┘
        │
        ▼
Email sent with reset link
        │
        ▼
User clicks link → /auth/callback?type=recovery
        │
        ▼
┌─────────────────────────────────┐
│  Set new password               │
│                                 │
│  New password                   │
│  ┌───────────────────────────┐ │
│  │                           │ │
│  └───────────────────────────┘ │
│                                 │
│  Confirm password               │
│  ┌───────────────────────────┐ │
│  │                           │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │    Update Password        │ │
│  └───────────────────────────┘ │
└─────────────────────────────────┘
        │
        ▼
Redirect to Dashboard
```

---

## Roles & Permissions

### Role Definitions

| Role | Description | Typical User |
|------|-------------|--------------|
| **Admin** | Full access, can manage team | Org owner, team lead |
| **Member** | Can create and edit decisions | Individual contributor |
| **Viewer** | Read-only access | Stakeholder, exec reviewer |

### Permission Matrix

| Action | Admin | Member | Viewer |
|--------|-------|--------|--------|
| **Decisions** | | | |
| Create decision | ✅ | ✅ | ❌ |
| Edit own decision | ✅ | ✅ | ❌ |
| Edit any decision | ✅ | ❌ | ❌ |
| View all decisions | ✅ | ✅ | ✅ |
| Delete decision | ✅ | Own only | ❌ |
| Generate outputs | ✅ | ✅ | ❌ |
| Share outputs | ✅ | ✅ | ❌ |
| **Team** | | | |
| Invite members | ✅ | ❌ | ❌ |
| Remove members | ✅ | ❌ | ❌ |
| Change roles | ✅ | ❌ | ❌ |
| View team list | ✅ | ✅ | ✅ |
| **Organization** | | | |
| Edit org settings | ✅ | ❌ | ❌ |
| View billing | ✅ | ❌ | ❌ |
| Delete organization | ✅ | ❌ | ❌ |
| **AI Features** | | | |
| Run competitor analysis | ✅ | ✅ | ❌ |
| Run evidence search | ✅ | ✅ | ❌ |

### RLS Policies

```sql
-- Users can only see/edit their own org's data
CREATE POLICY "org_isolation" ON decisions
  FOR ALL USING (
    org_id = (SELECT org_id FROM users WHERE id = auth.uid())
  );

-- Viewers can only read
CREATE POLICY "viewer_read_only" ON decisions
  FOR SELECT USING (
    org_id = (SELECT org_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "viewer_no_write" ON decisions
  FOR INSERT WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'member')
  );

-- Only admins can manage team
CREATE POLICY "admin_manage_invites" ON invitations
  FOR ALL USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
    AND org_id = (SELECT org_id FROM users WHERE id = auth.uid())
  );
```

---

## Session Management

### Session Lifecycle

```typescript
// Supabase handles session management
// Sessions are stored in localStorage/cookies

const sessionConfig = {
  // Session expires after 7 days of inactivity
  expiresIn: 60 * 60 * 24 * 7, // 7 days in seconds

  // Refresh token before expiry
  refreshThreshold: 60 * 60, // Refresh if < 1 hour remaining
};
```

### Auth State Management

```typescript
// Client-side auth state
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  organization: Organization | null;
  isLoading: boolean;
  error: Error | null;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  organization: null,
  isLoading: true,
  error: null,
}));

// Listen to auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    loadUserAndOrg(session.user.id);
  }
  if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null, organization: null });
  }
});
```

---

## Security Considerations

### Password Requirements

```typescript
const passwordRules = {
  minLength: 8,
  // No complexity requirements for MVP (reduces friction)
  // Can add later: requireUppercase, requireNumber, etc.
};
```

### Rate Limiting

```typescript
// Implemented at Supabase level + API route level
const rateLimits = {
  login: { attempts: 5, windowMinutes: 15 },
  signup: { attempts: 3, windowMinutes: 60 },
  passwordReset: { attempts: 3, windowMinutes: 60 },
  apiCalls: { attempts: 100, windowMinutes: 1 },
};
```

### Security Headers

```typescript
// next.config.js
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];
```

### Data Isolation Verification

```typescript
// Every API route should verify org membership
async function verifyOrgAccess(userId: string, resourceOrgId: string) {
  const user = await supabase
    .from('users')
    .select('org_id')
    .eq('id', userId)
    .single();

  if (user.org_id !== resourceOrgId) {
    throw new ForbiddenError('Access denied');
  }
}
```

---

## Implementation Checklist

### Supabase Setup
- [ ] Enable email auth
- [ ] Enable Google OAuth
- [ ] Configure email templates
- [ ] Set up redirect URLs
- [ ] Configure session settings

### Database
- [ ] Create users table with RLS
- [ ] Create organizations table with RLS
- [ ] Create invitations table with RLS
- [ ] Set up foreign key relationships
- [ ] Create auth trigger for new users

### API Routes
- [ ] `/api/auth/callback` - Handle OAuth/magic link callbacks
- [ ] `/api/auth/invite` - Process invitation acceptance
- [ ] `/api/organizations/members` - CRUD for team members
- [ ] `/api/organizations/invitations` - Manage invitations

### Frontend
- [ ] Login page
- [ ] Signup page
- [ ] Invite acceptance page
- [ ] Password reset flow
- [ ] Team settings page
- [ ] Auth state provider
