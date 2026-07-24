# Icon Picker

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Selection and Input |
| Owner | `IconPicker` |
| Storybook | `LDS Product/Selection and Input/Icon Picker` |
| Source | `../component-content.json#product-selection-and-input-icon-picker` |

빌딩·마커·카테고리에 쓸 작은 curated 아이콘 집합에서 하나를 고를 때 적합합니다. 전체 레지스트리를 검색하거나 아이콘을 탐색하는 화면에는 별도 검색 UI를 사용하세요.

## 사용 판단

### 사용

- 빌딩·마커·카테고리에 쓸 작은 curated 아이콘 집합에서 하나를 고를 때 적합합니다. 전체 레지스트리를 검색하거나 아이콘을 탐색하는 화면에는 별도 검색 UI를 사용하세요.
- options는 {value, icon, label?, disabled?}[]입니다. label은 타일의 accessible name과 hover title로 사용합니다.
- value/defaultValue, onChange(value), columns, size, disabled, emptyLabel을 지원합니다. 그룹 자체의 접근 가능 이름은 컴포넌트 label prop(기본 아이콘 선택)입니다.
- Compare against common icon picker expectations before changing it: single selected value, radio-group semantics, disabled options, empty state, keyboard navigation, accessible labels for icon-only tiles, and stable tile sizing.

### 사용하지 않음

- 라디오그룹으로 동작하며 그룹 전체가 Tab stop 하나만 갖습니다. Tab stop은 이동 위치를 따르고, 이동 위치가 없거나 비활성이면 선택 위치(없으면 첫 활성 타일)로 되돌아갑니다. controlled 사용에서 onChange가 value를 갱신하지 않아도 Tab stop이 둘로 갈라지지 않습니다.
- columns가 시각 그리드를 만들므로 Arrow Left/Right는 선형으로 순환 이동하고 Arrow Up/Down은 한 행(columns개)씩 이동합니다. 같은 열에 활성 타일이 없으면 같은 방향으로 계속 찾고 그리드 밖이면 제자리에 머뭅니다. Home/End는 첫/마지막 활성 타일로 갑니다. 모든 이동은 선택을 함께 옮기고 disabled 타일은 건너뜁니다.
- - options는 {value, icon, label?, disabled?}[]입니다. label은 타일의 accessible name과 hover title로 사용합니다. - value/defaultValue, onChange(value), columns, size, disabled, emptyLabel을 지원합니다. 그룹 자체의 접근 가능 이름은 컴포넌트 label prop(기본 아이콘 선택)입니다. - Compare against common icon picker expectations before changing it: single selected valu….
- Icon Picker가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | IconPicker의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Options | options 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Label | Radiogroup accessible name. @default "아이콘 선택" |
| Empty Label | emptyLabel 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `options` | `IconPickerOption[]` | No | 공개 타입 계약에 정의된 속성입니다. |
| `value` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `defaultValue` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onChange` | `(value: string) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `columns` | `number` | No | 열 수. @default 6 |
| `size` | `'sm' \| 'md' \| 'lg'` | No | 타일 크기. @default "md" |
| `label` | `string` | No | Radiogroup accessible name. @default "아이콘 선택" |
| `disabled` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `emptyLabel` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| disabled | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| emptyLabel | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.ReactNode |
| 변형·상태 · 비활성 옵션 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 변형·상태 · 빈 목록 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- value/defaultValue, onChange(value), columns, size, disabled, emptyLabel을 지원합니다. 그룹 자체의 접근 가능 이름은 컴포넌트 label prop(기본 아이콘 선택)입니다.
- Compare against common icon picker expectations before changing it: single selected value, radio-group semantics, disabled options, empty state, keyboard navigation, accessible labels for icon-only tiles, and stable tile sizing.
- 라디오그룹으로 동작하며 그룹 전체가 Tab stop 하나만 갖습니다. Tab stop은 이동 위치를 따르고, 이동 위치가 없거나 비활성이면 선택 위치(없으면 첫 활성 타일)로 되돌아갑니다. controlled 사용에서 onChange가 value를 갱신하지 않아도 Tab stop이 둘로 갈라지지 않습니다.
- columns가 시각 그리드를 만들므로 Arrow Left/Right는 선형으로 순환 이동하고 Arrow Up/Down은 한 행(columns개)씩 이동합니다. 같은 열에 활성 타일이 없으면 같은 방향으로 계속 찾고 그리드 밖이면 제자리에 머뭅니다. Home/End는 첫/마지막 활성 타일로 갑니다. 모든 이동은 선택을 함께 옮기고 disabled 타일은 건너뜁니다.
- 빈 상태 안내는 역할 없는 정적 텍스트입니다. aria-disabled 같은 상태 속성을 붙이지 않습니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- options는 {value, icon, label?, disabled?}[]입니다. label은 타일의 accessible name과 hover title로 사용합니다.
- value/defaultValue, onChange(value), columns, size, disabled, emptyLabel을 지원합니다. 그룹 자체의 접근 가능 이름은 컴포넌트 label prop(기본 아이콘 선택)입니다.
- Compare against common icon picker expectations before changing it: single selected value, radio-group semantics, disabled options, empty state, keyboard navigation, accessible labels for icon-only tiles, and stable tile sizing.
- 빈 상태 안내는 역할 없는 정적 텍스트입니다. aria-disabled 같은 상태 속성을 붙이지 않습니다.

