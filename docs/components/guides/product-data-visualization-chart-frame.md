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

### 사용

- 차트를 제목·설명·범례·action·resource 상태와 하나의 분석 표면으로 묶을 때 적합합니다. 주변 정보가 필요 없는 작은 인라인 추세에는 Chart Frame 대신 Sparkline 또는 단독 Chart를 사용하세요.
- frame region은 title과 description에 연결됩니다. 차트는 별도의 aria-label, description, deterministic summary를 계속 제공해야 합니다.
- - 읽기 순서는 title/meta → actions → description → resource message → chart → legend → freshness입니다. - header는 2단 구조입니다: 첫 행에 title과 보조 meta(구분점으로 연결)를 두고 actions를 그 행에 세로 중앙 정렬하며, description은 아래 행에서 전체 폭을 씁니다. 세로 스택 옆에 툴바가 떠 있는 형태를 만들지 않습니다. - ResourceState를 embedded로 조합해 initial loading은 Skeleton으로 대체하고, refreshing/stal….
- 내부 Card, ResourceState, Legend, DataToolbar와 각 chart의 접근성 계약을 비교했습니다. Carbon chart anatomy는 title, legend, labels, axes와 source/context의 일관된 anatomy를, PatternFly dashboard는 카드 기반 지표의 scan hierarchy와 responsive grid를, Carbon accessibility는 시각화에 비시각적 대안을 제공할 것을 요구합니다.

### 사용하지 않음

- 조건부 chart가 false, null, undefined인 상태는 보존 데이터로 간주하지 않습니다. error/offline에서 마지막 정상 chart를 유지하려면 실제 chart 노드를 children으로 전달합니다.
- 대시보드 차트의 제목, 맥락, action, 차트, 범례, loading/empty/error/stale/freshness를 한 표면에 묶는 LK Product Extension입니다. 개별 BarChart, DonutChart, LineChart, Sparkline의 accessible name과 텍스트 요약을 대신하지 않습니다.
- - 읽기 순서는 title/meta → actions → description → resource message → chart → legend → freshness입니다. - header는 2단 구조입니다: 첫 행에 title과 보조 meta(구분점으로 연결)를 두고 actions를 그 행에 세로 중앙 정렬하며, description은 아래 행에서 전체 폭을 씁니다. 세로 스택 옆에 툴바가 떠 있는 형태를 만들지 않습니다. - ResourceState를 embedded로 조합해 initial loading은 Skeleton으로 대체하고, refreshing/stal….
- 범용 tooltip/crosshair/zoom engine은 의도적으로 포함하지 않습니다. 이 frame은 chart renderer가 아니라 상태와 주변 anatomy의 재사용 계약입니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | ChartFrame의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Title | title 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Description | description 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Actions | actions 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Legend | legend 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| State Title | stateTitle 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| State Description | stateDescription 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| State Action | stateAction 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `title` | `React.ReactNode` | Yes | 공개 타입 계약에 정의된 속성입니다. |
| `description` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `meta` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `actions` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `legend` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `resourceState` | `ResourceStateValue` | No | 공개 타입 계약에 정의된 속성입니다. |
| `stateTitle` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `stateDescription` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `stateAction` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `lastUpdated` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `loadingContent` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | No | 주변 문서 구조에 맞춘 제목 단계. @default 3 |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `bodyStyle` | `React.CSSProperties` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| resourceState | 공개 타입 계약에 정의된 속성입니다. 타입 계약: ResourceStateValue |
| stateTitle | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.ReactNode |
| stateDescription | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.ReactNode |
| stateAction | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.ReactNode |
| loadingContent | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.ReactNode |
| 변형·상태 · 로딩과 오류 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 반응형 · 좁은 폭과 오래된 데이터 유지 | responsive 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- 한 개의 card surface만 만듭니다. 차트나 상태 안에 추가 card를 넣지 않습니다.
- 조건부 chart가 false, null, undefined인 상태는 보존 데이터로 간주하지 않습니다. error/offline에서 마지막 정상 chart를 유지하려면 실제 chart 노드를 children으로 전달합니다.
- - 읽기 순서는 title/meta → actions → description → resource message → chart → legend → freshness입니다. - header는 2단 구조입니다: 첫 행에 title과 보조 meta(구분점으로 연결)를 두고 actions를 그 행에 세로 중앙 정렬하며, description은 아래 행에서 전체 폭을 씁니다. 세로 스택 옆에 툴바가 떠 있는 형태를 만들지 않습니다. - ResourceState를 embedded로 조합해 initial loading은 Skeleton으로 대체하고, refreshing/stal….
- 범용 tooltip/crosshair/zoom engine은 의도적으로 포함하지 않습니다. 이 frame은 chart renderer가 아니라 상태와 주변 anatomy의 재사용 계약입니다.
- ChartFrame의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | header는 2단 구조입니다: 첫 행에 title과 보조 meta(구분점으로 연결)를 두고 actions를 그 행에 세로 중앙 정렬하며, description은 아래 행에서 전체 폭을 씁니다. 세로 스택 옆에 툴바가 떠 있는 형태를 만들지 않습니다. |
| 명시 규칙 2 | 제목은 기본 headingLevel={3}이며, 합성되는 페이지·섹션의 실제 heading 구조에 맞춰 16 중 인접한 단계를 명시합니다. |
| 명시 규칙 3 | - 읽기 순서는 title/meta → actions → description → resource message → chart → legend → freshness입니다. - header는 2단 구조입니다: 첫 행에 title과 보조 meta(구분점으로 연결)를 두고 actions를 그 행에 세로 중앙 정렬하며, description은 아래 행에서 전체 폭을 씁니다. 세로 스택 옆에 툴바가 떠 있는 형태를 만들지 않습니다. - ResourceState를 embedded로 조합해 initial loading은 Skeleton으로 대체하고, refreshing/stal… |
| --body1-line | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --body1-size | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |

