# Refresh Control

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Operations |
| Owner | `RefreshControl` |
| Storybook | `LDS Product/Data/Operations/Refresh Control` |
| Source | `../component-content.json#product-data-operations-refresh-control` |

실시간이 아닌 데이터에서 마지막 갱신 시점·수동 갱신·자동 주기를 제어할 때 적합합니다. 저장이나 제출처럼 데이터 자체를 변경하는 action에는 Refresh Control 대신 명시적인 Button과 작업 상태를 사용하세요.

## 사용 판단

### 사용

- 내부 ghost refresh action은 active light/dark scope의 semantic foreground를 직접 사용합니다.

### 사용하지 않음

- RefreshControl 자체는 stale warning을 중복 렌더하지 않습니다. 리소스 상태는 ResourceState, 실행 control은 이 컴포넌트로 분리합니다.

## Anatomy

| Part | Contract |
| --- | --- |
| refreshLabel | Accessible name and tooltip of the icon-only refresh action. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `refreshing` | `boolean` | No |  |
| `onRefresh` | `() = void` | No |  |
| `lastUpdated` | `React.ReactNode` | No |  |
| `lastUpdatedLabel` | `React.ReactNode` | No |  |
| `refreshLabel` | `string` | No | Accessible name and tooltip of the icon-only refresh action. |
| `autoRefreshValue` | `string` | No | 제품이 제어하는 polling interval 값. |
| `autoRefreshOptions` | `RefreshControlOption[]` | No |  |
| `onAutoRefreshChange` | `(value: string) = void` | No | 제품 polling interval 변경 callback. 생략하면 interval control은 read-only 의미로 비활성화됩니다. |
| `autoRefreshLabel` | `string` | No |  |
| `disabled` | `boolean` | No |  |
| `unavailableReason` | `React.ReactNode` | No | disabled 이유를 control과 함께 보이게 표시합니다. |
| `size` | `'sm' \| 'md'` | No |  |

## Behavior and interaction

- 수동 새로고침, 마지막 업데이트 시각, 선택적 자동 새로고침 간격을 한 group으로 정렬하는 LK Product Extension입니다. polling timer, fetch, cache invalidation, timestamp 계산은 제품이 소유합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |
| --color-semantic-label-disable | light: rgba(55, 56, 60, 0.52); dark: rgba(174, 176, 182, 0.52) |

## Responsive

- 내부 DataToolbar, ResourceState, Button, Select의 control 높이와 freshness 표현을 재사용했습니다. PatternFly stale data warning은 stale 상태와 추가 설명을 함께 두는 방식을, PatternFly Toolbar는 data action과 responsive wrapping을, Fluent Button은 사용할 수 없는 action의 이유를 함께 제공할 것을 권장합니다.

## Content and writing

- 정렬 순서는 freshness 텍스트 → 자동 간격 select → 새로고침 icon action입니다. 대시보드 카드 코너에 놓였을 때 수동 정보가 아니라 action이 최외곽(코너 쪽)에 오는 업계 관행(AWS 콘솔·Grafana)을 따릅니다.
- 새로고침은 icon-only Button이며 refreshLabel이 접근 가능한 이름과 tooltip을 제공합니다. 텍스트 라벨 버튼은 empty/error 상태의 복구 CTA에서만 사용합니다.
- refreshing은 중복 실행을 막고 loading label을 제공합니다. onRefresh가 없으면 no-op action을 남기지 않고 수동 control을 비활성화합니다.
- disabled에는 unavailableReason을 함께 제공해 권한·offline 같은 원인을 보이게 설명할 수 있습니다.

## Related components

| Component | Relationship |
| --- | --- |
| `AnnotatedImage` | 대표 시나리오에서 조합 |
| `BarChart` | 대표 시나리오에서 조합 |
| `Calendar` | 대표 시나리오에서 조합 |
| `Carousel` | 대표 시나리오에서 조합 |
| `ChartFrame` | 대표 시나리오에서 조합 |
| `DataCollectionPanel` | 대표 시나리오에서 조합 |
| `DataExportAction` | 대표 시나리오에서 조합 |
| `DataGrid` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

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

## Tokens and API

### Tokens

- `--caption1-line`
- `--caption1-size`
- `--color-semantic-label-alternative`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--font-sans`
- `--space-2`

### Source contracts

- `components/data/RefreshControl.jsx`
- `components/data/RefreshControl.d.ts`
- `components/data/RefreshControl.prompt.md`
- `stories/DataRefreshControl.stories.jsx`

## Migration

- 자동 간격은 controlled Select일 뿐 timer를 만들지 않습니다. onAutoRefreshChange가 없으면 선택 가능한 것처럼 보이는 no-op select 대신 read-only 의미로 비활성화합니다.

## Sources

- RefreshControl prompt contract: `components/data/RefreshControl.prompt.md`
- Storybook implementation evidence: `stories/DataRefreshControl.stories.jsx`
- [PatternFly stale data warning](https://www.patternfly.org/component-groups/status-and-state-indicators/stale-data-warning/)
- [PatternFly Toolbar](https://v5-archive.patternfly.org/components/toolbar/design-guidelines/)
- [Fluent Button](https://fluent2.microsoft.design/components/web/react/core/button/usage)
