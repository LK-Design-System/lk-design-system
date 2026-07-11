**IconButton** is the WDS Action/Icon Button primitive for icon-only actions
such as navigation arrows, close, search, and tool commands.

```jsx
<IconButton variant="soft" label="Previous">{chevronLeft}</IconButton>
<IconButton variant="signal" label="Back to top">{arrowUp}</IconButton>
<IconButton variant="soft" round={false} label="Open settings">{gear}</IconButton>
<IconButton variant="on-dark" label="Next">{chevronRight}</IconButton>
```

- Always provide `label`; it is the accessible name for the icon-only control.
- **variant**: `soft`, `solid`, `signal`, `ghost`, `plain`, `on-dark`. `plain`은 grouped toolbar처럼 부모 surface가 hover/background를 소유하는 조합용입니다.
- **size**: pixel size or size key, default `medium` (40).
- **round**: circular by default (WDS icon buttons are always circular); pass
  `round={false}` for the rounded-square look.
- Use `ToggleIcon` instead when the icon-only control has persistent on/off
  state.
- Native `disabled` removes the command from focus. `aria-disabled="true"` keeps
  it programmatically discoverable while applying unavailable styling and
  blocking activation; composite widgets decide whether it stays in their
  Arrow-key navigation model.
