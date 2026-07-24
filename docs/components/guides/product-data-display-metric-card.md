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

- 대시보드에서 소수의 KPI와 기준 기간·변화·갱신 시점을 빠르게 비교할 때 적합합니다. 상세 행 데이터나 여러 속성의 정밀 비교에는 Metric Card 대신 Table 또는 Chart를 사용하세요.
- period / baseline / lastUpdated / action — 측정 범위, 비교 기준, freshness, 하단 링크/복구 액션입니다. Action은 host가 Link, TextButton, Button으로 제공합니다.
- 기존 uppercase caption label, title1 value, legacy delta color는 호환합니다. 새 footer divider는 freshness/action을 본문 변화값과 분리하기 위해서만 추가했습니다.
- MetricCard — 하나의 KPI와 기간·비교 기준·freshness·다음 액션을 같은 정보 단위로 보여주는 타일. Classification: LDS Product Data Extension.

### 사용하지 않음

- 숫자 delta={0}은 자동 모드에서 flat + neutral이며 화살표를 표시하지 않습니다. 0에도 별도 의미가 필요하면 changeDirection과 changeTone을 명시합니다.
- loading은 LDS Skeleton, stale은 StatusBadge를 재사용합니다. error/empty는 카드 내부의 짧은 live/status copy로 유지하고 EmptyState 또는 다른 Card를 중첩하지 않습니다.
- Card의 component surface, border, radius, shadow와 22–24px content rhythm을 유지합니다. MetricCard 안에 Card/EmptyState를 중첩하지 않습니다.
- 표면과 경계선은 현재 light/dark semantic theme에서 직접 해석되어야 하며, 다크 scope 안에 라이트 카드 배경을 고정하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | MetricCard의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Label | label 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Change Tone Label | 명시적 changeTone 옆의 비색상 의미 라벨. 기본값은 개선/악화/주의/중립. |
| Caption | caption 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Action | 카드 하단의 링크형 액션 또는 상태 복구 액션. |
| Icon | icon 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Loading Label | loadingLabel 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Empty Label | emptyLabel 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

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
| `caption` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `lastUpdated` | `React.ReactNode` | No | 데이터 갱신 시각 또는 freshness 문구. |
| `action` | `React.ReactNode` | No | 카드 하단의 링크형 액션 또는 상태 복구 액션. |
| `icon` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `loading` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `loadingLabel` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `empty` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `emptyLabel` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `error` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `stale` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `staleLabel` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| deltaTone | 기존 방향+색상 결합 API. 새 코드에서는 changeDirection/changeTone을 분리하세요. @default "auto" 타입 계약: 'auto' \| 'up' \| 'down' \| 'flat' |
| changeTone | 변화가 지표 관점에서 좋은지, 나쁜지, 주의인지 나타내는 의미 tone. 타입 계약: 'positive' \| 'negative' \| 'cautionary' \| 'neutral' |
| changeToneLabel | 명시적 changeTone 옆의 비색상 의미 라벨. 기본값은 개선/악화/주의/중립. 타입 계약: React.ReactNode |
| loading | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| loadingLabel | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.ReactNode |
| empty | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| emptyLabel | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.ReactNode |
| error | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.ReactNode |
| stale | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| staleLabel | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.ReactNode |
| 변형·상태 · 갱신 시점과 오래된 데이터 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 반응형 · 좁은 폭과 변화 의미 반전 | responsive 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- 기존 deltaTone="auto|up|down|flat"은 그대로 동작합니다. 새 changeDirection/changeTone이 있으면 분리 API가 우선합니다.
- loading / loadingLabel / empty / emptyLabel / error / stale / staleLabel — resource와 freshness 상태입니다. 우선순위는 loading → error → empty → stale/ready입니다.
- Stat의 큰 tabular numeral과 label 대비를 따르되 dashboard metric에 필요한 unit, comparison, freshness, action만 추가합니다.
- - label / value / unit / caption / icon — metric identity, current value, unit, supporting copy, leading context입니다. - delta / changeDirection / changeTone / changeToneLabel — 수치 변화, 물리적 방향, 업무상 좋음·나쁨·주의·중립, 비색상 의미 라벨을 분리합니다. 예: latency down + positive = -12.4% · 개선. - 기존 deltaTone="auto|up|down|flat"은 그대로 동작합니다. 새 ch….
- DOM과 시각 순서는 동일합니다. 긴 label·caption·metadata는 좁은 폭에서 감싸며 value는 tabular numerals와 --title1-size를 유지합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | delta / changeDirection / changeTone / changeToneLabel — 수치 변화, 물리적 방향, 업무상 좋음·나쁨·주의·중립, 비색상 의미 라벨을 분리합니다. 예: latency down + positive = -12.4% · 개선. |
| 명시 규칙 2 | 숫자 delta={0}은 자동 모드에서 flat + neutral이며 화살표를 표시하지 않습니다. 0에도 별도 의미가 필요하면 changeDirection과 changeTone을 명시합니다. |
| 명시 규칙 3 | Card의 component surface, border, radius, shadow와 22–24px content rhythm을 유지합니다. MetricCard 안에 Card/EmptyState를 중첩하지 않습니다. |
| 명시 규칙 4 | - label / value / unit / caption / icon — metric identity, current value, unit, supporting copy, leading context입니다. - delta / changeDirection / changeTone / changeToneLabel — 수치 변화, 물리적 방향, 업무상 좋음·나쁨·주의·중립, 비색상 의미 라벨을 분리합니다. 예: latency down + positive = -12.4% · 개선. - 기존 deltaTone="auto\|up\|down\|flat"은 그대로 동작합니다. 새 ch… |
| --body2-line | 22px |

