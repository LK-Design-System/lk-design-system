**DataToolbar** — `DataGrid`/`Table` 위에서 제목, 결과 수, 검색, 필터, page-level action을 정렬하는 표면.

Classification: **LK Product Extension**. 선택 상태와 bulk action은 `DataGrid`가 소유하며 DataToolbar API에 중복하지 않습니다.

`size="sm | md"`는 profile-aware gap/padding token을 선택합니다. 명시적 size가 유지되는
상태에서 `ops`는 chrome만 조밀화하며 제목·검색·필터·action의 읽기 순서와 query ownership은
바뀌지 않습니다. `--lds-data-toolbar-*` consumer override가 profile token보다 우선합니다.

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

## Public surface and ref

- `className`, `style`, and the default ref target the root collection toolbar surface.
- Stable parts are `root`, `header`, `heading`, `title`, `count`, `description`, `actions`, `controls`, `search`, `filters`, `sort`, `metadata`, `narrowControls`, and `filterPanel`. Header and controls slots exist only when their content exists; `narrowControls` exists whenever `filters` or `sort` exists, and `filterPanel` is the Drawer body that hosts `filters` on a narrow surface.
- Root `data-size`, `data-variant`, and `data-layout` mirror the public density, perimeter, and responsive control policy.
- `vars` accepts only `--lds-data-toolbar-padding`, `--lds-data-toolbar-gap`, and `--lds-data-toolbar-search-max-width`; it does not add selection or pagination ownership.

- 검색은 제어/비제어 모두 가능합니다. `searchValue`와 `onSearchChange`를 주면 제어됩니다.
- `count`는 ko-KR 천 단위 구분으로 렌더링됩니다(`count={3941}` → `3,941개`). 결과 수 copy가 한국어로 고정된 표면이므로 grouping locale도 host 환경을 따르지 않고 함께 고정합니다. 숫자가 아닌 값은 그대로 통과시킵니다.
- `filters`는 query를 좁히는 chip/menu 슬롯, `actions`는 열 표시·순서 설정 trigger, 내보내기 같은 전체 표 action 슬롯입니다. `filters`에 함수를 주면 `{ size }`를 받아 검색과 같은 field control 밀도를 `Select`·`SearchField` 같은 자식에게 전달할 수 있습니다. 기존 ReactNode 슬롯도 그대로 지원합니다. 설정 UI와 저장 상태는 제품이 소유하고 `visibleColumnKeys`/`columnOrder`로 DataGrid에 전달합니다.
- 여러 필터의 host는 자식의 `max-content` 폭을 우선 보존하고 툴바 가용 폭으로 상한을 둡니다. 검색과 필터 합계가 control 행에 들어가면 한 줄을 유지하고, 실제 공간이 부족할 때만 필터 host가 다음 줄로 이동한 뒤 내부 control을 감쌉니다. 제품별 breakpoint나 고정 필터 폭은 DataToolbar가 소유하지 않습니다.
- `sort`는 정렬 control 슬롯입니다. 필터와 같은 `{ size }` context를 받지만 필터와 분리되어, 좁은 화면에서도 Drawer로 접히지 않고 toolbar에 남습니다. `metadata`는 동기화 시각·데이터 범위처럼 query를 바꾸지 않는 보조 정보 슬롯이며 넓은 화면에서 control 행의 끝(inline end)에 정렬됩니다.
- `size="sm"`은 검색과 render-prop filter control에 `--control-h-sm`(32px) compact 밀도를, 기본 `md`는 `--component-input-height` field 밀도(default 48px, `ops` 40px)를 제공합니다. `SearchField`·`Select`·`Input` 계열은 모두 이 토큰을 통해 해석되므로 profile을 바꿔도 한 행에서 서로 어긋나지 않습니다.
- `{ size }` context는 **field 밀도**입니다. action용 `Button` 척도(`--component-button-height-*`)와 field 척도는 전역에서 합치지 않으므로, 같은 `size`를 `Button`에 그대로 넘겨도 높이는 일치하지 않습니다(의도된 분리). 필터 행의 `Button`은 control 행 중앙 정렬로 두고, 필드 높이에 실제로 맞물려야 하는 field+action 조합은 `FieldAction`이 소유합니다. `FilterChip`은 고유 32px pill 높이를 유지하며 control 행 중앙에 정렬됩니다.

