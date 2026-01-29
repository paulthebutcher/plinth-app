# Async Jobs & Realtime Updates Specification

## Overview

Many AI-powered features in Plinth take 10-60+ seconds to complete. This document defines how background jobs work and how the frontend receives updates.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      JOB LIFECYCLE                               │
│                                                                  │
│   User Action                                                    │
│       │                                                          │
│       ▼                                                          │
│   ┌─────────────┐                                               │
│   │ Create Job  │ ─────► POST /api/jobs                         │
│   │  (pending)  │ ◄───── Returns job_id immediately              │
│   └─────────────┘                                               │
│       │                                                          │
│       ▼                                                          │
│   ┌─────────────┐                                               │
│   │  Inngest    │  Background job processor                      │
│   │  Worker     │  (or Vercel background function)               │
│   └─────────────┘                                               │
│       │                                                          │
│       ├────► Update job status: "running"                        │
│       │      Update progress: 0-100                              │
│       │                                                          │
│       ├────► Do work (AI calls, scraping, etc.)                  │
│       │                                                          │
│       ▼                                                          │
│   ┌─────────────┐                                               │
│   │  Complete   │ ─────► status: "completed" + output            │
│   │  or Fail    │ ─────► status: "failed" + error                │
│   └─────────────┘                                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Job Types

| Job Type | Typical Duration | Output |
|----------|------------------|--------|
| `competitor_analysis` | 30-90 seconds | CompetitorProfile |
| `market_research` | 20-60 seconds | MarketResearch evidence items |
| `brief_generation` | 15-30 seconds | Output with content |
| `option_analysis` | 10-20 seconds | Option with AI analysis |
| `evidence_search` | 10-30 seconds | Evidence items |

---

## Frontend Update Strategies

### Strategy 1: Polling (MVP)

Simple, reliable, works everywhere.

```typescript
// Create job
const { data: job } = await api.post('/api/jobs', {
  type: 'competitor_analysis',
  decision_id: decisionId,
  input: { company_name: 'Acme Corp', company_url: 'https://acme.com' }
});

// Poll for completion
const pollJob = async (jobId: string): Promise<Job> => {
  const poll = async (): Promise<Job> => {
    const { data } = await api.get(`/api/jobs/${jobId}`);

    if (data.status === 'completed' || data.status === 'failed') {
      return data;
    }

    // Update UI with progress
    setProgress(data.progress);
    setStatusMessage(data.status);

    // Poll again after delay
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second intervals
    return poll();
  };

  return poll();
};

const result = await pollJob(job.id);
```

**Polling Configuration:**

| Job Type | Poll Interval | Max Duration |
|----------|---------------|--------------|
| `competitor_analysis` | 3 seconds | 2 minutes |
| `market_research` | 3 seconds | 2 minutes |
| `brief_generation` | 2 seconds | 1 minute |
| `option_analysis` | 2 seconds | 30 seconds |

### Strategy 2: Supabase Realtime (Future Enhancement)

Subscribe to job status changes via Supabase Realtime.

```typescript
// Subscribe to job updates
const channel = supabase
  .channel(`job:${jobId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'jobs',
    filter: `id=eq.${jobId}`
  }, (payload) => {
    const job = payload.new as Job;
    setProgress(job.progress);

    if (job.status === 'completed') {
      onComplete(job.output);
      channel.unsubscribe();
    } else if (job.status === 'failed') {
      onError(job.error);
      channel.unsubscribe();
    }
  })
  .subscribe();

// Cleanup on unmount
return () => channel.unsubscribe();
```

---

## Job Processing (Backend)

### Inngest Implementation

```typescript
// inngest/functions/competitor-analysis.ts
import { inngest } from './client';
import { supabase } from '@/lib/supabase';

export const competitorAnalysis = inngest.createFunction(
  { id: 'competitor-analysis' },
  { event: 'jobs/competitor-analysis' },
  async ({ event, step }) => {
    const { jobId, companyName, companyUrl, decisionId } = event.data;

    // Update status to running
    await step.run('update-status-running', async () => {
      await supabase.from('jobs').update({
        status: 'running',
        started_at: new Date().toISOString()
      }).eq('id', jobId);
    });

    // Step 1: Scrape website (20%)
    const websiteData = await step.run('scrape-website', async () => {
      await updateProgress(jobId, 10, 'Scraping website...');
      return await firecrawl.scrape(companyUrl);
    });
    await updateProgress(jobId, 20);

    // Step 2: Search for news (40%)
    const newsData = await step.run('search-news', async () => {
      await updateProgress(jobId, 30, 'Searching for news...');
      return await exa.search(`${companyName} news`);
    });
    await updateProgress(jobId, 40);

    // Step 3: Get reviews (60%)
    const reviewData = await step.run('get-reviews', async () => {
      await updateProgress(jobId, 50, 'Gathering reviews...');
      return await fetchG2Reviews(companyName);
    });
    await updateProgress(jobId, 60);

    // Step 4: Generate profile with AI (90%)
    const profile = await step.run('generate-profile', async () => {
      await updateProgress(jobId, 70, 'Analyzing data...');
      return await generateCompetitorProfile({
        websiteData,
        newsData,
        reviewData,
        decisionContext: await getDecisionContext(decisionId)
      });
    });
    await updateProgress(jobId, 90);

    // Step 5: Save results (100%)
    await step.run('save-results', async () => {
      // Create competitor profile
      const { data: competitorProfile } = await supabase
        .from('competitor_profiles')
        .insert({
          decision_id: decisionId,
          job_id: jobId,
          company_name: companyName,
          company_url: companyUrl,
          status: 'complete',
          ...profile,
          generated_at: new Date().toISOString()
        })
        .select()
        .single();

      // Update job as complete
      await supabase.from('jobs').update({
        status: 'completed',
        progress: 100,
        output: { competitor_profile_id: competitorProfile.id },
        completed_at: new Date().toISOString()
      }).eq('id', jobId);

      return competitorProfile;
    });
  }
);

