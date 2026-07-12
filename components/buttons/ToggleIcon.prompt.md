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
- hover/pressed는 tone만 변경하고 `aria-pressed`의 persistent state와 구분합니다.
- [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)처럼
  label을 상태에 따라 바꾸지 않고 `aria-pressed`만 갱신합니다. WDS의
  Active/Inactive 역할은 유지하며 boxed surface와 plain/on-dark는 승인된 LK 변형입니다.

- **disable** — `disabled`의 호환 별칭입니다.
