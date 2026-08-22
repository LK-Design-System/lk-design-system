# Resource State

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Display |
| Owner | `ResourceState` |
| Storybook | `LDS Product/Data/Display/Resource State` |
| Source | `../component-content.json#product-data-display-resource-state` |

로딩·오류·지연 중에도 마지막 정상 데이터를 유지하며 현재 신뢰도를 알려야 할 때 적합합니다. 단일 필드 검증이나 짧은 작업 결과에는 Resource State 대신 Form 메시지 또는 Toast를 사용하세요.

## 사용 판단

### 사용

- 경고·오류를 직접 복구하는 유일한 action(새로고침, 다시 시도)은 tinted status surface에서도 버튼 경계와 채움이 식별되는 Button variant="secondary"를 기본 조합으로 사용합니다. 부가 정보를 여는 낮은 우선순위 action에만 ghost를 사용합니다.
- stale/error 상황에서 마지막 정상 데이터를 지우지 않는 점과 freshness를 명시하는 점은 일반 대시보드 복구성 기대를 반영합니다.

### 사용하지 않음

- 조건식 결과가 false, null, undefined인 children은 마지막 정상 콘텐츠로 간주하지 않습니다.
- empty, restricted: 자식 대신 EmptyState를 표시합니다.
- Primer는 단일 Banner action에 primary 또는 secondary 강조를 사용하도록 하고, Fluent는 warning/error MessageBar의 action이 문제를 해결하는 명확한 다음 행동이어야 한다고 안내합니다. LDS에서는 카드 안의 유일한 복구 action을 secondary로 표현해 페이지 primary CTA와 경쟁하지 않으면서도 버튼임을 분명히 합니다.
- retry 버튼, 데이터 fetcher, polling, offline 감지기는 의도적으로 포함하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| title | 상태의 기본 제목을 대체합니다. |
| description | 상태의 기본 설명을 대체합니다. |
| action | 재시도, 필터 초기화, 권한 요청처럼 제품이 실행을 소유하는 액션입니다. |
| lastUpdatedLabel | 마지막 업데이트 접두 레이블. @default "마지막 업데이트" |
| loadingContent | 기본 Skeleton 구성을 대체하는 로딩 콘텐츠입니다. |
| children | ready 상태의 콘텐츠 또는 refreshing/error/stale/offline에서 유지할 마지막 정상 콘텐츠입니다. 콘텐츠를 유지하면 오류·오프라인도 polite 상태로 알립니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `state` | `ResourceStateValue` | No | 표시할 리소스 상태. @default "ready" |
| `title` | `React.ReactNode` | No | 상태의 기본 제목을 대체합니다. |
| `description` | `React.ReactNode` | No | 상태의 기본 설명을 대체합니다. |
| `action` | `React.ReactNode` | No | 재시도, 필터 초기화, 권한 요청처럼 제품이 실행을 소유하는 액션입니다. |
| `lastUpdated` | `React.ReactNode` | No | 마지막으로 정상 데이터를 확인한 시각이나 설명입니다. |
| `lastUpdatedLabel` | `React.ReactNode` | No | 마지막 업데이트 접두 레이블. @default "마지막 업데이트" |
| `loadingContent` | `React.ReactNode` | No | 기본 Skeleton 구성을 대체하는 로딩 콘텐츠입니다. |
| `messageVariant` | `'standalone' \| 'embedded'` | No | 상태 메시지 표면 모양. 부모 표면과 결합할 때만 "embedded"를 명시합니다. @default "standalone" |
| `headingLevel` | `number` | No | 차단 상태 제목의 heading 단계. 감싸는 표면의 제목보다 한 단계 아래를 전달합니다. @default 3 |
| `children` | `React.ReactNode` | No | ready 상태의 콘텐츠 또는 refreshing/error/stale/offline에서 유지할 마지막 정상 콘텐츠입니다. 콘텐츠를 유지하면 오류·오프라인도 polite 상태로 알립니다. |

## States

| State | Contract |
| --- | --- |
| state | 표시할 리소스 상태. @default "ready" |
| loadingContent | 기본 Skeleton 구성을 대체하는 로딩 콘텐츠입니다. |
| messageVariant | 상태 메시지 표면 모양. 부모 표면과 결합할 때만 "embedded"를 명시합니다. @default "standalone" |

## Behavior and interaction

