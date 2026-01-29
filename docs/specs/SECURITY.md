# Security Specification

## Overview

Plinth handles sensitive strategic decision data for enterprises. This document defines security requirements and implementation.

---

## Security Principles

1. **Defense in depth** - Multiple layers of protection
2. **Least privilege** - Minimum access needed
3. **Secure by default** - Safe configurations out of the box
4. **Audit everything** - Comprehensive logging for compliance

---

## Authentication

### Supabase Auth Configuration

```typescript
// Secure auth settings
const authConfig = {
  // Session settings
  sessionDuration: 24 * 60 * 60,  // 24 hours
  refreshTokenRotation: true,

  // Password policy
  passwordMinLength: 8,
  passwordRequireUppercase: true,
  passwordRequireNumber: true,

  // Rate limiting
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60,  // 15 minutes

  // Email settings
  emailConfirmationRequired: true,

  // OAuth (future)
  allowedOAuthProviders: ['google', 'microsoft']  // Post-MVP
};
```

### JWT Security

- JWTs signed with RS256 (Supabase managed)
- Short-lived access tokens (1 hour)
- Refresh tokens rotated on use
- Tokens validated server-side on every request

### Session Management

```typescript
// Session validation middleware
async function validateSession(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new UnauthorizedError('No token provided');
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new UnauthorizedError('Invalid or expired session');
  }

  // Verify user still has org access
  const { data: membership } = await supabase
    .from('users')
    .select('org_id, role')
    .eq('id', user.id)
    .single();

  if (!membership) {
    throw new UnauthorizedError('User not found in organization');
  }

  return { user, orgId: membership.org_id, role: membership.role };
}
```

---

## Authorization

### Row Level Security (RLS)

All tables have RLS enabled. Policies ensure org-level isolation.

```sql
-- Base policy pattern
CREATE POLICY "org_isolation" ON [table]
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM users WHERE id = auth.uid()
    )
  );

-- For tables without org_id, use decision_id
CREATE POLICY "org_isolation_via_decision" ON [table]
  FOR ALL USING (
    decision_id IN (
      SELECT id FROM decisions WHERE org_id IN (
        SELECT org_id FROM users WHERE id = auth.uid()
      )
    )
  );
```

### Role-Based Access

| Resource | Admin | Member | Viewer |
|----------|-------|--------|--------|
| View decisions | ✓ | ✓ | ✓ |
| Create decisions | ✓ | ✓ | ✗ |
| Edit decisions | ✓ | ✓ (own) | ✗ |
| Delete decisions | ✓ | ✓ (own) | ✗ |
| Invite members | ✓ | ✗ | ✗ |
| Remove members | ✓ | ✗ | ✗ |
| Org settings | ✓ | ✗ | ✗ |

### API Authorization

```typescript
// Authorization middleware
function requireRole(allowedRoles: Role[]) {
  return async (req: Request, context: AuthContext) => {
    if (!allowedRoles.includes(context.role)) {
      throw new ForbiddenError(`Role ${context.role} not allowed`);
    }
  };
}

// Usage
router.delete('/api/organizations/members/:id',
  requireRole(['admin']),
  deleteMemberHandler
);
```

---

## Data Protection

### Data at Rest

- Supabase encrypts all data at rest (AES-256)
- Database backups encrypted
- Point-in-time recovery enabled

### Data in Transit

- All connections over HTTPS (TLS 1.3)
- HTTP Strict Transport Security (HSTS) enabled
- No mixed content allowed

### Sensitive Data Handling

```typescript
// Never log sensitive data
const sanitizeForLogging = (data: any) => {
  const sensitive = ['password', 'token', 'apiKey', 'secret'];
  const sanitized = { ...data };

  for (const key of sensitive) {
    if (sanitized[key]) {
      sanitized[key] = '[REDACTED]';
    }
  }

  return sanitized;
};
```

### PII Handling

| Data Type | Storage | Access |
|-----------|---------|--------|
| Email | Database | Authenticated users in org |
| Name | Database | Authenticated users in org |
| Decision content | Database | RLS enforced |
| AI prompts/responses | Not stored long-term | Ephemeral |

