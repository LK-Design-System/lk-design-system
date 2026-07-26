# Switch

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Selection and Input |
| Owner | `Switch` |
| Storybook | `LDS Core/Components/Selection and Input/Switch` |
| Source | `../component-content.json#core-components-selection-and-input-switch` |

변경 즉시 시스템 상태나 설정이 적용되는 on/off 제어에 적합합니다. 제출 시 한꺼번에 적용되는 동의·선택에는 Checkbox를, 실행 명령에는 Button을 사용하세요.

## Anatomy

| Part | Contract |
| --- | --- |
| label | 선택적 끝 라벨. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `checked` | `boolean` | No | 제어되는 on/off 상태. |
| `defaultChecked` | `boolean` | No | 비제어 초기 상태. @default false |
| `onChange` | `(next: boolean) = void` | No | 토글 시 다음 불리언과 함께 호출. |
| `label` | `React.ReactNode` | No | 선택적 끝 라벨. |
| `size` | `"sm" \| "md" \| "small" \| "medium"` | No | 트랙 크기. @default "md" |
| `state` | `"unchecked" \| "checked" \| "off" \| "on"` | No | fixed visual state for evidence matrices. |
| `platform` | `"normal" \| "ios" \| "android"` | No | platform visual variant. @default "normal" |
| `interaction` | `"normal" \| "inactive" \| "hovered" \| "focused"` | No |  |
| `active` | `boolean` | No | active visual state alias. |
| `focus` | `boolean` | No | focus visual state alias. |
| `disabled` | `boolean` | No | 비활성(흐림, 상호작용 불가). @default false |
| `disable` | `boolean` | No | disabled alias. |
| `readOnly` | `boolean` | No | Focusable inspection state that prevents value changes. |
| `name` | `string` | No | 네이티브 폼 컨트롤 이름 — 켜진 상태로 폼과 함께 전송됩니다. |
| `value` | `string` | No | 켜졌을 때 전송되는 값. @default "on" |
| `labelStyle` | `React.CSSProperties` | No |  |
| `style` | `React.CSSProperties` | No |  |
| `id` | `string` | No |  |

## States

| State | Contract |
| --- | --- |
| checked | 제어되는 on/off 상태. |
| defaultChecked | 비제어 초기 상태. @default false |
| state | fixed visual state for evidence matrices. |
| active | active visual state alias. |
| disabled | 비활성(흐림, 상호작용 불가). @default false |
| readOnly | Focusable inspection state that prevents value changes. |

## Behavior and interaction

- checked / defaultChecked / onChange(next) — 제어/비제어.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | Switch exposes role="switch" with aria-checked; Space and Enter toggle immediately. The control-to-label gap is 8px. |
| 명시 규칙 2 | 트랙 지오메트리(md 52×32 · sm 40×24), 노브 이동(색이 아닌 위치로도 상태 전달), disabled tabIndex=-1은 변경되지 않았습니다. |
| 명시 규칙 3 | size — md(52×32) · sm(40×24). label은 오른쪽에 위치. disabled는 토큰 색(회색 트랙·노브)으로 표시. |
| --body2-size | 15px |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |

## Content and writing

- 키보드 조작 가능: 포커스 가능, Space/Enter로 토글, 네이비 틴트 포커스 링. 텍스트 라벨이 있는 박스형 on/off는 Checkbox를 쓰세요.

## Accessibility

- readOnly remains focusable and communicates aria-readonly, but it suppresses pointer/keyboard changes and editable hover affordance. disabled is removed from the tab order.
- Reference basis: WAI-ARIA Switch pattern.
- 시각적으로 숨긴 네이티브 를 이 감싸는 구조를 씁니다(Material/Fluent/Ant와 동일한 선택). 대신 이 방식을 고른 이유는 폼 전송(name/value)과 브라우저 폼 복원이 필요하고, role="switch"가 input[type=checkbox]에 허용된 역할이라 aria-checked 의미를 그대로 유지할 수 있기 때문입니다. 트랙과 노브는 aria-hidden 장식 요소입니다.
- 접근 이름은 감싸는 의 내용에서 나옵니다. label에 JSX 노드를 넘겨도 이름이 "switch"로 떨어지지 않습니다. 이름을 직접 지정할 때만 aria-label을 쓰세요.
- Space는 네이티브 checkbox 활성화에 맡기고, Enter만 onKeyDown에서 preventDefault() 후 직접 토글합니다(Switch 계약 유지 + 폼 제출 방지). 소비자 onKeyDown이 먼저 실행되고, preventDefault()를 호출하면 내부 처리를 건너뜁니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Checkbox` | 대표 시나리오에서 조합 |
| `CheckboxGroup` | 대표 시나리오에서 조합 |
| `FilterChip` | 대표 시나리오에서 조합 |
| `MultiSelectChip` | 대표 시나리오에서 조합 |
| `Radio` | 대표 시나리오에서 조합 |
| `RadioGroup` | 대표 시나리오에서 조합 |
| `RangeSlider` | 대표 시나리오에서 조합 |
| `SegmentedControl` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Switch defaultChecked label="변경 알림" />
<Switch size="sm" checked={on} onChange={setOn} />
<Switch name="night-mode" value="on" label="야간 모드" />
<Switch disabled label="준비 중" />
```

## Tokens and API

### Tokens

- `--body2-size`
- `--color-semantic-fill-normal`
- `--color-semantic-fill-strong`
- `--color-semantic-focus-ring`
- `--color-semantic-interaction-inactive`
- `--color-semantic-label-disable`
- `--color-semantic-label-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-static-white`
- `--component-input-gap`
- `--dur-base`
- `--dur-fast`
- `--ease-in-out`
- `--ease-out`
- `--font-sans`
- `--radius-pill`
- `--shadow-control`
- `--shadow-sm`

### Source contracts

- `components/selection/Switch.jsx`
- `components/selection/Switch.d.ts`
- `components/selection/Switch.prompt.md`
- `stories/SelectionSwitch.stories.jsx`

## Sources

- Switch prompt contract: `components/selection/Switch.prompt.md`
- Storybook implementation evidence: `stories/SelectionSwitch.stories.jsx`
- [WAI-ARIA Switch pattern](https://www.w3.org/WAI/ARIA/apg/patterns/switch/)
