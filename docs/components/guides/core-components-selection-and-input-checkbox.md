# Checkbox

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Selection and Input |
| Owner | `Checkbox` |
| Storybook | `LDS Core/Components/Selection and Input/Checkbox` |
| Source | `../component-content.json#core-components-selection-and-input-checkbox` |

여러 항목을 각각 켜거나 끌 수 있고 선택 조합이 허용될 때 적합합니다. 반드시 하나만 골라야 하거나 즉시 적용되는 단일 설정에는 Checkbox 대신 Radio 또는 Switch를 사용하세요.

## Anatomy

| Part | Contract |
| --- | --- |
| label | Optional label rendered next to the control. |
| interaction | Forces visual interaction state for documentation matrices. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `label` | `React.ReactNode` | No | Optional label rendered next to the control. |
| `checked` | `boolean` | No | Controlled checked state. |
| `defaultChecked` | `boolean` | No | Initial checked state for uncontrolled usage. |
| `indeterminate` | `boolean` | No | Mixed checkbox state. Applies to the default box variant. @default false |
| `onChange` | `(checked: boolean) = void` | No | Called with the next checked state. |
| `name` | `string` | No | Native form control name — submitted with the form when checked. |
| `value` | `string` | No | Native form control value submitted when checked. @default "on" |
| `variant` | `"box" \| "mark"` | No | Visual style. mark renders the source-style check mark treatment. @default "box" |
| `status` | `"normal" \| "negative"` | No | Semantic status tone for the mark variant. @default "normal" |
| `state` | `"unchecked" \| "checked" \| "indeterminate"` | No | fixed visual state for evidence matrices. |
| `bold` | `boolean` | No | custom typography emphasis alias. |
| `size` | `"sm" \| "md" \| "small" \| "medium"` | No | Control size. @default "md" |
| `tight` | `boolean` | No | Reduces spacing between control and label. @default false |
| `interaction` | `"normal" \| "inactive" \| "hovered" \| "focused"` | No | Forces visual interaction state for documentation matrices. |
| `disabled` | `boolean` | No | Blocks pointer and keyboard interaction. @default false |
| `disable` | `boolean` | No | disabled alias. |
| `labelStyle` | `React.CSSProperties` | No |  |
| `style` | `React.CSSProperties` | No |  |
| `id` | `string` | No |  |
| `aria-label` | `string` | No |  |
| `onKeyDown` | `(event: React.KeyboardEvent) = void` | No | Forwarded to the native input; runs before the built-in Space toggle. |
| `onFocus` | `(event: React.FocusEvent) = void` | No |  |
| `onBlur` | `(event: React.FocusEvent) = void` | No |  |

## States

| State | Contract |
| --- | --- |
| checked | Controlled checked state. |
| defaultChecked | Initial checked state for uncontrolled usage. |
| onChange | Called with the next checked state. |
| variant | Visual style. mark renders the source-style check mark treatment. @default "box" |
| status | Semantic status tone for the mark variant. @default "normal" |
| state | fixed visual state for evidence matrices. |
| interaction | Forces visual interaction state for documentation matrices. |
| disabled | Blocks pointer and keyboard interaction. @default false |

## Behavior and interaction

- Checkbox — 켜지면 LK 시그널 잉크 + 화이트 체크로 채워지는 라운드 사각형. 제어(checked) 또는 비제어(defaultChecked); onChange는 다음 불리언을 받습니다.
- Selection contract.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | Checkbox, Radio, and Switch use the same 8px control-to-label gap. Checkbox remains independently toggleable and uses mixed only for a true aggregate indeterminate state. |
| 명시 규칙 2 | 타깃 크기: 시각 박스는 md 18px · sm 16px 그대로 두고, 그 위에 놓인 투명한 네이티브 input만 24×24px로 확장해 WCAG 2.5.8 (Target Size, Minimum)을 만족시킵니다. 픽셀 출력은 변하지 않습니다. |
| 명시 규칙 3 | size를 생략하면 일반 표면에서는 기존 md, bounded compact component scope에서는 sm 시각 glyph를 사용합니다. 두 크기 모두 투명 native input target은 최소 24×24px이며 명시한 size가 상속값보다 우선합니다. |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |

## Accessibility

- Reference basis: WAI-ARIA Checkbox pattern and GOV.UK Checkboxes.
- Radio와 동일하게 시각적으로 숨긴 네이티브 를 이 감싸는 구조입니다. 사각형은 aria-hidden 장식 인디케이터일 뿐입니다. 따라서 name/value 폼 전송, 브라우저 폼 복원, :checked, 네이티브 키보드 계약이 그대로 동작합니다.
- 접근 이름은 감싸는 의 내용에서 나옵니다. label에 JSX 노드를 넘겨도(예: CheckboxGroup의 제목 + 설명 조합) 이름이 "checkbox"로 떨어지지 않습니다. 이름을 직접 지정할 때만 aria-label을 쓰세요.
- 토글은 Space만 수행합니다(APG). Enter는 토글하지 않습니다 — 네이티브 input 동작을 그대로 따릅니다.
- 소비자가 넘긴 onKeyDown/onFocus/onBlur는 내부 핸들러보다 먼저 실행되며 토글을 죽이지 않습니다. 의도적으로 막으려면 핸들러에서 preventDefault()를 호출하세요. {...rest}는 내부 속성보다 앞서 펼쳐집니다.

## Related components

| Component | Relationship |
| --- | --- |
| `CheckboxGroup` | 대표 시나리오에서 조합 |
| `FilterChip` | 대표 시나리오에서 조합 |
| `MultiSelectChip` | 대표 시나리오에서 조합 |
| `Radio` | 대표 시나리오에서 조합 |
| `RadioGroup` | 대표 시나리오에서 조합 |
| `RangeSlider` | 대표 시나리오에서 조합 |
| `SegmentedControl` | 대표 시나리오에서 조합 |
| `Slider` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Checkbox checked={agreed} onChange={setAgreed} label="개인정보 수집·이용에 동의합니다." />
<Checkbox name="channels" value="email" defaultChecked label="이메일 알림" />
```

## Tokens and API

### Tokens

- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-normal`
- `--color-semantic-fill-strong`
- `--color-semantic-focus-ring`
- `--color-semantic-interaction-inactive`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-line-normal-neutral`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-static-white`
- `--color-semantic-status-negative`
- `--component-input-gap`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--label1-size`
- `--radius-5`
- `--radius-pill`

### Source contracts

- `components/forms/Checkbox.jsx`
- `components/forms/Checkbox.d.ts`
- `components/forms/Checkbox.prompt.md`
- `stories/FormCheckbox.stories.jsx`

## Migration

- 호환을 위해 input에 role="checkbox"·aria-checked·aria-disabled를 명시적으로 유지합니다. 값이 네이티브 상태와 항상 일치하므로 axe의 조건부 검사(aria-conditional-checkbox-attr)를 통과합니다.

## Sources

- Checkbox prompt contract: `components/forms/Checkbox.prompt.md`
- Storybook implementation evidence: `stories/FormCheckbox.stories.jsx`
- [WAI-ARIA Checkbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/)
- [GOV.UK Checkboxes](https://design-system.service.gov.uk/components/checkboxes/)
