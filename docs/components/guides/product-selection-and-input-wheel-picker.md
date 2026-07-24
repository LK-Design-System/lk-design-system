# Wheel Picker

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Selection and Input |
| Owner | `WheelPicker` |
| Storybook | `LDS Product/Selection and Input/Wheel Picker` |
| Source | `../component-content.json#product-selection-and-input-wheel-picker` |

층·시·분처럼 순서가 있고 선택지가 짧은 값을 모바일에서 조절할 때 적합합니다. 긴 목록이나 키보드 중심 데스크톱 폼에는 Wheel Picker 대신 Select를 사용하세요.

## 사용 판단

### 사용

- 층·시·분처럼 순서가 있고 선택지가 짧은 값을 모바일에서 조절할 때 적합합니다. 긴 목록이나 키보드 중심 데스크톱 폼에는 Wheel Picker 대신 Select를 사용하세요.
- options는 primitive 또는 { value, label, disabled } 항목을 받습니다. value / defaultValue / onChange, itemHeight, 홀수로 보정되는 visible, width, label, emptyLabel, disabled, readOnly를 지원합니다.
- listbox, aria-activedescendant, aria-selected를 사용하며 ArrowUp/ArrowDown, PageUp/PageDown, Home/End로 값을 이동합니다. 문자 입력은 type-ahead로 option label 앞부분을 매칭하고(같은 문자를 반복하면 다음 매칭으로 순환) 짧은 시간이 지나면 검색어가 초기화됩니다. disabled option은 건너뜁니다.
- 스크롤 값은 드럼이 멈춘 뒤에 커밋합니다. 관성 스크롤 중간 값을 프레임마다 커밋하면 선택 동기화가 scrollTop을 되돌려 사용자 스크롤과 충돌하므로, 스크롤이 잦아든 다음 스냅된 행 하나만 onChange로 올립니다.

### 사용하지 않음

- Layer: LDS Product extension. WDS Presentation/Picker/Wheels의 Date/Time variant parity를 주장하지 않습니다.
- 외곽 카드, inset pane, 중앙 띠, fade mask를 추가하지 않습니다. 깊이는 선택 행과 주변 행의 type scale·weight·3D transform으로만 표현하며 모든 활성 option 텍스트는 대비를 유지합니다.
- - options는 primitive 또는 { value, label, disabled } 항목을 받습니다. value / defaultValue / onChange, itemHeight, 홀수로 보정되는 visible, width, label, emptyLabel, disabled, readOnly를 지원합니다. - listbox, aria-activedescendant, aria-selected를 사용하며 ArrowUp/ArrowDown, PageUp/PageDown, Home/End로 값을 이동합니다. 문자 입력은 type-ahead로 option label….
- Wheel Picker가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | WheelPicker의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Label | Listbox accessible name. @default "휠 선택" |
| Empty Label | option이 없을 때 중앙에 표시할 문구. @default "선택 항목 없음" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `options` | `Array` | No | 문자열/숫자 또는 {value, label} 배열. |
| `value` | `string \| number` | No | 공개 타입 계약에 정의된 속성입니다. |
| `defaultValue` | `string \| number` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onChange` | `(value: string \| number, option: WheelPickerOption) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `itemHeight` | `number` | No | 각 행 높이(px). @default 36 |
| `visible` | `number` | No | 보이는 행 수(홀수 권장). @default 5 |
| `width` | `React.CSSProperties['width']` | No | 컴포넌트 너비. @default 128 |
| `label` | `string` | No | Listbox accessible name. @default "휠 선택" |
| `emptyLabel` | `React.ReactNode` | No | option이 없을 때 중앙에 표시할 문구. @default "선택 항목 없음" |
| `disabled` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `disable` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `readOnly` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| visible | 보이는 행 수(홀수 권장). @default 5 타입 계약: number |
| emptyLabel | option이 없을 때 중앙에 표시할 문구. @default "선택 항목 없음" 타입 계약: React.ReactNode |
| disabled | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| readOnly | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| 변형·상태 · 비활성 옵션 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 변형·상태 · 항목 없음 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- options는 primitive 또는 { value, label, disabled } 항목을 받습니다. value / defaultValue / onChange, itemHeight, 홀수로 보정되는 visible, width, label, emptyLabel, disabled, readOnly를 지원합니다.
- listbox, aria-activedescendant, aria-selected를 사용하며 ArrowUp/ArrowDown, PageUp/PageDown, Home/End로 값을 이동합니다. 문자 입력은 type-ahead로 option label 앞부분을 매칭하고(같은 문자를 반복하면 다음 매칭으로 순환) 짧은 시간이 지나면 검색어가 초기화됩니다. disabled option은 건너뜁니다.
- 스크롤 값은 드럼이 멈춘 뒤에 커밋합니다. 관성 스크롤 중간 값을 프레임마다 커밋하면 선택 동기화가 scrollTop을 되돌려 사용자 스크롤과 충돌하므로, 스크롤이 잦아든 다음 스냅된 행 하나만 onChange로 올립니다.
- readOnly는 focus와 읽기를 허용하지만 값 변경을 막습니다. disabled는 상호작용과 Tab 진입을 막습니다.
- 외곽 카드, inset pane, 중앙 띠, fade mask를 추가하지 않습니다. 깊이는 선택 행과 주변 행의 type scale·weight·3D transform으로만 표현하며 모든 활성 option 텍스트는 대비를 유지합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | WCAG 2.2 Contrast Minimum |
| 명시 규칙 2 | - Apple Pickers - Apple Focus and selection - WCAG 2.2 Contrast Minimum |
| --body1-line | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --body1-size | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |

