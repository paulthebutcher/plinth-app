# API Contracts Specification

## Overview

All API endpoints follow RESTful conventions with consistent request/response formats. This document defines the contracts for frontend-backend communication.

---

## API Conventions

### Base URL
```
Production: https://myplinth.com/api
Staging: https://staging.myplinth.com/api
Local: http://localhost:3000/api
```

### Authentication
All authenticated endpoints require:
```
Authorization: Bearer <supabase_jwt_token>
```

### Response Format

**Success Response:**
```typescript
{
  data: T,           // The response payload
  meta?: {           // Optional metadata
    page?: number,
    pageSize?: number,
    total?: number
  }
}
```

**Error Response:**
```typescript
{
  error: {
    code: string,      // Machine-readable code
    message: string,   // Human-readable message
    details?: any      // Additional context
  }
}
```

### Error Codes

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| `unauthorized` | 401 | Missing or invalid auth |
| `forbidden` | 403 | Authenticated but not allowed |
| `not_found` | 404 | Resource doesn't exist |
| `validation_error` | 400 | Invalid request data |
| `conflict` | 409 | Resource conflict |
| `rate_limited` | 429 | Too many requests |
| `internal_error` | 500 | Server error |

### Pagination
```typescript
// Request
GET /api/decisions?page=1&pageSize=20

// Response
{
  data: Decision[],
  meta: {
    page: 1,
    pageSize: 20,
    total: 47,
    totalPages: 3
  }
}
```

---

## Organizations API

### GET /api/organizations

Get current user's organization.

**Response:**
```typescript
{
  data: {
    id: string,
    name: string,
    slug: string,
    plan: "trial" | "team" | "enterprise",
    settings: {
      // Future: org-level settings
    },
    created_at: string,
    member_count: number
  }
}
```

### PATCH /api/organizations

Update organization settings.

**Request:**
```typescript
{
  name?: string,
  settings?: object
}
```

**Response:**
```typescript
{
  data: Organization
}
```

---

### GET /api/organizations/members

List organization members.

**Response:**
```typescript
{
  data: Array<{
    id: string,
    email: string,
    full_name: string | null,
    role: "admin" | "member" | "viewer",
    created_at: string,
    last_active_at: string | null
  }>
}
```

### POST /api/organizations/members/invite

Invite a new member.

**Request:**
```typescript
{
  email: string,
  role: "admin" | "member" | "viewer"
}
```

**Response:**
```typescript
{
  data: {
    id: string,
    email: string,
    role: string,
    expires_at: string
  }
}
```

### DELETE /api/organizations/members/:id

Remove a member.

**Response:**
```typescript
{
  data: { success: true }
}
```

### PATCH /api/organizations/members/:id

Update member role.

**Request:**
```typescript
{
  role: "admin" | "member" | "viewer"
}
```

---

## Decisions API

### GET /api/decisions

List decisions for current organization.

**Query Parameters:**
```
page?: number (default: 1)
pageSize?: number (default: 20, max: 100)
status?: "draft" | "in_review" | "committed" | "archived"
type?: "build_vs_buy" | "market_entry" | "investment" | "product_prioritization" | "custom"
search?: string (searches title, decision_frame)
sort?: "created_at" | "updated_at" | "deadline" (default: updated_at)
order?: "asc" | "desc" (default: desc)
```

**Response:**
```typescript
{
  data: Array<{
    id: string,
    title: string,
    decision_frame: string | null,
    status: DecisionStatus,
    type: DecisionType,
    quality_score: number,
    deadline: string | null,
    owner: {
      id: string,
      full_name: string,
      email: string
    },
    options_count: number,
    evidence_count: number,
    created_at: string,
    updated_at: string
  }>,
  meta: PaginationMeta
}
```

### POST /api/decisions

Create a new decision.

**Request:**
```typescript
{
  title: string,
  type: DecisionType,
  decision_frame?: string,
  context?: string,
  deadline?: string,  // ISO date
  urgency?: "low" | "medium" | "high" | "critical"
}
```

