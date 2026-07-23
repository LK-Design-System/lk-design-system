**TextButton** is the WDS Action/Text Button primitive for low-emphasis text
actions. Use it for inline links, card footers, secondary dismissals, and
compact "more" actions.

```jsx
<TextButton>View all</TextButton>
<TextButton tone="neutral" underline>Cancel</TextButton>
<TextButton loading loadingLabel="Loading more">Loading</TextButton>
<TextButton as="a" href="/products">View products</TextButton>
```

- **tone**: `signal`, `neutral`, `danger`.
- **size**: `sm`, `md`, `lg`.
- **underline** gives link-style emphasis; **as="a"** renders a link.
- **loading** prevents repeated activation, renders a spinner, and sets
  `aria-busy`; use **loadingLabel** for the single screen-reader name
  (기본값 `불러오는 중`). Existing content keeps its width while visually hidden.
- loading은 native `disabled`가 아니라 `aria-disabled="true"` + `aria-busy="true"`로
  처리해 focus를 유지합니다(Button과 동일한 계약).
- Native `disabled` removes the action from focus. `aria-disabled="true"` keeps
  it discoverable while applying unavailable styling and blocking activation.
- hover/pressed는 opacity tone만 낮추며 lift·scale·shadow를 사용하지 않습니다.
- **arrow** is deprecated and remains as a no-op compatibility prop.
- Use `Button` for filled CTAs and `IconButton` for icon-only actions.
- TextButton is a button-style action with sizes and loading state. Use `Link`
  for pure anchor/navigation text with underline control.
- [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)의
  keyboard/disabled 계약을 따릅니다. WDS 직접 축은 primary/assistive,
  small/medium, disable이며 `danger`, `lg`, underline, loading, anchor는 LDS 확장입니다.
