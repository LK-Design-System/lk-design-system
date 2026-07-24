# Checkbox

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Selection and Input |
| Owner | `Checkbox` |
| Storybook | `LDS Core/Components/Selection and Input/Checkbox` |
| Source | `../component-content.json#core-components-selection-and-input-checkbox` |

여러 항목을 각각 켜거나 끌 수 있고 선택 조합이 허용될 때 적합합니다. 반드시 하나만 골라야 하거나 즉시 적용되는 단일 설정에는 Checkbox 대신 Radio 또는 Switch를 사용하세요.

## 사용 판단

### 사용

- 여러 항목을 각각 켜거나 끌 수 있고 선택 조합이 허용될 때 적합합니다. 반드시 하나만 골라야 하거나 즉시 적용되는 단일 설정에는 Checkbox 대신 Radio 또는 Switch를 사용하세요.
- Checkbox, Radio, and Switch use the same 8px control-to-label gap. Checkbox remains independently toggleable and uses mixed only for a true aggregate indeterminate state.
- 혼합 상태: indeterminate(또는 state="indeterminate")는 checked와 독립입니다. 네이티브 input.indeterminate를 ref로 설정하고 aria-checked="mixed"를 함께 노출하며, 시각적으로는 가로 막대를 보여줍니다(체크 표시는 숨김).
- 호환을 위해 input에 role="checkbox"·aria-checked·aria-disabled를 명시적으로 유지합니다. 값이 네이티브 상태와 항상 일치하므로 axe의 조건부 검사(aria-conditional-checkbox-attr)를 통과합니다.

### 사용하지 않음

