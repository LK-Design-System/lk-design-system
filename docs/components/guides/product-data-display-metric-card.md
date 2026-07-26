# Metric Card

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Display |
| Owner | `MetricCard` |
| Storybook | `LDS Product/Data/Display/Metric Card` |
| Source | `../component-content.json#product-data-display-metric-card` |

대시보드에서 소수의 KPI와 기준 기간·변화·갱신 시점을 빠르게 비교할 때 적합합니다. 상세 행 데이터나 여러 속성의 정밀 비교에는 Metric Card 대신 Table 또는 Chart를 사용하세요.

## 사용 판단

### 사용

- MetricCard — 하나의 KPI와 기간·비교 기준·freshness·다음 액션을 같은 정보 단위로 보여주는 타일. Classification: LDS Product Data Extension.

### 사용하지 않음

- 표면과 경계선은 현재 light/dark semantic theme에서 직접 해석되어야 하며, 다크 scope 안에 라이트 카드 배경을 고정하지 않습니다.
- raw arrow SVG를 새로 유지하지 않고 LDS Icon registry의 arrow-up/down을 사용합니다.
- PatternFly dashboard guidelines는 카드마다 하나 또는 밀접한 지표를 담고, trend card에 current value, time range, sparkline, optional footer action을 두도록 안내합니다. MetricCard는 그 reusable anatomy만 소유하고 dashboard grid나 query state는 소유하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| changeToneLabel | 명시적 changeTone 옆의 비색상 의미 라벨. 기본값은 개선/악화/주의/중립. |
| action | 카드 하단의 링크형 액션 또는 상태 복구 액션. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `label` | `React.ReactNode` | No | 대문자 라벨. |
| `value` | `React.ReactNode` | No | 큰 값. |
| `unit` | `React.ReactNode` | No | 값 뒤의 단위. |
| `delta` | `number \| React.ReactNode` | No | 증감: 숫자 → 자동 상/하 화살표와 함께 "+N%", 또는 노드. |
| `deltaTone` | `'auto' \| 'up' \| 'down' \| 'flat'` | No | 기존 방향+색상 결합 API. 새 코드에서는 changeDirection/changeTone을 분리하세요. @default "auto" |
| `changeDirection` | `'auto' \| 'up' \| 'down' \| 'flat'` | No | 수치 변화 방향. auto에서 숫자 0은 flat으로 처리합니다. @default "auto" |
| `changeTone` | `'positive' \| 'negative' \| 'cautionary' \| 'neutral'` | No | 변화가 지표 관점에서 좋은지, 나쁜지, 주의인지 나타내는 의미 tone. |
| `changeToneLabel` | `React.ReactNode` | No | 명시적 changeTone 옆의 비색상 의미 라벨. 기본값은 개선/악화/주의/중립. |
| `period` | `React.ReactNode` | No | 측정 기간 또는 시간 범위. |
| `baseline` | `React.ReactNode` | No | 비교 기준. |
| `caption` | `React.ReactNode` | No |  |
| `lastUpdated` | `React.ReactNode` | No | 데이터 갱신 시각 또는 freshness 문구. |
| `action` | `React.ReactNode` | No | 카드 하단의 링크형 액션 또는 상태 복구 액션. |
| `icon` | `React.ReactNode` | No |  |
| `loading` | `boolean` | No |  |
| `loadingLabel` | `React.ReactNode` | No |  |
| `empty` | `boolean` | No |  |
| `emptyLabel` | `React.ReactNode` | No |  |
| `error` | `React.ReactNode` | No |  |
| `stale` | `boolean` | No |  |
| `staleLabel` | `React.ReactNode` | No |  |

## States

| State | Contract |
| --- | --- |
| deltaTone | 기존 방향+색상 결합 API. 새 코드에서는 changeDirection/changeTone을 분리하세요. @default "auto" |
| changeTone | 변화가 지표 관점에서 좋은지, 나쁜지, 주의인지 나타내는 의미 tone. |
| changeToneLabel | 명시적 changeTone 옆의 비색상 의미 라벨. 기본값은 개선/악화/주의/중립. |

## Behavior and interaction

- 기존 deltaTone="auto|up|down|flat"은 그대로 동작합니다. 새 changeDirection/changeTone이 있으면 분리 API가 우선합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | delta / changeDirection / changeTone / changeToneLabel — 수치 변화, 물리적 방향, 업무상 좋음·나쁨·주의·중립, 비색상 의미 라벨을 분리합니다. 예: latency down + positive = -12.4% · 개선. |
| 명시 규칙 2 | 숫자 delta={0}은 자동 모드에서 flat + neutral이며 화살표를 표시하지 않습니다. 0에도 별도 의미가 필요하면 changeDirection과 changeTone을 명시합니다. |
| 명시 규칙 3 | Card의 component surface, border, radius, shadow와 22–24px content rhythm을 유지합니다. MetricCard 안에 Card/EmptyState를 중첩하지 않습니다. |
| 명시 규칙 4 | Footer action은 페이지의 기본 본문 크기를 상속하지 않고 label2(13/18)로 고정합니다. 갱신 시각보다 약간만 강조해 보조 탐색으로 읽히고, action 유무가 같은 행의 카드 높이와 하단 여백을 크게 바꾸지 않게 합니다. |
| --body2-line | 22px |

