# UI Standards

These standards apply to all UI work in this repo.

## Rules

- Use tokenized Tailwind classes (bg-primary, text-foreground, border-border, bg-background).
- Prefer composing from UI primitives in `src/components/ui/*`.
- Never use raw hex colors in components; use CSS vars or Tailwind tokens only.
- Use consistent layout rhythm: `max-w-6xl/7xl`, `px-6`, `py-6`, `gap-6`.
- Typography scale: page titles `text-2xl/3xl`, section titles `text-lg`, body `text-sm/base`.
- Surfaces: use Card-like containers for grouped content; `rounded-xl`, subtle borders, `shadow-sm`.
- Empty states must include: icon, headline, helper text, primary CTA.
- Buttons: default is primary orange; links should not be browser-default blue/underlined.

## Examples

### Good layout rhythm

```tsx
<section className="mx-auto max-w-6xl px-6 py-6">
  <div className="grid gap-6">
    <h1 className="text-3xl font-semibold text-foreground">Decisions</h1>
    <div className="rounded-xl border border-border bg-background shadow-sm">
      {/* content */}
    </div>
  </div>
</section>
```

### Good empty state

```tsx
<div className="rounded-xl border border-border bg-background shadow-sm p-6 text-center">
  <Sparkles className="mx-auto h-10 w-10 text-primary" />
  <h3 className="mt-4 text-lg font-medium text-foreground">No decisions yet</h3>
  <p className="mt-2 text-sm text-foreground-muted">
    Start by analyzing your first strategic decision.
  </p>
  <Button className="mt-6">Analyze a decision</Button>
</div>
```

### Bad: raw hex and browser-default link

```tsx
<div style={{ background: "#fff" }}>
  <a href="/login">Login</a>
</div>
```

### Good: tokenized color + styled link

```tsx
<div className="bg-background">
  <Link href="/login" className="text-sm font-medium text-primary hover:text-primary-hover">
    Login
  </Link>
</div>
```
