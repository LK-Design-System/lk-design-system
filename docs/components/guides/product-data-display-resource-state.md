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

- 로딩·오류·지연 중에도 마지막 정상 데이터를 유지하며 현재 신뢰도를 알려야 할 때 적합합니다. 단일 필드 검증이나 짧은 작업 결과에는 Resource State 대신 Form 메시지 또는 Toast를 사용하세요.
- loading: 콘텐츠를 Skeleton으로 대체하고 aria-busy와 polite 상태 알림을 제공합니다.
- circle-block은 접근 차단·사용 불가에만 사용합니다. 오프라인은 Viewer와 같은 signal 글리프를 사용하고, 복구 문구는 원인 뒤에 -해 주세요. 형태의 다음 행동을 제공합니다.
- messageVariant="embedded"는 부모 surface의 가장자리와 결합하는 Banner를 사용합니다. standalone은 독립 콘텐츠 흐름용입니다.

### 사용하지 않음

- refreshing: 이미 표시한 콘텐츠가 있으면 그대로 유지하며 상태 메시지를 먼저 표시합니다. 콘텐츠가 없으면 loading처럼 동작합니다.
- stale, offline, error: 마지막 정상 콘텐츠가 있으면 상태 메시지 → 기존 콘텐츠 → 마지막 업데이트 시각 순서를 유지합니다. 콘텐츠가 없으면 EmptyState로 차단 상태를 표현합니다.
- 조건식 결과가 false, null, undefined인 children은 마지막 정상 콘텐츠로 간주하지 않습니다.
- empty, restricted: 자식 대신 EmptyState를 표시합니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | ResourceState의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Title | 상태의 기본 제목을 대체합니다. |
| Description | 상태의 기본 설명을 대체합니다. |
| Action | 재시도, 필터 초기화, 권한 요청처럼 제품이 실행을 소유하는 액션입니다. |
| Last Updated Label | 마지막 업데이트 접두 레이블. @default "마지막 업데이트" |
| Loading Content | 기본 Skeleton 구성을 대체하는 로딩 콘텐츠입니다. |
| Children | ready 상태의 콘텐츠 또는 refreshing/error/stale/offline에서 유지할 마지막 정상 콘텐츠입니다. 콘텐츠를 유지하면 오류·오프라인도 polite 상태로 알립니다. |

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
| `messageVariant` | `'standalone' \| 'embedded'` | No | 부모 표면과 결합되는 상태 메시지 모양. @default "embedded" |
| `headingLevel` | `number` | No | 차단 상태 제목의 heading 단계. 감싸는 표면의 제목보다 한 단계 아래를 전달합니다. @default 3 |
| `children` | `React.ReactNode` | No | ready 상태의 콘텐츠 또는 refreshing/error/stale/offline에서 유지할 마지막 정상 콘텐츠입니다. 콘텐츠를 유지하면 오류·오프라인도 polite 상태로 알립니다. |

## States

