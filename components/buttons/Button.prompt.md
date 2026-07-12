**Button** is the WDS Action/Button primitive for primary, secondary, and
supporting actions. LDS keeps WDS action roles but maps visual values through
LK theme tokens.

```jsx
<Button variant="primary">Request quote</Button>
<Button variant="signal" size="lg">View product</Button>
<Button variant="danger">Emergency stop request</Button>
<Button variant="ghost">Details</Button>
<Button variant="on-dark">Learn more</Button>
<Button loading loadingLabel="Saving">Saving</Button>
<Button as="a" href="contact.html" variant="primary" full>Contact</Button>
```

- **variant**: `primary`, `secondary`, `signal`, `dark`, `flat`, `ghost`,
  `on-dark`. `danger` is an explicit LDS safety extension, not a WDS parity axis.
- **size**: `sm`, `md`, `lg`.
- **full**: fills the container width.
- **loading**: prevents repeated activation, renders a spinner, and sets
  `aria-busy`; use **loadingLabel** for the single screen-reader name. The
  existing content keeps its width while visually hidden, so loading does not
  move adjacent controls.
- Native `disabled` removes a button from focus. `aria-disabled="true"` keeps it
  discoverable, applies the same unavailable treatment, and blocks activation.
- Disabled foreground, fill, and outlined border resolve semantic roles at the
  button's rendered theme scope, so nested dark surfaces do not inherit a
  root-resolved light alias.
- Hover and pressed feedback use calm tone changes only: no lift, scale, or
  shadow escalation. Focus remains the shared 2px `:focus-visible` outline.
- **as="a"** renders a link CTA while preserving Button styling.
- **arrow** is deprecated and remains as a no-op compatibility prop.
- Use `IconButton` for icon-only one-shot actions and `ToggleIcon` for
  icon-only persistent state actions.

## 근거와 유지 차이

- [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)의
  native button, Enter/Space, accessible name, disabled semantics를 따릅니다.
- [Fluent 2 Button](https://fluent2.microsoft.design/components/web/react/core/button/usage)의
  단일 주요 액션과 toggle/split 역할 분리를 채택합니다.
- 32/40/48 높이와 solid/outlined·primary/assistive·icon-only·disable 축은
  WDS `Button/Button` component set을 따릅니다. `danger`, dark-surface 변형,
  loading과 polymorphic anchor는 명시적인 LDS 확장입니다.