## Responsive

- Carbon Tile은 표준 카드 행의 크기를 일관되게 유지하고 내부 link를 하단 CTA로 배치합니다. LDS는 freshness가 먼저 읽히는 기존 DOM 순서를 유지하기 위해 link를 logical end에 두되, action 높이가 카드 행 높이를 왜곡하지 않도록 제한합니다.
- Reading order and responsive hierarchy.
- DOM과 시각 순서는 동일합니다. 긴 label·caption·metadata는 좁은 폭에서 감싸며 value는 tabular numerals와 --title1-size를 유지합니다.

## Content and writing

- label / value / unit / caption / icon — metric identity, current value, unit, supporting copy, leading context입니다.
- period / baseline / lastUpdated / action — 측정 범위, 비교 기준, freshness, 하단 링크/복구 액션입니다. Action은 host가 Link, TextButton, Button으로 제공합니다.
- loading / loadingLabel / empty / emptyLabel / error / stale / staleLabel — resource와 freshness 상태입니다. 우선순위는 loading → error → empty → stale/ready입니다.
- loading은 LDS Skeleton, stale은 StatusBadge를 재사용합니다. error/empty는 카드 내부의 짧은 live/status copy로 유지하고 EmptyState 또는 다른 Card를 중첩하지 않습니다.

## Accessibility

- PatternFly card accessibility는 카드 집합의 식별 가능한 이름과 제목 연결을 요구합니다. MetricCard는 visible label로 기본 role="group" 이름을 만들고 명시적 aria-label/aria-labelledby도 허용합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `Icon` | 대표 시나리오에서 조합 |
| `Link` | 대표 시나리오에서 조합 |
| `ChecklistItem` | 대표 시나리오에서 조합 |
| `FeatureCard` | 대표 시나리오에서 조합 |
| `FeedCard` | 대표 시나리오에서 조합 |
| `ListingCard` | 대표 시나리오에서 조합 |
| `NewsCard` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<MetricCard
  label="평균 응답 시간"
  value="41"
  unit="ms"
  delta={-12.4}
  changeDirection="down"
  changeTone="positive"
  period="최근 1시간"
  baseline="지난 7일 평균"
  lastUpdated="2분 전"
  action={<Link href="/latency">상세 보기</Link>}
/>
```

## Tokens and API

### Tokens

- `--body2-line`
- `--body2-size`
- `--caption1-line`
- `--caption1-size`
- `--color-semantic-label-alternative`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-line-normal-alternative`
- `--color-semantic-primary-normal`
- `--color-semantic-status-cautionary-text`
- `--color-semantic-status-negative-text`
- `--color-semantic-status-positive-text`
- `--component-card-bg`
- `--component-card-border`
- `--component-card-radius`
- `--font-sans`
- `--fw-bold`
- `--fw-extra`
- `--fw-medium`
- `--fw-semibold`
- `--label1-line`
- `--label1-size`
- `--label2-line`
- `--label2-size`
- `--ls-overline`
- `--shadow-xs`
- `--space-1`
- `--space-2`
- `--space-3`
- `--title1-size`

### Source contracts

- `components/cards/MetricCard.jsx`
- `components/cards/MetricCard.d.ts`
- `components/cards/MetricCard.prompt.md`
- `stories/DataAndStatus.stories.jsx`

## Migration

- 기존 uppercase caption label, title1 value, legacy delta color는 호환합니다. 새 footer divider는 freshness/action을 본문 변화값과 분리하기 위해서만 추가했습니다.

## Sources

- MetricCard prompt contract: `components/cards/MetricCard.prompt.md`
- Storybook implementation evidence: `stories/DataAndStatus.stories.jsx`
- [PatternFly dashboard guidelines](https://www.patternfly.org/patterns/dashboard/design-guidelines/)
- [PatternFly card accessibility](https://www.patternfly.org/components/card/accessibility/)
- [Carbon chart anatomy](https://v10.carbondesignsystem.com/data-visualization/chart-anatomy/)
- [Fluent 2 Card](https://fluent2.microsoft.design/components/web/react/core/card/usage)
- [Carbon Tile](https://carbondesignsystem.com/components/tile/usage/)
