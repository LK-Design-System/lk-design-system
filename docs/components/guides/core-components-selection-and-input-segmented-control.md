# Segmented Control

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Selection and Input |
| Owner | `SegmentedControl` |
| Storybook | `LDS Core/Components/Selection and Input/Segmented Control` |
| Source | `../component-content.json#core-components-selection-and-input-segmented-control` |

동시에 하나만 활성화되는 25개의 짧고 대등한 보기에 사용하세요. 서로 독립적인 기능을 실행하는 버튼 묶음에는 Toggle Button이 더 적합합니다.

## 사용 판단

### 사용

- 동시에 하나만 활성화되는 25개의 짧고 대등한 보기에 사용하세요. 서로 독립적인 기능을 실행하는 버튼 묶음에는 Toggle Button이 더 적합합니다.
- Use it for a small set of mutually exclusive views or modes. Use Tabs only when each label owns a distinct tab panel.
- - SegmentedControl is a named radiogroup, not a tablist: each segment is a radio with one roving tab stop. Arrow keys wrap across enabled segments; Home and End choose the first and last enabled segment. - 옵션별 표준 비활성 API는 disabled입니다. disable과 interaction="inactive"는 기존 증거 matrix를 위한 호환 별칭이며, 모두 native disabled + aria….
- Segmented Control가 소유하는 Selection and Input 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.

### 사용하지 않음

