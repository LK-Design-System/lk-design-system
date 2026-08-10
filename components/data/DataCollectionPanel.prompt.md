# DataCollectionPanel

`DataCollectionPanel`은 검색·필터 도구막대, 리소스 상태, 목록 본문, 선택적 좁은 화면 본문, 페이지네이션을 하나의 연속된 표면으로 묶는 **LK Product Extension**입니다. 제품 화면을 복제하지 않으며 query, fetch, 권한, 행 의미, 정렬과 페이지 상태는 제품이 소유합니다.

```jsx
<DataCollectionPanel
  aria-label="프로젝트 목록"
  toolbar={{
    size: 'sm',
    searchValue: query,
    onSearchChange: setQuery,
    filters: <SortControl />,
  }}
  resourceState={{ state: requestState, title: stateTitle }}
  compactContent={hasRows ? <ProjectList projects={projects} /> : undefined}
  footer={pageCount > 1 ? <Pagination page={page} count={pageCount} onChange={setPage} /> : undefined}
>
  {hasRows ? <Table tableLabel="프로젝트" columns={columns} rows={projects} rowHeaderKey="name" /> : null}
</DataCollectionPanel>
```

## 책임과 anatomy

- 읽기 순서는 **toolbar → resource message → active content → freshness → footer**입니다.
- `toolbar`는 `DataToolbar` props를 받고 패널이 `variant="embedded"`를 강제합니다.
- 화면 제목이나 상위 facet이 이미 collection의 이름과 개수를 설명한다면 `toolbar.title`과 `toolbar.count`를 생략해 같은 정보를 반복하지 않습니다.
- `resourceState`는 `ResourceState` props를 받고 패널이 children과 `messageVariant="embedded"`를 소유합니다.
- `children`은 기본·넓은 본문입니다. 정적 표 데이터에는 native `Table`, 선택·정렬·편집이 필요한 데이터에는 `DataGrid`를 사용합니다.
- `compactContent`는 제품이 직접 작성한 의미 있는 좁은 화면 표현입니다. 패널은 table row를 임의로 card로 변환하지 않습니다.
- `footer`는 보통 `Pagination`이며 page, pageSize, query 동기화는 제품이 제어합니다. 이동할 페이지가 없으면 prop을 생략합니다. 전달된 adapter가 `null`을 렌더링해도 빈 footer 구분선은 표시되지 않습니다.
- 초기 loading/error처럼 아직 표시할 데이터가 없을 때는 `children`과 `compactContent`를 넘기지 않습니다. 마지막 정상 데이터를 유지하는 refreshing/error/stale/offline 상태에서만 두 본문을 함께 넘겨 상태 메시지와 데이터를 보존합니다.

## 반응형 계약

- `layout="auto"`는 패널 컨테이너가 767px 이하이고 `compactContent`가 있을 때만 넓은 본문을 숨기고 좁은 본문을 표시합니다.
- `compactContent`가 없으면 좁은 화면에서도 `children`을 유지합니다. `Table`의 native 구조와 가로 overflow가 보존됩니다.
- `layout="wide" | "narrow"`는 테스트, 임베디드 레이아웃, 명시적 제품 topology를 위한 결정적 override입니다.
- 두 본문은 DOM에 같은 순서로 존재하지만 한 번에 하나만 CSS `display`에 참여하므로 숨겨진 중복 콘텐츠와 focus target은 접근성 트리와 Tab 순서에서 제외됩니다.

## 접근성

- 기본 root는 `section`입니다. landmark로 노출할 때 `aria-label` 또는 `aria-labelledby`로 이름을 제공합니다.
- 정적 표는 `caption`, `tableLabel`, `tableLabelledBy`, `<th scope>`를 사용해 행·열 관계를 유지합니다.
- 좁은 표현을 제공할 때도 동일한 항목 이름과 상태 텍스트를 semantic list 또는 native table 구조로 보존합니다.
- 패널은 자체 keyboard model을 만들지 않습니다. 검색, 필터, 행 action, Pagination은 각 native/LDS control의 DOM 순서대로 이동합니다.
- loading, empty, error, stale, offline, restricted announcement는 내부 `ResourceState` 계약을 따릅니다.

## Public surface and ref

- `ref`, `className`, `style`은 `as`가 선택한 root를 가리킵니다.
- `classNames`와 `styles`의 stable part는 `root`, `toolbar`, `state`, `wideContent`, `compactContent`, `footer`입니다.
- `vars`는 `--lds-data-collection-panel-min-height`, `--lds-data-collection-panel-footer-padding`만 받습니다.
- 외곽선, radius, 배경, shadow는 기존 card component token을 사용하며 중첩 Card를 만들지 않습니다.

## 비교 근거

- [Carbon Data Table usage](https://v10.carbondesignsystem.com/components/data-table/usage/)는 검색·필터·설정·action이 있는 toolbar를 table 상단에, pagination을 하단에 배치합니다.
- [PatternFly Toolbar guidelines](https://www.patternfly.org/components/toolbar/design-guidelines/)와 [Pagination guidelines](https://www.patternfly.org/components/pagination/design-guidelines/)는 데이터셋 control의 반응형 재배치와 하단 pagination을 별도 책임으로 설명합니다.
- [W3C WAI Tables](https://www.w3.org/WAI/tutorials/tables/)와 [table tips](https://www.w3.org/WAI/tutorials/tables/tips/)는 native header association과 작은 화면에서도 구조적 관계를 보존할 것을 요구합니다.

## LK 제품 workflow 검증

- **LK Portal** `e5ee99d5062170e26abe63d9105c2b8a024ce710`: `src/components/catalog/ProjectDirectory.tsx`는 Card, embedded DataToolbar, ResourceState, desktop Table, mobile list, Pagination을 반복 조합합니다. 패널로 supported by composition이며 실제 query·행 action·권한·compact item markup은 제품 소유입니다.
- **LK Control Full Daedeok** `3bdce49ec6868f016f4ec2cdbd12aabbf8a04f19`: `frontend/src/views/user/index.jsx`는 필터, loading/error/empty, MUI table, pagination을 같은 순서로 조합합니다. 패널 perimeter와 reading order는 재사용할 수 있지만 fetch·dialog·mutation·permission은 제품 소유입니다.
- **LK Web Viz** `4701e1dcfb0d0e9163c74c227da2d6feb801cb30`: `frontend/src/screens/TaskHistoryScreen.tsx`는 작업 이력을 개별 card 목록으로 표현하고 현재 표형 resource collection workflow가 없어 not applicable입니다.

새 아이콘이나 제품 asset은 추가하지 않습니다.
