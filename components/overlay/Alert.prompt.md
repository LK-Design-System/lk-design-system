**Alert** - WDS modal feedback alert for urgent or important decisions.

```jsx
<Alert open platform="web" title="Delete item?" primaryLabel="Delete" secondaryLabel="Cancel" variant="negative">
  This action cannot be undone.
</Alert>
```

- Use `platform="ios"`, `android`, or `web` to match the target surface.
- WDS axes: `platform`, `variant="normal|negative|assistive"`, `heading`, and primary/secondary actions.
- `tone="danger"` remains as a backward-compatible alias for `variant="negative"`.
