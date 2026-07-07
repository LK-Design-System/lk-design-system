**CircularProgress** - circular progress indicator.

```jsx
<CircularProgress value={72} label="Report progress" showValue />
<CircularProgress indeterminate label="Processing" />
<CircularProgress value={4} max={5} tone="positive" size={40} />
```

- **value / max** define determinate progress.
- **indeterminate** renders an unknown-duration rotating arc and omits `aria-valuenow`.
- **size / thickness** control the ring geometry.
- **tone**: `signal`, `positive`, `cautionary`, or `negative`.
- **label / showValue** provide accessible and visible progress context.
- Motion respects `prefers-reduced-motion`.