**Response:**
```typescript
{
  data: Decision  // Full decision object
}
```

### GET /api/decisions/:id

Get a single decision with all related data.

**Response:**
```typescript
{
  data: {
    id: string,
    title: string,
    decision_frame: string | null,
    status: DecisionStatus,
    type: DecisionType,
    context: string | null,
    deadline: string | null,
    urgency: Urgency | null,
    confidence_score: number | null,
    confidence_rationale: string | null,
    recommendation_id: string | null,
    recommendation_rationale: string | null,
    reversal_conditions: string | null,
    quality_score: number,
    metadata: object,
    owner: User,
    created_at: string,
    updated_at: string,

    // Related data (populated)
    options: Option[],
    evidence: Evidence[],
    constraints: Constraint[],
    tradeoffs: Tradeoff[],
    stakeholders: Stakeholder[],
    competitor_profiles: CompetitorProfile[],
    outputs: Output[],
    progress: DecisionProgress
  }
}
```

### PATCH /api/decisions/:id

Update a decision.

**Request:**
```typescript
{
  title?: string,
  decision_frame?: string,
  context?: string,
  status?: DecisionStatus,
  deadline?: string,
  urgency?: Urgency,
  confidence_score?: number,
  confidence_rationale?: string,
  recommendation_id?: string,
  recommendation_rationale?: string,
  reversal_conditions?: string
}
```

**Response:**
```typescript
{
  data: Decision
}
```

### DELETE /api/decisions/:id

Archive (soft delete) a decision.

**Response:**
```typescript
{
  data: { success: true }
}
```

---

## Options API

### POST /api/decisions/:decisionId/options

Add an option to a decision.

**Request:**
```typescript
{
  title: string,
  description?: string,
  pros?: Array<{ point: string, impact?: "high" | "medium" | "low" }>,
  cons?: Array<{ point: string, impact?: "high" | "medium" | "low" }>,
  risks?: Array<{ risk: string, likelihood?: string, impact?: string }>,
  is_template_suggested?: boolean
}
```

**Response:**
```typescript
{
  data: Option
}
```

### PATCH /api/decisions/:decisionId/options/:optionId

Update an option.

**Request:** (same as POST, all fields optional)

### DELETE /api/decisions/:decisionId/options/:optionId

Remove an option.

### POST /api/decisions/:decisionId/options/reorder

Reorder options.

**Request:**
```typescript
{
  order: string[]  // Array of option IDs in new order
}
```

---

## Evidence API

### POST /api/decisions/:decisionId/evidence

Add evidence item.

**Request:**
```typescript
{
  claim: string,
  source_url?: string,
  source_type: "web_research" | "internal_data" | "interview" | "competitor" | "document",
  strength: "strong" | "moderate" | "weak",
  notes?: string,
  // Multi-option linking: evidence can support AND/OR challenge multiple options
  option_links?: Array<{
    option_id: string,
    relationship: "supports" | "challenges" | "neutral"
  }>
}
```

**Response:**
```typescript
{
  data: {
    id: string,
    decision_id: string,
    claim: string,
    source_url: string | null,
    source_type: string,
    strength: string,
    notes: string | null,
    option_links: Array<{
      option_id: string,
      relationship: string
    }>,
    created_at: string
  }
}
```

### PATCH /api/decisions/:decisionId/evidence/:evidenceId

Update evidence (including option links).

**Request:**
```typescript
{
  claim?: string,
  source_url?: string,
  source_type?: string,
  strength?: string,
  notes?: string,
  option_links?: Array<{
    option_id: string,
    relationship: "supports" | "challenges" | "neutral"
  }>  // Replaces all existing links
}
```

### DELETE /api/decisions/:decisionId/evidence/:evidenceId

Remove evidence (cascades to option links).

---

## Constraints API

### POST /api/decisions/:decisionId/constraints

