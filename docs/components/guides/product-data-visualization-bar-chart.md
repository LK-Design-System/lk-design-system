# Bar Chart

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Visualization |
| Owner | `BarChart` |
| Storybook | `LDS Product/Data/Visualization/Bar Chart` |
| Source | `../component-content.json#product-data-visualization-bar-chart` |

상태·조직·제품처럼 이산 범주의 수치를 공통 기준선에서 비교할 때 적합합니다. 시간에 따른 변화나 전체 구성 비율을 보여 줄 때는 Bar Chart 대신 Line Chart 또는 Donut Chart를 사용하세요.

## 사용 판단

### 사용

- 상태·조직·제품처럼 이산 범주의 수치를 공통 기준선에서 비교할 때 적합합니다. 시간에 따른 변화나 전체 구성 비율을 보여 줄 때는 Bar Chart 대신 Line Chart 또는 Donut Chart를 사용하세요.
- data — { id?, label, accessibleLabel?, value, color? }[]. 복합 label은 accessibleLabel로 텍스트 이름을 제공합니다.
- description / summary / emptyLabel — root role="img"의 설명, 자동 label: value 요약 재정의, 빈 배열의 보이는 문구입니다. 제품 맥락을 담은 aria-label을 제공하세요.
- 빈 배열은 빈 차트를 그리지 않고 emptyLabel을 보이며 같은 문구를 텍스트 요약으로 제공합니다.

### 사용하지 않음

- Legend처럼 색상만 전달하지 않고 label과 수치를 결정적 텍스트 요약으로 연결합니다.
- dashboard surface는 기존 Card가 소유하므로 BarChart 자체는 border, radius, shadow, header/action을 추가하지 않습니다.
- - LineChart의 named role="img", 설명, responsive width 계약을 따르고 축 없는 compact 비교라는 차이만 유지합니다. - Legend처럼 색상만 전달하지 않고 label과 수치를 결정적 텍스트 요약으로 연결합니다. - dashboard surface는 기존 Card가 소유하므로 BarChart 자체는 border, radius, shadow, header/action을 추가하지 않습니다. - 기존 막대 폭, semantic primary fill, caption typography를 유지하고 label의 nowrap만 nar….
- Bar Chart가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | BarChart의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Description | 차트가 무엇을 비교하는지 설명하는 스크린 리더용 문장. |
| Empty Label | 데이터 배열이 비었을 때 보이는 문구이자 텍스트 요약. @default "데이터가 없습니다" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `data` | `BarDatum[]` | Yes | 공개 타입 계약에 정의된 속성입니다. |
| `height` | `number` | No | 공개 타입 계약에 정의된 속성입니다. |
| `gap` | `number` | No | 공개 타입 계약에 정의된 속성입니다. |
| `showValue` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `color` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `description` | `React.ReactNode` | No | 차트가 무엇을 비교하는지 설명하는 스크린 리더용 문장. |
| `summary` | `React.ReactNode` | No | 자동 생성되는 "label: value" 요약을 재정의합니다. |
| `emptyLabel` | `React.ReactNode` | No | 데이터 배열이 비었을 때 보이는 문구이자 텍스트 요약. @default "데이터가 없습니다" |

## States

| State | Contract |
| --- | --- |
| emptyLabel | 데이터 배열이 비었을 때 보이는 문구이자 텍스트 요약. @default "데이터가 없습니다" 타입 계약: React.ReactNode |
| 변형·상태 · 빈 범주 데이터 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 반응형 · 좁은 폭과 긴 라벨 | responsive 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- description / summary / emptyLabel — root role="img"의 설명, 자동 label: value 요약 재정의, 빈 배열의 보이는 문구입니다. 제품 맥락을 담은 aria-label을 제공하세요.
- 빈 배열은 빈 차트를 그리지 않고 emptyLabel을 보이며 같은 문구를 텍스트 요약으로 제공합니다.
- - data — { id?, label, accessibleLabel?, value, color? }[]. 복합 label은 accessibleLabel로 텍스트 이름을 제공합니다. - height / gap / showValue / color — compact 비교의 시각 축입니다. 긴 label은 좁은 카드에서 여러 줄로 감쌉니다. - description / summary / emptyLabel — root role="img"의 설명, 자동 label: value 요약 재정의, 빈 배열의 보이는 문구입니다. 제품 맥락을 담은 aria-label을 제공하세요.….
- 필수 범위는 accessible identity, deterministic summary, visible empty state, narrow wrapping입니다. 분석형 tooltip, keyboard data-point traversal, zoom, selection, full data table은 chart engine 또는 제품 조합에 남깁니다.
- BarChart의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | BarChart — 비음수 범주 값을 공유 최대 스케일로 비교하는 단순 세로 막대. Classification: LDS Product Data Extension. |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |
| --color-semantic-label-neutral | light: rgba(46, 47, 51, 0.88); dark: rgba(194, 196, 200, 0.88) |

