# ChartFrame

대시보드 차트의 제목, 맥락, action, 차트, 범례, loading/empty/error/stale/freshness를 한 표면에 묶는 **LK Product Extension**입니다. 개별 `BarChart`, `DonutChart`, `LineChart`, `Sparkline`의 accessible name과 텍스트 요약을 대신하지 않습니다.

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

- 읽기 순서는 **title/description/meta → actions → resource message → chart → legend → freshness**입니다.
- `ResourceState`를 embedded로 조합해 initial loading은 Skeleton으로 대체하고, refreshing/stale/error는 마지막 정상 chart와 legend를 유지합니다.
- 한 개의 card surface만 만듭니다. 차트나 상태 안에 추가 card를 넣지 않습니다.
- frame region은 title과 description에 연결됩니다. 차트는 별도의 `aria-label`, description, deterministic summary를 계속 제공해야 합니다.
- fetch, threshold, tooltip data, drill-down route는 제품과 chart component가 소유합니다.
- action과 legend는 좁은 폭에서 DOM 순서를 유지하며 줄바꿈됩니다.

## 비교와 결정 근거

내부 `Card`, `ResourceState`, `Legend`, `DataToolbar`와 각 chart의 접근성 계약을 비교했습니다. [Carbon chart anatomy](https://carbondesignsystem.com/data-visualization/chart-anatomy/)는 title, legend, labels, axes와 source/context의 일관된 anatomy를, [PatternFly dashboard](https://www.patternfly.org/patterns/dashboard/design-guidelines/)는 카드 기반 지표의 scan hierarchy와 responsive grid를, [Carbon accessibility](https://carbondesignsystem.com/guidelines/accessibility/developers/)는 시각화에 비시각적 대안을 제공할 것을 요구합니다.

범용 tooltip/crosshair/zoom engine은 의도적으로 포함하지 않습니다. 이 frame은 chart renderer가 아니라 상태와 주변 anatomy의 재사용 계약입니다.
