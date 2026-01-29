# Testing Strategy

## Overview

This document defines the testing approach for Plinth MVP. The goal is confidence in quality without over-engineering tests for a fast-moving early-stage product.

---

## Testing Principles

1. **Test the critical path** - Focus on user-facing flows
2. **Don't test the framework** - Trust Next.js, Supabase, etc.
3. **Integration over unit** - Real flows > isolated functions
4. **Fast feedback** - Tests should run in <2 minutes
5. **Readable tests** - Tests as documentation

---

## Test Types

### 1. Unit Tests

**What**: Individual functions, utilities, helpers

**When**: Complex logic that's reused

**Tool**: Vitest (fast, native ESM, good DX)

```typescript
// Example: Quality score calculation
describe('calculateQualityScore', () => {
  it('returns 0 for empty decision', () => {
    const decision = createEmptyDecision();
    expect(calculateQualityScore(decision)).toBe(0);
  });

  it('returns 100 for fully complete decision', () => {
    const decision = createCompleteDecision();
    expect(calculateQualityScore(decision)).toBe(100);
  });

  it('weights sections correctly', () => {
    const decision = createDecisionWithOnlyOptions();
    expect(calculateQualityScore(decision)).toBe(20); // Options = 20%
  });
});
```

**Target**: Utility functions, calculations, transformations

### 2. Integration Tests

**What**: API routes, database operations, service functions

**When**: Backend logic that touches multiple components

**Tool**: Vitest + test database

```typescript
// Example: Decision creation
describe('POST /api/decisions', () => {
  beforeEach(async () => {
    await resetTestDatabase();
    await seedTestUser();
  });

  it('creates a decision with valid input', async () => {
    const response = await testClient.post('/api/decisions', {
      title: 'Test Decision',
      type: 'build_vs_buy'
    });

    expect(response.status).toBe(201);
    expect(response.body.data.title).toBe('Test Decision');
    expect(response.body.data.status).toBe('draft');
  });

  it('returns 401 without auth', async () => {
    const response = await testClient
      .post('/api/decisions', { title: 'Test' })
      .noAuth();

    expect(response.status).toBe(401);
  });

  it('returns 400 for invalid input', async () => {
    const response = await testClient.post('/api/decisions', {
      title: '', // Invalid: empty
      type: 'invalid_type'
    });

    expect(response.status).toBe(400);
  });
});
```

**Target**: All API endpoints, database queries

### 3. Component Tests

**What**: React components in isolation

**When**: Complex UI logic, state management

**Tool**: Vitest + React Testing Library

```typescript
// Example: Option card component
describe('OptionCard', () => {
  it('renders option title and description', () => {
    render(<OptionCard option={mockOption} />);

    expect(screen.getByText('Build In-House')).toBeInTheDocument();
    expect(screen.getByText(/develop internally/i)).toBeInTheDocument();
  });

  it('shows AI analysis button when no analysis exists', () => {
    render(<OptionCard option={optionWithoutAnalysis} />);

    expect(screen.getByRole('button', { name: /analyze/i })).toBeInTheDocument();
  });

  it('calls onAnalyze when analyze button clicked', async () => {
    const onAnalyze = vi.fn();
    render(<OptionCard option={mockOption} onAnalyze={onAnalyze} />);

    await userEvent.click(screen.getByRole('button', { name: /analyze/i }));

    expect(onAnalyze).toHaveBeenCalledWith(mockOption.id);
  });
});
```

**Target**: Complex components with logic (not simple presentational)

### 4. End-to-End Tests

**What**: Full user flows through the application

**When**: Critical paths that must not break

**Tool**: Playwright

```typescript
// Example: Decision creation flow
test('user can create and complete a decision', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Create decision
  await page.click('text=New Decision');
  await page.click('text=Build vs Buy');
  await page.fill('[name="title"]', 'CRM Platform Selection');
  await page.fill('[name="decision_frame"]', 'Should we build or buy a CRM?');
  await page.click('text=Create Decision');

  // Verify on canvas
  await expect(page).toHaveURL(/\/decisions\/.+/);
  await expect(page.locator('h1')).toContainText('CRM Platform Selection');

  // Add an option
  await page.click('text=Add Option');
  await page.fill('[name="title"]', 'Build Custom CRM');
  await page.click('text=Save');

  // Verify option added
  await expect(page.locator('.option-card')).toContainText('Build Custom CRM');
});
```

