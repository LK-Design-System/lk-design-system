**Snackbar** - WDS feedback bar with optional heading, description, icon, action, and close.

```jsx
<Snackbar heading="Saved" action="Undo" />
<Snackbar leadingIcon closeButton description="Changes were saved." />
```

- Use for short feedback with an optional action. Use `Toast` for transient status-only messages.
- WDS axes: `heading`, `description`, `icon`, and `closeButton`.
