# Saved View

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Operations |
| Owner | `SavedViewControl` |
| Storybook | `LDS Product/Data/Operations/Saved View` |
| Source | `../component-content.json#product-data-operations-saved-view` |

필터·정렬·열 구성을 반복해서 재사용하며 보기별 저장·이름 변경·삭제가 필요할 때 적합합니다. 일회성 필터나 단순 preset 선택에는 Saved View 대신 Filter Bar 또는 Select를 사용하세요.

## 사용 판단

### 사용하지 않음

- value와 onChange는 완전 제어형입니다. 컴포넌트는 선택한 ID만 전달하며 보기 적용, 서버 저장, 로컬 저장, URL 동기화, 충돌 해결을 수행하지 않습니다.
- Button / DropdownMenu: 액션의 크기·강조·오버플로 방식은 호출자가 기존 컴포넌트로 조합합니다. SavedViewControl 내부에는 별도 버튼 스타일이나 메뉴 상태를 복제하지 않습니다.
- Primer Filter pattern — 페이지 수준 필터는 공유 가능한 URL 상태가 기본이고 교차 세션 개인 설정은 서버 저장 대상이라는 구분을 따릅니다. SavedViewControl은 어느 저장 전략도 내장하지 않고 이벤트만 전달합니다.
- Classification: LK Product Extension. WDS Core variant parity를 주장하지 않습니다. 저장된 보기의 데이터 모델, 권한, 저장소, URL, 확인 다이얼로그는 제품 계층이 소유합니다.

## Anatomy

| Part | Contract |
| --- | --- |
| saveAction | Product-owned overwrite action. |
| saveAsAction | Product-owned create-copy action. |
| renameAction | Product-owned rename action. |
| deleteAction | Product-owned delete action. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `views` | `SavedViewOption[]` | No |  |
| `value` | `string` | No | Controlled selected view id. Use an empty string when no view is selected. |
| `onChange` | `(viewId: string, event: React.ChangeEvent) = void` | No | Emits selection only; 생략하면 select는 read-only 의미로 disabled됩니다. |
| `label` | `React.ReactNode` | No |  |
| `placeholder` | `string` | No |  |
| `emptyLabel` | `string` | No |  |
| `dirty` | `boolean` | No | Shows a non-color unsaved-change status. |
| `dirtyLabel` | `React.ReactNode` | No |  |
| `saving` | `boolean` | No | Shows an inline busy status and sets aria-busy on the group. |
| `savingLabel` | `React.ReactNode` | No |  |
| `saveAction` | `React.ReactNode` | No | Product-owned overwrite action. |
| `saveAsAction` | `React.ReactNode` | No | Product-owned create-copy action. |
| `renameAction` | `React.ReactNode` | No | Product-owned rename action. |
| `deleteAction` | `React.ReactNode` | No | Product-owned delete action. |
| `disabled` | `boolean` | No |  |
| `size` | `'sm' \| 'md' \| 'lg'` | No |  |
| `selectId` | `string` | No |  |
| `name` | `string` | No |  |

## Behavior and interaction

- SavedViewControl — 필터, 표 레이아웃, 차트 또는 대시보드 구성을 이름 있는 보기로 선택하는 LK Product 패턴입니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | Fluent 2 Select — 하나의 값을 고르는 native select가 모바일에서 사용하기 쉽고 브라우저 옵션 semantics를 유지한다는 근거입니다. 그래서 rich option chrome이나 검색이 필요하지 않은 saved view 선택에 native select를 사용합니다. |
| 명시 규칙 2 | 1. 보이는 라벨과 네이티브 단일 선택 2. dirty 또는 saving 상태(색만으로 전달하지 않음) 3. saveAction, saveAsAction, renameAction, deleteAction 순서의 제품 액션 슬롯 |
| 명시 규칙 3 | 대표 검증 story는 LDS Product/Data/Operations/Saved View의 SavedViewActions(최대 780px)와 Narrow320LongLabels(320px)입니다. 일반 폭에서 dirty → 선택 → 제품 save/save-as callback → saving 상태를, 320px에서 긴 보기 이름과 네 액션의 줄바꿈·native selection·가로 overflow 부재를 확인했습니다. |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |

