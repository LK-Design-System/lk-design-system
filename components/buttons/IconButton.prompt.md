**IconButton** is the WDS Action/Icon Button primitive for icon-only actions
such as navigation arrows, close, search, and tool commands.

```jsx
<IconButton variant="soft" label="Previous">{chevronLeft}</IconButton>
<IconButton variant="signal" label="Back to top">{arrowUp}</IconButton>
<IconButton variant="soft" round={false} label="Open settings">{gear}</IconButton>
<IconButton variant="on-dark" label="Next">{chevronRight}</IconButton>
```

- Always provide `label`; it is the accessible name for the icon-only control.
- **variant**: `soft`, `solid`, `signal`, `ghost`, `on-dark`.
- **size**: pixel size or size key, default `medium` (40).
- **round**: circular by default (WDS icon buttons are always circular); pass
  `round={false}` for the rounded-square look.
- Use `ToggleIcon` instead when the icon-only control has persistent on/off
  state.
