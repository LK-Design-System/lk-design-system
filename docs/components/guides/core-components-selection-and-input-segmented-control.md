# Segmented Control

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Selection and Input |
| Owner | `SegmentedControl` |
| Storybook | `LDS Core/Components/Selection and Input/Segmented Control` |
| Source | `../component-content.json#core-components-selection-and-input-segmented-control` |

동시에 하나만 활성화되는 25개의 짧고 대등한 보기에 사용하세요. 서로 독립적인 기능을 실행하는 버튼 묶음에는 Toggle Button이 더 적합합니다.

## Anatomy

| Part | Contract |
| --- | --- |
| interaction | Group evidence state. inactive disables every option; prefer disabled in product code. |
| aria-label | Accessible name for the mutually exclusive option group. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `options` | `SegmentOption[]` | Yes |  |
| `value` | `string` | No |  |
| `defaultValue` | `string` | No |  |
| `onChange` | `(value: string) = void` | No |  |
| `variant` | `'solid' \| 'outlined'` | No |  |
| `size` | `'sm' \| 'md' \| 'lg' \| 'small' \| 'medium' \| 'large'` | No |  |
| `interaction` | `'normal' \| 'inactive' \| 'hovered' \| 'focused' \| 'active' \| 'active-focused'` | No | Group evidence state. inactive disables every option; prefer disabled in product code. |
| `full` | `boolean` | No |  |
| `resize` | `'fill' \| 'hug'` | No |  |
| `disabled` | `boolean` | No |  |
| `disable` | `boolean` | No |  |
| `aria-label` | `string` | No | Accessible name for the mutually exclusive option group. |
| `classNames` | `LdsClassNames` | No |  |
| `styles` | `LdsStyles` | No |  |
| `vars` | `LdsVars` | No |  |

## States

| State | Contract |
| --- | --- |
| interaction | Group evidence state. inactive disables every option; prefer disabled in product code. |

## Behavior and interaction

- SegmentedControl — 단일 선택 뷰 토글. 옵션이 쿨 그레이 트랙에 놓이고, 활성 옵션은 부드러운 그림자와 함께 화이트 필로 올라갑니다.
- Semantics and keyboard contract.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | size sm\|md\|lg는 전체 track 외곽 높이 32/40/48px입니다. Solid의 내부 padding과 Outlined의 border가 이 높이에 더해지지 않습니다. full은 컨테이너 폭까지 늘림. |
| 명시 규칙 2 | 상호 배타적인 2–4개의 짧은 뷰에 쓰세요. 옵션이 많거나 길거나 실제 페이지 내비게이션에는 Tabs를 쓰세요. |
| 명시 규칙 3 | WDS 내부 Segmented Control/Segmented Control component-set(16215:35115)의 직접 축은 Variant(Solid/Outlined), Size(Small/Medium/Large), Icon(False/True)뿐입니다. interaction은 공용 API 축이 아니라 상태 증거 호환값입니다. |
| --body1-size | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |

## Responsive

- ButtonGroup의 단일 선택 모드는 이 컴포넌트를 조합합니다. 따라서 높이·disabled·roving 규칙을 ButtonGroup에서 별도로 다시 만들지 않습니다.

## Content and writing

- ref, className, and style target the radiogroup root.
- Stable parts are root, segment, icon, label, and count; each segment exposes data-state="checked|unchecked" and data-disabled.
- options — 문자열 또는 { value, label, icon, count, disabled }. count는 단일 선택 필터를 고르기 전에 값별 결과 건수를 비교해야 할 때 사용하며 라디오의 접근 가능한 이름과 함께 읽힙니다. value / defaultValue / onChange — 제어/비제어.

## Accessibility

- Geometry overrides are limited to the documented --lds-segmented-control- variables. Selection state and keyboard semantics stay owned by the component.
- SegmentedControl is a named radiogroup, not a tablist: each segment is a radio with one roving tab stop. Arrow keys wrap across enabled segments; Home and End choose the first and last enabled segment.
- 옵션별 표준 비활성 API는 disabled입니다. disable과 interaction="inactive"는 기존 증거 matrix를 위한 호환 별칭이며, 모두 native disabled + aria-disabled로 수렴하고 로빙 탐색에서 제외됩니다. 그룹의 disabled도 모든 segment에 같은 계약을 적용합니다.
- Use it for a small set of mutually exclusive views or modes. Use Tabs only when each label owns a distinct tab panel.
- Reference basis: WAI-ARIA Radio Group pattern and Apple Segmented controls.

## Related components

| Component | Relationship |
| --- | --- |
| `Icon` | 대표 시나리오에서 조합 |
| `Checkbox` | 대표 시나리오에서 조합 |
| `CheckboxGroup` | 대표 시나리오에서 조합 |
| `FilterChip` | 대표 시나리오에서 조합 |
| `MultiSelectChip` | 대표 시나리오에서 조합 |
| `Radio` | 대표 시나리오에서 조합 |
| `RadioGroup` | 대표 시나리오에서 조합 |
| `RangeSlider` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<SegmentedControl options={['KR', 'EN']} defaultValue="KR" onChange={setLang} />
<SegmentedControl full options={[{value:'list',label:'리스트'},{value:'grid',label:'그리드'}]} />
<SegmentedControl aria-label="상태 필터" options={[{value:'all',label:'전체',count:12},{value:'active',label:'진행 중',count:8}]} defaultValue="all" />
```

## Tokens and API

### Tokens

- `--body1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-normal`
- `--color-semantic-fill-strong`
- `--color-semantic-focus-ring`
- `--color-semantic-label-alternative`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-surface-strong`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--fw-medium`
- `--fw-semibold`
- `--headline2-size`
- `--label1-size`
- `--lds-segmented-control-gap`
- `--lds-segmented-control-height`
- `--lds-segmented-control-padding`
- `--lds-segmented-control-radius`
- `--lds-segmented-control-segment-radius`
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

## Sources

- SegmentedControl prompt contract: `components/selection/SegmentedControl.prompt.md`
- Storybook implementation evidence: `stories/SelectionSegmentedControl.stories.jsx`
- [WAI-ARIA Radio Group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
- [Apple Segmented controls](https://developer.apple.com/design/human-interface-guidelines/segmented-controls)
