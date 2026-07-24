# Radio

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Selection and Input |
| Owner | `Radio` |
| Storybook | `LDS Core/Components/Selection and Input/Radio` |
| Source | `../component-content.json#core-components-selection-and-input-radio` |

비교해야 할 선택지가 적고 반드시 하나만 고르는 폼에 적합합니다. 여러 항목을 함께 선택하거나 옵션이 많아 공간을 줄여야 할 때는 Radio 대신 Checkbox 또는 Select를 사용하세요.

## 사용 판단

### 사용

- 비교해야 할 선택지가 적고 반드시 하나만 고르는 폼에 적합합니다. 여러 항목을 함께 선택하거나 옵션이 많아 공간을 줄여야 할 때는 Radio 대신 Checkbox 또는 Select를 사용하세요.
- Disabled and checked are independent states: a disabled checked radio keeps its neutral center dot so the current value remains visible, while primary fill/border is removed and label, ring, and dot use disabled-neutral roles. SegmentedControl, ButtonGroup, and ChoiceCard use this same “preserve selection, remove prim….
- - Related radios share name; uncontrolled radios synchronize their custom indicator with the browser's native group state. The label gap is 8px and the default selected dot is 12px. - Disabled and checked are independent states: a disabled checked radio keeps its neutral center dot so the current value remains visible….
- Radio가 소유하는 Selection and Input 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.

### 사용하지 않음

- Arrow-key behavior and single-selection semantics come from the native radio input. Do not replace it with independent custom tab stops.
- - Related radios share name; uncontrolled radios synchronize their custom indicator with the browser's native group state. The label gap is 8px and the default selected dot is 12px. - Disabled and checked are independent states: a disabled checked radio keeps its neutral center dot so the current value remains visible….
- Radio가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Radio의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Label | 컨트롤 옆 라벨. |
| Interaction | interaction 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Label Style | labelStyle 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Aria Label | aria-label 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `label` | `React.ReactNode` | No | 컨트롤 옆 라벨. |
| `checked` | `boolean` | No | 이 옵션의 선택 여부. |
| `defaultChecked` | `boolean` | No | Initial checked state for uncontrolled usage. |
| `name` | `string` | No | 라디오 세트가 공유하는 그룹 이름. |
| `value` | `string` | No | 이 옵션의 값. |
| `onChange` | `(e: React.ChangeEvent) = void` | No | 네이티브 change 핸들러. |
| `size` | `"sm" \| "md" \| "small" \| "medium"` | No | 컨트롤 크기. @default "md" |
| `state` | `"unchecked" \| "checked"` | No | fixed visual state for evidence matrices. |
| `bold` | `boolean` | No | custom typography emphasis alias. |
| `tight` | `boolean` | No | 라벨 간격을 좁힘. @default false |
| `interaction` | `"normal" \| "inactive" \| "hovered" \| "focused"` | No | 공개 타입 계약에 정의된 속성입니다. |
| `disabled` | `boolean` | No | 흐림 + 상호작용 차단. @default false |
| `disable` | `boolean` | No | disabled alias. |
| `labelStyle` | `React.CSSProperties` | No | 공개 타입 계약에 정의된 속성입니다. |
| `style` | `React.CSSProperties` | No | 공개 타입 계약에 정의된 속성입니다. |
| `id` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `aria-label` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| checked | 이 옵션의 선택 여부. 타입 계약: boolean |
| defaultChecked | Initial checked state for uncontrolled usage. 타입 계약: boolean |
| state | fixed visual state for evidence matrices. 타입 계약: "unchecked" \| "checked" |
| interaction | 공개 타입 계약에 정의된 속성입니다. 타입 계약: "normal" \| "inactive" \| "hovered" \| "focused" |
| disabled | 흐림 + 상호작용 차단. @default false 타입 계약: boolean |

## Behavior and interaction

