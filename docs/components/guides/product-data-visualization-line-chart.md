# Line Chart

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Visualization |
| Owner | `LineChart` |
| Storybook | `LDS Product/Data/Visualization/Line Chart` |
| Source | `../component-content.json#product-data-visualization-line-chart` |

학습 곡선·텔레메트리·성과 지표처럼 순서가 있는 값의 추세와 여러 series를 비교할 때 적합합니다. 이산 범주의 크기나 전체 구성 비율에는 Line Chart 대신 Bar Chart 또는 Donut Chart를 사용하세요.

## 사용 판단

### 사용

- Legend를 재사용합니다. 범례용 선 swatch는 shape="line"과 dashed로 표현하고, point marker는 데이터 밀도가 낮거나 샘플 강조가 필요할 때만 켭니다.
- LineChart — 학습 곡선, 성능 지표, 텔레메트리 추이를 시간/step 축으로 보여주는 다중 시리즈 SVG 라인 차트. 새 charting engine이 아니라 Legend와 semantic token을 조합한 Product/Data pattern입니다.

### 사용하지 않음

- 제품 데이터 차트는 yDomain/yTicks와 locale-aware formatY를 명시합니다. LDS의 자동 tick은 구조 preview용 균등 분할 fallback이며 분석 화면의 nice-tick 정책을 추론하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| showLegend | 범례 표시. @default true |
| description | 차트가 무엇의 추이를 보여주는지 설명하는 스크린 리더용 문장. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `series` | `LineChartSeries[]` | No | 시리즈 배열. 각 시리즈는 {id?, name, color, dashed, points:[{x,y}]}. |
| `width` | `number` | No |  |
| `height` | `number` | No |  |
| `xLabel` | `React.ReactNode` | No |  |
| `yLabel` | `string` | No |  |
| `xTicks` | `number \| number[]` | No |  |
| `yTicks` | `number` | No | y축 분할 수. @default 4 |
| `xDomain` | `[number, number]` | No |  |
| `yDomain` | `[number, number]` | No |  |
| `includeZero` | `boolean` | No | y domain에 0을 포함합니다. @default true |
| `showGrid` | `boolean` | No | grid line 표시. @default true |
| `showLegend` | `boolean` | No | 범례 표시. @default true |
| `showPoints` | `boolean` | No | point marker 표시. @default false |
| `referenceLines` | `LineChartReferenceLine[]` | No |  |
| `emptyLabel` | `React.ReactNode` | No |  |
| `formatX` | `(v: number) = React.ReactNode` | No |  |
| `formatY` | `(v: number) = React.ReactNode` | No |  |
| `description` | `React.ReactNode` | No | 차트가 무엇의 추이를 보여주는지 설명하는 스크린 리더용 문장. |
| `summary` | `React.ReactNode` | No | 자동 생성되는 요약을 재정의합니다. 자동 요약은 시리즈별 시작·최저·최고·마지막 값에 이어 그려진 referenceLines의 이름·값과 그 선을 넘긴 시리즈를 덧붙입니다. |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 다중 시리즈를 색상만으로 구분하지 않습니다(WCAG 1.4.1). 텍스트 요약이 1차 대안이고, 시각적으로도 시리즈가 셋 이상이거나 색각 이상 사용자를 고려해야 하면 dashed(선 패턴)나 showPoints(마커)를 함께 켜서 색 외 단서를 남기세요. |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |

## Responsive

- Compare against common line chart expectations before changing it: bounded domains, axis ticks and labels, grid option, multiple series, legend handoff, reference lines, empty state, responsive SVG, and predictable formatting hooks.
- 기본은 responsive SVG입니다. width/height는 viewBox 기준 크기이며, 실제 렌더는 부모 너비 안에서 줄어듭니다.

## Content and writing

