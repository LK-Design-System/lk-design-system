**IconButton** is the WDS Action/Icon Button primitive for icon-only actions
such as navigation arrows, close, search, and tool commands.

```jsx
<IconButton variant="soft" label="Previous">{chevronLeft}</IconButton>
<IconButton variant="signal" round label="Back to top">{arrowUp}</IconButton>
<IconButton variant="on-dark" label="Next">{chevronRight}</IconButton>
```

- Always provide `label`; it is the accessible name for the icon-only control.
- **variant**: `soft`, `solid`, `signal`, `ghost`, `on-dark`.
- **size**: pixel size, default `44`.
- **round**: renders a circular control.
- Use `ToggleIcon` instead when the icon-only control has persistent on/off
  state.