**Target**: 5-10 critical user flows

---

## Critical Paths to Test (E2E)

| Flow | Priority | Description |
|------|----------|-------------|
| Sign up → First decision | P0 | Complete onboarding flow |
| Login → View dashboard | P0 | Basic auth works |
| Create decision | P0 | Core functionality |
| Add options/evidence | P0 | Building a decision |
| Generate brief | P0 | Primary output |
| Share brief | P1 | Collaboration feature |
| Invite team member | P1 | Multi-user |
| Competitor analysis | P1 | AI feature |

---

## Test Database Strategy

### Local Development

- Supabase local (Docker)
- Fresh database per test run
- Seed data for consistent state

```typescript
// Test setup
beforeAll(async () => {
  // Connect to test database
  await setupTestDatabase();
});

beforeEach(async () => {
  // Reset to clean state
  await truncateAllTables();
  await seedBaseData();
});

afterAll(async () => {
  await teardownTestDatabase();
});
```

### CI Environment

- Supabase project for CI (separate from staging/prod)
- Database reset between test suites
- Secrets in GitHub Actions

---

## Mocking Strategy

### What to Mock

| Dependency | Mock? | Reason |
|------------|-------|--------|
| OpenAI API | Yes | Cost, speed, determinism |
| Firecrawl API | Yes | Cost, speed, external dependency |
| Supabase Auth | No | Use test instance |
| Supabase DB | No | Use test instance |
| Next.js routing | No | Test real behavior |

### AI Response Mocking

```typescript
// Mock AI responses for deterministic tests
vi.mock('@/lib/openai', () => ({
  generateCompetitorProfile: vi.fn().mockResolvedValue({
    overview: { description: 'Mock company description' },
    strengths: [{ point: 'Strong brand', confidence: 'high' }],
    // ... etc
  }),

  analyzeOption: vi.fn().mockResolvedValue({
    pros: [{ point: 'Low cost', impact: 'high' }],
    cons: [{ point: 'Slow to implement', impact: 'medium' }],
    // ... etc
  })
}));
```

---

## Coverage Requirements

### MVP Coverage Targets

| Category | Target | Notes |
|----------|--------|-------|
| Unit tests | 60% | Focus on complex logic |
| API routes | 80% | All endpoints covered |
| Critical paths (E2E) | 100% | All P0 flows |
| Overall | 50%+ | Quality over quantity |

### What NOT to Test

- Simple components (buttons, labels)
- Framework behavior (Next.js routing)
- Third-party libraries
- CSS/styling
- Obvious code

---

## CI Pipeline

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - name: Type check
        run: npm run typecheck

      - name: Lint
        run: npm run lint

      - name: Unit & Integration tests
        run: npm run test
        env:
          SUPABASE_URL: ${{ secrets.TEST_SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.TEST_SUPABASE_ANON_KEY }}

      - name: E2E tests
        run: npm run test:e2e
        env:
          BASE_URL: http://localhost:3000

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## Test Organization

```
/tests
├── /unit
│   ├── /utils
│   │   ├── quality-score.test.ts
│   │   └── format-date.test.ts
│   └── /lib
│       └── prompts.test.ts
├── /integration
│   ├── /api
│   │   ├── decisions.test.ts
│   │   ├── options.test.ts
│   │   └── evidence.test.ts
│   └── /services
│       └── ai-service.test.ts
├── /components
│   ├── option-card.test.tsx
│   └── evidence-form.test.tsx
├── /e2e
│   ├── auth.spec.ts
│   ├── onboarding.spec.ts
│   ├── decision-creation.spec.ts
│   └── brief-generation.spec.ts
└── /fixtures
    ├── decisions.ts
    ├── options.ts
    └── users.ts
```

---

## Running Tests

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# E2E tests
npm run test:e2e

# Watch mode (development)
npm run test:watch

# Coverage report
npm run test:coverage
```

---

## Test Maintenance

### Keeping Tests Green

- Fix broken tests immediately (don't skip)
- Update tests when behavior changes intentionally
- Delete tests for removed features
- Review test failures in PR review

### Flaky Test Policy

- Investigate immediately
- If not fixable quickly, add `@flaky` tag
- Track in issue tracker
- Review flaky tests weekly
