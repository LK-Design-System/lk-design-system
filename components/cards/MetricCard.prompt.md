**MetricCard** — 하나의 KPI와 기간·비교 기준·freshness·다음 액션을 같은 정보 단위로 보여주는 타일. Classification: **LDS Product Data Extension**.

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

- **label / value / unit / caption / icon** — metric identity, current value, unit, supporting copy, leading context입니다.
- **delta / changeDirection / changeTone / changeToneLabel** — 수치 변화, 물리적 방향, 업무상 좋음·나쁨·주의·중립, 비색상 의미 라벨을 분리합니다. 예: latency `down + positive = -12.4% · 개선`.
- 기존 **deltaTone="auto|up|down|flat"**은 그대로 동작합니다. 새 `changeDirection`/`changeTone`이 있으면 분리 API가 우선합니다.
- 숫자 `delta={0}`은 자동 모드에서 `flat + neutral`이며 화살표를 표시하지 않습니다. 0에도 별도 의미가 필요하면 `changeDirection`과 `changeTone`을 명시합니다.
- **period / baseline / lastUpdated / action** — 측정 범위, 비교 기준, freshness, 하단 링크/복구 액션입니다. Action은 host가 `Link`, `TextButton`, `Button`으로 제공합니다.
- **loading / loadingLabel / empty / emptyLabel / error / stale / staleLabel** — resource와 freshness 상태입니다. 우선순위는 loading → error → empty → stale/ready입니다.
- loading은 LDS `Skeleton`, stale은 `StatusBadge`를 재사용합니다. error/empty는 카드 내부의 짧은 live/status copy로 유지하고 `EmptyState` 또는 다른 `Card`를 중첩하지 않습니다.

## Reading order and responsive hierarchy

1. label과 optional icon
2. current value와 unit
3. change, period, baseline
4. caption
5. stale/last updated와 footer action

DOM과 시각 순서는 동일합니다. 긴 label·caption·metadata는 좁은 폭에서 감싸며 value는 tabular numerals와 `--title1-size`를 유지합니다.

## Internal LDS comparison and retained deltas

- `Card`의 component surface, border, radius, shadow와 22–24px content rhythm을 유지합니다. MetricCard 안에 Card/EmptyState를 중첩하지 않습니다.
- 표면과 경계선은 현재 light/dark semantic theme에서 직접 해석되어야 하며, 다크 scope 안에 라이트 카드 배경을 고정하지 않습니다.
- `Stat`의 큰 tabular numeral과 label 대비를 따르되 dashboard metric에 필요한 unit, comparison, freshness, action만 추가합니다.
- `StatusBadge`의 non-color stale label과 `Skeleton`의 reduced-motion loading을 그대로 조합합니다.
- 기존 uppercase caption label, title1 value, legacy delta color는 호환합니다. 새 footer divider는 freshness/action을 본문 변화값과 분리하기 위해서만 추가했습니다.
- raw arrow SVG를 새로 유지하지 않고 LDS `Icon` registry의 arrow-up/down을 사용합니다.

## External references and design conclusions

- [PatternFly dashboard guidelines](https://www.patternfly.org/patterns/dashboard/design-guidelines/)는 카드마다 하나 또는 밀접한 지표를 담고, trend card에 current value, time range, sparkline, optional footer action을 두도록 안내합니다. MetricCard는 그 reusable anatomy만 소유하고 dashboard grid나 query state는 소유하지 않습니다.
- [PatternFly card accessibility](https://www.patternfly.org/components/card/accessibility/)는 카드 집합의 식별 가능한 이름과 제목 연결을 요구합니다. MetricCard는 visible label로 기본 `role="group"` 이름을 만들고 명시적 `aria-label`/`aria-labelledby`도 허용합니다.
- [Carbon chart anatomy](https://v10.carbondesignsystem.com/data-visualization/chart-anatomy/)는 KPI를 number와 짧은 description으로 설명하고 donut big number와 독립 dashboard value 모두를 구분합니다. current value는 MetricCard, proportion은 DonutChart가 담당합니다.

필수 범위는 metric identity, direction와 semantic verdict 분리, period/baseline/freshness/action, loading/empty/error/stale입니다. 계산식, threshold 정책, 데이터 fetch, query/time-range control, drill-down route, sparkline 데이터는 제품이 소유합니다.