- 데이터가 없으면 축과 보이는 emptyLabel을 유지하며 같은 문구를 텍스트 요약으로 제공합니다. loading/error/zoom/tooltip/crosshair가 필요한 분석용 차트는 별도 composed product pattern으로 둡니다.
- BarChart, DonutChart, Sparkline과 같은 named image, 맥락 설명, 결정적 텍스트 요약, 보이는 empty-state 계약을 사용합니다.
- Legend의 시리즈 이름은 시각 범례를 담당하고, 자동 요약은 색과 선 모양 없이도 값의 범위와 추이를 이해할 수 있게 합니다.
- host Card/ChartFrame이 title, surface, action, refresh를 소유합니다. LineChart에는 별도 카드 chrome을 추가하지 않습니다.

## Accessibility

- series {id?,name,accessibleLabel?,color,dashed,points:[{x,y}]}[] · width/height · xTicks/yTicks · xDomain/yDomain · includeZero · showGrid/showLegend/showPoints · referenceLines {y,label,color?,dashed?}[] · emptyLabel · formatX/formatY.
- description / summary — 차트 맥락 설명과 자동 텍스트 요약 override입니다. 기본 요약은 각 시리즈의 유효 point 수, 시작, 최저, 최고, 마지막 값을 입력 순서대로 제공합니다. 복합 범례 이름은 accessibleLabel로 요약 이름을 고정합니다.
- referenceLines는 자동 요약에도 포함됩니다. y domain 안에 그려진 기준선만 대상이며 기준선 N개. 뒤에 각 선의 이름·값과 그 선을 넘긴 시리즈 이름(없으면 초과한 시리즈 없음)이 이어집니다. 임계선은 role="img" SVG 안 텍스트로만 존재하면 보조기술에 전혀 닿지 않으므로, 임계 이탈 판단을 시각 표시에만 맡기지 않습니다. summary를 직접 넘기면 기준선 문장도 그 값으로 대체되므로 필요한 내용을 직접 포함시키세요.
- Carbon accessibility for developers의 meaningful description/data alternative 원칙에 따라 선 모양과 색만 발표하지 않고 시작·범위·마지막 값을 텍스트로 제공합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `AnnotatedImage` | 대표 시나리오에서 조합 |
| `BarChart` | 대표 시나리오에서 조합 |
| `Calendar` | 대표 시나리오에서 조합 |
| `ChartFrame` | 대표 시나리오에서 조합 |
| `Carousel` | 대표 시나리오에서 조합 |
| `DataGrid` | 대표 시나리오에서 조합 |
| `DataToolbar` | 대표 시나리오에서 조합 |
| `DataExportAction` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<LineChart
  yLabel="mAP"
  xLabel="epoch"
  series={[
    { name: 'train', points: pts1 },
    { name: 'val', dashed: true, points: pts2 },
  ]}
/>
```

## Tokens and API

### Tokens

- `--caption1-line`
- `--caption1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-data-viz-series-1`
- `--color-semantic-data-viz-series-2`
- `--color-semantic-data-viz-series-3`
- `--color-semantic-data-viz-series-4`
- `--color-semantic-data-viz-series-5`
- `--color-semantic-label-alternative`
- `--color-semantic-label-assistive`
- `--color-semantic-line-normal-alternative`
- `--color-semantic-line-normal-normal`
- `--font-sans`
- `--fw-medium`
- `--fw-semibold`
- `--space-3`

### Source contracts

- `components/data/LineChart.jsx`
- `components/data/LineChart.d.ts`
- `components/data/LineChart.prompt.md`
- `stories/DataLineChart.stories.jsx`

## Sources

- LineChart prompt contract: `components/data/LineChart.prompt.md`
- Storybook implementation evidence: `stories/DataLineChart.stories.jsx`
- [Carbon chart anatomy](https://v10.carbondesignsystem.com/data-visualization/chart-anatomy/)
- [Carbon accessibility for developers](https://carbondesignsystem.com/guidelines/accessibility/developers/)
- [PatternFly dashboard guidelines](https://www.patternfly.org/patterns/dashboard/design-guidelines/)
