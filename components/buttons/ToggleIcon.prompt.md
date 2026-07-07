**ToggleIcon** is the WDS Action/Toggle Icon primitive for icon-only on/off actions.

```jsx
<ToggleIcon label="Show route" defaultPressed>
  <Icon name="eye" size={18} />
</ToggleIcon>
```

- Always provide `label`; the visible content is icon-only.
- Use `ToggleIcon` for icon-only state actions and `ToggleButton` when the control has visible text.
- For one-shot icon actions, use `IconButton` instead.
