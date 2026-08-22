# Chart Frame

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Visualization |
| Owner | `ChartFrame` |
| Storybook | `LDS Product/Data/Visualization/Chart Frame` |
| Source | `../component-content.json#product-data-visualization-chart-frame` |

차트를 제목·설명·범례·action·resource 상태와 하나의 분석 표면으로 묶을 때 적합합니다. 주변 정보가 필요 없는 작은 인라인 추세에는 Chart Frame 대신 Sparkline 또는 단독 Chart를 사용하세요.

## 사용 판단

### 사용하지 않음

- 조건부 chart가 false, null, undefined인 상태는 보존 데이터로 간주하지 않습니다. error/offline에서 마지막 정상 chart를 유지하려면 실제 chart 노드를 children으로 전달합니다.
- 범용 tooltip/crosshair/zoom engine은 의도적으로 포함하지 않습니다. 이 frame은 chart renderer가 아니라 상태와 주변 anatomy의 재사용 계약입니다.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `title` | `React.ReactNode` | Yes |  |
| `description` | `React.ReactNode` | No |  |
| `meta` | `React.ReactNode` | No |  |
| `actions` | `React.ReactNode` | No |  |
| `legend` | `React.ReactNode` | No |  |
| `resourceState` | `ResourceStateValue` | No |  |
| `stateTitle` | `React.ReactNode` | No |  |
| `stateDescription` | `React.ReactNode` | No |  |
| `stateAction` | `React.ReactNode` | No |  |
| `lastUpdated` | `React.ReactNode` | No |  |
| `loadingContent` | `React.ReactNode` | No |  |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | No | 주변 문서 구조에 맞춘 제목 단계. @default 3 |
| `children` | `React.ReactNode` | No |  |
| `bodyStyle` | `React.CSSProperties` | No |  |

## Behavior and interaction

- 한 개의 card surface만 만듭니다. 차트나 상태 안에 추가 card를 넣지 않습니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | header는 2단 구조입니다: 첫 행에 title과 보조 meta(구분점으로 연결)를 두고 actions를 그 행에 세로 중앙 정렬하며, description은 아래 행에서 전체 폭을 씁니다. 세로 스택 옆에 툴바가 떠 있는 형태를 만들지 않습니다. |
| 명시 규칙 2 | 제목은 기본 headingLevel={3}이며, 합성되는 페이지·섹션의 실제 heading 구조에 맞춰 16 중 인접한 단계를 명시합니다. |
| --body1-line | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --body1-size | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Responsive

- action과 legend는 좁은 폭에서 DOM 순서를 유지하며 줄바꿈됩니다.

## Content and writing

- 읽기 순서는 title/meta → actions → description → resource message → chart → legend → freshness입니다.

## Accessibility

- frame region은 title과 description에 연결됩니다. 차트는 별도의 aria-label, description, deterministic summary를 계속 제공해야 합니다.
- 대시보드 차트의 제목, 맥락, action, 차트, 범례, loading/empty/error/stale/freshness를 한 표면에 묶는 LK Product Extension입니다. 개별 BarChart, DonutChart, LineChart, Sparkline의 accessible name과 텍스트 요약을 대신하지 않습니다.
- 내부 Card, ResourceState, Legend, DataToolbar와 각 chart의 접근성 계약을 비교했습니다. Carbon chart anatomy는 title, legend, labels, axes와 source/context의 일관된 anatomy를, PatternFly dashboard는 카드 기반 지표의 scan hierarchy와 responsive grid를, Carbon accessibility는 시각화에 비시각적 대안을 제공할 것을 요구합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `BarChart` | 대표 시나리오에서 조합 |
| `Button` | 대표 시나리오에서 조합 |
| `DonutChart` | 대표 시나리오에서 조합 |
| `Legend` | 대표 시나리오에서 조합 |
| `RefreshControl` | 대표 시나리오에서 조합 |
| `AnnotatedImage` | 대표 시나리오에서 조합 |
| `Carousel` | 대표 시나리오에서 조합 |
| `DataCollectionPanel` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<ChartFrame
  title="로봇 상태"
  description="현재 fleet 구성"
  actions={<RefreshControl onRefresh={refetch} />}
  resourceState={query.state}
  lastUpdated="오늘 14:32"
  legend={<Legend items={legendItems} />}
>
  <DonutChart aria-label="상태별 로봇 수" segments={segments} />
</ChartFrame>
```

## Tokens and API

### Tokens

- `--body1-line`
- `--body1-size`
- `--caption1-line`
- `--caption1-size`
- `--color-semantic-label-alternative`
- `--color-semantic-label-neutral`
- `--color-semantic-label-strong`
- `--color-semantic-line-normal-normal`
- `--component-card-bg`
- `--component-card-border`
- `--component-card-radius`
- `--component-card-shadow-sm`
- `--font-sans`
- `--fw-bold`
- `--label2-line`
- `--label2-size`
- `--space-1`
- `--space-2`
- `--space-3`
- `--space-4`
- `--space-5`

### Source contracts

- `components/data/ChartFrame.jsx`
- `components/data/ChartFrame.d.ts`
- `components/data/ChartFrame.prompt.md`
- `stories/DataChartFrame.stories.jsx`

## Sources

- ChartFrame prompt contract: `components/data/ChartFrame.prompt.md`
- Storybook implementation evidence: `stories/DataChartFrame.stories.jsx`
- [Carbon chart anatomy](https://carbondesignsystem.com/data-visualization/chart-anatomy/)
- [PatternFly dashboard](https://www.patternfly.org/patterns/dashboard/design-guidelines/)
- [Carbon accessibility](https://carbondesignsystem.com/guidelines/accessibility/developers/)