- Segmented Control가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.
- 표현이 비슷하다는 이유만으로 상태 의미가 다른 sibling 컴포넌트를 서로 대체하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | SegmentedControl의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Interaction | Group evidence state. inactive disables every option; prefer disabled in product code. |
| Aria Label | Accessible name for the mutually exclusive option group. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `options` | `SegmentOption[]` | Yes | 공개 타입 계약에 정의된 속성입니다. |
| `value` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `defaultValue` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onChange` | `(value: string) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `variant` | `'solid' \| 'outlined'` | No | 공개 타입 계약에 정의된 속성입니다. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'small' \| 'medium' \| 'large'` | No | 공개 타입 계약에 정의된 속성입니다. |
| `interaction` | `'normal' \| 'inactive' \| 'hovered' \| 'focused' \| 'active' \| 'active-focused'` | No | Group evidence state. inactive disables every option; prefer disabled in product code. |
| `full` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `resize` | `'fill' \| 'hug'` | No | 공개 타입 계약에 정의된 속성입니다. |
| `disabled` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `disable` | `boolean` | No | Disabled alias retained for compatibility; prefer disabled. |
| `aria-label` | `string` | No | Accessible name for the mutually exclusive option group. |

## States

| State | Contract |
| --- | --- |
| variant | 공개 타입 계약에 정의된 속성입니다. 타입 계약: 'solid' \| 'outlined' |
| interaction | Group evidence state. inactive disables every option; prefer disabled in product code. 타입 계약: 'normal' \| 'inactive' \| 'hovered' \| 'focused' \| 'active' \| 'active-focused' |
| disabled | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |

## Behavior and interaction

- SegmentedControl is a named radiogroup, not a tablist: each segment is a radio with one roving tab stop. Arrow keys wrap across enabled segments; Home and End choose the first and last enabled segment.
- Use it for a small set of mutually exclusive views or modes. Use Tabs only when each label owns a distinct tab panel.
- options — 문자열 또는 { value, label, icon, disabled }. value / defaultValue / onChange — 제어/비제어.
- 상호 배타적인 2–4개의 짧은 뷰에 쓰세요. 옵션이 많거나 길거나 실제 페이지 내비게이션에는 Tabs를 쓰세요.
- WDS 내부 Segmented Control/Segmented Control component-set(16215:35115)의 직접 축은 Variant(Solid/Outlined), Size(Small/Medium/Large), Icon(False/True)뿐입니다. interaction은 공용 API 축이 아니라 상태 증거 호환값입니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | size sm\|md\|lg는 전체 track 외곽 높이 32/40/48px입니다. Solid의 내부 padding과 Outlined의 border가 이 높이에 더해지지 않습니다. full은 컨테이너 폭까지 늘림. |
| 명시 규칙 2 | 상호 배타적인 2–4개의 짧은 뷰에 쓰세요. 옵션이 많거나 길거나 실제 페이지 내비게이션에는 Tabs를 쓰세요. |
| 명시 규칙 3 | WDS 내부 Segmented Control/Segmented Control component-set(16215:35115)의 직접 축은 Variant(Solid/Outlined), Size(Small/Medium/Large), Icon(False/True)뿐입니다. interaction은 공용 API 축이 아니라 상태 증거 호환값입니다. |
| 명시 규칙 4 | - options — 문자열 또는 { value, label, icon, disabled }. value / defaultValue / onChange — 제어/비제어. - size sm\|md\|lg는 전체 track 외곽 높이 32/40/48px입니다. Solid의 내부 padding과 Outlined의 border가 이 높이에 더해지지 않습니다. full은 컨테이너 폭까지 늘림. - 상호 배타적인 2–4개의 짧은 뷰에 쓰세요. 옵션이 많거나 길거나 실제 페이지 내비게이션에는 Tabs를 쓰세요. |
| --body1-size | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |

## Responsive

- SegmentedControl is a named radiogroup, not a tablist: each segment is a radio with one roving tab stop. Arrow keys wrap across enabled segments; Home and End choose the first and last enabled segment.
- size sm|md|lg는 전체 track 외곽 높이 32/40/48px입니다. Solid의 내부 padding과 Outlined의 border가 이 높이에 더해지지 않습니다. full은 컨테이너 폭까지 늘림.
- ButtonGroup의 단일 선택 모드는 이 컴포넌트를 조합합니다. 따라서 높이·disabled·roving 규칙을 ButtonGroup에서 별도로 다시 만들지 않습니다.
- - SegmentedControl is a named radiogroup, not a tablist: each segment is a radio with one roving tab stop. Arrow keys wrap across enabled segments; Home and End choose the first and last enabled segment. - 옵션별 표준 비활성 API는 disabled입니다. disable과 interaction="inactive"는 기존 증거 matrix를 위한 호환 별칭이며, 모두 native disabled + aria….

## Content and writing

- SegmentedControl is a named radiogroup, not a tablist: each segment is a radio with one roving tab stop. Arrow keys wrap across enabled segments; Home and End choose the first and last enabled segment.
- Use it for a small set of mutually exclusive views or modes. Use Tabs only when each label owns a distinct tab panel.
- options — 문자열 또는 { value, label, icon, disabled }. value / defaultValue / onChange — 제어/비제어.
- - SegmentedControl is a named radiogroup, not a tablist: each segment is a radio with one roving tab stop. Arrow keys wrap across enabled segments; Home and End choose the first and last enabled segment. - 옵션별 표준 비활성 API는 disabled입니다. disable과 interaction="inactive"는 기존 증거 matrix를 위한 호환 별칭이며, 모두 native disabled + aria….

## Accessibility

- SegmentedControl is a named radiogroup, not a tablist: each segment is a radio with one roving tab stop. Arrow keys wrap across enabled segments; Home and End choose the first and last enabled segment.
- 옵션별 표준 비활성 API는 disabled입니다. disable과 interaction="inactive"는 기존 증거 matrix를 위한 호환 별칭이며, 모두 native disabled + aria-disabled로 수렴하고 로빙 탐색에서 제외됩니다. 그룹의 disabled도 모든 segment에 같은 계약을 적용합니다.
- Use it for a small set of mutually exclusive views or modes. Use Tabs only when each label owns a distinct tab panel.
- Reference basis: WAI-ARIA Radio Group pattern and Apple Segmented controls.
- 단일 선택 의미와 키보드는 native Radio 계열과 같습니다. 비활성인데 선택된 값은 선택 정보를 지우지 않되, Radio의 회색 중심 점처럼 primary 색을 제거하고 중립 채움·비활성 전경·semibold만 남깁니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Use it for a small set of mutually exclusive views or modes. Use Tabs only when each label owns a distinct tab panel. |
| Don't | Segmented Control가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다. |
| Do | - SegmentedControl is a named radiogroup, not a tablist: each segment is a radio with one roving tab stop. Arrow keys wrap across enabled segments; Home and End choose the first and last enabled segment. - 옵션별 표준 비활성 API는 disabled입니다. disable과 interaction="inactive"는 기존 증거 matrix를 위한 호환 별칭이며, 모두 native disabled + aria…. |
| Don't | 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다. |

## Exceptions

- Use it for a small set of mutually exclusive views or modes. Use Tabs only when each label owns a distinct tab panel.
- - SegmentedControl is a named radiogroup, not a tablist: each segment is a radio with one roving tab stop. Arrow keys wrap across enabled segments; Home and End choose the first and last enabled segment. - 옵션별 표준 비활성 API는 disabled입니다. disable과 interaction="inactive"는 기존 증거 matrix를 위한 호환 별칭이며, 모두 native disabled + aria….
- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 SegmentedControl의 범용 API에 넣지 않습니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Icon` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Checkbox` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `CheckboxGroup` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FilterChip` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `MultiSelectChip` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Radio` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `RadioGroup` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `RangeSlider` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<SegmentedControl options={['KR', 'EN']} defaultValue="KR" onChange={setLang} />
<SegmentedControl full options={[{value:'list',label:'리스트'},{value:'grid',label:'그리드'}]} />
```