## Responsive

- Reading order and responsive hierarchy.
- DOM과 시각 순서는 동일합니다. 긴 label·caption·metadata는 좁은 폭에서 감싸며 value는 tabular numerals와 --title1-size를 유지합니다.
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- label / value / unit / caption / icon — metric identity, current value, unit, supporting copy, leading context입니다.
- delta / changeDirection / changeTone / changeToneLabel — 수치 변화, 물리적 방향, 업무상 좋음·나쁨·주의·중립, 비색상 의미 라벨을 분리합니다. 예: latency down + positive = -12.4% · 개선.
- period / baseline / lastUpdated / action — 측정 범위, 비교 기준, freshness, 하단 링크/복구 액션입니다. Action은 host가 Link, TextButton, Button으로 제공합니다.
- loading / loadingLabel / empty / emptyLabel / error / stale / staleLabel — resource와 freshness 상태입니다. 우선순위는 loading → error → empty → stale/ready입니다.

## Accessibility

- PatternFly card accessibility는 카드 집합의 식별 가능한 이름과 제목 연결을 요구합니다. MetricCard는 visible label로 기본 role="group" 이름을 만들고 명시적 aria-label/aria-labelledby도 허용합니다.
- - PatternFly dashboard guidelines는 카드마다 하나 또는 밀접한 지표를 담고, trend card에 current value, time range, sparkline, optional footer action을 두도록 안내합니다. MetricCard는 그 reusable anatomy만 소유하고 dashboard grid나 query state는 소유하지 않습니다. - PatternFly card accessibility는 카드 집합의 식별 가능한 이름과 제목 연결을 요구합니다. MetricCard는 visible label로 기본 role….
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.
- 색상, 모양 또는 아이콘 하나만으로 상태를 구분하지 않고 이름·텍스트·semantic state를 함께 제공합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | period / baseline / lastUpdated / action — 측정 범위, 비교 기준, freshness, 하단 링크/복구 액션입니다. Action은 host가 Link, TextButton, Button으로 제공합니다. |
| Don't | 숫자 delta={0}은 자동 모드에서 flat + neutral이며 화살표를 표시하지 않습니다. 0에도 별도 의미가 필요하면 changeDirection과 changeTone을 명시합니다. |
| Do | 기존 uppercase caption label, title1 value, legacy delta color는 호환합니다. 새 footer divider는 freshness/action을 본문 변화값과 분리하기 위해서만 추가했습니다. |
| Don't | loading은 LDS Skeleton, stale은 StatusBadge를 재사용합니다. error/empty는 카드 내부의 짧은 live/status copy로 유지하고 EmptyState 또는 다른 Card를 중첩하지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 MetricCard의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Icon` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Link` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ChecklistItem` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FeatureCard` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FeedCard` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ListingCard` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `NewsCard` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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
- - Card의 component surface, border, radius, shadow와 22–24px content rhythm을 유지합니다. MetricCard 안에 Card/EmptyState를 중첩하지 않습니다. - 표면과 경계선은 현재 light/dark semantic theme에서 직접 해석되어야 하며, 다크 scope 안에 라이트 카드 배경을 고정하지 않습니다. - Stat의 큰 tabular numeral과 label 대비를 따르되 dashboard metric에 필요한 unit, comparison, freshness, action만 추가합니다.….
- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- MetricCard prompt contract: `components/cards/MetricCard.prompt.md`
- Storybook implementation evidence: `stories/DataAndStatus.stories.jsx`
- [PatternFly dashboard guidelines](https://www.patternfly.org/patterns/dashboard/design-guidelines/)
- [PatternFly card accessibility](https://www.patternfly.org/components/card/accessibility/)
- [Carbon chart anatomy](https://v10.carbondesignsystem.com/data-visualization/chart-anatomy/)
