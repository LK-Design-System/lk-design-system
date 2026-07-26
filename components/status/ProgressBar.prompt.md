**ProgressBar** - linear progress indicator.

```jsx
<ProgressBar value={68} label="Upload" showValue />
<ProgressBar indeterminate label="Processing" />
<ProgressBar value={3} max={5} tone="positive" size="lg" />
```

- **value / max** define determinate progress.
- **indeterminate** renders an unknown-duration segment and omits `aria-valuenow`.
- **tone**: `signal`, `positive`, `cautionary`, or `negative`.
- **size**: `sm`, `md`, or `lg`.
- **label / showValue** expose readable progress context.
- Motion respects `prefers-reduced-motion`. The indeterminate segment gets its animation from an inline style, so the injected `@media (prefers-reduced-motion: reduce)` rule declares `animation:none!important` — dropping `!important` silently disables the guard (WCAG 2.3.3). Same mechanism as `Skeleton`/`Spinner`.
