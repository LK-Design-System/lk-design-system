# Export Action

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Operations |
| Owner | `DataExportAction` |
| Storybook | `LDS Product/Data/Operations/Export Action` |
| Source | `../component-content.json#product-data-operations-export-action` |

전체 또는 선택 데이터를 파일로 만들며 형식·권한·진행 상태를 명시해야 할 때 적합합니다. 즉시 복사하거나 단일 링크를 내려받는 단순 작업에는 Export Action 대신 Copy Button 또는 Link를 사용하세요.

## 사용 판단

### 사용하지 않음

- format별 옵션, 개인정보 마스킹, 대용량 비동기 전달 방식은 제품 정책이므로 컴포넌트가 추측하지 않습니다.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `formats` | `DataExportOption[]` | No |  |
| `formatValue` | `string` | No |  |
| `defaultFormatValue` | `string` | No |  |
| `onFormatChange` | `(value: string) = void` | No |  |
| `scopeValue` | `string` | No |  |
| `defaultScopeValue` | `string` | No |  |
| `scopeOptions` | `DataExportOption[]` | No |  |
| `onScopeChange` | `(value: string) = void` | No |  |
| `selectedCount` | `number` | No |  |
| `totalCount` | `number` | No |  |
| `onExport` | `(request: DataExportRequest) = void` | No |  |
| `state` | `'idle' \| 'processing' \| 'success' \| 'error'` | No |  |
| `progress` | `number` | No |  |
| `successMessage` | `React.ReactNode` | No |  |
| `errorMessage` | `React.ReactNode` | No |  |
| `allowed` | `boolean` | No | 제품 RBAC 판정 결과. @default true |
| `unavailableBehavior` | `'disabled' \| 'hidden'` | No | 권한이 없을 때 disabled 설명 또는 완전 숨김. @default "disabled" |
| `unavailableReason` | `React.ReactNode` | No |  |
| `exportLabel` | `React.ReactNode` | No |  |
| `size` | `'sm' \| 'md'` | No |  |

## States

| State | Contract |
| --- | --- |
| unavailableBehavior | 권한이 없을 때 disabled 설명 또는 완전 숨김. @default "disabled" |

## Behavior and interaction

- 기본 범위는 현재 페이지, 선택 항목, 전체 검색 결과를 구분합니다. 제품은 필요하면 scopeOptions를 완전히 제어합니다.
- 선택 수나 제품 제공 옵션이 바뀌어 현재 형식·범위가 사라지면 각각 첫 번째 유효 옵션으로 즉시 정규화합니다. 따라서 uncontrolled 사용에서도 제거된 format이나 selected 범위가 export 요청으로 전달되지 않습니다.
- 행 단위 export가 아니라 dataset global action이므로 DataToolbar.actions에 배치합니다. 선택 행 작업은 DataGrid bulk band가 계속 소유합니다.
- 내보내기 형식과 범위, 제품이 판정한 권한, 비동기 job 상태를 표현하는 LK Product Extension입니다. 파일 생성·download·queue·RBAC 결정은 제품/서버가 소유합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --color-semantic-label-disable | light: rgba(55, 56, 60, 0.52); dark: rgba(174, 176, 182, 0.52) |
| --color-semantic-label-neutral | light: rgba(46, 47, 51, 0.88); dark: rgba(194, 196, 200, 0.88) |

## Responsive

- 별도 카드나 modal을 만들지 않으며 좁은 폭에서는 format, scope, action이 순서대로 줄바꿈됩니다.
- 내부 DataToolbar, DataGrid selection model, Select, Button, ProgressBar를 비교해 기존 높이·상태·아이콘을 재사용했습니다. Carbon Data table은 export를 global table toolbar action으로 분류하고, Carbon export pattern은 export 시작과 processing 상태를 구분하며, Fluent Button은 disabled action에 사용할 수 없는 이유와 접근 방법을 설명할 것을 권장합니다.

## Content and writing

- state="processing"은 중복 실행을 막고 determinate/indeterminate ProgressBar를 표시합니다. success/error는 각각 status/alert 라이브 리전으로 알립니다. 두 리전은 idle 상태에서도 빈 채로 계속 마운트되어 있고 텍스트만 바뀝니다. 메시지와 함께 새로 삽입된 리전은 낭독이 누락되기 때문이며, 보이는 완료 문구는 표현만 담당합니다(ToastStack의 상시 리전과 같은 계약).

## Accessibility

- 실행할 수 없는 export action은 native disabled 대신 aria-disabled로 표시해 계속 포커스 가능한 상태를 유지합니다. 권한이 회수되는 순간 포커스가 로 떨어지는 것을 막고, Tab으로 이동하는 사용자가 aria-describedby로 연결된 사유를 발견할 수 있게 하기 위해서입니다(Button.jsx의 loading focusable-disabled 선례, 아래 Fluent Button 지침).

## Related components

| Component | Relationship |
| --- | --- |
| `AnnotatedImage` | 대표 시나리오에서 조합 |
| `BarChart` | 대표 시나리오에서 조합 |
| `Carousel` | 대표 시나리오에서 조합 |
| `ChartFrame` | 대표 시나리오에서 조합 |
| `DataCollectionPanel` | 대표 시나리오에서 조합 |
| `DataGrid` | 대표 시나리오에서 조합 |
| `DataToolbar` | 대표 시나리오에서 조합 |
| `DescriptionList` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<DataExportAction
  selectedCount={selectedCount}
  totalCount={totalCount}
  allowed={permissions.canExport}
  unavailableReason="분석가 권한이 필요합니다."
  state={exportJob.state}
  progress={exportJob.progress}
  onExport={({ format, scope }) => startExport({ format, scope })}
/>
```

## Tokens and API

### Tokens

- `--caption1-line`
- `--caption1-size`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-status-negative-text`
- `--color-semantic-status-positive-text`
- `--font-sans`
- `--space-1`
- `--space-2`

### Source contracts

- `components/data/DataExportAction.jsx`
- `components/data/DataExportAction.d.ts`
- `components/data/DataExportAction.prompt.md`
- `stories/DataExportAction.stories.jsx`

## Migration

- 내부 ghost export action은 active light/dark scope의 semantic foreground를 직접 사용하고, callback·유효 format·유효 scope가 없으면 no-op button 대신 비활성 상태가 됩니다.

## Sources

- DataExportAction prompt contract: `components/data/DataExportAction.prompt.md`
- Storybook implementation evidence: `stories/DataExportAction.stories.jsx`
- [Carbon Data table](https://carbondesignsystem.com/components/data-table/usage/)
- [Carbon export pattern](https://v10.carbondesignsystem.com/community/patterns/export-pattern/)
- [Fluent Button](https://fluent2.microsoft.design/components/web/react/core/button/usage)