- 토글은 Space만 수행합니다(APG). Enter는 토글하지 않습니다 — 네이티브 input 동작을 그대로 따릅니다.
- 타깃 크기: 시각 박스는 md 18px · sm 16px 그대로 두고, 그 위에 놓인 투명한 네이티브 input만 24×24px로 확장해 WCAG 2.5.8 (Target Size, Minimum)을 만족시킵니다. 픽셀 출력은 변하지 않습니다.
- - Radio와 동일하게 시각적으로 숨긴 네이티브 를 이 감싸는 구조입니다. 사각형은 aria-hidden 장식 인디케이터일 뿐입니다. 따라서 name/value 폼 전송, 브라우저 폼 복원, :checked, 네이티브 키보드 계약이 그대로 동작합니다. - 접근 이름은 감싸는 의 내용에서 나옵니다. label에 JSX 노드를 넘겨도(예: CheckboxGroup의 제목 + 설명 조합) 이름이 "checkbox"로 떨어지지 않습니다. 이름을 직접 지정할 때만 aria-label을 쓰세요. - 토글은 Space만 수행합니다(APG). Enter는 토글하지 않습니다 —….
- Checkbox가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Checkbox의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Label | Optional label rendered next to the control. |
| Interaction | Forces visual interaction state for documentation matrices. |
| Label Style | labelStyle 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Aria Label | aria-label 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

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
| `labelStyle` | `React.CSSProperties` | No | 공개 타입 계약에 정의된 속성입니다. |
| `style` | `React.CSSProperties` | No | 공개 타입 계약에 정의된 속성입니다. |
| `id` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `aria-label` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onKeyDown` | `(event: React.KeyboardEvent) = void` | No | Forwarded to the native input; runs before the built-in Space toggle. |
| `onFocus` | `(event: React.FocusEvent) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onBlur` | `(event: React.FocusEvent) = void` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| checked | Controlled checked state. 타입 계약: boolean |
| defaultChecked | Initial checked state for uncontrolled usage. 타입 계약: boolean |
| onChange | Called with the next checked state. 타입 계약: (checked: boolean) = void |
| variant | Visual style. mark renders the source-style check mark treatment. @default "box" 타입 계약: "box" \| "mark" |
| status | Semantic status tone for the mark variant. @default "normal" 타입 계약: "normal" \| "negative" |
| state | fixed visual state for evidence matrices. 타입 계약: "unchecked" \| "checked" \| "indeterminate" |
| interaction | Forces visual interaction state for documentation matrices. 타입 계약: "normal" \| "inactive" \| "hovered" \| "focused" |
| disabled | Blocks pointer and keyboard interaction. @default false 타입 계약: boolean |

## Behavior and interaction

- Radio와 동일하게 시각적으로 숨긴 네이티브 를 이 감싸는 구조입니다. 사각형은 aria-hidden 장식 인디케이터일 뿐입니다. 따라서 name/value 폼 전송, 브라우저 폼 복원, :checked, 네이티브 키보드 계약이 그대로 동작합니다.
- 토글은 Space만 수행합니다(APG). Enter는 토글하지 않습니다 — 네이티브 input 동작을 그대로 따릅니다.
- 소비자가 넘긴 onKeyDown/onFocus/onBlur는 내부 핸들러보다 먼저 실행되며 토글을 죽이지 않습니다. 의도적으로 막으려면 핸들러에서 preventDefault()를 호출하세요. {...rest}는 내부 속성보다 앞서 펼쳐집니다.
- 혼합 상태: indeterminate(또는 state="indeterminate")는 checked와 독립입니다. 네이티브 input.indeterminate를 ref로 설정하고 aria-checked="mixed"를 함께 노출하며, 시각적으로는 가로 막대를 보여줍니다(체크 표시는 숨김).
- 호환을 위해 input에 role="checkbox"·aria-checked·aria-disabled를 명시적으로 유지합니다. 값이 네이티브 상태와 항상 일치하므로 axe의 조건부 검사(aria-conditional-checkbox-attr)를 통과합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | Checkbox, Radio, and Switch use the same 8px control-to-label gap. Checkbox remains independently toggleable and uses mixed only for a true aggregate indeterminate state. |
| 명시 규칙 2 | 타깃 크기: 시각 박스는 md 18px · sm 16px 그대로 두고, 그 위에 놓인 투명한 네이티브 input만 24×24px로 확장해 WCAG 2.5.8 (Target Size, Minimum)을 만족시킵니다. 픽셀 출력은 변하지 않습니다. |
| 명시 규칙 3 | - Checkbox, Radio, and Switch use the same 8px control-to-label gap. Checkbox remains independently toggleable and uses mixed only for a true aggregate indeterminate state. - Reference basis: WAI-ARIA Checkbox pattern and GOV.UK Checkboxes. |
| 명시 규칙 4 | - Radio와 동일하게 시각적으로 숨긴 네이티브 를 이 감싸는 구조입니다. 사각형은 aria-hidden 장식 인디케이터일 뿐입니다. 따라서 name/value 폼 전송, 브라우저 폼 복원, :checked, 네이티브 키보드 계약이 그대로 동작합니다. - 접근 이름은 감싸는 의 내용에서 나옵니다. label에 JSX 노드를 넘겨도(예: CheckboxGroup의 제목 + 설명 조합) 이름이 "checkbox"로 떨어지지 않습니다. 이름을 직접 지정할 때만 aria-label을 쓰세요. - 토글은 Space만 수행합니다(APG). Enter는 토글하지 않습니다 —… |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- Checkbox, Radio, and Switch use the same 8px control-to-label gap. Checkbox remains independently toggleable and uses mixed only for a true aggregate indeterminate state.
- Radio와 동일하게 시각적으로 숨긴 네이티브 를 이 감싸는 구조입니다. 사각형은 aria-hidden 장식 인디케이터일 뿐입니다. 따라서 name/value 폼 전송, 브라우저 폼 복원, :checked, 네이티브 키보드 계약이 그대로 동작합니다.
- 접근 이름은 감싸는 의 내용에서 나옵니다. label에 JSX 노드를 넘겨도(예: CheckboxGroup의 제목 + 설명 조합) 이름이 "checkbox"로 떨어지지 않습니다. 이름을 직접 지정할 때만 aria-label을 쓰세요.
- - Checkbox, Radio, and Switch use the same 8px control-to-label gap. Checkbox remains independently toggleable and uses mixed only for a true aggregate indeterminate state. - Reference basis: WAI-ARIA Checkbox pattern and GOV.UK Checkboxes.

## Accessibility

- Reference basis: WAI-ARIA Checkbox pattern and GOV.UK Checkboxes.
- Radio와 동일하게 시각적으로 숨긴 네이티브 를 이 감싸는 구조입니다. 사각형은 aria-hidden 장식 인디케이터일 뿐입니다. 따라서 name/value 폼 전송, 브라우저 폼 복원, :checked, 네이티브 키보드 계약이 그대로 동작합니다.
- 접근 이름은 감싸는 의 내용에서 나옵니다. label에 JSX 노드를 넘겨도(예: CheckboxGroup의 제목 + 설명 조합) 이름이 "checkbox"로 떨어지지 않습니다. 이름을 직접 지정할 때만 aria-label을 쓰세요.
- 토글은 Space만 수행합니다(APG). Enter는 토글하지 않습니다 — 네이티브 input 동작을 그대로 따릅니다.
- 소비자가 넘긴 onKeyDown/onFocus/onBlur는 내부 핸들러보다 먼저 실행되며 토글을 죽이지 않습니다. 의도적으로 막으려면 핸들러에서 preventDefault()를 호출하세요. {...rest}는 내부 속성보다 앞서 펼쳐집니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Checkbox, Radio, and Switch use the same 8px control-to-label gap. Checkbox remains independently toggleable and uses mixed only for a true aggregate indeterminate state. |
| Don't | 토글은 Space만 수행합니다(APG). Enter는 토글하지 않습니다 — 네이티브 input 동작을 그대로 따릅니다. |
| Do | 혼합 상태: indeterminate(또는 state="indeterminate")는 checked와 독립입니다. 네이티브 input.indeterminate를 ref로 설정하고 aria-checked="mixed"를 함께 노출하며, 시각적으로는 가로 막대를 보여줍니다(체크 표시는 숨김). |
| Don't | 타깃 크기: 시각 박스는 md 18px · sm 16px 그대로 두고, 그 위에 놓인 투명한 네이티브 input만 24×24px로 확장해 WCAG 2.5.8 (Target Size, Minimum)을 만족시킵니다. 픽셀 출력은 변하지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Checkbox의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `CheckboxGroup` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FilterChip` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `MultiSelectChip` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Radio` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `RadioGroup` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `RangeSlider` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `SegmentedControl` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Slider` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<Checkbox checked={agreed} onChange={setAgreed} label="개인정보 수집·이용에 동의합니다." />
<Checkbox name="channels" value="email" defaultChecked label="이메일 알림" />
```

## Tokens and API

### Tokens

- `--color-semantic-background-elevated-normal`
- `--color-semantic-brand-ink`
- `--color-semantic-fill-normal`
- `--color-semantic-fill-strong`
- `--color-semantic-focus-ring`
- `--color-semantic-interaction-inactive`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
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
- - Radio와 동일하게 시각적으로 숨긴 네이티브 를 이 감싸는 구조입니다. 사각형은 aria-hidden 장식 인디케이터일 뿐입니다. 따라서 name/value 폼 전송, 브라우저 폼 복원, :checked, 네이티브 키보드 계약이 그대로 동작합니다. - 접근 이름은 감싸는 의 내용에서 나옵니다. label에 JSX 노드를 넘겨도(예: CheckboxGroup의 제목 + 설명 조합) 이름이 "checkbox"로 떨어지지 않습니다. 이름을 직접 지정할 때만 aria-label을 쓰세요. - 토글은 Space만 수행합니다(APG). Enter는 토글하지 않습니다 —….
- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Checkbox prompt contract: `components/forms/Checkbox.prompt.md`
- Storybook implementation evidence: `stories/FormCheckbox.stories.jsx`
- [WAI-ARIA Checkbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/)
- [GOV.UK Checkboxes](https://design-system.service.gov.uk/components/checkboxes/)
- [SEED Checkbox benchmark](https://seed-design.io/components/checkbox)