## Responsive

- options는 primitive 또는 { value, label, disabled } 항목을 받습니다. value / defaultValue / onChange, itemHeight, 홀수로 보정되는 visible, width, label, emptyLabel, disabled, readOnly를 지원합니다.
- - options는 primitive 또는 { value, label, disabled } 항목을 받습니다. value / defaultValue / onChange, itemHeight, 홀수로 보정되는 visible, width, label, emptyLabel, disabled, readOnly를 지원합니다. - listbox, aria-activedescendant, aria-selected를 사용하며 ArrowUp/ArrowDown, PageUp/PageDown, Home/End로 값을 이동합니다. 문자 입력은 type-ahead로 option label….
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- options는 primitive 또는 { value, label, disabled } 항목을 받습니다. value / defaultValue / onChange, itemHeight, 홀수로 보정되는 visible, width, label, emptyLabel, disabled, readOnly를 지원합니다.
- listbox, aria-activedescendant, aria-selected를 사용하며 ArrowUp/ArrowDown, PageUp/PageDown, Home/End로 값을 이동합니다. 문자 입력은 type-ahead로 option label 앞부분을 매칭하고(같은 문자를 반복하면 다음 매칭으로 순환) 짧은 시간이 지나면 검색어가 초기화됩니다. disabled option은 건너뜁니다.
- 외곽 카드, inset pane, 중앙 띠, fade mask를 추가하지 않습니다. 깊이는 선택 행과 주변 행의 type scale·weight·3D transform으로만 표현하며 모든 활성 option 텍스트는 대비를 유지합니다.
- - options는 primitive 또는 { value, label, disabled } 항목을 받습니다. value / defaultValue / onChange, itemHeight, 홀수로 보정되는 visible, width, label, emptyLabel, disabled, readOnly를 지원합니다. - listbox, aria-activedescendant, aria-selected를 사용하며 ArrowUp/ArrowDown, PageUp/PageDown, Home/End로 값을 이동합니다. 문자 입력은 type-ahead로 option label….

## Accessibility

