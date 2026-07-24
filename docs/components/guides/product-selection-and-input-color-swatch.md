# Color Swatch

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Selection and Input |
| Owner | `ColorSwatch` |
| Storybook | `LDS Product/Selection and Input/Color Swatch` |
| Source | `../component-content.json#product-selection-and-input-color-swatch` |

테마·상태처럼 제품이 허용한 소수의 색상 토큰을 선택할 때 적합합니다. 임의 색상 값 입력이나 색상 조합 편집에는 Color Swatch 대신 전용 색상 편집기를 사용하세요.

## 사용 판단

### 사용

- 테마·상태처럼 제품이 허용한 소수의 색상 토큰을 선택할 때 적합합니다. 임의 색상 값 입력이나 색상 조합 편집에는 Color Swatch 대신 전용 색상 편집기를 사용하세요.
- 제품이 허용한 소수의 색 토큰을 고르는 용도입니다. 임의 색상 입력, 그라디언트, 팔레트 편집에는 전용 색상 편집기를 사용하세요.
- Color Swatch가 소유하는 Selection and Input 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.
- 제품별 구현 대신 공개 ColorSwatch API와 semantic token으로 일관성을 유지해야 할 때 사용합니다.

### 사용하지 않음

- 색상 스와치 묶음은 관행상 단일 선택 그룹이므로 radiogroup + radio + aria-checked로 노출합니다. 선택 상태를 링 색만으로 표현하지 않습니다.
- 항목의 접근 가능 이름은 label입니다. 한국어 색 이름을 항상 제공하세요. CF6360이나 var(--color-…) 같은 원시 CSS 값은 이름으로 쓰지 않으며, label이 없으면 위치 기반 한국어 이름(색상 1, 색상 2 …)으로 대체합니다.
- 선택은 시그널 잉크 링 그리고 흰 체크 표시로 동시에 전달합니다. 체크에는 어두운 halo를 덧입혀 밝은 색 위에서도 형태가 보이게 합니다. 색 대비만으로 선택을 구분하지 않습니다.
- 키보드는 APG Radio Group 계약입니다. 그룹 전체가 Tab stop 하나(선택된 스와치, 없으면 첫 활성 스와치)를 갖고 Arrow Left/Right/Up/Down이 순환 이동하면서 선택을 함께 옮기며 Home/End는 처음/끝으로 갑니다. disabled 항목은 이동에서 건너뜁니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | ColorSwatch의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Label | radiogroup의 접근 가능 이름. @default "색상 선택" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `colors` | `Array` | Yes | 색상(임의의 CSS 색) 또는 색 이름을 담은 항목. |
| `value` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `defaultValue` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onChange` | `(color: string) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `size` | `number` | No | 스와치 크기(px). @default 28 |
| `shape` | `'rounded' \| 'circle'` | No | 공개 타입 계약에 정의된 속성입니다. |
| `label` | `string` | No | radiogroup의 접근 가능 이름. @default "색상 선택" |
| `disabled` | `boolean` | No | 그룹 전체를 비활성화합니다. |

## States

| State | Contract |
| --- | --- |
| disabled | 그룹 전체를 비활성화합니다. 타입 계약: boolean |
| 변형·상태 · 선택 전 상태 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- colors — 문자열 CSS 색 또는 {value, label?, disabled?} 항목의 배열. value / defaultValue / onChange(color) — 선택된 색. size(px, 기본 28) · shape(rounded · circle) · label(radiogroup 접근 가능 이름, 기본 색상 선택) · disabled(그룹 전체 비활성).
- 색상 스와치 묶음은 관행상 단일 선택 그룹이므로 radiogroup + radio + aria-checked로 노출합니다. 선택 상태를 링 색만으로 표현하지 않습니다.
- 선택은 시그널 잉크 링 그리고 흰 체크 표시로 동시에 전달합니다. 체크에는 어두운 halo를 덧입혀 밝은 색 위에서도 형태가 보이게 합니다. 색 대비만으로 선택을 구분하지 않습니다.
- 키보드는 APG Radio Group 계약입니다. 그룹 전체가 Tab stop 하나(선택된 스와치, 없으면 첫 활성 스와치)를 갖고 Arrow Left/Right/Up/Down이 순환 이동하면서 선택을 함께 옮기며 Home/End는 처음/끝으로 갑니다. disabled 항목은 이동에서 건너뜁니다.
- WAI-ARIA Radio Group pattern — 단일 Tab stop, 방향키 이동+선택, radio/aria-checked 계약.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | colors — 문자열 CSS 색 또는 {value, label?, disabled?} 항목의 배열. value / defaultValue / onChange(color) — 선택된 색. size(px, 기본 28) · shape(rounded · circle) · label(radiogroup 접근 가능 이름, 기본 색상 선택) · disabled(그룹 전체 비활성). |
| 명시 규칙 2 | 항목의 접근 가능 이름은 label입니다. 한국어 색 이름을 항상 제공하세요. CF6360이나 var(--color-…) 같은 원시 CSS 값은 이름으로 쓰지 않으며, label이 없으면 위치 기반 한국어 이름(색상 1, 색상 2 …)으로 대체합니다. |
| 명시 규칙 3 | WCAG 2.2 Use of Color (1.4.1) — 선택 상태를 색만으로 전달하지 않도록 체크 표시를 병행합니다. |
| 명시 규칙 4 | - colors — 문자열 CSS 색 또는 {value, label?, disabled?} 항목의 배열. value / defaultValue / onChange(color) — 선택된 색. size(px, 기본 28) · shape(rounded · circle) · label(radiogroup 접근 가능 이름, 기본 색상 선택) · disabled(그룹 전체 비활성). - 색상 스와치 묶음은 관행상 단일 선택 그룹이므로 radiogroup + radio + aria-checked로 노출합니다. 선택 상태를 링 색만으로 표현하지 않습니다. - 항목의 접근 가능… |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- colors — 문자열 CSS 색 또는 {value, label?, disabled?} 항목의 배열. value / defaultValue / onChange(color) — 선택된 색. size(px, 기본 28) · shape(rounded · circle) · label(radiogroup 접근 가능 이름, 기본 색상 선택) · disabled(그룹 전체 비활성).
- 항목의 접근 가능 이름은 label입니다. 한국어 색 이름을 항상 제공하세요. CF6360이나 var(--color-…) 같은 원시 CSS 값은 이름으로 쓰지 않으며, label이 없으면 위치 기반 한국어 이름(색상 1, 색상 2 …)으로 대체합니다.
- Polaris ColorPicker·Fluent SwatchPicker의 색상명 라벨 관행을 따라 스와치마다 사람이 읽는 이름을 요구합니다.
- - colors — 문자열 CSS 색 또는 {value, label?, disabled?} 항목의 배열. value / defaultValue / onChange(color) — 선택된 색. size(px, 기본 28) · shape(rounded · circle) · label(radiogroup 접근 가능 이름, 기본 색상 선택) · disabled(그룹 전체 비활성). - 색상 스와치 묶음은 관행상 단일 선택 그룹이므로 radiogroup + radio + aria-checked로 노출합니다. 선택 상태를 링 색만으로 표현하지 않습니다. - 항목의 접근 가능….