## Responsive

- action과 legend는 좁은 폭에서 DOM 순서를 유지하며 줄바꿈됩니다.
- - 읽기 순서는 title/meta → actions → description → resource message → chart → legend → freshness입니다. - header는 2단 구조입니다: 첫 행에 title과 보조 meta(구분점으로 연결)를 두고 actions를 그 행에 세로 중앙 정렬하며, description은 아래 행에서 전체 폭을 씁니다. 세로 스택 옆에 툴바가 떠 있는 형태를 만들지 않습니다. - ResourceState를 embedded로 조합해 initial loading은 Skeleton으로 대체하고, refreshing/stal….
- 내부 Card, ResourceState, Legend, DataToolbar와 각 chart의 접근성 계약을 비교했습니다. Carbon chart anatomy는 title, legend, labels, axes와 source/context의 일관된 anatomy를, PatternFly dashboard는 카드 기반 지표의 scan hierarchy와 responsive grid를, Carbon accessibility는 시각화에 비시각적 대안을 제공할 것을 요구합니다.
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.

## Content and writing

- 읽기 순서는 title/meta → actions → description → resource message → chart → legend → freshness입니다.
- header는 2단 구조입니다: 첫 행에 title과 보조 meta(구분점으로 연결)를 두고 actions를 그 행에 세로 중앙 정렬하며, description은 아래 행에서 전체 폭을 씁니다. 세로 스택 옆에 툴바가 떠 있는 형태를 만들지 않습니다.
- frame region은 title과 description에 연결됩니다. 차트는 별도의 aria-label, description, deterministic summary를 계속 제공해야 합니다.
- 제목은 기본 headingLevel={3}이며, 합성되는 페이지·섹션의 실제 heading 구조에 맞춰 16 중 인접한 단계를 명시합니다.

## Accessibility

- frame region은 title과 description에 연결됩니다. 차트는 별도의 aria-label, description, deterministic summary를 계속 제공해야 합니다.
- 대시보드 차트의 제목, 맥락, action, 차트, 범례, loading/empty/error/stale/freshness를 한 표면에 묶는 LK Product Extension입니다. 개별 BarChart, DonutChart, LineChart, Sparkline의 accessible name과 텍스트 요약을 대신하지 않습니다.
- - 읽기 순서는 title/meta → actions → description → resource message → chart → legend → freshness입니다. - header는 2단 구조입니다: 첫 행에 title과 보조 meta(구분점으로 연결)를 두고 actions를 그 행에 세로 중앙 정렬하며, description은 아래 행에서 전체 폭을 씁니다. 세로 스택 옆에 툴바가 떠 있는 형태를 만들지 않습니다. - ResourceState를 embedded로 조합해 initial loading은 Skeleton으로 대체하고, refreshing/stal….
- 내부 Card, ResourceState, Legend, DataToolbar와 각 chart의 접근성 계약을 비교했습니다. Carbon chart anatomy는 title, legend, labels, axes와 source/context의 일관된 anatomy를, PatternFly dashboard는 카드 기반 지표의 scan hierarchy와 responsive grid를, Carbon accessibility는 시각화에 비시각적 대안을 제공할 것을 요구합니다.
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | frame region은 title과 description에 연결됩니다. 차트는 별도의 aria-label, description, deterministic summary를 계속 제공해야 합니다. |
| Don't | 조건부 chart가 false, null, undefined인 상태는 보존 데이터로 간주하지 않습니다. error/offline에서 마지막 정상 chart를 유지하려면 실제 chart 노드를 children으로 전달합니다. |
| Do | - 읽기 순서는 title/meta → actions → description → resource message → chart → legend → freshness입니다. - header는 2단 구조입니다: 첫 행에 title과 보조 meta(구분점으로 연결)를 두고 actions를 그 행에 세로 중앙 정렬하며, description은 아래 행에서 전체 폭을 씁니다. 세로 스택 옆에 툴바가 떠 있는 형태를 만들지 않습니다. - ResourceState를 embedded로 조합해 initial loading은 Skeleton으로 대체하고, refreshing/stal…. |
| Don't | 대시보드 차트의 제목, 맥락, action, 차트, 범례, loading/empty/error/stale/freshness를 한 표면에 묶는 LK Product Extension입니다. 개별 BarChart, DonutChart, LineChart, Sparkline의 accessible name과 텍스트 요약을 대신하지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 ChartFrame의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `BarChart` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Button` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DonutChart` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Legend` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `RefreshControl` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `AnnotatedImage` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Calendar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Carousel` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- ChartFrame prompt contract: `components/data/ChartFrame.prompt.md`
- Storybook implementation evidence: `stories/DataChartFrame.stories.jsx`
- [Carbon chart anatomy](https://carbondesignsystem.com/data-visualization/chart-anatomy/)
- [PatternFly dashboard](https://www.patternfly.org/patterns/dashboard/design-guidelines/)
- [Carbon accessibility](https://carbondesignsystem.com/guidelines/accessibility/developers/)