## Responsive

- 작은 화면에서는 선택, 상태, 액션이 DOM 순서를 유지한 채 줄바꿈됩니다. 별도 카드 표면이나 중첩 메뉴 chrome을 만들지 않습니다.

## Content and writing

- onChange가 없으면 조작 가능한 no-op select를 노출하지 않고 disabled read-only 표현으로 전환합니다. 빈 views도 같은 비활성 계약과 emptyLabel을 사용합니다.
- dirty/saving 상태의 낭독은 select 옆의 보이는 배지·스피너가 아니라 상시 마운트된 polite 라이브 리전이 담당합니다. 메시지와 함께 새로 삽입된 리전은 낭독이 누락되므로, 리전은 상태가 없을 때도 빈 채로 남아 있고 텍스트만 바뀝니다(ToastStack의 상시 리전과 같은 계약). 보이는 배지와 스피너는 표현만 담당하며 자체 status role을 갖지 않습니다.
- 액션은 슬롯입니다. 수정/삭제 권한, 삭제 확인, 이름 입력, 실패 메시지, 저장 중 비활성화 정책은 제품이 결정합니다.
- DataGrid의 visibleColumnKeys/columnOrder와 DashboardGrid의 자식 순서는 제품 상태입니다. 저장 보기는 그 상태의 이름과 선택 진입점만 제공하며 내부 값을 해석하지 않습니다.

## Accessibility

- 같은 리전이 select의 aria-describedby 대상이기도 합니다. 그래야 select에 포커스한 사용자가 현재 보기에 저장되지 않은 변경이 있다는 사실을 알 수 있습니다.
- Select: 높이, 입력 border, --radius-input, label typography와 focus ring을 맞췄습니다. label foreground는 :root component alias 대신 active light/dark scope의 semantic label을 직접 해석합니다. 저장된 보기는 단일 문자열 선택이므로 옵션 패널을 새로 만들지 않고 네이티브 를 사용합니다. 이 차이는 모바일 선택 UX와 기본 키보드 semantics를 보존하기 위한 것입니다.

## Related components

| Component | Relationship |
| --- | --- |
| `AnnotatedImage` | 대표 시나리오에서 조합 |
| `BarChart` | 대표 시나리오에서 조합 |
| `Carousel` | 대표 시나리오에서 조합 |
| `ChartFrame` | 대표 시나리오에서 조합 |
| `DataCollectionPanel` | 대표 시나리오에서 조합 |
| `DataExportAction` | 대표 시나리오에서 조합 |
| `DataGrid` | 대표 시나리오에서 조합 |
| `DataToolbar` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<SavedViewControl
  views={views}
  value={viewId}
  onChange={setViewId}
  dirty={hasUnsavedChanges}
  saveAction={<Button onClick={save}>변경 저장</Button>}
  saveAsAction={<Button onClick={openSaveAs}>다른 이름으로 저장</Button>}
/>
```

## Tokens and API

### Tokens

- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-normal`
- `--color-semantic-focus-ring`
- `--color-semantic-label-alternative`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--component-button-transition`
- `--component-input-font-size`
- `--component-input-label-font-size`
- `--component-input-label-font-weight`
- `--component-input-label-letter-spacing`
- `--component-input-label-line-height`
- `--component-input-letter-spacing`
- `--component-input-line-height`
- `--component-input-padding-x`
- `--control-h-lg`
- `--control-h-md`
- `--control-h-sm`
- `--font-sans`
- `--label2-size`
- `--radius-input`
- `--space-1-5`

### Source contracts

- `components/data/SavedViewControl.jsx`
- `components/data/SavedViewControl.d.ts`
- `components/data/SavedViewControl.prompt.md`
- `stories/DataSavedView.stories.jsx`

## Sources

- SavedViewControl prompt contract: `components/data/SavedViewControl.prompt.md`
- Storybook implementation evidence: `stories/DataSavedView.stories.jsx`
- [SAP Fiori Views (Variant Management)](https://experience.sap.com/fiori-design-web/variant-management/)
- [Fluent 2 Select](https://fluent2.microsoft.design/components/web/react/core/select/usage)
- [Primer Filter pattern](https://primer.style/product/scenario-patterns/filter/)
