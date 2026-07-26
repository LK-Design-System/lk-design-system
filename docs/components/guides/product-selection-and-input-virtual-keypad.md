# Virtual Keypad

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Selection and Input |
| Owner | `VirtualKeypad` |
| Storybook | `LDS Product/Selection and Input/Virtual Keypad` |
| Source | `../component-content.json#product-selection-and-input-virtual-keypad` |

운영체제 숫자 키보드를 사용할 수 없거나 제품이 직접 입력면을 제공해야 하는 키오스크·임베디드 흐름에 적합합니다. 일반 모바일·데스크톱 폼에서는 운영체제가 제공하는 숫자 키보드를 먼저 사용하세요.

## 사용 판단

### 사용하지 않음

- min and max only decide whether confirmation is available. They never clamp, round, pad, or rewrite intermediate input. Empty values, sign-only values, and trailing decimal points are incomplete and therefore cannot be confirmed.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `value` | `string` | Yes | Controlled canonical value. Decimal values always use . internally. |
| `onChange` | `(value: string, meta: VirtualKeypadChangeMeta) = void` | Yes |  |
| `onConfirm` | `(value: string) = void` | Yes |  |
| `mode` | `VirtualKeypadMode` | No |  |
| `allowNegative` | `boolean` | No | Show the sign-toggle key and allow negative confirmation. @default false |
| `locale` | `string` | No | BCP 47 locale used only for the visible decimal key. @default "ko-KR" |
| `min` | `number` | No | Confirmation lower bound. Intermediate input is never clamped. |
| `max` | `number` | No | Confirmation upper bound. Intermediate input is never clamped. |
| `maxLength` | `number` | No | Maximum canonical string length, including sign and decimal point. |
| `disabled` | `boolean` | No | Disable every keypad action. @default false |
| `confirmDisabled` | `boolean` | No | Disable confirmation without disabling editing actions. @default false |
| `targetId` | `string` | No | Existing input id whose focus may be preserved during pointer activation. |
| `clearLabel` | `string` | No |  |
| `backspaceLabel` | `string` | No |  |
| `signLabel` | `string` | No |  |
| `confirmLabel` | `string` | No |  |

## States

| State | Contract |
| --- | --- |
| disabled | Disable every keypad action. @default false |
| confirmDisabled | Disable confirmation without disabling editing actions. @default false |

## Behavior and interaction

- onChange(nextValue, { action, key }) reports digit, decimal, sign, backspace, or clear. The decimal key always reports canonical key: '.' even when locale renders a comma. onConfirm(value) receives that same canonical string.
- maxLength counts the complete canonical string, including a sign and decimal point. It blocks only mutations that would grow beyond the limit; clear, backspace, and removing an existing sign remain available.
- document/global hardware-key capture, roving focus, arrow-key remapping, long-press repeat, or synthesized keyboard events;.
- target field rendering, selection/caret editing, target discovery, a shared target ref/hook, unit formatting, thousands grouping, parsing, rounding, clamping, or transport/save state;.
- VirtualKeypad is an LK Product Extension for numeric entry on kiosk and embedded surfaces where the product intentionally renders its own keypad. It is not WDS parity and it is not a replacement for the operating system's general-purpose keyboard or IME.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | value is always a controlled string. Digits, the canonical decimal point ., and the optional leading - are the only values the component itself inserts. |
| 명시 규칙 2 | Visual, DOM, and keyboard order are the same: digits 1–9, optional sign / 0 / optional decimal, then clear / backspace / confirm. Missing sign or decimal positions are non-interactive, aria-hidden grid cells rather than fake disabled keys. |
| 명시 규칙 3 | Every key is the existing native Button size="lg" (48px), so Enter/Space, focus-visible, pressed, and disabled behavior remain Button-owned. The keypad installs no document/global keyboard listener and no repeat-on-hold behavior. |
| 명시 규칙 4 | WCAG 2.2 Target Size (Minimum) requires at least a 24-by-24 CSS-pixel target unless an exception applies. LDS deliberately reuses its 48px large Button target for every densely adjacent key, exceeding the minimum without depending on spacing exceptions. |
| --border-thin | 1px |

