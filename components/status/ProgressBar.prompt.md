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
- Motion respects `prefers-reduced-motion`.
