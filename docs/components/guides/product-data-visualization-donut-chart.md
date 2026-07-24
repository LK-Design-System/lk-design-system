# Donut Chart

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Visualization |
| Owner | `DonutChart` |
| Storybook | `LDS Product/Data/Visualization/Donut Chart` |
| Source | `../component-content.json#product-data-visualization-donut-chart` |

합계가 의미 있는 소수 범주의 구성 비율과 중심 요약값을 보여 줄 때 적합합니다. 정확한 값 비교나 범주가 많을 때는 Donut Chart 대신 Bar Chart 또는 Table을 사용하세요.

## 사용 판단

### 사용

- 합계가 의미 있는 소수 범주의 구성 비율과 중심 요약값을 보여 줄 때 적합합니다. 정확한 값 비교나 범주가 많을 때는 Donut Chart 대신 Bar Chart 또는 Table을 사용하세요.
- 빈 배열과 0합계는 구분합니다. 빈 배열은 emptyLabel, 0합계는 실제 세그먼트 이름·0 값이 포함된 요약을 제공합니다.
- PatternFly dashboard guidelines는 proportional utilization에 bar/donut을 사용하고 card title과 선택적 action을 별도 anatomy로 둡니다. 해당 chrome은 MetricCard/Card 조합에 남깁니다.
- DonutChart — 비음수 세그먼트의 전체 대비 비율과 실제 합계를 보여주는 링 차트. Classification: LDS Product Data Extension.

### 사용하지 않음

- host Card가 surface와 action을 소유합니다. DonutChart에 별도 card chrome이나 nested surface를 추가하지 않습니다.
- Carbon accessibility for developers의 의미 있는 텍스트 대안 원칙에 따라 색·호 길이만으로 값을 전달하지 않습니다.
- - Legend의 swatch+label+value 위계를 유지하되 Donut 내부 범례는 차트의 자동 텍스트 요약과 중복 발표되지 않도록 decorative 처리합니다. - LineChart와 같은 named image/description 계약을 채택하고, 원형 차트의 big number와 비율 범례만 고유 anatomy로 유지합니다. - host Card가 surface와 action을 소유합니다. DonutChart에 별도 card chrome이나 nested surface를 추가하지 않습니다. - 기존 palette, ring thickness, cente….
- - Carbon chart anatomy는 circular chart의 title, label, tooltip, legend, graph frame, big number를 구분하며 작은 slice의 정보가 사라질 때 데이터 대안이 필요하다고 설명합니다. LDS는 모든 세그먼트를 결정적 텍스트 요약에 포함합니다. - Carbon accessibility for developers의 의미 있는 텍스트 대안 원칙에 따라 색·호 길이만으로 값을 전달하지 않습니다. - PatternFly dashboard guidelines는 proportional utilization에….

## Anatomy

| Part | Contract |
| --- | --- |
| Root | DonutChart의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Center Label | 가운데 텍스트 재정의. |
| Legend | 측면 범례. @default true |
| Description | 차트가 무엇을 구성하는지 설명하는 스크린 리더용 문장. |
| Empty Label | 세그먼트 배열이 비었을 때 가운데에 보이는 문구이자 텍스트 요약. @default "데이터가 없습니다" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `segments` | `DonutSegment[]` | Yes | 공개 타입 계약에 정의된 속성입니다. |
| `size` | `number` | No | 공개 타입 계약에 정의된 속성입니다. |
| `thickness` | `number` | No | 공개 타입 계약에 정의된 속성입니다. |
| `showTotal` | `boolean` | No | 가운데에 합계 표시. @default true |
| `centerLabel` | `React.ReactNode` | No | 가운데 텍스트 재정의. |
| `legend` | `boolean` | No | 측면 범례. @default true |
| `description` | `React.ReactNode` | No | 차트가 무엇을 구성하는지 설명하는 스크린 리더용 문장. |
| `summary` | `React.ReactNode` | No | 자동 생성되는 합계·세그먼트·비율 요약을 재정의합니다. |
| `emptyLabel` | `React.ReactNode` | No | 세그먼트 배열이 비었을 때 가운데에 보이는 문구이자 텍스트 요약. @default "데이터가 없습니다" |