Flex sizing 근거는 [CSS Flexible Box Layout Module Level 1](https://www.w3.org/TR/css-flexbox-1/#flexibility)의 content-based flex basis와 automatic minimum size, [MDN의 flex item wrapping 안내](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Flexible_box_layout/Wrapping_items)의 “전체 item 폭이 컨테이너보다 클 때 wrap” 원칙입니다. LDS는 이 원칙을 `width: max-content`, `max-width: 100%`, `min-width: 0` 조합으로 적용해 intrinsic 폭 보존과 협소 폭 축소를 분리합니다.
- `selectedCount`와 `bulkActions`는 DataToolbar props가 아닙니다. 선택 수, 선택 해제, bulk action은 DataGrid의 같은 높이 selection band에 둡니다.
- Pagination은 DataToolbar 안에 넣지 않습니다. DataGrid 바로 아래에 별도 `Pagination`을 붙이고 page/pageSize/query를 제품이 제어합니다.
- `variant="embedded"`는 DataToolbar를 부모 표면(감싸는 `section`·`Card`) 안의 헤더로 결합할 때 자체 border·radius를 제거하고 하단 divider만 남깁니다. `DataGrid variant="embedded"`와 함께 collection 패턴을 하나의 연속 외곽선으로 묶으며, `style`로 border/radius를 덮어쓰지 않습니다. 기본값 `standalone`은 페이지 레벨 표면으로 자체 외곽선을 그립니다.
- [Carbon Data table usage](https://carbondesignsystem.com/components/data-table/usage/)는 기본 table toolbar를 검색·필터·설정·export 같은 global action에, 선택 후 batch action bar를 선택 항목 작업에 사용합니다. LDS도 이 소유권 분리를 따릅니다.
- [PatternFly Toolbar design guidelines](https://v4-archive.patternfly.org/v4/components/toolbar/design-guidelines/)는 search filter와 filter group을 하나의 연관된 그룹으로 배치하고 모든 toolbar item을 세로 중앙 정렬합니다. LDS는 검색과 field형 필터에 같은 `size`를 전달하고, 고유 높이를 가진 chip은 늘리지 않고 중앙 정렬합니다.
- [PatternFly Filters](https://www.patternfly.org/patterns/filters/design-guidelines/)는 text entry·single select·filter group을 같은 toolbar 안에서 조합할 수 있는 필터 유형으로 구분합니다. 따라서 LDS는 임의 자식을 강제로 clone하거나 높이를 덮지 않고 render-prop context로 field control 밀도만 전달합니다.
- [Carbon Pagination usage](https://carbondesignsystem.com/components/pagination/usage/)는 table pagination을 표 아래에 stack되는 별도 component로 정의합니다.
- [WAI-ARIA APG Table pattern](https://www.w3.org/WAI/ARIA/apg/patterns/table/)에 따라 DataToolbar가 표의 native semantics나 keyboard model을 대신하지 않습니다. 검색과 action은 각 native control의 정상 Tab 순서를 유지합니다.

## Search-optional collections

`searchable` defaults to `true` for backward compatibility. Set `searchable={false}` when the product has no search state or search behavior. If filters are present, the filter row remains; if neither search nor filters are present, the controls row is omitted entirely.

The header row is independent: `title`, `description`, `count`, or page-level `actions` keeps it present even when controls are omitted. If neither header content nor controls exist, `DataToolbar` returns `null` instead of leaving an empty bordered strip. Selection count and bulk actions never make either row appear; those remain `DataGrid` ownership.

```jsx
<DataToolbar
  variant="embedded"
  searchable={false}
  title="Documents"
  count={documents.length}
  actions={<Button size="sm">Sort</Button>}
/>
```

## Responsive controls (`layout`)

`layout`은 control 행의 반응형 정책입니다. 기본값 `auto`는 toolbar 자체를 `lds-data-toolbar` inline-size container로 두고, 컨테이너 폭이 767px 이하일 때 narrow 배치로 전환합니다. `wide`와 `narrow`는 컨테이너 폭과 무관하게 각 배치를 고정하며, `DataCollectionPanel`은 자신의 `layout`을 embedded toolbar에 그대로 전달합니다.

- **wide**: 검색 → 필터 host → 정렬 → metadata 순서의 한 행이며 기존 출력과 동일합니다.
- **narrow**: 검색이 한 행 전체를 차지하고, 필터는 `outlined`/`assistive` `Button` trigger(`아이콘 tune` + `filterLabel`)로 접히며 정렬 control은 trigger 옆에서 남은 폭을 채웁니다. metadata는 다음 행 전체 폭을 차지합니다.
- 필터 trigger는 `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`로 Drawer와 연결됩니다. `activeFilterCount`가 1 이상이면 trigger 라벨에 `필터 3`처럼 적용 수를 붙여 접힌 상태에서도 현재 query가 좁혀져 있음을 드러냅니다. 기본값이 아닌 필터 수의 계산은 제품이 소유합니다.
- 필터 Drawer는 `density="compact"`이며 `filterPanelTitle`을 제목으로, `filterCloseLabel`을 footer의 full-width 확정 action으로 사용합니다. 필터 자식은 `filterPanel` part 안에서 세로로 쌓이고 전체 폭을 채웁니다. 닫히면 Drawer 계약대로 trigger로 초점을 복원합니다. 같은 `filters` 노드가 wide host와 Drawer 양쪽에 렌더링되므로 필터 상태는 항상 제품 state에 두고 자식 내부 state에 의존하지 않습니다.
- 반응형 규칙은 `#lk-data-toolbar-layout` head style 하나로 주입되며(`Input`의 placeholder 패턴), 루트는 grid 행당 정확히 한 DOM 자식만 가집니다. narrow에서 숨겨지는 wide host는 `display:none`이므로 Tab 순서에 남지 않습니다. 반대로 wide에서는 narrow trigger 행이 `display:none`입니다.
- 근거: [PatternFly Toolbar](https://www.patternfly.org/components/toolbar/design-guidelines/)는 좁은 breakpoint에서 filter group을 하나의 toggle 뒤로 접고 검색과 주요 action은 노출된 채 남기며, [Carbon Data table filtering](https://carbondesignsystem.com/components/data-table/usage/#filtering)은 여러 필터를 panel로 모아 적용 수를 표시합니다. LDS는 breakpoint를 viewport가 아니라 toolbar 컨테이너 폭으로 판정해 split view·Drawer 안에서도 같은 정책이 유지되도록 합니다([CSS Containment Module Level 3, container queries](https://www.w3.org/TR/css-contain-3/#container-queries)).