| State | Contract |
| --- | --- |
| state | 표시할 리소스 상태. @default "ready" 타입 계약: ResourceStateValue |
| loadingContent | 기본 Skeleton 구성을 대체하는 로딩 콘텐츠입니다. 타입 계약: React.ReactNode |
| messageVariant | 부모 표면과 결합되는 상태 메시지 모양. @default "embedded" 타입 계약: 'standalone' \| 'embedded' |
| 반응형 · 좁은 폭의 로딩과 차단 상태 | responsive 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- loading: 콘텐츠를 Skeleton으로 대체하고 aria-busy와 polite 상태 알림을 제공합니다.
- refreshing: 이미 표시한 콘텐츠가 있으면 그대로 유지하며 상태 메시지를 먼저 표시합니다. 콘텐츠가 없으면 loading처럼 동작합니다.
- stale, offline, error: 마지막 정상 콘텐츠가 있으면 상태 메시지 → 기존 콘텐츠 → 마지막 업데이트 시각 순서를 유지합니다. 콘텐츠가 없으면 EmptyState로 차단 상태를 표현합니다.
- polite 대역의 공지는 상시 마운트된 숨김 status region이 담당합니다. 상태 분기 요소는 메시지와 함께 삽입되므로 role="status"로는 신뢰성 있게 낭독되지 않고, role="alert"만 삽입 시 낭독이 명세로 보장됩니다. 그래서 assertive 차단 상태(콘텐츠 없는 error·offline)는 분기 요소가 alert로 직접 공지하고 숨김 region은 침묵하며(이중 낭독 방지), 그 외 모든 비-ready 상태는 숨김 region이 제목·설명을 공지합니다. 콘텐츠를 보존하는 대역의 Banner는 대역 안에서 텍스트만 바뀌는 동안 자체 l….
- live-region 긴급도는 상태 이름만이 아니라 콘텐츠 가용성으로 결정합니다. 마지막 정상 콘텐츠를 유지하는 error·offline은 작업을 중단하지 않으므로 status/polite이고, 콘텐츠가 없어 EmptyState로 차단되는 error·offline만 alert/assertive입니다. loading·empty·restricted 같은 예상 가능한 차단 상태와 모든 비차단 상태는 status/polite를 사용합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 차단 상태(EmptyState) 제목의 heading 레벨은 headingLevel(기본 3)로 지정합니다. 감싸는 표면이 자신의 제목 레벨에 맞춰 내려주면 문서 위계(WCAG 1.3.1)가 유지됩니다. ChartFrame은 자기 제목 레벨 +1을 전달합니다. |
| 명시 규칙 2 | - ready: 자식 콘텐츠를 그대로 표시합니다. - loading: 콘텐츠를 Skeleton으로 대체하고 aria-busy와 polite 상태 알림을 제공합니다. - refreshing: 이미 표시한 콘텐츠가 있으면 그대로 유지하며 상태 메시지를 먼저 표시합니다. 콘텐츠가 없으면 loading처럼 동작합니다. - stale, offline, error: 마지막 정상 콘텐츠가 있으면 상태 메시지 → 기존 콘텐츠 → 마지막 업데이트 시각 순서를 유지합니다. 콘텐츠가 없으면 EmptyState로 차단 상태를 표현합니다. - 조건식 결과가 false, null, unde… |
| 명시 규칙 3 | 구현 전에 내부의 Banner(embedded/standalone seam), EmptyState(중앙 정렬 차단 상태), Skeleton(점진 로딩)을 비교했습니다. 외부 기준은 WCAG 2.2 Status Messages, WAI-ARIA Alert pattern, Carbon contextual empty state, Fluent MessageBar, PatternFly Skeleton, PatternFly stale data warning입니다. |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- refreshing: 이미 표시한 콘텐츠가 있으면 그대로 유지하며 상태 메시지를 먼저 표시합니다. 콘텐츠가 없으면 loading처럼 동작합니다.
- stale, offline, error: 마지막 정상 콘텐츠가 있으면 상태 메시지 → 기존 콘텐츠 → 마지막 업데이트 시각 순서를 유지합니다. 콘텐츠가 없으면 EmptyState로 차단 상태를 표현합니다.
- polite 대역의 공지는 상시 마운트된 숨김 status region이 담당합니다. 상태 분기 요소는 메시지와 함께 삽입되므로 role="status"로는 신뢰성 있게 낭독되지 않고, role="alert"만 삽입 시 낭독이 명세로 보장됩니다. 그래서 assertive 차단 상태(콘텐츠 없는 error·offline)는 분기 요소가 alert로 직접 공지하고 숨김 region은 침묵하며(이중 낭독 방지), 그 외 모든 비-ready 상태는 숨김 region이 제목·설명을 공지합니다. 콘텐츠를 보존하는 대역의 Banner는 대역 안에서 텍스트만 바뀌는 동안 자체 l….
- live-region 긴급도는 상태 이름만이 아니라 콘텐츠 가용성으로 결정합니다. 마지막 정상 콘텐츠를 유지하는 error·offline은 작업을 중단하지 않으므로 status/polite이고, 콘텐츠가 없어 EmptyState로 차단되는 error·offline만 alert/assertive입니다. loading·empty·restricted 같은 예상 가능한 차단 상태와 모든 비차단 상태는 status/polite를 사용합니다.