## Tokens and API

### Tokens

- `--body1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-normal`
- `--color-semantic-fill-strong`
- `--color-semantic-focus-ring`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-surface-strong`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-medium`
- `--fw-semibold`
- `--headline2-size`
- `--label1-size`
- `--radius-10`
- `--radius-8`
- `--radius-md`
- `--radius-sm`
- `--shadow-xs`

### Source contracts

- `components/selection/SegmentedControl.jsx`
- `components/selection/SegmentedControl.d.ts`
- `components/selection/SegmentedControl.prompt.md`
- `stories/SelectionSegmentedControl.stories.jsx`

## Migration

- 옵션별 표준 비활성 API는 disabled입니다. disable과 interaction="inactive"는 기존 증거 matrix를 위한 호환 별칭이며, 모두 native disabled + aria-disabled로 수렴하고 로빙 탐색에서 제외됩니다. 그룹의 disabled도 모든 segment에 같은 계약을 적용합니다.
- WDS 내부 Segmented Control/Segmented Control component-set(16215:35115)의 직접 축은 Variant(Solid/Outlined), Size(Small/Medium/Large), Icon(False/True)뿐입니다. interaction은 공용 API 축이 아니라 상태 증거 호환값입니다.
- - SegmentedControl is a named radiogroup, not a tablist: each segment is a radio with one roving tab stop. Arrow keys wrap across enabled segments; Home and End choose the first and last enabled segment. - 옵션별 표준 비활성 API는 disabled입니다. disable과 interaction="inactive"는 기존 증거 matrix를 위한 호환 별칭이며, 모두 native disabled + aria….
- - WDS 내부 Segmented Control/Segmented Control component-set(16215:35115)의 직접 축은 Variant(Solid/Outlined), Size(Small/Medium/Large), Icon(False/True)뿐입니다. interaction은 공용 API 축이 아니라 상태 증거 호환값입니다. - 단일 선택 의미와 키보드는 native Radio 계열과 같습니다. 비활성인데 선택된 값은 선택 정보를 지우지 않되, Radio의 회색 중심 점처럼 primary 색을 제거하고 중립 채움·비활성 전경·semibold만 남깁….

## Sources

- SegmentedControl prompt contract: `components/selection/SegmentedControl.prompt.md`
- Storybook implementation evidence: `stories/SelectionSegmentedControl.stories.jsx`
- [WAI-ARIA Radio Group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
- [Apple Segmented controls](https://developer.apple.com/design/human-interface-guidelines/segmented-controls)
- [SEED Segmented Control benchmark](https://seed-design.io/components/segmented-control)
