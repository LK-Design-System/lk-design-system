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

검증 스토리와 제품 QA는 최소 다음 규모를 포함한다.

| 규모 | 검증 내용 |
| --- | --- |
| 0건 | 전체 없음 · 검색 0건 · selected-only 0건을 `ResourceState`로 구분 |
| 3건 | 기본 선택/해제와 상세 정보 표시 |
| 30건 | 검색·필터·3개 페이지를 오가며 선택 보존 |
| 100건 | 선택 한도, 마지막 항목, 전체 선택/해제, 장문 데이터 |
| 공통 | 320px/desktop, keyboard, screen reader, loading/error+retry, 긴 한국어 summary와 날짜의 비교 가능성 |

기존 `DataGrid` 128-result selection 스토리와 `DataCollectionPanel`의 normal/320px·
loading/empty/stale 스토리가 이 경로의 검증 근거다.

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