- listbox, aria-activedescendant, aria-selected를 사용하며 ArrowUp/ArrowDown, PageUp/PageDown, Home/End로 값을 이동합니다. 문자 입력은 type-ahead로 option label 앞부분을 매칭하고(같은 문자를 반복하면 다음 매칭으로 순환) 짧은 시간이 지나면 검색어가 초기화됩니다. disabled option은 건너뜁니다.
- readOnly는 focus와 읽기를 허용하지만 값 변경을 막습니다. disabled는 상호작용과 Tab 진입을 막습니다.
- Apple Focus and selection.
- WCAG 2.2 Contrast Minimum.
- - options는 primitive 또는 { value, label, disabled } 항목을 받습니다. value / defaultValue / onChange, itemHeight, 홀수로 보정되는 visible, width, label, emptyLabel, disabled, readOnly를 지원합니다. - listbox, aria-activedescendant, aria-selected를 사용하며 ArrowUp/ArrowDown, PageUp/PageDown, Home/End로 값을 이동합니다. 문자 입력은 type-ahead로 option label….

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | options는 primitive 또는 { value, label, disabled } 항목을 받습니다. value / defaultValue / onChange, itemHeight, 홀수로 보정되는 visible, width, label, emptyLabel, disabled, readOnly를 지원합니다. |
| Don't | Layer: LDS Product extension. WDS Presentation/Picker/Wheels의 Date/Time variant parity를 주장하지 않습니다. |
| Do | listbox, aria-activedescendant, aria-selected를 사용하며 ArrowUp/ArrowDown, PageUp/PageDown, Home/End로 값을 이동합니다. 문자 입력은 type-ahead로 option label 앞부분을 매칭하고(같은 문자를 반복하면 다음 매칭으로 순환) 짧은 시간이 지나면 검색어가 초기화됩니다. disabled option은 건너뜁니다. |
| Don't | 외곽 카드, inset pane, 중앙 띠, fade mask를 추가하지 않습니다. 깊이는 선택 행과 주변 행의 type scale·weight·3D transform으로만 표현하며 모든 활성 option 텍스트는 대비를 유지합니다. |

## Exceptions

- 긴 목록 검색이 필요한 경우 Select, Combobox, TreePicker를 사용합니다.
- - options는 primitive 또는 { value, label, disabled } 항목을 받습니다. value / defaultValue / onChange, itemHeight, 홀수로 보정되는 visible, width, label, emptyLabel, disabled, readOnly를 지원합니다. - listbox, aria-activedescendant, aria-selected를 사용하며 ArrowUp/ArrowDown, PageUp/PageDown, Home/End로 값을 이동합니다. 문자 입력은 type-ahead로 option label….
- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 WheelPicker의 범용 API에 넣지 않습니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ColorSwatch` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DatePicker` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DateRangeField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FileUpload` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FileUploadQueue` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `IconPicker` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `NumberField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `PinInput` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<WheelPicker options={['B1', '1F', '2F', '3F']} defaultValue="1F" onChange={setFloor} />
```

## Tokens and API

### Tokens

- `--body1-line`
- `--body1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-normal`
- `--color-semantic-focus-ring`
- `--color-semantic-label-assistive`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-label-strong`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--fw-medium`
- `--fw-semibold`
- `--headline1-line`
- `--headline1-size`
- `--label1-line`
- `--label1-size`
- `--label2-line`
- `--label2-size`
- `--radius-md`
- `--space-3`

### Source contracts

- `components/selection/WheelPicker.jsx`
- `components/selection/WheelPicker.d.ts`
- `components/selection/WheelPicker.prompt.md`
- `stories/SelectionWheelPicker.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- WheelPicker prompt contract: `components/selection/WheelPicker.prompt.md`
- Storybook implementation evidence: `stories/SelectionWheelPicker.stories.jsx`
- [Apple Pickers](https://developer.apple.com/design/human-interface-guidelines/pickers)
- [Apple Focus and selection](https://developer.apple.com/design/human-interface-guidelines/focus-and-selection/)
- [WCAG 2.2 Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