## States

| State | Contract |
| --- | --- |
| emptyLabel | 세그먼트 배열이 비었을 때 가운데에 보이는 문구이자 텍스트 요약. @default "데이터가 없습니다" 타입 계약: React.ReactNode |
| 반응형 · 좁은 폭과 긴 범례 | responsive 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- size / thickness / showTotal / centerLabel / legend — 링, big number, 보이는 범례 축입니다. 긴 label과 범례는 좁은 폭에서 감싸집니다.
- description / summary / emptyLabel — root role="img"의 설명, 자동 합계·수치·비율 요약 override, 빈 배열의 가운데 문구입니다.
- 빈 배열과 0합계는 구분합니다. 빈 배열은 emptyLabel, 0합계는 실제 세그먼트 이름·0 값이 포함된 요약을 제공합니다.
- 기존 palette, ring thickness, centered total을 유지하고 zero-sum의 거짓 1과 narrow overflow만 제거했습니다.
- PatternFly dashboard guidelines는 proportional utilization에 bar/donut을 사용하고 card title과 선택적 action을 별도 anatomy로 둡니다. 해당 chrome은 MetricCard/Card 조합에 남깁니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | segments — { id?, value, label, accessibleLabel?, color? }[]. 음수와 비수치 값은 원형 비율에서 0으로 취급합니다. |
| 명시 규칙 2 | 합계가 0이면 1을 대체 합계로 만들지 않습니다. 색 세그먼트는 그리지 않고 가운데 0, 범례 0%, 텍스트 합계 0을 유지합니다. |
| 명시 규칙 3 | 빈 배열과 0합계는 구분합니다. 빈 배열은 emptyLabel, 0합계는 실제 세그먼트 이름·0 값이 포함된 요약을 제공합니다. |
| 명시 규칙 4 | 기존 palette, ring thickness, centered total을 유지하고 zero-sum의 거짓 1과 narrow overflow만 제거했습니다. |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Responsive

- size / thickness / showTotal / centerLabel / legend — 링, big number, 보이는 범례 축입니다. 긴 label과 범례는 좁은 폭에서 감싸집니다.
- 기존 palette, ring thickness, centered total을 유지하고 zero-sum의 거짓 1과 narrow overflow만 제거했습니다.
- - segments — { id?, value, label, accessibleLabel?, color? }[]. 음수와 비수치 값은 원형 비율에서 0으로 취급합니다. - size / thickness / showTotal / centerLabel / legend — 링, big number, 보이는 범례 축입니다. 긴 label과 범례는 좁은 폭에서 감싸집니다. - description / summary / emptyLabel — root role="img"의 설명, 자동 합계·수치·비율 요약 override, 빈 배열의 가운데 문구입니다. - 합계가 0이면 1을….
- - Legend의 swatch+label+value 위계를 유지하되 Donut 내부 범례는 차트의 자동 텍스트 요약과 중복 발표되지 않도록 decorative 처리합니다. - LineChart와 같은 named image/description 계약을 채택하고, 원형 차트의 big number와 비율 범례만 고유 anatomy로 유지합니다. - host Card가 surface와 action을 소유합니다. DonutChart에 별도 card chrome이나 nested surface를 추가하지 않습니다. - 기존 palette, ring thickness, cente….

## Content and writing

- segments — { id?, value, label, accessibleLabel?, color? }[]. 음수와 비수치 값은 원형 비율에서 0으로 취급합니다.
- size / thickness / showTotal / centerLabel / legend — 링, big number, 보이는 범례 축입니다. 긴 label과 범례는 좁은 폭에서 감싸집니다.
- description / summary / emptyLabel — root role="img"의 설명, 자동 합계·수치·비율 요약 override, 빈 배열의 가운데 문구입니다.
- 합계가 0이면 1을 대체 합계로 만들지 않습니다. 색 세그먼트는 그리지 않고 가운데 0, 범례 0%, 텍스트 합계 0을 유지합니다.

