# Tree Picker

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Selection and Input |
| Owner | `TreePicker` |
| Storybook | `LDS Product/Selection and Input/Tree Picker` |
| Source | `../component-content.json#product-selection-and-input-tree-picker` |

토픽·폴더처럼 부모와 자식 관계를 보존한 채 여러 범위를 고를 때 적합합니다. 평면 목록이나 단일 선택에는 Tree Picker 대신 Searchable Multi Select 또는 Select를 사용하세요.

## 사용 판단

### 사용

- 같은 level에서 아이콘을 쓸 경우 모두 같은 종류·크기로 제공하거나 모두 생략합니다. node별 장식 icon이나 application status chrome은 이 입력의 책임이 아닙니다.

## Anatomy

| Part | Contract |
| --- | --- |
| selectionBehavior | Descendant aggregation or explicit per-node selection. @default "descendants" |
| label | Accessible name for the tree. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `nodes` | `TreePickerNode[]` | No |  |
| `selectedIds` | `string[]` | No |  |
| `defaultSelectedIds` | `string[]` | No |  |
| `onSelectedIdsChange` | `(selectedIds: string[]) = void` | No |  |
| `expandedIds` | `string[]` | No |  |
| `defaultExpandedIds` | `string[]` | No |  |
| `onExpandedIdsChange` | `(expandedIds: string[]) = void` | No |  |
| `query` | `string` | No |  |
| `defaultQuery` | `string` | No |  |
| `onQueryChange` | `(query: string) = void` | No |  |
| `selectionBehavior` | `'descendants' \| 'independent'` | No | Descendant aggregation or explicit per-node selection. @default "descendants" |
| `searchLabel` | `React.ReactNode` | No |  |
| `searchPlaceholder` | `string` | No |  |
| `label` | `string` | No | Accessible name for the tree. |
| `emptyMessage` | `React.ReactNode` | No |  |
| `noResultsMessage` | `React.ReactNode` | No |  |
| `maxHeight` | `React.CSSProperties['maxHeight']` | No |  |
| `disabled` | `boolean` | No |  |

## Behavior and interaction

- selectionBehavior="descendants"에서 branch checkbox는 선택 가능한 활성 descendant의 집계입니다. disabled descendant는 parent action과 checked/mixed 계산에서 제외되어, 선택할 수 없는 항목 때문에 parent가 영구적으로 mixed가 되지 않습니다.
- selectionBehavior="independent"는 selectable인 각 node만 독립적으로 선택합니다. branch를 직접 선택하려면 그 branch에 selectable: true를 명시합니다.
- Carbon Design System Tree View: caret과 row selection target을 구분하고 일관된 icon 사용 원칙을 채택했습니다.
- TreePicker는 계층에서 여러 값을 선택하는 LK Product Data 입력 확장입니다. 단순 탐색·현재 위치 표시에는 기존 Tree/TreeView를 사용하고, 선택값을 form 또는 filter 상태로 제출해야 할 때만 사용합니다. WDS Core parity가 아닙니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | label은 좁은 폭에서 말줄임하고 문자열 label에는 전체 값을 확인할 native title을 제공합니다. description도 말줄임하며 meta는 공간이 부족하면 다음 줄로 wrap합니다. 320px 안팎에서 horizontal overflow를 만들지 않습니다. |
| 명시 규칙 2 | hierarchy와 roving focus는 LDS Tree/TreeView, 검색 입력은 Input, selection visual은 Checkbox의 박스 토큰(18px 박스·16px check·--radius-5), caret 크기·hover·focus·disabled·spacing은 LDS icon control과 data-row token 관행을 기준으로 맞췄습니다. 시각 언어만 빌려오고 컨트롤은 마운트하지 않습니다. |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-fill-alternative | light: rgba(112, 115, 124, 0.05); dark: rgba(112, 115, 124, 0.12) |

## Content and writing