Add constraint.

**Request:**
```typescript
{
  category: "legal" | "technical" | "budget" | "timeline" | "brand" | "org" | "other",
  description: string,
  severity: "hard" | "soft",
  notes?: string
}
```

### PATCH /api/decisions/:decisionId/constraints/:constraintId

### DELETE /api/decisions/:decisionId/constraints/:constraintId

---

## Tradeoffs API

### POST /api/decisions/:decisionId/tradeoffs

Add tradeoff.

**Request:**
```typescript
{
  option_id: string,
  gives_up: string,
  gets: string,
  acknowledged: boolean
}
```

### PATCH /api/decisions/:decisionId/tradeoffs/:tradeoffId

### DELETE /api/decisions/:decisionId/tradeoffs/:tradeoffId

---

## Stakeholders API

### POST /api/decisions/:decisionId/stakeholders

Add stakeholder.

**Request:**
```typescript
{
  name: string,
  role?: string,
  stance?: "supportive" | "neutral" | "skeptical" | "unknown",
  concerns?: string
}
```

### PATCH /api/decisions/:decisionId/stakeholders/:stakeholderId

### DELETE /api/decisions/:decisionId/stakeholders/:stakeholderId

---

## Outputs API

### POST /api/decisions/:decisionId/outputs

Generate an output (triggers async AI generation).

**Request:**
```typescript
{
  type: "brief"  // MVP: only "brief" supported
}
```

**Response:**
```typescript
{
  data: {
    id: string,
    job_id: string,  // Use to poll job status
    status: "pending" | "generating" | "complete" | "failed",
    type: string
  }
}
```

**Validation:** Returns 400 if decision quality_score < 80%.

### GET /api/decisions/:decisionId/outputs/:outputId

Get output with current status.

**Response:**
```typescript
{
  data: {
    id: string,
    decision_id: string,
    type: string,
    status: "pending" | "generating" | "complete" | "failed",
    content: string | null,  // Populated when status = "complete"
    error_message: string | null,  // Populated when status = "failed"
    format: string,
    is_shared: boolean,
    share_key: string | null,
    created_at: string,
    generated_at: string | null
  }
}
```

### PATCH /api/decisions/:decisionId/outputs/:outputId

Update output (edit content after generation).

**Request:**
```typescript
{
  content?: string,
  is_shared?: boolean
}
```

### POST /api/decisions/:decisionId/outputs/:outputId/share

Generate shareable link.

**Response:**
```typescript
{
  data: {
    share_key: string,
    url: string  // Full shareable URL
  }
}
```

### DELETE /api/decisions/:decisionId/outputs/:outputId/share

Revoke sharing.

---

## AI API

### POST /api/ai/analyze-competitor

Generate competitor profile.

**Request:**
```typescript
{
  company_name: string,
  company_url?: string,
  decision_id: string,
  depth?: "quick" | "standard" | "deep"  // default: standard
}
```

**Response (streaming):**
```typescript
// Server-Sent Events stream
event: progress
data: { stage: "scraping", message: "Fetching company website..." }

event: progress
data: { stage: "analyzing", message: "Analyzing competitor data..." }

event: complete
data: { profile: CompetitorProfile }
```

### POST /api/ai/analyze-options

Analyze decision options.

**Request:**
```typescript
{
  decision_id: string,
  option_id?: string,  // If provided, analyze single option
  action: "analyze" | "compare" | "suggest"
}
```

**Response (streaming):**
```typescript
// For analyze/compare: streams structured analysis
// For suggest: returns suggested options
```

### POST /api/ai/research-market

Run market research.

**Request:**
```typescript
{
  decision_id: string,
  market: string,
  geography?: string
}
```

### POST /api/ai/search-evidence

Search for evidence.

**Request:**
```typescript
{
  decision_id: string,
  query: string,
  evidence_type?: "supporting" | "challenging" | "both"
}
```

