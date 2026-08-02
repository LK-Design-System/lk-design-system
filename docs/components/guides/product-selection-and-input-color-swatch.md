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

- 제품이 허용한 소수의 색 토큰을 고르는 용도입니다. 임의 색상 입력, 그라디언트, 팔레트 편집에는 전용 색상 편집기를 사용하세요.

### 사용하지 않음

- 선택은 시그널 잉크 링 그리고 흰 체크 표시로 동시에 전달합니다. 체크에는 어두운 halo를 덧입혀 밝은 색 위에서도 형태가 보이게 합니다. 색 대비만으로 선택을 구분하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| label | radiogroup의 접근 가능 이름. @default "색상 선택" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `colors` | `Array` | Yes | 색상(임의의 CSS 색) 또는 색 이름을 담은 항목. |
| `value` | `string` | No |  |
| `defaultValue` | `string` | No |  |
| `onChange` | `(color: string) = void` | No |  |
| `size` | `number` | No | 스와치 크기(px). @default 28 |
| `shape` | `'rounded' \| 'circle'` | No |  |
| `label` | `string` | No | radiogroup의 접근 가능 이름. @default "색상 선택" |
| `disabled` | `boolean` | No | 그룹 전체를 비활성화합니다. |

## States

| State | Contract |
| --- | --- |
| disabled | 그룹 전체를 비활성화합니다. |

## Behavior and interaction

- ColorSwatch — 제한된 색 목록에서 하나를 고르는 단일 선택 스와치 행.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | colors — 문자열 CSS 색 또는 {value, label?, disabled?} 항목의 배열. value / defaultValue / onChange(color) — 선택된 색. size(px, 기본 28) · shape(rounded · circle) · label(radiogroup 접근 가능 이름, 기본 색상 선택) · disabled(그룹 전체 비활성). |
| 명시 규칙 2 | 항목의 접근 가능 이름은 label입니다. 한국어 색 이름을 항상 제공하세요. CF6360이나 var(--color-…) 같은 원시 CSS 값은 이름으로 쓰지 않으며, label이 없으면 위치 기반 한국어 이름(색상 1, 색상 2 …)으로 대체합니다. |
| 명시 규칙 3 | WCAG 2.2 Use of Color (1.4.1) — 선택 상태를 색만으로 전달하지 않도록 체크 표시를 병행합니다. |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-focus-ring | light: color-mix(in srgb, var(--color-semantic-primary-normal) 20%, transparent); dark: color-mix(in srgb, var(--color-semantic-primary-normal) 40%, transparent) |

## Content and writing

- Polaris ColorPicker·Fluent SwatchPicker의 색상명 라벨 관행을 따라 스와치마다 사람이 읽는 이름을 요구합니다.

## Accessibility

- 색상 스와치 묶음은 관행상 단일 선택 그룹이므로 radiogroup + radio + aria-checked로 노출합니다. 선택 상태를 링 색만으로 표현하지 않습니다.
- 키보드는 APG Radio Group 계약입니다. 그룹 전체가 Tab stop 하나(선택된 스와치, 없으면 첫 활성 스와치)를 갖고 Arrow Left/Right/Up/Down이 순환 이동하면서 선택을 함께 옮기며 Home/End는 처음/끝으로 갑니다. disabled 항목은 이동에서 건너뜁니다.
- WAI-ARIA Radio Group pattern — 단일 Tab stop, 방향키 이동+선택, radio/aria-checked 계약.

## Related components

| Component | Relationship |
| --- | --- |
| `DatePicker` | 대표 시나리오에서 조합 |
| `DateRangeField` | 대표 시나리오에서 조합 |
| `FieldAction` | 대표 시나리오에서 조합 |
| `FileUpload` | 대표 시나리오에서 조합 |
| `FileUploadQueue` | 대표 시나리오에서 조합 |
| `IconPicker` | 대표 시나리오에서 조합 |
| `NumberField` | 대표 시나리오에서 조합 |
| `PinInput` | 대표 시나리오에서 조합 |

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
- `--space-2-5`

### Source contracts

- `components/forms/ColorSwatch.jsx`
- `components/forms/ColorSwatch.d.ts`
- `components/forms/ColorSwatch.prompt.md`
- `stories/SelectionColorSwatch.stories.jsx`

## Sources

- ColorSwatch prompt contract: `components/forms/ColorSwatch.prompt.md`
- Storybook implementation evidence: `stories/SelectionColorSwatch.stories.jsx`
- [WAI-ARIA Radio Group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
- [WCAG 2.2 Use of Color (1.4.1)](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
