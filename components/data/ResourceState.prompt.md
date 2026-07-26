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
- 조건식 결과가 `false`, `null`, `undefined`인 children은 마지막 정상 콘텐츠로 간주하지 않습니다.
- `empty`, `restricted`: 자식 대신 `EmptyState`를 표시합니다.
- polite 대역의 공지는 **상시 마운트된 숨김 status region**이 담당합니다. 상태 분기 요소는
  메시지와 함께 삽입되므로 `role="status"`로는 신뢰성 있게 낭독되지 않고, `role="alert"`만
  삽입 시 낭독이 명세로 보장됩니다. 그래서 assertive 차단 상태(콘텐츠 없는 `error`·`offline`)는
  분기 요소가 alert로 직접 공지하고 숨김 region은 침묵하며(이중 낭독 방지), 그 외 모든
  비-ready 상태는 숨김 region이 제목·설명을 공지합니다. 콘텐츠를 보존하는 대역의 Banner는
  대역 안에서 텍스트만 바뀌는 동안 자체 live 시맨틱으로 갱신을 공지합니다.
- live-region 긴급도는 상태 이름만이 아니라 **콘텐츠 가용성**으로 결정합니다. 마지막 정상 콘텐츠를
  유지하는 `error`·`offline`은 작업을 중단하지 않으므로 `status`/polite이고, 콘텐츠가 없어
  `EmptyState`로 차단되는 `error`·`offline`만 `alert`/assertive입니다. `loading`·`empty`·`restricted`
  같은 예상 가능한 차단 상태와 모든 비차단 상태는 `status`/polite를 사용합니다.
- 차단 상태(`EmptyState`) 제목의 heading 레벨은 `headingLevel`(기본 3)로 지정합니다. 감싸는 표면이
  자신의 제목 레벨에 맞춰 내려주면 문서 위계(WCAG 1.3.1)가 유지됩니다. `ChartFrame`은 자기 제목
  레벨 +1을 전달합니다.
- 아이콘은 상태 토큰에 맞는 registry icon을 항상 포함합니다.
- `circle-block`은 접근 차단·사용 불가에만 사용합니다. 오프라인은 Viewer와 같은 signal 글리프를 사용하고, 복구 문구는 원인 뒤에 `-해 주세요.` 형태의 다음 행동을 제공합니다.
- 기본 `messageVariant="standalone"`은 독립 콘텐츠 흐름에서 자체 테두리와 radius를 갖는 Banner를 사용합니다. 부모 카드·패널의 가장자리와 실제로 결합할 때만 `messageVariant="embedded"`를 명시합니다. `ChartFrame`처럼 결합 경계를 소유하는 합성 컴포넌트도 이 값을 명시적으로 전달해야 합니다.
- 경고·오류를 직접 복구하는 유일한 action(`새로고침`, `다시 시도`)은 tinted status surface에서도 버튼 경계와 채움이 식별되는 `Button variant="secondary"`를 기본 조합으로 사용합니다. 부가 정보를 여는 낮은 우선순위 action에만 `ghost`를 사용합니다.
- 네트워크 요청, retry 실행, 캐시 및 freshness 계산, 권한 판정은 제품 코드가 소유합니다. 이 컴포넌트는 controlled 시각·접근성 계약만 소유합니다.

## 비교와 결정 근거

구현 전에 내부의 `Banner`(embedded/standalone seam), `EmptyState`(중앙 정렬 차단 상태), `Skeleton`(점진 로딩)을 비교했습니다. 외부 기준은 [WCAG 2.2 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html), [WAI-ARIA Alert pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/), [Primer Banner](https://primer.style/product/components/banner/guidelines/), [Fluent MessageBar](https://fluent2.microsoft.design/components/web/react/core/messagebar/usage), [Carbon contextual empty state](https://carbondesignsystem.com/patterns/empty-states-pattern/), [PatternFly Skeleton](https://www.patternfly.org/components/skeleton/design-guidelines/), [PatternFly stale data warning](https://www.patternfly.org/component-groups/status-and-state-indicators/stale-data-warning/)입니다.

- Primer는 flush Banner를 카드·다이얼로그·테이블처럼 경계가 분명한 confined surface 안으로 제한하고, Fluent는 container-level MessageBar를 해당 컨테이너의 제목 바로 아래에 배치합니다. 따라서 독립 배치를 안전한 기본값으로 두고, 부모 외곽선이 존재하는 합성에서만 `embedded`를 명시합니다.
- Primer는 단일 Banner action에 primary 또는 secondary 강조를 사용하도록 하고, Fluent는 warning/error MessageBar의 action이 문제를 해결하는 명확한 다음 행동이어야 한다고 안내합니다. LDS에서는 카드 안의 유일한 복구 action을 `secondary`로 표현해 페이지 primary CTA와 경쟁하지 않으면서도 버튼임을 분명히 합니다.
- Carbon의 작은 tile empty state는 좌측 정렬을 권장하지만, LDS의 기존 `EmptyState`와의 시각적 일관성을 위해 차단 상태는 중앙 정렬을 유지합니다.
- stale/error 상황에서 마지막 정상 데이터를 지우지 않는 점과 freshness를 명시하는 점은 일반 대시보드 복구성 기대를 반영합니다.
- WAI의 `alert`는 현재 작업을 즉시 방해할 만큼 중요한 동적 메시지에 한정합니다. 기존 콘텐츠를 계속
  읽고 조작할 수 있는 연결 저하는 `status`로 두어 반복적인 네트워크 변화가 현재 음성을 끊지 않게 합니다.
- retry 버튼, 데이터 fetcher, polling, offline 감지기는 의도적으로 포함하지 않습니다.