## Accessibility

- options는 {value, icon, label?, disabled?}[]입니다. label은 타일의 accessible name과 hover title로 사용합니다.
- Compare against common icon picker expectations before changing it: single selected value, radio-group semantics, disabled options, empty state, keyboard navigation, accessible labels for icon-only tiles, and stable tile sizing.
- 라디오그룹으로 동작하며 그룹 전체가 Tab stop 하나만 갖습니다. Tab stop은 이동 위치를 따르고, 이동 위치가 없거나 비활성이면 선택 위치(없으면 첫 활성 타일)로 되돌아갑니다. controlled 사용에서 onChange가 value를 갱신하지 않아도 Tab stop이 둘로 갈라지지 않습니다.
- 빈 상태 안내는 역할 없는 정적 텍스트입니다. aria-disabled 같은 상태 속성을 붙이지 않습니다.
- hover는 neutral fill, keyboard focus는 LDS focus ring, selection은 primary surface/border로 분리합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | options는 {value, icon, label?, disabled?}[]입니다. label은 타일의 accessible name과 hover title로 사용합니다. |
| Don't | 라디오그룹으로 동작하며 그룹 전체가 Tab stop 하나만 갖습니다. Tab stop은 이동 위치를 따르고, 이동 위치가 없거나 비활성이면 선택 위치(없으면 첫 활성 타일)로 되돌아갑니다. controlled 사용에서 onChange가 value를 갱신하지 않아도 Tab stop이 둘로 갈라지지 않습니다. |
| Do | value/defaultValue, onChange(value), columns, size, disabled, emptyLabel을 지원합니다. 그룹 자체의 접근 가능 이름은 컴포넌트 label prop(기본 아이콘 선택)입니다. |
| Don't | columns가 시각 그리드를 만들므로 Arrow Left/Right는 선형으로 순환 이동하고 Arrow Up/Down은 한 행(columns개)씩 이동합니다. 같은 열에 활성 타일이 없으면 같은 방향으로 계속 찾고 그리드 밖이면 제자리에 머뭅니다. Home/End는 첫/마지막 활성 타일로 갑니다. 모든 이동은 선택을 함께 옮기고 disabled 타일은 건너뜁니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 IconPicker의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ColorSwatch` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DatePicker` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DateRangeField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FileUpload` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FileUploadQueue` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `NumberField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `PinInput` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `PropertyField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<IconPicker
  options={[{ value: 'dock', icon: <Icon name="anchor" />, label: '도킹' }]}
  defaultValue="dock"
  onChange={setIcon}
/>
```

## Tokens and API

### Tokens

- `--caption1-line`
- `--caption1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-normal`
- `--color-semantic-focus-ring`
- `--color-semantic-label-alternative`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-line-normal-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-primary-surface-strong`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-medium`
- `--radius-lg`
- `--radius-md`
- `--radius-sm`
- `--space-2`
- `--space-3`

### Source contracts

- `components/selection/IconPicker.jsx`
- `components/selection/IconPicker.d.ts`
- `components/selection/IconPicker.prompt.md`
- `stories/SelectionIconPicker.stories.jsx`

## Migration

- DS 관행상 타일은 semantic line/fill/background token과 Icon registry 기반 아이콘을 사용하고, legacy border/background 토큰이나 임의 SVG를 넣지 않습니다.
- - options는 {value, icon, label?, disabled?}[]입니다. label은 타일의 accessible name과 hover title로 사용합니다. - value/defaultValue, onChange(value), columns, size, disabled, emptyLabel을 지원합니다. 그룹 자체의 접근 가능 이름은 컴포넌트 label prop(기본 아이콘 선택)입니다. - Compare against common icon picker expectations before changing it: single selected valu….
- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- IconPicker prompt contract: `components/selection/IconPicker.prompt.md`
- Storybook implementation evidence: `stories/SelectionIconPicker.stories.jsx`
- [WAI-ARIA Radio Group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
- [Apple Focus and selection](https://developer.apple.com/design/human-interface-guidelines/focus-and-selection/)
