# Sparkline

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Visualization |
| Owner | `Sparkline` |
| Storybook | `LDS Product/Data/Visualization/Sparkline` |
| Source | `../component-content.json#product-data-visualization-sparkline` |

카드나 표 셀 안에서 짧은 시계열의 상승·하락·변동만 보조적으로 보여 줄 때 적합합니다. 축·기준선·정확한 값 비교가 중요하면 Sparkline 대신 전체 Line Chart를 사용하세요.

## 사용 판단

### 사용

- Sparkline — 현재 KPI 옆에서 짧은 수치 추세를 보여주는 축 없는 인라인 차트. Classification: LDS Product Data Extension.

### 사용하지 않음

- MetricCard의 tabular current value를 대체하지 않습니다. Sparkline은 과거 흐름만 보조하며 현재 값·기간·baseline은 MetricCard가 소유합니다.

## Anatomy

| Part | Contract |
| --- | --- |
| description | 추세의 맥락을 설명하는 스크린 리더용 문장. |
| emptyLabel | 데이터가 비었을 때 보이는 문구이자 텍스트 요약. @default "데이터가 없습니다" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `data` | `number[]` | Yes | 데이터 포인트. |
| `width` | `number` | No |  |
| `height` | `number` | No |  |
| `color` | `string` | No |  |
| `fill` | `boolean` | No | 선 아래 부드러운 영역 채움. @default true |
| `strokeWidth` | `number` | No |  |
| `description` | `string` | No | 추세의 맥락을 설명하는 스크린 리더용 문장. |
| `summary` | `string` | No | 자동 생성되는 시작·최저·최고·마지막 값 요약을 재정의합니다. |
| `emptyLabel` | `string` | No | 데이터가 비었을 때 보이는 문구이자 텍스트 요약. @default "데이터가 없습니다" |
| `formatValue` | `(value: number) = string` | No | 텍스트 요약에서 수치를 포맷합니다. |

## States

| State | Contract |
| --- | --- |
| emptyLabel | 데이터가 비었을 때 보이는 문구이자 텍스트 요약. @default "데이터가 없습니다" |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 기존 primary stroke, soft fill, 2px inset을 유지하고 좁은 부모에서 비례 축소되도록 max-width만 보강했습니다. |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |
| --color-semantic-primary-normal | light: #3878B3; dark: #5390C9 |
| --fw-medium | 500 |

## Responsive

- data / width / height / color / fill / strokeWidth — compact trend의 수치와 시각 축입니다. finite 값만 그립니다.
- LineChart의 responsive SVG, named image, 패턴을 따르되 axis/legend/reference line 없이 inline 추세에만 집중합니다.

## Content and writing

- description / summary / emptyLabel / formatValue — SVG의 설명, 자동 개수·시작·최저·최고·마지막 요약 override, 보이는 빈 문구, 요약 수치 formatter입니다.
- 빈 배열은 빈 SVG가 아니라 emptyLabel 텍스트를 렌더하고 같은 정보를 에 제공합니다.
- PatternFly dashboard guidelines는 trend card가 current value와 prior values over a period를 함께 보여주고 sparkline을 흔히 사용한다고 설명합니다. current value·period·action은 MetricCard에, trend rendering만 Sparkline에 둡니다.

## Accessibility

- 제품 맥락이 있는 aria-label을 제공하세요. 생략 시 fallback 이름은 추세 차트입니다.
- Carbon chart anatomy의 descriptive title/label 원칙을 축 없는 sparkline에도 적용해 accessible name과 수치 요약을 요구합니다.
- Carbon accessibility for developers의 meaningful description/data alternative 원칙에 따라 선 모양만 발표하지 않고 시작·범위·마지막 값을 텍스트로 제공합니다.
- 필수 범위는 accessible identity, deterministic trend summary, visible empty state, responsive inline rendering입니다. tooltip, hover point, axis, selection, forecasting은 LineChart 또는 제품 chart engine에 남깁니다.

## Related components

| Component | Relationship |
| --- | --- |
| `AnnotatedImage` | 대표 시나리오에서 조합 |
| `BarChart` | 대표 시나리오에서 조합 |
| `Calendar` | 대표 시나리오에서 조합 |
| `Carousel` | 대표 시나리오에서 조합 |
| `ChartFrame` | 대표 시나리오에서 조합 |
| `DataCollectionPanel` | 대표 시나리오에서 조합 |
| `DataExportAction` | 대표 시나리오에서 조합 |
| `DataGrid` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Sparkline
  aria-label="최근 7일 처리량 추세"
  description="일별 처리량입니다."
  data={[3, 5, 4, 8, 6, 9, 12]}
/>
```

## Tokens and API

### Tokens

- `--color-semantic-label-alternative`
- `--color-semantic-primary-normal`
- `--fw-medium`

### Source contracts

- `components/data/Sparkline.jsx`
- `components/data/Sparkline.d.ts`
- `components/data/Sparkline.prompt.md`
- `stories/DataSparkline.stories.jsx`

## Sources

- Sparkline prompt contract: `components/data/Sparkline.prompt.md`
- Storybook implementation evidence: `stories/DataSparkline.stories.jsx`
- [PatternFly dashboard guidelines](https://www.patternfly.org/patterns/dashboard/design-guidelines/)
- [Carbon chart anatomy](https://v10.carbondesignsystem.com/data-visualization/chart-anatomy/)
- [Carbon accessibility for developers](https://carbondesignsystem.com/guidelines/accessibility/developers/)