---

## API Security

### Input Validation

All inputs validated with Zod before processing:

```typescript
const createDecisionSchema = z.object({
  title: z.string().min(1).max(200),
  type: z.enum(['build_vs_buy', 'market_entry', 'investment', 'product_prioritization', 'custom']),
  decision_frame: z.string().max(1000).optional(),
  context: z.string().max(5000).optional(),
  deadline: z.string().datetime().optional()
});
```

### Rate Limiting

| Endpoint Category | Limit | Window |
|-------------------|-------|--------|
| Authentication | 10 requests | 1 minute |
| AI generation | 20 requests | 1 minute |
| Standard API | 100 requests | 1 minute |
| Bulk operations | 10 requests | 1 minute |

```typescript
// Using Vercel KV for rate limiting
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(100, '1m'),
});

async function rateLimitMiddleware(req: Request, userId: string) {
  const { success, limit, remaining } = await ratelimit.limit(userId);

  if (!success) {
    throw new RateLimitError('Too many requests', { limit, remaining });
  }
}
```

### CORS Configuration

```typescript
const corsConfig = {
  origin: [
    'https://myplinth.com',
    'https://staging.myplinth.com',
    process.env.NODE_ENV === 'development' && 'http://localhost:3000'
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
```

### SQL Injection Prevention

- All queries use parameterized statements via Supabase client
- No raw SQL string concatenation
- Input sanitization before database operations

### XSS Prevention

- React's default escaping
- Content Security Policy headers
- No `dangerouslySetInnerHTML` without sanitization

```typescript
// CSP headers
const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "connect-src 'self' https://*.supabase.co https://api.openai.com",
  ].join('; '),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};
```

---

## Third-Party Security

### API Key Management

- All API keys in Vercel environment variables
- Keys never exposed to client
- Different keys for staging/production
- Regular key rotation (quarterly)

### External Services

| Service | Data Shared | Security Notes |
|---------|-------------|----------------|
| OpenAI | Decision context, prompts | SOC 2 compliant, data not used for training |
| Firecrawl | Public URLs only | No user data shared |
| Exa | Search queries | No PII in queries |
| Resend | Email addresses, templates | SOC 2 compliant |
| Sentry | Error data (sanitized) | PII scrubbing enabled |

### Vendor Security Requirements

All vendors must have:
- SOC 2 Type II certification (or equivalent)
- Data processing agreement
- GDPR compliance (if applicable)
- Documented security practices

---

## Audit & Logging

### Audit Events

```typescript
type AuditEvent = {
  timestamp: string;
  user_id: string;
  org_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  ip_address: string;
  user_agent: string;
  details?: object;
};

// Events to log
const auditableActions = [
  'decision.created',
  'decision.deleted',
  'decision.shared',
  'member.invited',
  'member.removed',
  'member.role_changed',
  'output.generated',
  'output.shared',
  'auth.login',
  'auth.logout',
  'auth.password_changed'
];
```

### Log Retention

| Log Type | Retention |
|----------|-----------|
| Audit logs | 1 year |
| Error logs | 90 days |
| Access logs | 30 days |
| Debug logs | 7 days |

---

## Incident Response

### Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| P1 - Critical | Data breach, system down | 1 hour |
| P2 - High | Security vulnerability, partial outage | 4 hours |
| P3 - Medium | Performance degradation | 24 hours |
| P4 - Low | Minor issue | 1 week |

### Response Procedure

1. **Detect** - Monitoring alerts or user report
2. **Assess** - Determine severity and scope
3. **Contain** - Limit damage (revoke access, take offline if needed)
4. **Investigate** - Root cause analysis
5. **Remediate** - Fix the issue
6. **Notify** - Inform affected users if required
7. **Review** - Post-incident review and improvements

---

## Compliance Considerations

### For Future Enterprise Tiers

- SOC 2 Type II preparation (document controls now)
- GDPR compliance (data export, deletion rights)
- Data residency options (regional Supabase instances)
- SSO/SAML integration
- Advanced audit logging
- Custom data retention policies