## Responsive

- operating-system keyboard visibility control, VisualViewport/VirtualKeyboard inset management, sticky composer layout, or fullscreen kiosk policy;.
- | Closest LDS sibling | Retained constraint | Intentional delta and reason | | --- | --- | --- | | Button | native button semantics, 48px lg height, existing radius, focus, pressed and disabled treatments | The buttons are arranged in a three-column numeric layout; digits use flat, edit actions use ghost, and confirm…
- The group uses only established surface, line, spacing, radius, label, and Button tokens. Its outer surface groups touch targets without introducing a new elevation, shadow, status color, icon family, or motion language.

## Accessibility

- disabled disables all native buttons. confirmDisabled disables only confirmation. A consumer should connect any visible reason or range error through aria-describedby; the keypad does not invent product validation copy.
- targetId is an optional focus-preservation relationship, not a value binding. On pointer down, the keypad prevents the browser from moving focus only when that id resolves to the input that is already focused. It does not focus a target, search the document globally, or retain focus when some other control was active.
- clearLabel, backspaceLabel, signLabel, and confirmLabel name the four non-digit actions. They localize visible/accessibility text only and never change action eligibility, canonical keys, or callback semantics.
- W3C VirtualKeyboard API is a Working Draft for virtual-keyboard visibility and viewport/layout adaptation. VirtualKeypad does not require, call, or emulate that API; products may add it as a progressive viewport enhancement outside this component.
- WAI-ARIA APG Button Pattern defines named native button activation with Enter and Space. Individual keypad keys remain native Buttons; the outer role="group" only supplies the collective accessible name and does not replace button semantics with a custom keyboard model.

## Exceptions

- WHATWG HTML inputmode lets a user agent choose an appropriate input modality independently of input type. LDS therefore keeps native inputMode/enterKeyHint pass-through as the default path; a product uses inputmode="none" only when it has intentionally supplied a complete local input control.

## Related components

| Component | Relationship |
| --- | --- |
| `Input` | 대표 시나리오에서 조합 |
| `ColorSwatch` | 대표 시나리오에서 조합 |
| `DatePicker` | 대표 시나리오에서 조합 |
| `DateRangeField` | 대표 시나리오에서 조합 |
| `FileUpload` | 대표 시나리오에서 조합 |
| `FileUploadQueue` | 대표 시나리오에서 조합 |
| `IconPicker` | 대표 시나리오에서 조합 |
| `NumberField` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
const [value, setValue] = useState('0.');

<Input id="speed" value={value} inputMode="none" onChange={(event) => setValue(event.target.value)} />
<VirtualKeypad
  aria-label="속도 숫자 키패드"
  targetId="speed"
  value={value}
  mode="decimal"
  allowNegative
  min={-2}
  max={2}
  locale="ko-KR"
  onChange={(nextValue) => setValue(nextValue)}
  onConfirm={(confirmedValue) => save(confirmedValue)}
/>
```

## Tokens and API

### Tokens

- `--border-thin`
- `--color-semantic-background-normal-alternative`
- `--color-semantic-label-disable`
- `--color-semantic-label-normal`
- `--color-semantic-line-normal-normal`
- `--component-button-height-lg`
- `--font-sans`
- `--radius-xl`
- `--space-2`
- `--space-3`

### Source contracts

- `components/forms/VirtualKeypad.jsx`
- `components/forms/VirtualKeypad.d.ts`
- `components/forms/VirtualKeypad.prompt.md`
- `stories/SelectionVirtualKeypad.stories.jsx`

## Sources

- VirtualKeypad prompt contract: `components/forms/VirtualKeypad.prompt.md`
- Storybook implementation evidence: `stories/SelectionVirtualKeypad.stories.jsx`
- [WHATWG HTML inputmode](https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute)
- [W3C VirtualKeyboard API](https://www.w3.org/TR/virtual-keyboard/)
- [WCAG 2.2 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WAI-ARIA APG Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