- Related radios share name; uncontrolled radios synchronize their custom indicator with the browser's native group state. The label gap is 8px and the default selected dot is 12px.
- Disabled and checked are independent states: a disabled checked radio keeps its neutral center dot so the current value remains visible, while primary fill/border is removed and label, ring, and dot use disabled-neutral roles. SegmentedControl, ButtonGroup, and ChoiceCard use this same “preserve selection, remove prim….
- Arrow-key behavior and single-selection semantics come from the native radio input. Do not replace it with independent custom tab stops.
- Radio — 1.5px 헤어라인 원(20px, sm 16px). 선택되면 원이 시그널 잉크로 채워지고 화이트 중앙 점이 나타납니다. 그룹은 같은 name을 공유하세요.
- - Related radios share name; uncontrolled radios synchronize their custom indicator with the browser's native group state. The label gap is 8px and the default selected dot is 12px. - Disabled and checked are independent states: a disabled checked radio keeps its neutral center dot so the current value remains visible….

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | Related radios share name; uncontrolled radios synchronize their custom indicator with the browser's native group state. The label gap is 8px and the default selected dot is 12px. |
| 명시 규칙 2 | Radio — 1.5px 헤어라인 원(20px, sm 16px). 선택되면 원이 시그널 잉크로 채워지고 화이트 중앙 점이 나타납니다. 그룹은 같은 name을 공유하세요. |
| 명시 규칙 3 | - Related radios share name; uncontrolled radios synchronize their custom indicator with the browser's native group state. The label gap is 8px and the default selected dot is 12px. - Disabled and checked are independent states: a disabled checked radio keeps its neutral center dot so the current value remains visible… |
| --body2-size | 15px |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- Related radios share name; uncontrolled radios synchronize their custom indicator with the browser's native group state. The label gap is 8px and the default selected dot is 12px.
- Disabled and checked are independent states: a disabled checked radio keeps its neutral center dot so the current value remains visible, while primary fill/border is removed and label, ring, and dot use disabled-neutral roles. SegmentedControl, ButtonGroup, and ChoiceCard use this same “preserve selection, remove prim….
- Radio — 1.5px 헤어라인 원(20px, sm 16px). 선택되면 원이 시그널 잉크로 채워지고 화이트 중앙 점이 나타납니다. 그룹은 같은 name을 공유하세요.
- - Related radios share name; uncontrolled radios synchronize their custom indicator with the browser's native group state. The label gap is 8px and the default selected dot is 12px. - Disabled and checked are independent states: a disabled checked radio keeps its neutral center dot so the current value remains visible….

## Accessibility

- Arrow-key behavior and single-selection semantics come from the native radio input. Do not replace it with independent custom tab stops.
- Reference basis: WAI-ARIA Radio Group pattern and GOV.UK Radios.
- - Related radios share name; uncontrolled radios synchronize their custom indicator with the browser's native group state. The label gap is 8px and the default selected dot is 12px. - Disabled and checked are independent states: a disabled checked radio keeps its neutral center dot so the current value remains visible….
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Disabled and checked are independent states: a disabled checked radio keeps its neutral center dot so the current value remains visible, while primary fill/border is removed and label, ring, and dot use disabled-neutral roles. SegmentedControl, ButtonGroup, and ChoiceCard use this same “preserve selection, remove prim…. |
| Don't | Arrow-key behavior and single-selection semantics come from the native radio input. Do not replace it with independent custom tab stops. |
| Do | - Related radios share name; uncontrolled radios synchronize their custom indicator with the browser's native group state. The label gap is 8px and the default selected dot is 12px. - Disabled and checked are independent states: a disabled checked radio keeps its neutral center dot so the current value remains visible…. |
| Don't | - Related radios share name; uncontrolled radios synchronize their custom indicator with the browser's native group state. The label gap is 8px and the default selected dot is 12px. - Disabled and checked are independent states: a disabled checked radio keeps its neutral center dot so the current value remains visible…. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Radio의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `RadioGroup` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Checkbox` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `CheckboxGroup` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FilterChip` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `MultiSelectChip` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `RangeSlider` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `SegmentedControl` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Slider` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<Radio name="type" value="product" checked={t==='product'} onChange={()=>setT('product')} label="제품 문의" />
```

## Tokens and API

### Tokens

- `--body2-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-brand-ink`
- `--color-semantic-fill-normal`
- `--color-semantic-focus-ring`
- `--color-semantic-label-disable`
- `--color-semantic-line-normal-neutral`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-static-white`
- `--component-input-gap`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--radius-pill`

### Source contracts

- `components/forms/Radio.jsx`
- `components/forms/Radio.d.ts`
- `components/forms/Radio.prompt.md`
- `stories/FormRadio.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Radio prompt contract: `components/forms/Radio.prompt.md`
- Storybook implementation evidence: `stories/FormRadio.stories.jsx`
- [WAI-ARIA Radio Group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
- [GOV.UK Radios](https://design-system.service.gov.uk/components/radios/)
- [SEED Radio benchmark](https://seed-design.io/components/radio)