async function updateProgress(jobId: string, progress: number, message?: string) {
  await supabase.from('jobs').update({
    progress,
    ...(message && { output: { status_message: message } })
  }).eq('id', jobId);
}
```

### Error Handling

```typescript
// Wrap all job processing in try/catch
try {
  // ... job logic
} catch (error) {
  await supabase.from('jobs').update({
    status: 'failed',
    error: error instanceof Error ? error.message : 'Unknown error',
    completed_at: new Date().toISOString()
  }).eq('id', jobId);

  // Log to Sentry for debugging
  Sentry.captureException(error, {
    extra: { jobId, jobType: 'competitor_analysis' }
  });

  throw error; // Inngest will handle retries
}
```

---

## UI Patterns

### Job Progress Modal

```
┌─────────────────────────────────────────────────────────────────┐
│  🔍 Analyzing Competitor                                        │
│                                                                  │
│  ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░  60%                                     │
│                                                                  │
│  Gathering customer reviews...                                   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    [Cancel]                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  💡 This usually takes 30-60 seconds                            │
└─────────────────────────────────────────────────────────────────┘
```

### Inline Progress (for brief generation)

```
┌─────────────────────────────────────────────────────────────────┐
│  Generate Brief                                                  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │   ⟳ Generating...  45%                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Synthesizing decision data...                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Background with Toast Notification

For non-blocking operations:

```
┌──────────────────────────────────────┐
│  ✓ Competitor analysis started        │
│  We'll notify you when it's ready.    │
│                             [View]    │
└──────────────────────────────────────┘
```

When complete:

```
┌──────────────────────────────────────┐
│  ✓ Competitor profile ready           │
│  Acme Corp has been analyzed.         │
│                             [View]    │
└──────────────────────────────────────┘
```

---

## Job Queue Management

### Concurrency Limits

| Scope | Limit | Rationale |
|-------|-------|-----------|
| Per organization | 5 concurrent jobs | Prevent abuse, fair usage |
| Per user | 3 concurrent jobs | UX - too many is confusing |
| Per decision | 2 concurrent jobs | Data integrity |

### Rate Limiting

```typescript
// Check before creating job
const activeJobs = await supabase
  .from('jobs')
  .select('id')
  .eq('org_id', orgId)
  .in('status', ['pending', 'running'])
  .count();

if (activeJobs.count >= 5) {
  throw new Error('Too many active jobs. Please wait for some to complete.');
}
```

### Job Expiration

- Jobs stuck in "pending" for >5 minutes: auto-fail
- Jobs stuck in "running" for >10 minutes: auto-fail
- Completed job data retained: 30 days
- Failed job data retained: 7 days

---

## Retry Strategy

Using Inngest's built-in retry:

```typescript
export const competitorAnalysis = inngest.createFunction(
  {
    id: 'competitor-analysis',
    retries: 3,
    onFailure: async ({ error, event }) => {
      // Final failure handler
      await supabase.from('jobs').update({
        status: 'failed',
        error: `Failed after 3 retries: ${error.message}`
      }).eq('id', event.data.jobId);
    }
  },
  // ...
);
```

### Retry-able vs Non-retryable Errors

| Error Type | Retry? | Example |
|------------|--------|---------|
| Network timeout | Yes | API call timed out |
| Rate limit | Yes (with backoff) | OpenAI 429 |
| Invalid input | No | Company URL doesn't exist |
| Auth failure | No | API key invalid |
| Parse error | Yes (once) | LLM returned invalid JSON |

---

## Monitoring & Alerts

### Metrics to Track

- Job creation rate by type
- Average job duration by type
- Failure rate by type
- Queue depth
- P95 completion time

### Alert Thresholds

| Metric | Threshold | Action |
|--------|-----------|--------|
| Failure rate | >10% over 1 hour | Page on-call |
| Queue depth | >50 jobs | Warning |
| P95 duration | >2x normal | Investigate |
| Stuck jobs | >5 stuck | Auto-remediate + alert |
