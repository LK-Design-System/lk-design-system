# Data Toolbar

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Operations |
| Owner | `DataToolbar` |
| Storybook | `LDS Product/Data/Operations/Data Toolbar` |
| Source | `../component-content.json#product-data-operations-data-toolbar` |

표나 그리드 바로 위에서 검색·필터·결과 수·페이지 수준 action을 함께 제공할 때 적합합니다. 선택된 행에만 적용되는 bulk action이나 전역 앱 명령에는 Data Toolbar 대신 선택 band 또는 Command Bar를 사용하세요.

## 사용 판단

### 사용하지 않음

- 여러 필터의 host는 자식의 max-content 폭을 우선 보존하고 툴바 가용 폭으로 상한을 둡니다. 검색과 필터 합계가 control 행에 들어가면 한 줄을 유지하고, 실제 공간이 부족할 때만 필터 host가 다음 줄로 이동한 뒤 내부 control을 감쌉니다. 제품별 breakpoint나 고정 필터 폭은 DataToolbar가 소유하지 않습니다.
- Classification: LK Product Extension. 선택 상태와 bulk action은 DataGrid가 소유하며 DataToolbar API에 중복하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| title | 테이블/그리드 제목. |
| description | 제목 아래 설명. |
| filters | 필터 chip/menu 슬롯. 함수면 검색 필드와 같은 control size를 받습니다. |
| actions | 우측 일반 액션 슬롯. |
| size | 밀도. @default "md" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `title` | `React.ReactNode` | No | 테이블/그리드 제목. |
| `description` | `React.ReactNode` | No | 제목 아래 설명. |
| `count` | `number` | No | 전체 결과 수. |
| `searchable` | `boolean` | No | Render the search control. Set false for count/filter/action-only collections. @default true |
| `searchValue` | `string` | No | 제어 검색어. |
| `defaultSearchValue` | `string` | No | 비제어 검색어 초기값. @default "" |
| `onSearchChange` | `(value: string) = void` | No | 검색어 변경 콜백. |
| `searchPlaceholder` | `string` | No | 검색 input placeholder와 accessible name. @default "검색" |
| `filters` | `React.ReactNode \| ((context: DataToolbarFilterContext) = React.ReactNode)` | No | 필터 chip/menu 슬롯. 함수면 검색 필드와 같은 control size를 받습니다. |
| `actions` | `React.ReactNode` | No | 우측 일반 액션 슬롯. |
| `size` | `DataToolbarSize` | No | 밀도. @default "md" |
| `variant` | `'standalone' \| 'embedded'` | No | 외곽선 소유. "embedded"는 툴바 자체 테두리·radius를 제거하고 하단 divider만 남겨, 부모 표면(section·Card) 안에서 헤더로 결합합니다. @default "standalone" |
| `classNames` | `LdsClassNames` | No |  |
| `styles` | `LdsStyles` | No |  |
| `vars` | `LdsVars` | No |  |

## States

| State | Contract |
| --- | --- |
| variant | 외곽선 소유. "embedded"는 툴바 자체 테두리·radius를 제거하고 하단 divider만 남겨, 부모 표면(section·Card) 안에서 헤더로 결합합니다. @default "standalone" |

## Behavior and interaction

- 검색은 제어/비제어 모두 가능합니다. searchValue와 onSearchChange를 주면 제어됩니다.
- Pagination은 DataToolbar 안에 넣지 않습니다. DataGrid 바로 아래에 별도 Pagination을 붙이고 page/pageSize/query를 제품이 제어합니다.
- Carbon Data table usage는 기본 table toolbar를 검색·필터·설정·export 같은 global action에, 선택 후 batch action bar를 선택 항목 작업에 사용합니다. LDS도 이 소유권 분리를 따릅니다.
- Carbon Pagination usage는 table pagination을 표 아래에 stack되는 별도 component로 정의합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | size="sm"은 검색과 render-prop filter control에 32px compact 밀도를, 기본 md는 48px field 밀도를 제공합니다. action용 Button 척도와 field 척도는 전역에서 합치지 않습니다. FilterChip은 고유 32px pill 높이를 유지하며 control 행 중앙에 정렬됩니다. |
| 명시 규칙 2 | Flex sizing 근거는 CSS Flexible Box Layout Module Level 1의 content-based flex basis와 automatic minimum size, MDN의 flex item wrapping 안내의 “전체 item 폭이 컨테이너보다 클 때 wrap” 원칙입니다. LDS는 이 원칙을 width: max-content, max-width: 100%, min-width: 0 조합으로 적용해 intrinsic 폭 보존과 협소 폭 축소를 분리합니다. |
| --body1-line | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --body1-size | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --body2-line | 22px |

## Responsive