- anatomy는 LDS Input 검색, border가 있는 tree, 행별 caret·체크 표시기·label/description·optional meta입니다. 적용/저장 action, 선택 요약, 권한 요청은 제품 화면이 별도로 조합합니다.
- Tree를 복제하지 않고 multi-select form contract만 추가합니다. navigation link, drag-and-drop reorder, lazy load, context action은 별도 component를 사용합니다.
- Adobe Spectrum Tree View: caret hit area, hover/focus/disabled, 긴 label truncation, filter hierarchy를 반영했습니다.
- 의도적으로 drag/reorder, lazy loading, inline rename, per-node action menu, 적용/저장 CTA, 권한 workflow는 제외했습니다. 필요한 경우 Product extension이나 application layer에서 조합합니다.

## Accessibility

- 행의 체크 표시기는 Checkbox 인스턴스가 아니라 md box Checkbox의 시각 치수·토큰만 재현한 장식용 aria-hidden 요소입니다. 선택 상태는 treeitem의 aria-checked가 단독으로 소유하므로 tree 안에는 포커스 가능한 form control이 존재하지 않습니다. 네이티브 checkbox를 다시 마운트하면 aria-hidden 안에 포커스 가능한 요소가 생겨(Axe aria-hidden-focus) roving Tab stop 계약도 깨집니다. 표시기를 클릭하면 행의 선택 toggle이 그대로 실행됩니다.
- focus와 selection은 서로 다른 상태입니다. tree 전체에는 roving Tab stop 하나만 있고, 선택은 aria-checked, 현재 focus는 LDS focus ring으로 표현합니다. 선택 색만으로 focus를 대신하지 않습니다.
- Arrow Up/Down은 보이는 활성 행 사이를 이동하고, Home/End는 처음/끝, Arrow Right/Left는 펼침·자식·부모 이동, Space는 선택 toggle입니다. Enter도 LDS 호환 입력으로 같은 toggle을 제공합니다. printable key typeahead는 다음 일치 label로 이동합니다.
- treeitem 하나가 aria-expanded, aria-checked, aria-disabled와 keyboard contract를 소유합니다. caret은 pointer hit target만 넓히는 시각 affordance이며 별도 Tab stop이나 중복 접근성 이름을 만들지 않습니다.
- disabled node와 그 descendant는 focus·선택·펼침 action에서 제외합니다. 첫 node가 disabled여도 첫 번째 활성 node가 roving Tab stop을 받습니다.

## Related components

| Component | Relationship |
| --- | --- |
| `AnnotatedImage` | 대표 시나리오에서 조합 |
| `BarChart` | 대표 시나리오에서 조합 |
| `Calendar` | 대표 시나리오에서 조합 |
| `ChartFrame` | 대표 시나리오에서 조합 |
| `Carousel` | 대표 시나리오에서 조합 |
| `DataGrid` | 대표 시나리오에서 조합 |
| `DataToolbar` | 대표 시나리오에서 조합 |
| `DataExportAction` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<TreePicker
  nodes={scopes}
  selectedIds={selectedIds}
  onSelectedIdsChange={setSelectedIds}
  expandedIds={expandedIds}
  onExpandedIdsChange={setExpandedIds}
/>
```

## Tokens and API

### Tokens

- `--caption1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-alternative`
- `--color-semantic-fill-normal`
- `--color-semantic-fill-strong`
- `--color-semantic-focus-ring`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-line-normal-neutral`
- `--color-semantic-line-normal-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-static-white`
- `--component-toggle-icon-size-sm`
- `--control-h-md`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-medium`
- `--fw-semibold`
- `--label2-size`
- `--radius-5`
- `--radius-md`
- `--radius-pill`
- `--radius-sm`
- `--space-0`
- `--space-1`
- `--space-2`
- `--space-4`

### Source contracts

- `components/data/TreePicker.jsx`
- `components/data/TreePicker.d.ts`
- `components/data/TreePicker.prompt.md`
- `stories/DataTreePicker.stories.jsx`

## Sources

- TreePicker prompt contract: `components/data/TreePicker.prompt.md`
- Storybook implementation evidence: `stories/DataTreePicker.stories.jsx`
- [WAI-ARIA APG Tree View Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/)
- [Adobe Spectrum Tree View](https://spectrum.adobe.com/page/tree-view/)
- [Carbon Design System Tree View](https://carbondesignsystem.com/components/tree-view/usage/)
- [Carbon Design System Checkbox](https://carbondesignsystem.com/components/checkbox/usage/)