- 아이콘은 상태 토큰에 맞는 registry icon을 항상 포함합니다.
- Carbon의 작은 tile empty state는 좌측 정렬을 권장하지만, LDS의 기존 EmptyState와의 시각적 일관성을 위해 차단 상태는 중앙 정렬을 유지합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 차단 상태(EmptyState) 제목의 heading 레벨은 headingLevel(기본 3)로 지정합니다. 감싸는 표면이 자신의 제목 레벨에 맞춰 내려주면 문서 위계(WCAG 1.3.1)가 유지됩니다. ChartFrame은 자기 제목 레벨 +1을 전달합니다. |
| 명시 규칙 2 | 구현 전에 내부의 Banner(embedded/standalone seam), EmptyState(중앙 정렬 차단 상태), Skeleton(점진 로딩)을 비교했습니다. 외부 기준은 WCAG 2.2 Status Messages, WAI-ARIA Alert pattern, Primer Banner, Fluent MessageBar, Carbon contextual empty state, PatternFly Skeleton, PatternFly stale data warning입니다. |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |

## Content and writing

- refreshing: 이미 표시한 콘텐츠가 있으면 그대로 유지하며 상태 메시지를 먼저 표시합니다. 콘텐츠가 없으면 loading처럼 동작합니다.
- stale, offline, error: 마지막 정상 콘텐츠가 있으면 상태 메시지 → 기존 콘텐츠 → 마지막 업데이트 시각 순서를 유지합니다. 콘텐츠가 없으면 EmptyState로 차단 상태를 표현합니다.
- live-region 긴급도는 상태 이름만이 아니라 콘텐츠 가용성으로 결정합니다. 마지막 정상 콘텐츠를 유지하는 error·offline은 작업을 중단하지 않으므로 status/polite이고, 콘텐츠가 없어 EmptyState로 차단되는 error·offline만 alert/assertive입니다. loading·empty·restricted 같은 예상 가능한 차단 상태와 모든 비차단 상태는 status/polite를 사용합니다.
- circle-block은 접근 차단·사용 불가에만 사용합니다. 오프라인은 Viewer와 같은 signal 글리프를 사용하고, 복구 문구는 원인 뒤에 -해 주세요. 형태의 다음 행동을 제공합니다.

## Accessibility

- loading: 콘텐츠를 Skeleton으로 대체하고 aria-busy와 polite 상태 알림을 제공합니다.
- polite 대역의 공지는 상시 마운트된 숨김 status region이 담당합니다. 상태 분기 요소는 메시지와 함께 삽입되므로 role="status"로는 신뢰성 있게 낭독되지 않고, role="alert"만 삽입 시 낭독이 명세로 보장됩니다. 그래서 assertive 차단 상태(콘텐츠 없는 error·offline)는 분기 요소가 alert로 직접 공지하고 숨김 region은 침묵하며(이중 낭독 방지), 그 외 모든 비-ready 상태는 숨김 region이 제목·설명을 공지합니다.
- 네트워크 요청, retry 실행, 캐시 및 freshness 계산, 권한 판정은 제품 코드가 소유합니다. 이 컴포넌트는 controlled 시각·접근성 계약만 소유합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `StatusBadge` | 대표 시나리오에서 조합 |
| `AnnotatedImage` | 대표 시나리오에서 조합 |
| `BarChart` | 대표 시나리오에서 조합 |
| `Carousel` | 대표 시나리오에서 조합 |
| `ChartFrame` | 대표 시나리오에서 조합 |
| `DataCollectionPanel` | 대표 시나리오에서 조합 |
| `DataExportAction` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<ResourceState
  state="stale"
  lastUpdated="오늘 14:32"
  action={<Button size="sm">새로고침</Button>}
>
  <MetricSummary />
</ResourceState>
```

## Tokens and API

### Tokens

- `--caption1-line`
- `--caption1-size`
- `--color-semantic-label-alternative`
- `--color-semantic-line-normal-normal`
- `--font-sans`
- `--space-2`
- `--space-3`
- `--space-4`
- `--space-5`
- `--space-6`

### Source contracts

- `components/data/ResourceState.jsx`
- `components/data/ResourceState.d.ts`
- `components/data/ResourceState.prompt.md`
- `stories/DataResourceState.stories.jsx`

## Sources

- ResourceState prompt contract: `components/data/ResourceState.prompt.md`
- Storybook implementation evidence: `stories/DataResourceState.stories.jsx`
- [WCAG 2.2 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)
- [WAI-ARIA Alert pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)
- [Primer Banner](https://primer.style/product/components/banner/guidelines/)
- [Fluent MessageBar](https://fluent2.microsoft.design/components/web/react/core/messagebar/usage)
- [Carbon contextual empty state](https://carbondesignsystem.com/patterns/empty-states-pattern/)
- [PatternFly Skeleton](https://www.patternfly.org/components/skeleton/design-guidelines/)
- [PatternFly stale data warning](https://www.patternfly.org/component-groups/status-and-state-indicators/stale-data-warning/)