### POST /api/ai/synthesize

Generate decision synthesis.

**Request:**
```typescript
{
  decision_id: string
}
```

### POST /api/ai/generate-brief

Generate decision brief.

**Request:**
```typescript
{
  decision_id: string
}
```

### POST /api/ai/surface-tradeoffs

Surface implicit tradeoffs.

**Request:**
```typescript
{
  decision_id: string
}
```

### POST /api/ai/calibrate-confidence

Check confidence calibration.

**Request:**
```typescript
{
  decision_id: string
}
```

### POST /api/ai/challenge

Challenge recommendation.

**Request:**
```typescript
{
  decision_id: string
}
```

### POST /api/ai/identify-gaps

Identify decision gaps.

**Request:**
```typescript
{
  decision_id: string
}
```

---

## Public Share API

### GET /api/share/:shareKey

Get shared output (no auth required).

**Response:**
```typescript
{
  data: {
    output: {
      type: string,
      content: string,
      format: string,
      created_at: string
    },
    decision: {
      title: string,
      owner_name: string,
      organization_name: string
    }
  }
}
```

---

## Jobs API

Background jobs for async AI operations (competitor analysis, brief generation, etc.).

### POST /api/jobs

Create a new background job.

**Request:**
```typescript
{
  type: "competitor_analysis" | "market_research" | "brief_generation" | "option_analysis",
  decision_id: string,
  input: {
    // Type-specific input parameters
    // For competitor_analysis:
    company_name?: string,
    company_url?: string,
    depth?: "quick" | "standard" | "deep"
    // For brief_generation:
    // (no additional input needed)
    // etc.
  }
}
```

**Response:**
```typescript
{
  data: {
    id: string,
    type: string,
    status: "pending",
    created_at: string
  }
}
```

### GET /api/jobs/:jobId

Check job status.

**Response:**
```typescript
{
  data: {
    id: string,
    decision_id: string | null,
    type: string,
    status: "pending" | "running" | "completed" | "failed",
    progress: number,  // 0-100
    input: object,
    output: object | null,  // Populated when status = "completed"
    error: string | null,   // Populated when status = "failed"
    started_at: string | null,
    completed_at: string | null,
    created_at: string
  }
}
```

### GET /api/decisions/:decisionId/jobs

List jobs for a decision.

**Query Parameters:**
```
type?: string (filter by job type)
status?: "pending" | "running" | "completed" | "failed"
```

**Response:**
```typescript
{
  data: Array<Job>
}
```

### DELETE /api/jobs/:jobId

Cancel a pending/running job.

**Response:**
```typescript
{
  data: { success: true }
}
```

**Note:** Only jobs with status "pending" or "running" can be cancelled.

---

## Comments API

Lightweight collaboration comments on decisions and their components.

### GET /api/decisions/:decisionId/comments

List all comments for a decision.

**Query Parameters:**
```
target_type?: "decision" | "option" | "evidence" | "tradeoff" | "constraint"
target_id?: string
```

**Response:**
```typescript
{
  data: Array<{
    id: string,
    decision_id: string,
    user: {
      id: string,
      full_name: string,
      email: string
    },
    parent_id: string | null,
    content: string,
    target_type: string | null,
    target_id: string | null,
    created_at: string,
    updated_at: string,
    replies?: Comment[]  // Nested if has children
  }>
}
```

### POST /api/decisions/:decisionId/comments

Add a comment.

**Request:**
```typescript
{
  content: string,
  parent_id?: string,        // For replies
  target_type?: "decision" | "option" | "evidence" | "tradeoff" | "constraint",
  target_id?: string         // ID of the target entity
}
```

**Response:**
```typescript
{
  data: Comment
}
```

### PATCH /api/decisions/:decisionId/comments/:commentId

Update a comment (only by author).

**Request:**
```typescript
{
  content: string
}
```

**Response:**
```typescript
{
  data: Comment
}
```

### DELETE /api/decisions/:decisionId/comments/:commentId

