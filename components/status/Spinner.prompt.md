**Spinner** - WDS loading indicator for unknown-duration work.

```jsx
<Spinner />
<Spinner variant="wanted" size={36} />
<Spinner size={18} label="Loading" />
```

- **variant**: `circular` or `wanted`.
- **size / thickness / color** control the circular ring geometry and active arc.
- **label** adds visible status text and lets assistive tech announce the loading state.
- Use `ProgressBar` or `CircularProgress` when a value or completion percentage is known.
- Motion respects `prefers-reduced-motion`.
