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
- renderTooltip(x)는 제품의 시각·단위·집계·결측 표시를 맡습니다. Portal의 원본 최신값과 집계된 이력을 혼동하지 않도록 툴팁에 집계 단위를 표시합니다. 범례·조회 기간·폴링은 제품 소유입니다.
- 범위: LK Product Extension인 LineChart의 시점 조회만 확장합니다. LK Portal의 장치 리소스 분석이 직접 소비자이며, LK Web Viz와 LK Control Full Daedeok의 transport/실시간 제어 변경은 이 증분에 해당하지 않습니다. 해당 제품의 툴팁 채택을 검증 완료로 주장하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| showLegend | 범례 표시. @default true |
| renderTooltip | 선택 시점의 상세 내용. 집계 단위와 결측 의미는 제품에서 정의합니다. |
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
| `showTooltip` | `boolean` | No | 시점 조회 툴팁. 좌우 방향키 및 Home/End로 이동합니다. @default false |
| `tooltipXValues` | `number[]` | No | 결측 시점까지 선택할 수 있도록 제품이 제공하는 x 좌표. |
| `renderTooltip` | `(x: number) = React.ReactNode` | No | 선택 시점의 상세 내용. 집계 단위와 결측 의미는 제품에서 정의합니다. |
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
| 명시 규칙 2 | 포인터를 따라가는 동작은 Highcharts tooltip.followPointer의 직접 조작 관례를 따릅니다. 툴팁은 커서와 간격을 두고, WCAG 2.2 SC 1.4.13에 따라 Escape로 닫히며 툴팁 자체를 가리킬 수 있고 포인터나 포커스가 유지되는 동안 사라지지 않습니다. |
| 명시 규칙 3 | 비교 대상: Legend, Tooltip, BarChart. 차트에 카드 chrome을 추가하지 않고 Core 말풍선의 표면·타이포·간격을 유지합니다. hover 가능한 말풍선과 150ms 닫힘 지연은 포인터 이동을 위한 접근성 차이입니다. |
| 명시 규칙 4 | Recharts Tooltip의 활성 시점·다중 지표 정보 구성을 참고했습니다. WCAG 1.4.13에 따라 키보드 진입, Escape, hover 유지로 동일 정보를 제공합니다. |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Responsive

- Compare against common line chart expectations before changing it: bounded domains, axis ticks and labels, grid option, multiple series, legend handoff, reference lines, empty state, responsive SVG, and predictable formatting hooks.
- 기본은 responsive SVG입니다. width/height는 viewBox 기준 크기이며, 실제 렌더는 부모 너비 안에서 줄어듭니다.

## Content and writing

- 데이터가 없으면 축과 보이는 emptyLabel을 유지하며 같은 문구를 텍스트 요약으로 제공합니다. loading/error/zoom은 제품이 소유합니다.
- 축과 빈 상태는 기존 label-alternative 토큰을 사용합니다. 전역 토큰 값은 변경하지 않습니다.
- BarChart, DonutChart, Sparkline과 같은 named image, 맥락 설명, 결정적 텍스트 요약, 보이는 empty-state 계약을 사용합니다.
- Legend의 시리즈 이름은 시각 범례를 담당하고, 자동 요약은 색과 선 모양 없이도 값의 범위와 추이를 이해할 수 있게 합니다.

## Accessibility

- series {id?,name,accessibleLabel?,color,dashed,points:[{x,y}]}[] · width/height · xTicks/yTicks · xDomain/yDomain · includeZero · showGrid/showLegend/showPoints · referenceLines {y,label,color?,dashed?}[] · emptyLabel · formatX/formatY.
- description / summary — 차트 맥락 설명과 자동 텍스트 요약 override입니다. 기본 요약은 각 시리즈의 유효 point 수, 시작, 최저, 최고, 마지막 값을 입력 순서대로 제공합니다. 복합 범례 이름은 accessibleLabel로 요약 이름을 고정합니다.
- referenceLines는 자동 요약에도 포함됩니다. y domain 안에 그려진 기준선만 대상이며 기준선 N개. 뒤에 각 선의 이름·값과 그 선을 넘긴 시리즈 이름(없으면 초과한 시리즈 없음)이 이어집니다. 임계선은 role="img" SVG 안 텍스트로만 존재하면 보조기술에 전혀 닿지 않으므로, 임계 이탈 판단을 시각 표시에만 맡기지 않습니다. summary를 직접 넘기면 기준선 문장도 그 값으로 대체되므로 필요한 내용을 직접 포함시키세요.
- showTooltip은 기본 false인 추가 기능입니다. 기존 Core Tooltip의 배치·Escape·hover/focus 수명주기를 재사용하며 차트 위에 안정된 읽기 위치로 표시합니다.
- 포인터 툴팁은 차트 안에서 커서를 따라가되 값은 가까운 x에 스냅합니다. 차트에 Tab으로 진입한 뒤 좌우 방향키·Home/End로 이동하면 선택한 시점의 데이터 높이에 기준점을 둡니다. 터치는 차트를 탭합니다. tooltipXValues로 결측 시점도 제공할 수 있습니다.

## Exceptions

- 축 눈금·축 제목·기준선 라벨·빈 상태 문구의 크기와 시리즈·기준선의 선 굵기는 --lk-chart-tick-size, --lk-chart-axis-title-size, --lk-chart-reference-label-size, --lk-chart-empty-label-size, --lk-chart-series-stroke, --lk-chart-reference-stroke 훅을 경유하며 폴백이 곧 기존 리터럴(10px / 10px / 10px / 12px / 2 / 1.5)이라 제품 화면은 바이트 동일하게 렌더됩니다.

## Related components

| Component | Relationship |
| --- | --- |
| `AnnotatedImage` | 대표 시나리오에서 조합 |
| `BarChart` | 대표 시나리오에서 조합 |
| `Carousel` | 대표 시나리오에서 조합 |
| `ChartFrame` | 대표 시나리오에서 조합 |
| `DataCollectionPanel` | 대표 시나리오에서 조합 |
| `DataExportAction` | 대표 시나리오에서 조합 |
| `DataGrid` | 대표 시나리오에서 조합 |
| `DataToolbar` | 대표 시나리오에서 조합 |

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
- `--color-semantic-line-normal-alternative`
- `--color-semantic-line-normal-normal`
- `--font-sans`
- `--fw-medium`
- `--fw-semibold`
- `--lk-chart-axis-title-size`
- `--lk-chart-empty-label-size`
- `--lk-chart-reference-label-size`
- `--lk-chart-reference-stroke`
- `--lk-chart-series-stroke`
- `--lk-chart-tick-size`
- `--space-1`
- `--space-3`

### Source contracts

- `components/data/LineChart.jsx`
- `components/data/LineChart.d.ts`
- `components/data/LineChart.prompt.md`
- `stories/DataLineChart.stories.jsx`

## Sources

- LineChart prompt contract: `components/data/LineChart.prompt.md`
- Storybook implementation evidence: `stories/DataLineChart.stories.jsx`
- [Highcharts tooltip.followPointer](https://api.highcharts.com/highcharts/tooltip.followPointer)
- [WCAG 2.2 SC 1.4.13](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)
- [Recharts Tooltip](https://recharts.github.io/en-US/api/Tooltip/)
- [WCAG 1.4.13](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)
- [Carbon chart anatomy](https://v10.carbondesignsystem.com/data-visualization/chart-anatomy/)
- [Carbon accessibility for developers](https://carbondesignsystem.com/guidelines/accessibility/developers/)
- [PatternFly dashboard guidelines](https://www.patternfly.org/patterns/dashboard/design-guidelines/)
