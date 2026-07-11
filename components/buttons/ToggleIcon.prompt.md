**ToggleIcon** is the WDS Action/Toggle Icon primitive for icon-only on/off actions.

```jsx
<ToggleIcon label="Show route" defaultPressed>
  <Icon name="eye" size={18} />
</ToggleIcon>
```

- Always provide `label`; the visible content is icon-only.
- `variant="plain"`은 grouped light toolbar, `variant="on-dark"`는 dark viewport 위 조합에 사용합니다. pressed semantics와 disabled/focus 계약은 variant와 무관하게 같습니다.
- Use `ToggleIcon` for icon-only state actions and `ToggleButton` when the control has visible text.
- For one-shot icon actions, use `IconButton` instead.
- Native `disabled` removes the control from focus. `aria-disabled="true"` keeps it discoverable while applying the same unavailable styling and blocking activation; use that distinction only when a composite widget deliberately keeps unavailable choices in Arrow-key navigation.