Delete a comment (only by author or admin).

**Response:**
```typescript
{
  data: { success: true }
}
```

---

## Type Definitions

```typescript
type DecisionStatus = "draft" | "in_review" | "committed" | "archived";

type DecisionType = "build_vs_buy" | "market_entry" | "investment" | "product_prioritization" | "custom";

type Urgency = "low" | "medium" | "high" | "critical";

interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "member" | "viewer";
}

interface Option {
  id: string;
  decision_id: string;
  title: string;
  description: string | null;
  pros: Array<{ point: string; impact?: string }>;
  cons: Array<{ point: string; impact?: string }>;
  risks: Array<{ risk: string; likelihood?: string; impact?: string }>;
  ai_analysis: object | null;
  is_template_suggested: boolean;
  recommendation_rank: number | null;
  created_at: string;
}

interface Evidence {
  id: string;
  decision_id: string;
  claim: string;
  source_url: string | null;
  source_type: "web_research" | "internal_data" | "interview" | "competitor" | "document";
  strength: "strong" | "moderate" | "weak";
  notes: string | null;
  option_links: Array<{
    option_id: string;
    relationship: "supports" | "challenges" | "neutral";
  }>;
  created_at: string;
}

interface EvidenceOption {
  id: string;
  evidence_id: string;
  option_id: string;
  relationship: "supports" | "challenges" | "neutral";
}

interface Constraint {
  id: string;
  decision_id: string;
  category: string;
  description: string;
  severity: "hard" | "soft";
  notes: string | null;
  created_at: string;
}

interface Tradeoff {
  id: string;
  decision_id: string;
  option_id: string;
  gives_up: string;
  gets: string;
  acknowledged: boolean;
  created_at: string;
}

interface Stakeholder {
  id: string;
  decision_id: string;
  name: string;
  role: string | null;
  stance: "supportive" | "neutral" | "skeptical" | "unknown" | null;
  concerns: string | null;
  created_at: string;
}

interface CompetitorProfile {
  id: string;
  decision_id: string;
  company_name: string;
  company_url: string | null;
  overview: object;
  product: object;
  market_position: object;
  strengths: object[];
  weaknesses: object[];
  recent_activity: object[];
  strategic_signals: object[];
  sources: object[];
  generated_at: string;
}

interface Output {
  id: string;
  decision_id: string;
  type: "brief";  // MVP: only brief supported
  status: "pending" | "generating" | "complete" | "failed";
  content: string | null;
  error_message: string | null;
  format: string;
  is_shared: boolean;
  share_key: string | null;
  created_at: string;
  generated_at: string | null;
}

interface Job {
  id: string;
  org_id: string;
  decision_id: string | null;
  type: "competitor_analysis" | "market_research" | "brief_generation" | "option_analysis";
  status: "pending" | "running" | "completed" | "failed";
  input: object;
  output: object | null;
  error: string | null;
  progress: number;  // 0-100
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

interface Comment {
  id: string;
  decision_id: string;
  user_id: string;
  user?: User;  // Populated in responses
  parent_id: string | null;
  content: string;
  target_type: "decision" | "option" | "evidence" | "tradeoff" | "constraint" | null;
  target_id: string | null;
  created_at: string;
  updated_at: string;
  replies?: Comment[];  // Nested children in threaded responses
}

interface DecisionProgress {
  frame: { is_complete: boolean };
  context: { is_complete: boolean };
  options: { is_complete: boolean; count: number };
  evidence: { is_complete: boolean; count: number };
  tradeoffs: { is_complete: boolean; count: number };
  recommendation: { is_complete: boolean };
  quality_score: number;
}
```

---

## Webhook Events (Future)

For integrations, we'll fire webhooks on:

```typescript
type WebhookEvent =
  | "decision.created"
  | "decision.status_changed"
  | "decision.brief_generated"
  | "member.invited"
  | "member.joined";
```
