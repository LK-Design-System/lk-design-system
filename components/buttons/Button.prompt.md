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
  `aria-busy`; use **loadingLabel** for the single screen-reader name
  (기본값 `불러오는 중`). The existing content keeps its width while visually
  hidden, so loading does not move adjacent controls.
- **loading="inline"**: the second loading presentation — the spinner sits
  beside the label and the variant palette stays. 말이 사라지면 안 되는
  컨트롤(예: "정지 요청 중"을 계속 말해야 하는 안전 정지)용. 차단 계약은
  `true`와 동일하고 표현만 다릅니다.
- **loading은 native `disabled`를 사용하지 않습니다.** 대신 `aria-disabled="true"`
  와 `aria-busy="true"`를 두고 activation만 차단합니다. native `disabled`로 만들면
  방금 그 버튼을 누른 키보드 사용자의 focus가 즉시 `<body>`로 튕기기 때문이며,
  Polaris·Carbon과 같은 처리입니다. 명시적인 `disabled`/`disable`만 tab 순서에서
  제거합니다.
- Native `disabled` removes a button from focus. `aria-disabled="true"` keeps it
  discoverable, applies the same unavailable treatment, and blocks activation.
- **iconOnly**는 접근 가능한 이름이 없으면 이름 없는 버튼이 됩니다. `aria-label`
  (또는 `aria-labelledby`)을 반드시 전달하세요. 누락 시 development 빌드에서만
  console 경고가 출력되며 production 번들에서는 제거됩니다.
- Disabled foreground, fill, and outlined border resolve semantic roles at the
  button's rendered theme scope, so nested dark surfaces do not inherit a
  root-resolved light alias.
- Ghost text also resolves from the rendered theme scope. Transparent fill and
  the hairline border carry its lower emphasis; text contrast is not reduced to
  create hierarchy.
- Hover and pressed feedback use calm tone changes only: no lift, scale, or
  shadow escalation. Focus remains the shared 2px `:focus-visible` outline.
- **as="a"** renders a link CTA while preserving Button styling.
- **arrow** is deprecated and remains as a no-op compatibility prop.
- Use `IconButton` for icon-only one-shot actions and `ToggleIcon` for
  icon-only persistent state actions.
- Footer action mapping is fixed: execute/save/apply uses the primary action;
  cancel/back uses `variant="outlined" color="assistive"`; destructive
  confirmation uses `variant="danger"` and a `ConfirmDialog`. Footer actions
  stay secondary-to-primary in DOM order and destructive actions are separated
  from an unrelated primary cluster.

## Contrast evidence

- [WCAG 2.2 contrast minimum](https://www.w3.org/TR/WCAG22/#contrast-minimum)
  requires 4.5:1 for normal-size button text.
- [Fluent 2 Button usage](https://fluent2.microsoft.design/components/web/react/core/button/usage)
  applies text contrast across interactive button states. LDS keeps ghost low
  emphasis through its transparent surface and border, not low-legibility text.

## 근거와 유지 차이

- [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)의
  native button, Enter/Space, accessible name, disabled semantics를 따릅니다.
- [Fluent 2 Button](https://fluent2.microsoft.design/components/web/react/core/button/usage)의
  단일 주요 액션과 toggle/split 역할 분리를 채택합니다.
- 32/40/48 높이와 solid/outlined·primary/assistive·icon-only·disable 축은
  WDS `Button/Button` component set을 따릅니다. `danger`, dark-surface 변형,
  loading과 polymorphic anchor는 명시적인 LDS 확장입니다.

TypeScript preserves the rendered element's props through the generic `as` contract. For example, `as="a"` accepts anchor props such as `href`, while the default button accepts native button props. Custom components receive their own declared props without widening the public surface to `any`.

## Public surface and ref

- Public root and native focus target are the same rendered element. `className`, `style`, and the default ref all target it, including polymorphic anchors.
- Stable parts are `root`, `content`, and `loader`; each is mirrored by `data-slot`. `data-disabled`, `data-loading`, `data-size`, and `data-variant` expose actual component state.
- `classNames` and `styles` accept only those stable part keys; they do not replace native Button semantics or activation ownership.
- `vars` accepts only `--lds-button-height`, `--lds-button-padding`, `--lds-button-radius`, and `--lds-button-gap`. It changes geometry without replacing Button semantics or loading behavior.
- `disable` and the `small|medium|large` size values are compatibility aliases. New code uses `disabled` and `sm|md|lg`.