## Accessibility

- segments — { id?, value, label, accessibleLabel?, color? }[]. 음수와 비수치 값은 원형 비율에서 0으로 취급합니다.
- description / summary / emptyLabel — root role="img"의 설명, 자동 합계·수치·비율 요약 override, 빈 배열의 가운데 문구입니다.
- Carbon accessibility for developers의 의미 있는 텍스트 대안 원칙에 따라 색·호 길이만으로 값을 전달하지 않습니다.
- - segments — { id?, value, label, accessibleLabel?, color? }[]. 음수와 비수치 값은 원형 비율에서 0으로 취급합니다. - size / thickness / showTotal / centerLabel / legend — 링, big number, 보이는 범례 축입니다. 긴 label과 범례는 좁은 폭에서 감싸집니다. - description / summary / emptyLabel — root role="img"의 설명, 자동 합계·수치·비율 요약 override, 빈 배열의 가운데 문구입니다. - 합계가 0이면 1을….
- - Carbon chart anatomy는 circular chart의 title, label, tooltip, legend, graph frame, big number를 구분하며 작은 slice의 정보가 사라질 때 데이터 대안이 필요하다고 설명합니다. LDS는 모든 세그먼트를 결정적 텍스트 요약에 포함합니다. - Carbon accessibility for developers의 의미 있는 텍스트 대안 원칙에 따라 색·호 길이만으로 값을 전달하지 않습니다. - PatternFly dashboard guidelines는 proportional utilization에….

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | 빈 배열과 0합계는 구분합니다. 빈 배열은 emptyLabel, 0합계는 실제 세그먼트 이름·0 값이 포함된 요약을 제공합니다. |
| Don't | host Card가 surface와 action을 소유합니다. DonutChart에 별도 card chrome이나 nested surface를 추가하지 않습니다. |
| Do | PatternFly dashboard guidelines는 proportional utilization에 bar/donut을 사용하고 card title과 선택적 action을 별도 anatomy로 둡니다. 해당 chrome은 MetricCard/Card 조합에 남깁니다. |
| Don't | Carbon accessibility for developers의 의미 있는 텍스트 대안 원칙에 따라 색·호 길이만으로 값을 전달하지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 DonutChart의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `AnnotatedImage` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `BarChart` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Calendar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ChartFrame` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Carousel` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DataGrid` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DataToolbar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DataExportAction` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<DonutChart
  aria-label="운영 상태 비율"
  description="정상, 검토, 중지 장비의 구성을 보여줍니다."
  segments={[
    { id: 'healthy', value: 12, label: '정상' },
    { id: 'review', value: 7, label: '검토' },
    { id: 'stopped', value: 5, label: '중지' },
  ]}
/>
```

## Tokens and API

### Tokens

- `--caption1-size`
- `--color-semantic-data-viz-series-1`
- `--color-semantic-data-viz-series-2`
- `--color-semantic-data-viz-series-3`
- `--color-semantic-data-viz-series-4`
- `--color-semantic-data-viz-series-5`
- `--color-semantic-data-viz-series-6`
- `--color-semantic-fill-strong`
- `--color-semantic-label-alternative`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--font-sans`
- `--fw-extra`
- `--fw-medium`
- `--label2-line`
- `--label2-size`

### Source contracts

- `components/data/DonutChart.jsx`
- `components/data/DonutChart.d.ts`
- `components/data/DonutChart.prompt.md`
- `stories/DataDonutChart.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- DonutChart prompt contract: `components/data/DonutChart.prompt.md`
- Storybook implementation evidence: `stories/DataDonutChart.stories.jsx`
- [Carbon chart anatomy](https://v10.carbondesignsystem.com/data-visualization/chart-anatomy/)
- [Carbon accessibility for developers](https://carbondesignsystem.com/guidelines/accessibility/developers/)
- [PatternFly dashboard guidelines](https://www.patternfly.org/patterns/dashboard/design-guidelines/)