## Accessibility

- loading: 콘텐츠를 Skeleton으로 대체하고 aria-busy와 polite 상태 알림을 제공합니다.
- polite 대역의 공지는 상시 마운트된 숨김 status region이 담당합니다. 상태 분기 요소는 메시지와 함께 삽입되므로 role="status"로는 신뢰성 있게 낭독되지 않고, role="alert"만 삽입 시 낭독이 명세로 보장됩니다. 그래서 assertive 차단 상태(콘텐츠 없는 error·offline)는 분기 요소가 alert로 직접 공지하고 숨김 region은 침묵하며(이중 낭독 방지), 그 외 모든 비-ready 상태는 숨김 region이 제목·설명을 공지합니다. 콘텐츠를 보존하는 대역의 Banner는 대역 안에서 텍스트만 바뀌는 동안 자체 l….
- 차단 상태(EmptyState) 제목의 heading 레벨은 headingLevel(기본 3)로 지정합니다. 감싸는 표면이 자신의 제목 레벨에 맞춰 내려주면 문서 위계(WCAG 1.3.1)가 유지됩니다. ChartFrame은 자기 제목 레벨 +1을 전달합니다.
- 네트워크 요청, retry 실행, 캐시 및 freshness 계산, 권한 판정은 제품 코드가 소유합니다. 이 컴포넌트는 controlled 시각·접근성 계약만 소유합니다.
- - ready: 자식 콘텐츠를 그대로 표시합니다. - loading: 콘텐츠를 Skeleton으로 대체하고 aria-busy와 polite 상태 알림을 제공합니다. - refreshing: 이미 표시한 콘텐츠가 있으면 그대로 유지하며 상태 메시지를 먼저 표시합니다. 콘텐츠가 없으면 loading처럼 동작합니다. - stale, offline, error: 마지막 정상 콘텐츠가 있으면 상태 메시지 → 기존 콘텐츠 → 마지막 업데이트 시각 순서를 유지합니다. 콘텐츠가 없으면 EmptyState로 차단 상태를 표현합니다. - 조건식 결과가 false, null, unde….

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | loading: 콘텐츠를 Skeleton으로 대체하고 aria-busy와 polite 상태 알림을 제공합니다. |
| Don't | refreshing: 이미 표시한 콘텐츠가 있으면 그대로 유지하며 상태 메시지를 먼저 표시합니다. 콘텐츠가 없으면 loading처럼 동작합니다. |
| Do | circle-block은 접근 차단·사용 불가에만 사용합니다. 오프라인은 Viewer와 같은 signal 글리프를 사용하고, 복구 문구는 원인 뒤에 -해 주세요. 형태의 다음 행동을 제공합니다. |
| Don't | stale, offline, error: 마지막 정상 콘텐츠가 있으면 상태 메시지 → 기존 콘텐츠 → 마지막 업데이트 시각 순서를 유지합니다. 콘텐츠가 없으면 EmptyState로 차단 상태를 표현합니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 ResourceState의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `StatusBadge` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `AnnotatedImage` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `BarChart` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Calendar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ChartFrame` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Carousel` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DataGrid` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- ResourceState prompt contract: `components/data/ResourceState.prompt.md`
- Storybook implementation evidence: `stories/DataResourceState.stories.jsx`
- [WCAG 2.2 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)
- [WAI-ARIA Alert pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)
- [Carbon contextual empty state](https://carbondesignsystem.com/patterns/empty-states-pattern/)
- [Fluent MessageBar](https://fluent2.microsoft.design/components/web/react/core/messagebar/usage)
- [PatternFly Skeleton](https://www.patternfly.org/components/skeleton/design-guidelines/)
- [PatternFly stale data warning](https://www.patternfly.org/component-groups/status-and-state-indicators/stale-data-warning/)
