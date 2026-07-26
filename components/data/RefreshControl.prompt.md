# RefreshControl

수동 새로고침, 마지막 업데이트 시각, 선택적 자동 새로고침 간격을 한 group으로 정렬하는 **LK Product Extension**입니다. polling timer, fetch, cache invalidation, timestamp 계산은 제품이 소유합니다.

```jsx
<RefreshControl
  refreshing={query.isFetching}
  onRefresh={query.refetch}
  lastUpdated="오늘 14:32"
  autoRefreshValue={interval}
  autoRefreshOptions={intervalOptions}
  onAutoRefreshChange={setInterval}
/>
```

- 정렬 순서는 **freshness 텍스트 → 자동 간격 select → 새로고침 icon action**입니다. 대시보드 카드 코너에 놓였을 때 수동 정보가 아니라 action이 최외곽(코너 쪽)에 오는 업계 관행(AWS 콘솔·Grafana)을 따릅니다.
- 새로고침은 icon-only `Button`이며 `refreshLabel`이 접근 가능한 이름과 tooltip을 제공합니다. 텍스트 라벨 버튼은 empty/error 상태의 복구 CTA에서만 사용합니다.
- `refreshing`은 중복 실행을 막고 loading label을 제공합니다. `onRefresh`가 없으면 no-op action을 남기지 않고 수동 control을 비활성화합니다.
- `lastUpdated`는 마지막 정상 데이터 시각입니다. stale 판단은 제품이 수행하고 `ResourceState state="stale"`에 전달합니다.
- 자동 간격은 controlled `Select`일 뿐 timer를 만들지 않습니다. `onAutoRefreshChange`가 없으면 선택 가능한 것처럼 보이는 no-op select 대신 read-only 의미로 비활성화합니다.
- `disabled`에는 `unavailableReason`을 함께 제공해 권한·offline 같은 원인을 보이게 설명할 수 있습니다.
- 툴바 action 슬롯이나 위젯 footer에 들어갈 수 있도록 별도 카드 표면을 만들지 않습니다.
- 내부 ghost refresh action은 active light/dark scope의 semantic foreground를 직접 사용합니다.

## 비교와 결정 근거

내부 `DataToolbar`, `ResourceState`, `Button`, `Select`의 control 높이와 freshness 표현을 재사용했습니다. [PatternFly stale data warning](https://www.patternfly.org/component-groups/status-and-state-indicators/stale-data-warning/)은 stale 상태와 추가 설명을 함께 두는 방식을, [PatternFly Toolbar](https://v5-archive.patternfly.org/components/toolbar/design-guidelines/)는 data action과 responsive wrapping을, [Fluent Button](https://fluent2.microsoft.design/components/web/react/core/button/usage)은 사용할 수 없는 action의 이유를 함께 제공할 것을 권장합니다.

`RefreshControl` 자체는 stale warning을 중복 렌더하지 않습니다. 리소스 상태는 `ResourceState`, 실행 control은 이 컴포넌트로 분리합니다.
