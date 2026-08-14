# 선택형 컬렉션 필드 패턴

| Field | Value |
| --- | --- |
| Type | Cross-component pattern guide |
| Status | Current |
| Owner | Design system owner |
| Last reviewed | 2026-08-13 |

수십~100건의 후보를 검색해 여러 건 선택하고 다음 단계로 넘기는 field를 기존 데이터
컴포넌트로 조합하는 공식 규칙이다. `SearchableMultiSelect`의 chip 누적이나 화면별 bespoke
card grid는 이 규모의 권장 경로가 아니며, 새 `CollectionPicker` public component도 만들지
않는다 — `DataGrid`가 stable identity, lossless selection model, page/all-matching scope,
bulk band, 선택 수 live announcement를 이미 소유한다. field-level invalid/focus나 compact
live-count 공백이 여러 소비자에서 반복 확인될 때만 해당 API를 좁게 보강한다.

## 기본 조합

```
fieldset(named group) → DataCollectionPanel(DataToolbar + ResourceState)
  → selectable DataGrid(wide) / 제품 작성 compact list(narrow) → Pagination
```

- 조합 전체를 `fieldset`/`role="group"`으로 묶고 접근 가능한 그룹 이름을 준다. required/invalid/
  `aria-describedby`는 개별 checkbox가 아니라 이 그룹 수준에 연결한다(제품 소유).
- 스크롤 소유자는 명시한다 — `Pagination`을 쓰면 페이지가, 내부 스크롤을 쓰면 그 컨테이너가
  소유하며 둘을 겹치지 않는다.

## 선택 모델 계약

| 계약 | 소유 | 방법 |
| --- | --- | --- |
| stable identity | `DataGrid` | `getRowId` — 인덱스 기본값을 쓰지 말고 서버 ID를 준다 |
| explicit / allMatching 의미 | `DataGrid` | `selectionModel` — `{mode:'explicit', selectedIds}` 또는 `{mode:'allMatching', excludedIds}`. 서버 payload로 그대로 직렬화 가능하다 |
| 검색·필터·페이지 이동 후 선택 보존 | `DataGrid` + 제품 | controlled `selectionModel`을 단계 상태로 유지한다. explicit은 ID 기반이라 보존되고, allMatching은 필터가 바뀌면 의미가 바뀌므로 제품이 범위 재확인을 소유한다 |
| 페이지 전체 vs 검색 결과 전체 | `DataGrid` | `selectAllScope="page" \| "allMatching"` — 이름에 범위가 드러난다(현재 페이지 · 전체 결과) |
| 선택 수·전체 해제·bulk action | `DataGrid` | selection band + `bulkActions(ctx)`(`selectedCount`·`totalCount`·`clearSelection`) |
| 선택 한도·선택된 항목만 보기 | 제품 | `getRowCanSelect`로 한도 초과를 막고, selected-only 필터는 toolbar filter로 제품이 소유한다 |
| 행 checkbox 이름 | `DataGrid` | `getRowSelectionLabel`·`selectionEntityLabel` — 사람이 이해할 수 있는 이름을 준다 |
| 선택 수 live announcement | `DataGrid` | 상시 마운트된 `role="status"` 영역이 `N개 선택됨`을 낭독한다 |

## Wide/narrow 동일 선택 모델

`DataCollectionPanel`의 `layout="auto"`(767px 기준)로 wide `DataGrid`와 narrow compact
콘텐츠를 전환한다. narrow 표현은 제품이 작성하되 **같은 controlled `selectionModel`을
공유**해야 하며, 별도 선택 상태를 만들지 않는다. narrow 표현에서도 선택 수 변화는 live
announcement로 남아야 한다 — `DataGrid`를 쓰지 않는 narrow 표현이라면 제품이 `role="status"`
영역을 소유한다. chip 수십 개나 100개의 tab stop이 input 앞에 누적되는 표현은 금지한다.

## 상태 fixture 기준

검증 스토리와 제품 QA는 최소 다음 규모를 포함한다. LDS가 이미 증명한 경로와, 제품이
자기 데이터로 덮어야 하는 경로를 구분한다.

| 규모 | 검증 내용 | 현재 LDS 근거 |
| --- | --- | --- |
| 0건 | 전체 없음 · 검색 0건 · selected-only 0건을 `ResourceState`로 구분 | `DataGrid` 상호작용 스토리와 `DataCollectionPanel` 변형·상태 스토리가 loading/빈 결과/오래된 데이터를 덮는다. selected-only 0건은 제품 필터라 미포함 |
| 3건 | 기본 선택/해제와 상세 정보 표시 | `DataGrid` 개요 스토리(3행 fixture) |
| 30건 | 검색·필터·페이지를 오가며 선택 보존 | **없음.** 페이지 이동 자체는 `DataGrid` 상호작용 스토리가 덮지만, 이동 뒤 선택 보존은 증명되지 않았다 |
| 100건 | 선택 한도, 마지막 항목, 전체 선택/해제, 장문 데이터 | 부분. `DataToolbar` 개요 스토리가 `totalCount` 128로 page↔allMatching 전환, indeterminate, `N개 선택됨` live count, entity label을 증명한다. 선택 한도는 제품 소유(`getRowCanSelect`) |
| 공통 | 320px/desktop, keyboard, screen reader, loading/error+retry, 긴 한국어 summary와 날짜의 비교 가능성 | `DataGrid` 반응형(320px 고정 열) 스토리와 위 상태 스토리 |

**wide/narrow 동일 selection 모델은 아직 증명되지 않았다.** `DataCollectionPanel`은 layout만
소유하고 selection을 소유하지 않으므로(패널 API에 selection prop이 없다), wide `DataGrid`와
narrow compact 콘텐츠가 하나의 controlled `selectionModel`을 공유하는 경로는 현재 제품이
조립하고 검증해야 한다. 두 번째 소비자에서 같은 조립이 반복 확인되면 그때 이 경로를 덮는
좁은 스토리 또는 API 보강을 검토한다 — 그 전에는 `CollectionPicker`를 만들지 않는다는 위
결정을 유지한다.

## 외부 근거

- [Carbon Data Table](https://carbondesignsystem.com/components/data-table/usage/) — selection과
  pagination을 별도 기능으로 두고 toolbar와 조합한다.
- [WAI-ARIA APG Grid](https://www.w3.org/WAI/ARIA/apg/patterns/grid/) — composite grid를 쓰면
  focus 이동을 구현자가 명시적으로 관리해야 한다.

## 관련 계약

`components/data/DataGrid.prompt.md`, `components/data/DataCollectionPanel.prompt.md`,
`components/data/DataToolbar.prompt.md`, `components/data/ResourceState.prompt.md`,
`components/navigation/Pagination.prompt.md`가 각 컴포넌트의 계약을 소유한다.
다단계 플로우 안에서의 위치는 [`GUIDED_CREATION_PATTERN.md`](GUIDED_CREATION_PATTERN.md),
선택 결과의 확인은 [`CHECK_ANSWERS_PATTERN.md`](CHECK_ANSWERS_PATTERN.md)를 따른다.
