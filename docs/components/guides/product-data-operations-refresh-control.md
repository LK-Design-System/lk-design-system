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

- 실시간이 아닌 데이터에서 마지막 갱신 시점·수동 갱신·자동 주기를 제어할 때 적합합니다. 저장이나 제출처럼 데이터 자체를 변경하는 action에는 Refresh Control 대신 명시적인 Button과 작업 상태를 사용하세요.
- 새로고침은 icon-only Button이며 refreshLabel이 접근 가능한 이름과 tooltip을 제공합니다. 텍스트 라벨 버튼은 empty/error 상태의 복구 CTA에서만 사용합니다.
- disabled에는 unavailableReason을 함께 제공해 권한·offline 같은 원인을 보이게 설명할 수 있습니다.
- 내부 ghost refresh action은 active light/dark scope의 semantic foreground를 직접 사용합니다.

### 사용하지 않음

- refreshing은 중복 실행을 막고 loading label을 제공합니다. onRefresh가 없으면 no-op action을 남기지 않고 수동 control을 비활성화합니다.
- 자동 간격은 controlled Select일 뿐 timer를 만들지 않습니다. onAutoRefreshChange가 없으면 선택 가능한 것처럼 보이는 no-op select 대신 read-only 의미로 비활성화합니다.
- - 정렬 순서는 freshness 텍스트 → 자동 간격 select → 새로고침 icon action입니다. 대시보드 카드 코너에 놓였을 때 수동 정보가 아니라 action이 최외곽(코너 쪽)에 오는 업계 관행(AWS 콘솔·Grafana)을 따릅니다. - 새로고침은 icon-only Button이며 refreshLabel이 접근 가능한 이름과 tooltip을 제공합니다. 텍스트 라벨 버튼은 empty/error 상태의 복구 CTA에서만 사용합니다. - refreshing은 중복 실행을 막고 loading label을 제공합니다. onRefresh가 없으면 no-op….
- RefreshControl 자체는 stale warning을 중복 렌더하지 않습니다. 리소스 상태는 ResourceState, 실행 control은 이 컴포넌트로 분리합니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | RefreshControl의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Last Updated Label | lastUpdatedLabel 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Refresh Label | Accessible name and tooltip of the icon-only refresh action. |
| Auto Refresh Options | autoRefreshOptions 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Auto Refresh Label | autoRefreshLabel 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `refreshing` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onRefresh` | `() = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `lastUpdated` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `lastUpdatedLabel` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `refreshLabel` | `string` | No | Accessible name and tooltip of the icon-only refresh action. |
| `autoRefreshValue` | `string` | No | 제품이 제어하는 polling interval 값. |
| `autoRefreshOptions` | `RefreshControlOption[]` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onAutoRefreshChange` | `(value: string) = void` | No | 제품 polling interval 변경 callback. 생략하면 interval control은 read-only 의미로 비활성화됩니다. |
| `autoRefreshLabel` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `disabled` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `unavailableReason` | `React.ReactNode` | No | disabled 이유를 control과 함께 보이게 표시합니다. |
| `size` | `'sm' \| 'md'` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| disabled | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| 반응형 · 좁은 폭의 갱신 중 상태 | responsive 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- 정렬 순서는 freshness 텍스트 → 자동 간격 select → 새로고침 icon action입니다. 대시보드 카드 코너에 놓였을 때 수동 정보가 아니라 action이 최외곽(코너 쪽)에 오는 업계 관행(AWS 콘솔·Grafana)을 따릅니다.
- 새로고침은 icon-only Button이며 refreshLabel이 접근 가능한 이름과 tooltip을 제공합니다. 텍스트 라벨 버튼은 empty/error 상태의 복구 CTA에서만 사용합니다.
- 자동 간격은 controlled Select일 뿐 timer를 만들지 않습니다. onAutoRefreshChange가 없으면 선택 가능한 것처럼 보이는 no-op select 대신 read-only 의미로 비활성화합니다.
- 수동 새로고침, 마지막 업데이트 시각, 선택적 자동 새로고침 간격을 한 group으로 정렬하는 LK Product Extension입니다. polling timer, fetch, cache invalidation, timestamp 계산은 제품이 소유합니다.
- - 정렬 순서는 freshness 텍스트 → 자동 간격 select → 새로고침 icon action입니다. 대시보드 카드 코너에 놓였을 때 수동 정보가 아니라 action이 최외곽(코너 쪽)에 오는 업계 관행(AWS 콘솔·Grafana)을 따릅니다. - 새로고침은 icon-only Button이며 refreshLabel이 접근 가능한 이름과 tooltip을 제공합니다. 텍스트 라벨 버튼은 empty/error 상태의 복구 CTA에서만 사용합니다. - refreshing은 중복 실행을 막고 loading label을 제공합니다. onRefresh가 없으면 no-op….

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |
| --color-semantic-label-disable | light: rgba(55, 56, 60, 0.52); dark: rgba(174, 176, 182, 0.52) |

## Responsive

- 내부 DataToolbar, ResourceState, Button, Select의 control 높이와 freshness 표현을 재사용했습니다. PatternFly stale data warning은 stale 상태와 추가 설명을 함께 두는 방식을, PatternFly Toolbar는 data action과 responsive wrapping을, Fluent Button은 사용할 수 없는 action의 이유를 함께 제공할 것을 권장합니다.
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- 정렬 순서는 freshness 텍스트 → 자동 간격 select → 새로고침 icon action입니다. 대시보드 카드 코너에 놓였을 때 수동 정보가 아니라 action이 최외곽(코너 쪽)에 오는 업계 관행(AWS 콘솔·Grafana)을 따릅니다.
- 새로고침은 icon-only Button이며 refreshLabel이 접근 가능한 이름과 tooltip을 제공합니다. 텍스트 라벨 버튼은 empty/error 상태의 복구 CTA에서만 사용합니다.
- refreshing은 중복 실행을 막고 loading label을 제공합니다. onRefresh가 없으면 no-op action을 남기지 않고 수동 control을 비활성화합니다.
- disabled에는 unavailableReason을 함께 제공해 권한·offline 같은 원인을 보이게 설명할 수 있습니다.

## Accessibility

- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.
- 색상, 모양 또는 아이콘 하나만으로 상태를 구분하지 않고 이름·텍스트·semantic state를 함께 제공합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | 새로고침은 icon-only Button이며 refreshLabel이 접근 가능한 이름과 tooltip을 제공합니다. 텍스트 라벨 버튼은 empty/error 상태의 복구 CTA에서만 사용합니다. |
| Don't | refreshing은 중복 실행을 막고 loading label을 제공합니다. onRefresh가 없으면 no-op action을 남기지 않고 수동 control을 비활성화합니다. |
| Do | disabled에는 unavailableReason을 함께 제공해 권한·offline 같은 원인을 보이게 설명할 수 있습니다. |
| Don't | 자동 간격은 controlled Select일 뿐 timer를 만들지 않습니다. onAutoRefreshChange가 없으면 선택 가능한 것처럼 보이는 no-op select 대신 read-only 의미로 비활성화합니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 RefreshControl의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `AnnotatedImage` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `BarChart` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Calendar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ChartFrame` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Carousel` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DataGrid` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DataToolbar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DataExportAction` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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

- refreshing은 중복 실행을 막고 loading label을 제공합니다. onRefresh가 없으면 no-op action을 남기지 않고 수동 control을 비활성화합니다.
- 자동 간격은 controlled Select일 뿐 timer를 만들지 않습니다. onAutoRefreshChange가 없으면 선택 가능한 것처럼 보이는 no-op select 대신 read-only 의미로 비활성화합니다.
- - 정렬 순서는 freshness 텍스트 → 자동 간격 select → 새로고침 icon action입니다. 대시보드 카드 코너에 놓였을 때 수동 정보가 아니라 action이 최외곽(코너 쪽)에 오는 업계 관행(AWS 콘솔·Grafana)을 따릅니다. - 새로고침은 icon-only Button이며 refreshLabel이 접근 가능한 이름과 tooltip을 제공합니다. 텍스트 라벨 버튼은 empty/error 상태의 복구 CTA에서만 사용합니다. - refreshing은 중복 실행을 막고 loading label을 제공합니다. onRefresh가 없으면 no-op….
- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.

## Sources

- RefreshControl prompt contract: `components/data/RefreshControl.prompt.md`
- Storybook implementation evidence: `stories/DataRefreshControl.stories.jsx`
- [PatternFly stale data warning](https://www.patternfly.org/component-groups/status-and-state-indicators/stale-data-warning/)
- [PatternFly Toolbar](https://v5-archive.patternfly.org/components/toolbar/design-guidelines/)
- [Fluent Button](https://fluent2.microsoft.design/components/web/react/core/button/usage)