## Accessibility

- 색상 스와치 묶음은 관행상 단일 선택 그룹이므로 radiogroup + radio + aria-checked로 노출합니다. 선택 상태를 링 색만으로 표현하지 않습니다.
- 키보드는 APG Radio Group 계약입니다. 그룹 전체가 Tab stop 하나(선택된 스와치, 없으면 첫 활성 스와치)를 갖고 Arrow Left/Right/Up/Down이 순환 이동하면서 선택을 함께 옮기며 Home/End는 처음/끝으로 갑니다. disabled 항목은 이동에서 건너뜁니다.
- WAI-ARIA Radio Group pattern — 단일 Tab stop, 방향키 이동+선택, radio/aria-checked 계약.
- WCAG 2.2 Use of Color (1.4.1) — 선택 상태를 색만으로 전달하지 않도록 체크 표시를 병행합니다.
- - colors — 문자열 CSS 색 또는 {value, label?, disabled?} 항목의 배열. value / defaultValue / onChange(color) — 선택된 색. size(px, 기본 28) · shape(rounded · circle) · label(radiogroup 접근 가능 이름, 기본 색상 선택) · disabled(그룹 전체 비활성). - 색상 스와치 묶음은 관행상 단일 선택 그룹이므로 radiogroup + radio + aria-checked로 노출합니다. 선택 상태를 링 색만으로 표현하지 않습니다. - 항목의 접근 가능….

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | 제품이 허용한 소수의 색 토큰을 고르는 용도입니다. 임의 색상 입력, 그라디언트, 팔레트 편집에는 전용 색상 편집기를 사용하세요. |
| Don't | 색상 스와치 묶음은 관행상 단일 선택 그룹이므로 radiogroup + radio + aria-checked로 노출합니다. 선택 상태를 링 색만으로 표현하지 않습니다. |
| Do | Color Swatch가 소유하는 Selection and Input 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다. |
| Don't | 항목의 접근 가능 이름은 label입니다. 한국어 색 이름을 항상 제공하세요. CF6360이나 var(--color-…) 같은 원시 CSS 값은 이름으로 쓰지 않으며, label이 없으면 위치 기반 한국어 이름(색상 1, 색상 2 …)으로 대체합니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 ColorSwatch의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `DatePicker` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DateRangeField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FileUpload` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FileUploadQueue` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `IconPicker` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `NumberField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `PinInput` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `PropertyField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<ColorSwatch
  colors={[
    { value: '#0067A8', label: '브랜드 파랑' },
    { value: '#5E6E86', label: '중립 회색' },
    { value: '#CF6360', label: '경고 빨강' },
  ]}
  defaultValue="#0067A8"
  onChange={setColor}
/>
```

## Tokens and API

### Tokens

- `--color-semantic-background-elevated-normal`
- `--color-semantic-focus-ring`
- `--color-semantic-line-normal-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-static-black`
- `--color-semantic-static-white`
- `--dur-fast`
- `--ease-out`
- `--radius-md`

### Source contracts

- `components/forms/ColorSwatch.jsx`
- `components/forms/ColorSwatch.d.ts`
- `components/forms/ColorSwatch.prompt.md`
- `stories/SelectionColorSwatch.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- ColorSwatch prompt contract: `components/forms/ColorSwatch.prompt.md`
- Storybook implementation evidence: `stories/SelectionColorSwatch.stories.jsx`
- [WAI-ARIA Radio Group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
- [WCAG 2.2 Use of Color (1.4.1)](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