- vars accepts only --lds-data-toolbar-padding, --lds-data-toolbar-gap, and --lds-data-toolbar-search-max-width; it does not add selection or pagination ownership.
- filters는 query를 좁히는 chip/menu 슬롯, actions는 열 표시·순서 설정 trigger, 내보내기 같은 전체 표 action 슬롯입니다. filters에 함수를 주면 { size }를 받아 검색과 같은 field control 밀도를 Select·SearchField 같은 자식에게 전달할 수 있습니다. 기존 ReactNode 슬롯도 그대로 지원합니다. 설정 UI와 저장 상태는 제품이 소유하고 visibleColumnKeys/columnOrder로 DataGrid에 전달합니다.
- selectedCount와 bulkActions는 DataToolbar props가 아닙니다. 선택 수, 선택 해제, bulk action은 DataGrid의 같은 높이 selection band에 둡니다.
- PatternFly Toolbar design guidelines는 search filter와 filter group을 하나의 연관된 그룹으로 배치하고 모든 toolbar item을 세로 중앙 정렬합니다. LDS는 검색과 field형 필터에 같은 size를 전달하고, 고유 높이를 가진 chip은 늘리지 않고 중앙 정렬합니다.

## Content and writing

- className, style, and the default ref target the root collection toolbar surface.
- Stable parts are root, header, heading, title, count, description, actions, controls, search, and filters. Header and controls slots exist only when their content exists.
- DataToolbar — DataGrid/Table 위에서 제목, 결과 수, 검색, 필터, page-level action을 정렬하는 표면.
- The header row is independent: title, description, count, or page-level actions keeps it present even when controls are omitted. If neither header content nor controls exist, DataToolbar returns null instead of leaving an empty bordered strip.

## Accessibility

- WAI-ARIA APG Table pattern에 따라 DataToolbar가 표의 native semantics나 keyboard model을 대신하지 않습니다. 검색과 action은 각 native control의 정상 Tab 순서를 유지합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `DataGrid` | 대표 시나리오에서 조합 |
| `FilterChip` | 대표 시나리오에서 조합 |
| `Icon` | 대표 시나리오에서 조합 |
| `Select` | 대표 시나리오에서 조합 |
| `TextButton` | 대표 시나리오에서 조합 |
| `AnnotatedImage` | 대표 시나리오에서 조합 |
| `BarChart` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<DataToolbar
  title="사용자 목록"
  description="조직에 등록된 계정"
  count={24}
  searchValue={query}
  onSearchChange={setQuery}
  searchPlaceholder="사용자 검색"
  filters={({ size }) => (
    <Select size={size} value={status} onChange={setStatus}>
      <option value="all">전체 상태</option>
      <option value="online">온라인</option>
    </Select>
  )}
  actions={<Button size="sm">내보내기</Button>}
/>
```

### 추가 조합 2

```jsx
<DataToolbar
  variant="embedded"
  searchable={false}
  title="Documents"
  count={documents.length}
  actions={<Button size="sm">Sort</Button>}
/>
```

## Tokens and API

### Tokens

- `--body1-line`
- `--body1-size`
- `--body2-line`
- `--body2-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-label-alternative`
- `--color-semantic-label-strong`
- `--color-semantic-line-solid-normal`
- `--font-sans`
- `--fw-medium`
- `--fw-semibold`
- `--label2-line`
- `--label2-size`
- `--lds-data-toolbar-gap`
- `--lds-data-toolbar-padding`
- `--lds-data-toolbar-search-max-width`
- `--radius-md`
- `--space-1`
- `--space-1-5`
- `--space-2`
- `--space-3`

### Source contracts

- `components/data/DataToolbar.jsx`
- `components/data/DataToolbar.d.ts`
- `components/data/DataToolbar.prompt.md`
- `stories/DataToolbar.stories.jsx`

## Migration

- searchable defaults to true for backward compatibility. Set searchable={false} when the product has no search state or search behavior. If filters are present, the filter row remains; if neither search nor filters are present, the controls row is omitted entirely.

## Sources

- DataToolbar prompt contract: `components/data/DataToolbar.prompt.md`
- Storybook implementation evidence: `stories/DataToolbar.stories.jsx`
- [CSS Flexible Box Layout Module Level 1](https://www.w3.org/TR/css-flexbox-1/#flexibility)
- [MDN의 flex item wrapping 안내](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Flexible_box_layout/Wrapping_items)
- [Carbon Data table usage](https://carbondesignsystem.com/components/data-table/usage/)
- [PatternFly Toolbar design guidelines](https://v4-archive.patternfly.org/v4/components/toolbar/design-guidelines/)
- [PatternFly Filters](https://www.patternfly.org/patterns/filters/design-guidelines/)
- [Carbon Pagination usage](https://carbondesignsystem.com/components/pagination/usage/)
- [WAI-ARIA APG Table pattern](https://www.w3.org/WAI/ARIA/apg/patterns/table/)
