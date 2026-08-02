**IconButton** is the WDS Action/Icon Button primitive for icon-only actions
such as navigation arrows, close, search, and tool commands.

```jsx
<IconButton variant="soft" label="Previous">{chevronLeft}</IconButton>
<IconButton variant="signal" label="Back to top">{arrowUp}</IconButton>
<IconButton variant="soft" round={false} label="Open settings">{gear}</IconButton>
<IconButton variant="on-dark" label="Next">{chevronRight}</IconButton>
```

## Dense 24px size extension

Classification: **WDS Core with an explicit LDS compatibility extension**. The
accepted local WDS component-set evidence defines 28px, 32px, and 40px Icon
Button sizes. LDS preserves those sizes and adds `size="xs"` with the
`xsmall` alias as a 24px dense-action option for compact table rows. The legacy
`custom` key remains the public name of the WDS 28px size.

- `xs` / `xsmall`: `--component-icon-button-size-xs` (24px)
- `custom`: `--component-icon-button-size-custom` (28px)
- `sm` / `small`: `--component-icon-button-size-sm` (32px)
- `md` / `medium`: `--component-icon-button-size-md` (40px, default)

[WCAG 2.2 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)
sets a 24 by 24 CSS pixel minimum target, subject to its documented exceptions.
For that reason LDS does not add the observed 20px product workaround. Use the
24px extension only in deliberately dense action regions; general-purpose and
touch-forward surfaces retain the 32px or 40px sizes. The visual delta is
limited to the control box and its proportionally smaller glyph (typically
14–16px); variant color, radius, focus, hover, pressed, and disabled contracts
remain unchanged.

- Always provide `label`; it is the accessible name for the icon-only control.
  누락하면 development 빌드에서 console 경고가 출력됩니다(production 번들에서는
  제거됨). 이름을 외부 노드에서 참조해야 하면 `aria-labelledby`를 대신 쓰세요.
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
- hover/pressed는 tone만 변경하고 lift·scale·shadow를 추가하지 않습니다.
- [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)의
  accessible name, Enter/Space, unavailable semantics를 따릅니다. WDS의 원형
  Icon Button을 기본으로 유지하고 `round={false}`는 명시적인 LDS 확장입니다.