## Responsive

- height / gap / showValue / color — compact 비교의 시각 축입니다. 긴 label은 좁은 카드에서 여러 줄로 감쌉니다.
- LineChart의 named role="img", 설명, responsive width 계약을 따르고 축 없는 compact 비교라는 차이만 유지합니다.
- 기존 막대 폭, semantic primary fill, caption typography를 유지하고 label의 nowrap만 narrow overflow를 막기 위해 제거했습니다.
- Carbon chart anatomy는 차트 제목, 축/레이블, 범례가 데이터 의미를 설명해야 한다고 정의합니다. 축을 생략하는 이 compact 패턴도 이름·설명·텍스트 수치 요약을 필수로 둡니다.

## Content and writing

- data — { id?, label, accessibleLabel?, value, color? }[]. 복합 label은 accessibleLabel로 텍스트 이름을 제공합니다.
- height / gap / showValue / color — compact 비교의 시각 축입니다. 긴 label은 좁은 카드에서 여러 줄로 감쌉니다.
- description / summary / emptyLabel — root role="img"의 설명, 자동 label: value 요약 재정의, 빈 배열의 보이는 문구입니다. 제품 맥락을 담은 aria-label을 제공하세요.
- 빈 배열은 빈 차트를 그리지 않고 emptyLabel을 보이며 같은 문구를 텍스트 요약으로 제공합니다.

## Accessibility

- data — { id?, label, accessibleLabel?, value, color? }[]. 복합 label은 accessibleLabel로 텍스트 이름을 제공합니다.
- description / summary / emptyLabel — root role="img"의 설명, 자동 label: value 요약 재정의, 빈 배열의 보이는 문구입니다. 제품 맥락을 담은 aria-label을 제공하세요.
- LineChart의 named role="img", 설명, responsive width 계약을 따르고 축 없는 compact 비교라는 차이만 유지합니다.
- Carbon accessibility for developers는 데이터 시각화에 의미 있는 텍스트와 screen-reader 대안을 고려하라고 안내합니다. 자동 요약은 기본 대안이며 summary는 더 풍부한 제품 설명을 위한 override입니다.
- - data — { id?, label, accessibleLabel?, value, color? }[]. 복합 label은 accessibleLabel로 텍스트 이름을 제공합니다. - height / gap / showValue / color — compact 비교의 시각 축입니다. 긴 label은 좁은 카드에서 여러 줄로 감쌉니다. - description / summary / emptyLabel — root role="img"의 설명, 자동 label: value 요약 재정의, 빈 배열의 보이는 문구입니다. 제품 맥락을 담은 aria-label을 제공하세요.….

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | data — { id?, label, accessibleLabel?, value, color? }[]. 복합 label은 accessibleLabel로 텍스트 이름을 제공합니다. |
| Don't | Legend처럼 색상만 전달하지 않고 label과 수치를 결정적 텍스트 요약으로 연결합니다. |
| Do | description / summary / emptyLabel — root role="img"의 설명, 자동 label: value 요약 재정의, 빈 배열의 보이는 문구입니다. 제품 맥락을 담은 aria-label을 제공하세요. |
| Don't | dashboard surface는 기존 Card가 소유하므로 BarChart 자체는 border, radius, shadow, header/action을 추가하지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 BarChart의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `AnnotatedImage` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Calendar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ChartFrame` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Carousel` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DataGrid` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DataToolbar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DataExportAction` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DescriptionList` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<BarChart
  aria-label="문서 상태별 항목 수"
  description="초안, 검토, 게시 상태의 항목 수를 비교합니다."
  data={[
    { id: 'draft', label: '초안', value: 12 },
    { id: 'review', label: '검토', value: 7 },
    { id: 'published', label: '게시', value: 5 },
  ]}
/>
```

## Tokens and API

### Tokens

- `--caption1-line`
- `--caption1-size`
- `--color-semantic-label-alternative`
- `--color-semantic-label-neutral`
- `--color-semantic-primary-normal`
- `--dur-slow`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--label2-line`
- `--label2-size`
- `--radius-md`

### Source contracts

- `components/data/BarChart.jsx`
- `components/data/BarChart.d.ts`
- `components/data/BarChart.prompt.md`
- `stories/DataBarChart.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- BarChart prompt contract: `components/data/BarChart.prompt.md`
- Storybook implementation evidence: `stories/DataBarChart.stories.jsx`
- [Carbon chart anatomy](https://v10.carbondesignsystem.com/data-visualization/chart-anatomy/)
- [Carbon accessibility for developers](https://carbondesignsystem.com/guidelines/accessibility/developers/)
- [PatternFly dashboard guidelines](https://www.patternfly.org/patterns/dashboard/design-guidelines/)
