## Numeric columns

Header and body cells use `font-variant-numeric: tabular-nums` so values do not jitter between rows. Set `align: 'right'` on comparable numeric columns; nominal identifiers such as postal codes or equipment IDs remain left aligned.

Reference: [SAP Fiori data table usage](https://www.sap.com/design-system/fiori-design-android/v25-4/components/data-table/usage) recommends content-dependent alignment and right alignment for comparable numeric values.

## Flexible truncated column

Classification: **LDS Product extension**. `truncate: true` is an opt-in column
layout contract for one long, plain-text field that should consume the table's
remaining width without pushing fixed metadata or action columns outside the
container.

```jsx
<Table
  columns={[
    { key: 'name', label: 'Name', truncate: true },
    { key: 'status', label: 'Status', width: 112 },
    { key: 'actions', label: 'Actions', width: 48, align: 'right', render: renderActions },
  ]}
  rows={rows}
/>
```

- Prefer one `truncate` column per table. It uses the remaining width and
  ignores that column's `width`; other columns keep their explicit widths.
- The complete text remains in the DOM while the visible line uses an
  ellipsis. Do not add a duplicate accessible label just because text is
  visually clipped.
- A custom `render` tree is still constrained by the cell, but nested flex or
  grid layouts must provide their own `minWidth: 0` and overflow behavior.
- Horizontal scrolling remains the default overflow policy for tables whose
  intentionally fixed columns cannot fit. Truncation is not applied globally.

The [CSS Table Module Level 3](https://www.w3.org/TR/css-tables-3/) explains why
cell min-content widths participate in a table's intrinsic width. The contract
therefore constrains both header and body cells, rather than styling only the
header. [MUI X column dimensions](https://mui.com/x/react-data-grid/column-dimensions/)
provides the comparable explicit flexible-column model, while
[Carbon data table guidance](https://v10.carbondesignsystem.com/components/data-table/usage/)
prefers giving tables enough room to avoid truncation. LDS follows both
principles by keeping this behavior explicit and opt-in.

**Table** — 대문자 캡션 헤더, tabular 행, 부드러운 호버 워시가 있는 차분한 데이터 표.

```jsx
<Table
  caption="모델별 현장 상태"
  rowHeaderKey="code"
  getRowId={(row) => row.code}
  columns={[
    { key: 'code', label: '모델' },
    { key: 'site', label: '현장' },
    { key: 'status', label: '상태', render: (r) => <StatusBadge tone={r.tone}>{r.status}</StatusBadge> },
  ]}
  rows={[{ code: 'LKR-T1', site: '판교 물류센터', status: '가동중', tone: 'positive' }]}
/>
```

- **columns** — `{ key, label, align, width, render }`. **rows** — 데이터 객체. **size** `sm · md`. **hover** — 행 워시. 상태 점·링크·액션에는 `render`를 쓰세요.
- 한 컬럼에는 가능한 하나의 데이터 속성만 담으세요. 값, 상태, 수집 시각, 액션은 각각 독립 컬럼으로 분리하고, 비교/정렬해야 하는 표 셀 안에 값+시간처럼 서로 다른 데이터를 묶지 마세요. 구분 기준은 **식별자인가, 비교·정렬하는 속성인가**입니다 — 키·슬러그·코드처럼 같은 대상을 가리키는 식별자는 이름 아래 보조 텍스트로 쌓아도 되지만, 시각·수치처럼 행 사이를 비교하거나 정렬 기준이 되는 속성은 자기 컬럼을 가져야 값이 세로로 정렬되어 비교와 정렬 결과 확인이 가능합니다. 특히 도구막대 정렬 옵션(예: 최근 변경순)의 기준 속성이 화면에 컬럼으로 없으면 사용자는 정렬 결과를 검증할 수 없습니다. 이 기준은 넓은 표에만 적용됩니다 — 좁은 화면의 세로 목록은 컬럼 비교가 목적이 아니므로 식별자와 속성을 쌓아도 됩니다. 헤더 클릭 정렬까지 필요하면 Table이 아니라 `DataGrid`를 선택하세요.
- 결측 값은 공백이나 `0`으로 위장하지 말고 `render`에서 보이는 `—`와 스크린리더용
  `값 없음`을 함께 제공합니다. 로딩·오류는 셀 placeholder가 아니라 표의 resource state로
  분리합니다.

## 표 시맨틱 계약 (WCAG 1.3.1)

읽기 전용 표라도 헤더와 데이터의 관계는 보조기술에 전달되어야 합니다. Table은 DataGrid와 같은 native table 시맨틱 기준을 따릅니다.

- 열 헤더는 항상 `<th scope="col">`입니다. 별도 prop이 필요 없으며 끌 수 없습니다.
- **rowHeaderKey** — 행을 식별하는 컬럼의 key입니다. 지정하면 그 컬럼의 셀이 `<td>` 대신 `<th scope="row">`가 되어, 스크린 리더가 나머지 셀을 읽을 때 행 이름을 함께 낭독합니다. 시각 표현은 데이터 셀과 동일하게 유지되고 시맨틱만 바뀝니다. 장비 ID·자산 코드처럼 행을 유일하게 지시하는 컬럼 하나에만 쓰세요.
- **caption** — 표 위에 보이는 `<caption>`이며 동시에 표의 접근 가능한 이름입니다. 표 제목이 표 자체에 속할 때 첫 번째 선택지입니다.
- **tableLabel** — 보이는 캡션이 없을 때 `<table>`에 직접 붙는 aria-label입니다. 래퍼 `div`가 아니라 표에 이름이 필요하므로, 밖에서 넘긴 `aria-label`(래퍼로 전달됨) 대신 이 prop을 쓰세요.
- **tableLabelledBy** — 표 밖에 이미 보이는 제목(heading 등)의 id를 연결해 `<table>`의 aria-labelledby로 사용합니다. 보이는 제목이 있는 페이지에서는 이름을 중복 작성하지 말고 이 연결을 쓰세요.
- `caption`이 있으면 `tableLabel`과 `tableLabelledBy`는 무시됩니다. 보이는 캡션을 ARIA 이름으로 덮어쓰면 이름과 보이는 텍스트가 어긋나기 때문입니다(WCAG 2.5.3).
- **getRowId** — React key로 쓸 안정적인 행 식별자를 반환합니다. 생략하면 `row.id`, 그것도 없으면 배열 index를 씁니다. 행이 갱신·재정렬되는 표에서는 호버 같은 행 로컬 상태가 엉뚱한 행에 남지 않도록 반드시 지정하세요.

Reference: [WAI-ARIA APG Table pattern](https://www.w3.org/WAI/ARIA/apg/patterns/table/) — 열/행 헤더는 `<th>`와 `scope`로 표현하고 표에는 이름을 부여합니다. 자사 `DataGrid`도 같은 기준(`scope="col"`, `tableLabel`)을 씁니다.

## Row and cell-style extension points

- `getRowProps(row, index)` merges native `<tr>` attributes such as `data-*`, `className`, `style`, and pointer handlers. It does not add selection, focus, or grid semantics. Use `DataGrid` when rows must be selected, sorted, or navigated with the keyboard.
- `getTableHeaderCellStyle({ padding, align, width })` and `getTableDataCellStyle({ padding, align, width })` expose the LDS static-table cell presentation for product-owned table compositions that cannot use the full `Table` renderer. Preserve native `<th scope="col|row">` and `<td>` elements when using them.

## Banded rows (`banded`) — 넓은 표의 행 결속

- **banded** — 모든 데이터 행에 `--color-semantic-fill-alternative` 밴드를 깝니다. 라벨 열과 측정 열 사이가 먼 넓은 표에서 헤어라인만으로는 행의 시선이 이어지지 않을 때 쓰세요. 호버 워시는 밴드 위에서 한 단 위 fill(`fill-normal`)로 올라가 여전히 보입니다.
- **교차(지브라)가 아니라 전 행 밴드입니다.** 행이 적은 표에서 교차 줄무늬는 특정 행의 강조로 오독됩니다 — 강조는 상태 표현(배지·톤)의 몫이고 기하의 몫이 아닙니다. 이 판정은 투영 매체(Slides)에서 실측으로 확정됐습니다(`docs/TABLE_MEDIUM_CONTRACT_PROPOSAL.md`).
- 외부 근거: [Carbon Data table](https://carbondesignsystem.com/components/data-table/usage/)의 zebra 옵션 — "행을 따라가는 시선이 옆 행으로 이탈하는 것을 막는" 넓은 표 장치이며, Carbon은 줄무늬를 끄면 행 구분선을 요구합니다(LDS 기본형이 그 형태). [USWDS Table](https://designsystem.digital.gov/components/table/)의 striped 변형도 같은 계열입니다. LDS는 두 시스템의 교차 줄무늬 대신 전 행 밴드를 채택합니다(강조 오독 근거는 위).

## 매체 재지정 훅 (`--lk-table-*`)

셀 패딩과 타입은 `--lk-table-cell-pad-sm/md`, `--lk-table-head-size/line/spacing`, `--lk-table-cell-size/line` 훅을 경유합니다. 매체 훅이 없으면 `--component-table-cell-padding-sm/md`를 읽고, 그 token의 `default` 값은 기존 리터럴과 같습니다. 투영·전시처럼 읽기 거리가 다른 매체의 명시적 `--lk-table-*`가 profile token보다 우선합니다. `ops` 안의 명시적 `size="md"`도 API 의미는 유지한 채 ops-md token 값을 사용합니다. 전체 precedence와 측정 게이트는 `docs/DENSITY_AND_EXPRESSION_PROFILE_CONTRACT.md`가 정본입니다.

## 그룹 행 (`groupKey`)

- **groupKey** — 행을 묶는 필드 이름입니다. 같은 값을 가진 **연속 구간**마다
  표 전체를 가로지르는 `<th scope="colgroup">` 그룹 헤더가 한 번 열립니다.
- 호출자의 행 순서가 곧 보고의 순서이므로, 흩어진 같은 값은 **모으지 않고**
  두 번째 구간을 엽니다 — 행을 재정렬하는 것은 호출자가 한 주장을 시스템이
  고쳐 쓰는 일입니다.
- 그룹 행은 밴드를 입지 않습니다: 밴드가 "데이터 행"을 말하는데 라벨은
  데이터 행이 아닙니다. 열 헤더의 조용한 대문자 레지스터를 빌리되 헤어라인은
  버립니다 — 열 헤더 아래 선은 헤더와 데이터를 가르지만, 그룹 라벨은 자기가
  여는 행들과 **함께** 있습니다.
- 유래: 위성(Slides)의 StatusAssessment가 손말이 `<table>`을 유지한 세 번째
  이유가 그룹 행 부재였습니다(`docs/TABLE_MEDIUM_CONTRACT_PROPOSAL.md`).
