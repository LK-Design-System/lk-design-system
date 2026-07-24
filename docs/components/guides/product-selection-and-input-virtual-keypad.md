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

### 사용

- 운영체제 숫자 키보드를 사용할 수 없거나 제품이 직접 입력면을 제공해야 하는 키오스크·임베디드 흐름에 적합합니다. 일반 모바일·데스크톱 폼에서는 운영체제가 제공하는 숫자 키보드를 먼저 사용하세요.
- targetId is an optional focus-preservation relationship, not a value binding. On pointer down, the keypad prevents the browser from moving focus only when that id resolves to the input that is already focused. It does not focus a target, search the document globally, or retain focus when some other control was active.
- WHATWG HTML inputmode lets a user agent choose an appropriate input modality independently of input type. LDS therefore keeps native inputMode/enterKeyHint pass-through as the default path; a product uses inputmode="none" only when it has intentionally supplied a complete local input control.
- W3C VirtualKeyboard API is a Working Draft for virtual-keyboard visibility and viewport/layout adaptation. VirtualKeypad does not require, call, or emulate that API; products may add it as a progressive viewport enhancement outside this component.

### 사용하지 않음

- min and max only decide whether confirmation is available. They never clamp, round, pad, or rewrite intermediate input. Empty values, sign-only values, and trailing decimal points are incomplete and therefore cannot be confirmed.
- - value is always a controlled string. Digits, the canonical decimal point ., and the optional leading - are the only values the component itself inserts. This preserves incomplete editing states such as - and 0., as well as meaningful leading zeros such as 007; the keypad never converts the value to a number while ed….
- The group uses only established surface, line, spacing, radius, label, and Button tokens. Its outer surface groups touch targets without introducing a new elevation, shadow, status color, icon family, or motion language. Ghost edit keys resolve their foreground from the active semantic light/dark scope instead of the….
- Virtual Keypad가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | VirtualKeypad의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Clear Label | clearLabel 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Backspace Label | backspaceLabel 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Sign Label | signLabel 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Confirm Label | confirmLabel 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `value` | `string` | Yes | Controlled canonical value. Decimal values always use . internally. |
| `onChange` | `(value: string, meta: VirtualKeypadChangeMeta) = void` | Yes | 공개 타입 계약에 정의된 속성입니다. |
| `onConfirm` | `(value: string) = void` | Yes | 공개 타입 계약에 정의된 속성입니다. |
| `mode` | `VirtualKeypadMode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `allowNegative` | `boolean` | No | Show the sign-toggle key and allow negative confirmation. @default false |
| `locale` | `string` | No | BCP 47 locale used only for the visible decimal key. @default "ko-KR" |
| `min` | `number` | No | Confirmation lower bound. Intermediate input is never clamped. |
| `max` | `number` | No | Confirmation upper bound. Intermediate input is never clamped. |
| `maxLength` | `number` | No | Maximum canonical string length, including sign and decimal point. |
| `disabled` | `boolean` | No | Disable every keypad action. @default false |
| `confirmDisabled` | `boolean` | No | Disable confirmation without disabling editing actions. @default false |
| `targetId` | `string` | No | Existing input id whose focus may be preserved during pointer activation. |
| `clearLabel` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `backspaceLabel` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `signLabel` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `confirmLabel` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| disabled | Disable every keypad action. @default false 타입 계약: boolean |
| confirmDisabled | Disable confirmation without disabling editing actions. @default false 타입 계약: boolean |
| 변형·상태 · 범위 오류와 비활성 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 상호작용 · 대상 입력 초점 유지 | interaction 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 반응형 · 320px 좁은 폭 | responsive 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 반응형 · 낮은 가로 화면 | responsive 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- value is always a controlled string. Digits, the canonical decimal point ., and the optional leading - are the only values the component itself inserts. This preserves incomplete editing states such as - and 0., as well as meaningful leading zeros such as 007; the keypad never converts the value to a number while edit….
- Visual, DOM, and keyboard order are the same: digits 1–9, optional sign / 0 / optional decimal, then clear / backspace / confirm. Missing sign or decimal positions are non-interactive, aria-hidden grid cells rather than fake disabled keys.
- onChange(nextValue, { action, key }) reports digit, decimal, sign, backspace, or clear. The decimal key always reports canonical key: '.' even when locale renders a comma. onConfirm(value) receives that same canonical string.
- maxLength counts the complete canonical string, including a sign and decimal point. It blocks only mutations that would grow beyond the limit; clear, backspace, and removing an existing sign remain available.
- targetId is an optional focus-preservation relationship, not a value binding. On pointer down, the keypad prevents the browser from moving focus only when that id resolves to the input that is already focused. It does not focus a target, search the document globally, or retain focus when some other control was active.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | value is always a controlled string. Digits, the canonical decimal point ., and the optional leading - are the only values the component itself inserts. This preserves incomplete editing states such as - and 0., as well as meaningful leading zeros such as 007; the keypad never converts the value to a number while edit… |
| 명시 규칙 2 | Visual, DOM, and keyboard order are the same: digits 1–9, optional sign / 0 / optional decimal, then clear / backspace / confirm. Missing sign or decimal positions are non-interactive, aria-hidden grid cells rather than fake disabled keys. |
| 명시 규칙 3 | Every key is the existing native Button size="lg" (48px), so Enter/Space, focus-visible, pressed, and disabled behavior remain Button-owned. The keypad installs no document/global keyboard listener and no repeat-on-hold behavior. |
| 명시 규칙 4 | WCAG 2.2 Target Size (Minimum) requires at least a 24-by-24 CSS-pixel target unless an exception applies. LDS deliberately reuses its 48px large Button target for every densely adjacent key, exceeding the minimum without depending on spacing exceptions. |
| --border-thin | 1px |

## Responsive

- W3C VirtualKeyboard API is a Working Draft for virtual-keyboard visibility and viewport/layout adaptation. VirtualKeypad does not require, call, or emulate that API; products may add it as a progressive viewport enhancement outside this component.
- WCAG 2.2 Target Size (Minimum) requires at least a 24-by-24 CSS-pixel target unless an exception applies. LDS deliberately reuses its 48px large Button target for every densely adjacent key, exceeding the minimum without depending on spacing exceptions.
- operating-system keyboard visibility control, VisualViewport/VirtualKeyboard inset management, sticky composer layout, or fullscreen kiosk policy;.
- | Closest LDS sibling | Retained constraint | Intentional delta and reason | | --- | --- | --- | | Button | native button semantics, 48px lg height, existing radius, focus, pressed and disabled treatments | The buttons are arranged in a three-column numeric layout; digits use flat, edit actions use ghost, and confirm….

## Content and writing

- disabled disables all native buttons. confirmDisabled disables only confirmation. A consumer should connect any visible reason or range error through aria-describedby; the keypad does not invent product validation copy.
- clearLabel, backspaceLabel, signLabel, and confirmLabel name the four non-digit actions. They localize visible/accessibility text only and never change action eligibility, canonical keys, or callback semantics.
- WAI-ARIA APG Button Pattern defines named native button activation with Enter and Space. Individual keypad keys remain native Buttons; the outer role="group" only supplies the collective accessible name and does not replace button semantics with a custom keyboard model.
- - value is always a controlled string. Digits, the canonical decimal point ., and the optional leading - are the only values the component itself inserts. This preserves incomplete editing states such as - and 0., as well as meaningful leading zeros such as 007; the keypad never converts the value to a number while ed….

## Accessibility

- Visual, DOM, and keyboard order are the same: digits 1–9, optional sign / 0 / optional decimal, then clear / backspace / confirm. Missing sign or decimal positions are non-interactive, aria-hidden grid cells rather than fake disabled keys.
- disabled disables all native buttons. confirmDisabled disables only confirmation. A consumer should connect any visible reason or range error through aria-describedby; the keypad does not invent product validation copy.
- targetId is an optional focus-preservation relationship, not a value binding. On pointer down, the keypad prevents the browser from moving focus only when that id resolves to the input that is already focused. It does not focus a target, search the document globally, or retain focus when some other control was active.
- clearLabel, backspaceLabel, signLabel, and confirmLabel name the four non-digit actions. They localize visible/accessibility text only and never change action eligibility, canonical keys, or callback semantics.
- Every key is the existing native Button size="lg" (48px), so Enter/Space, focus-visible, pressed, and disabled behavior remain Button-owned. The keypad installs no document/global keyboard listener and no repeat-on-hold behavior.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | targetId is an optional focus-preservation relationship, not a value binding. On pointer down, the keypad prevents the browser from moving focus only when that id resolves to the input that is already focused. It does not focus a target, search the document globally, or retain focus when some other control was active. |
| Don't | min and max only decide whether confirmation is available. They never clamp, round, pad, or rewrite intermediate input. Empty values, sign-only values, and trailing decimal points are incomplete and therefore cannot be confirmed. |
| Do | WHATWG HTML inputmode lets a user agent choose an appropriate input modality independently of input type. LDS therefore keeps native inputMode/enterKeyHint pass-through as the default path; a product uses inputmode="none" only when it has intentionally supplied a complete local input control. |
| Don't | - value is always a controlled string. Digits, the canonical decimal point ., and the optional leading - are the only values the component itself inserts. This preserves incomplete editing states such as - and 0., as well as meaningful leading zeros such as 007; the keypad never converts the value to a number while ed…. |

## Exceptions

- targetId is an optional focus-preservation relationship, not a value binding. On pointer down, the keypad prevents the browser from moving focus only when that id resolves to the input that is already focused. It does not focus a target, search the document globally, or retain focus when some other control was active.
- WHATWG HTML inputmode lets a user agent choose an appropriate input modality independently of input type. LDS therefore keeps native inputMode/enterKeyHint pass-through as the default path; a product uses inputmode="none" only when it has intentionally supplied a complete local input control.
- WCAG 2.2 Target Size (Minimum) requires at least a 24-by-24 CSS-pixel target unless an exception applies. LDS deliberately reuses its 48px large Button target for every densely adjacent key, exceeding the minimum without depending on spacing exceptions.

## Related components

| Component | Relationship |
| --- | --- |
| `Input` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ColorSwatch` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DatePicker` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DateRangeField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FileUpload` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FileUploadQueue` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `IconPicker` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `NumberField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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

## Migration

- The group uses only established surface, line, spacing, radius, label, and Button tokens. Its outer surface groups touch targets without introducing a new elevation, shadow, status color, icon family, or motion language. Ghost edit keys resolve their foreground from the active semantic light/dark scope instead of the….
- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- VirtualKeypad prompt contract: `components/forms/VirtualKeypad.prompt.md`
- Storybook implementation evidence: `stories/SelectionVirtualKeypad.stories.jsx`
- [WHATWG HTML inputmode](https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute)
- [W3C VirtualKeyboard API](https://www.w3.org/TR/virtual-keyboard/)
- [WCAG 2.2 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WAI-ARIA APG Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
