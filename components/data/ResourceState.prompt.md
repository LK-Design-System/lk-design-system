# ResourceState

`ResourceState`는 대시보드 위젯, 표, 차트처럼 비동기 리소스를 표시하는 표면에 공통 상태 계약을 부여하는 **LK Product Extension**입니다. WDS 컴포넌트 축을 주장하지 않으며, 새 카드 외형을 만들지 않고 기존 `Banner`, `EmptyState`, `Skeleton`을 조합합니다.

```jsx
<ResourceState
  state="stale"
  lastUpdated="오늘 14:32"
  action={<Button size="sm">새로고침</Button>}
>
  <MetricSummary />
</ResourceState>
```

## 계약

- `ready`: 자식 콘텐츠를 그대로 표시합니다.
- `loading`: 콘텐츠를 Skeleton으로 대체하고 `aria-busy`와 polite 상태 알림을 제공합니다.
- `refreshing`: 이미 표시한 콘텐츠가 있으면 그대로 유지하며 상태 메시지를 먼저 표시합니다. 콘텐츠가 없으면 loading처럼 동작합니다.
- `stale`, `offline`, `error`: 마지막 정상 콘텐츠가 있으면 **상태 메시지 → 기존 콘텐츠 → 마지막 업데이트 시각** 순서를 유지합니다. 콘텐츠가 없으면 `EmptyState`로 차단 상태를 표현합니다.
- `empty`, `restricted`: 자식 대신 `EmptyState`를 표시합니다.
- 오류·오프라인은 `alert`, 나머지 진행·주의 상태는 `status` 의미를 사용합니다. 아이콘은 상태 토큰에 맞는 registry icon을 항상 포함합니다.
- `circle-block`은 접근 차단·사용 불가에만 사용합니다. 오프라인은 Viewer와 같은 signal 글리프를 사용하고, 복구 문구는 원인 뒤에 `-해 주세요.` 형태의 다음 행동을 제공합니다.
- `messageVariant="embedded"`는 부모 surface의 가장자리와 결합하는 Banner를 사용합니다. `standalone`은 독립 콘텐츠 흐름용입니다.
- 네트워크 요청, retry 실행, 캐시 및 freshness 계산, 권한 판정은 제품 코드가 소유합니다. 이 컴포넌트는 controlled 시각·접근성 계약만 소유합니다.

## 비교와 결정 근거

구현 전에 내부의 `Banner`(embedded/standalone seam), `EmptyState`(중앙 정렬 차단 상태), `Skeleton`(점진 로딩)을 비교했습니다. 외부 기준은 [Carbon contextual empty state](https://carbondesignsystem.com/patterns/empty-states-pattern/), [Fluent MessageBar](https://fluent2.microsoft.design/components/web/react/core/messagebar/usage), [PatternFly Skeleton](https://www.patternfly.org/components/skeleton/design-guidelines/), [PatternFly stale data warning](https://www.patternfly.org/component-groups/status-and-state-indicators/stale-data-warning/)입니다.

- Carbon의 작은 tile empty state는 좌측 정렬을 권장하지만, LDS의 기존 `EmptyState`와의 시각적 일관성을 위해 차단 상태는 중앙 정렬을 유지합니다.
- stale/error 상황에서 마지막 정상 데이터를 지우지 않는 점과 freshness를 명시하는 점은 일반 대시보드 복구성 기대를 반영합니다.
- retry 버튼, 데이터 fetcher, polling, offline 감지기는 의도적으로 포함하지 않습니다.
