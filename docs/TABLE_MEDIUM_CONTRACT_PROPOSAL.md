# Table 매체 계약 제안 — 밴딩과 재지정 가능한 밀도

| Field | Value |
| --- | --- |
| Type | Plan |
| Status | Adopted — 2026-08-17 main 반영(banded + --lk-table-* 재지정 훅, 제품 기본 바이트 동일). 릴리스 후 위성 손말이 철거 |
| Owner | Design system owner |
| Last reviewed | 2026-08-17 |
| Source | 소비처: `lk-design-system-slides/src/components/editorial/StatusAssessment.jsx` · 대상: `components/data/Table`(+`table-cell-styles`) |

Product `Table`에 두 가지를 더하자는 제안이다: **행 밴딩**과 **매체가 재지정
가능한 밀도·타입**. 목적은 위성이 표를 손으로 마는 일을 끝내는 것이다.

## 배경 — 위성에서 실측으로 도착한 표 문법

Slides가 투영 매체 개편(2026-08-16)에서 표를 전폭으로 펴면서 두 규칙이
실측으로 확정됐다:

1. **열 의도**: 라벨 열이 잉여 폭을 흡수하고, 측정 열(숫자·짧은 문구·판정)은
   내용 폭으로 우측 레일에 묶인다. 비교되는 값은 붙어 있어야 한다.
2. **행 밴딩**: 전폭 행은 헤어라인만으로 라벨→측정값의 시선을 잇지 못한다
   (행 내부 500px 공백 실측). 데이터 행 전부에 램프의 가장 조용한
   fill(`fill-alternative`)을 깔면 밴드가 행을 잇는다. 지브라는 행이 적을 때
   강조로 오독되어 기각 — 색은 이탈만 표시한다는 원칙과 충돌한다.

1은 Table이 이미 표현할 수 있다(`width`/`truncate`/`align`). **2는 표현할 수
없다** — 밴딩 prop이 없다. 그래서 StatusAssessment는 Table을 우회해 `<table>`을
직접 말고 있고, 오늘의 열 정책·밴딩도 그 손말이 위에 다시 발명됐다.
KeyFigure가 숫자를 Stat에 위임하는 시스템에서("Nothing about a number is
re-implemented here") 표만 예외로 남아 있는 상태다.

## 위임을 막는 두 번째 장벽 — 밀도·타입이 제품 고정

Table의 셀 패딩 기본값은 리터럴("14px 16px")이고 타입도 제품 램프 직결이다.
Slides·Editorial은 매체 seam(`--editorial-cell-pad-*`, `--editorial-note-*`)을
경유해야 하므로, 밴딩이 생겨도 밀도·타입이 재지정 불가면 위임은 불가능하다.

## 제안

1. **`banded?: boolean`** (기본 false): 데이터 행에 `fill-alternative` 밴드.
   hover 워시와 공존(워시가 밴드 위에 얹힘). 로보틱스 대시보드의 넓은 표도
   같은 문법의 수혜자다.
2. **셀 스타일의 변수 경유**: `table-cell-styles`의 패딩·타입이 컴포넌트
   토큰(`--lk-table-cell-pad-*`, `--lk-table-cell-type-*` 등, 기본값 = 현행
   리터럴)을 경유하게 한다. 제품 화면은 변화 0이고, 매체는 자기 스코프에서
   재지정한다 — Slides의 타입 seam과 같은 구조를 Table이 자기 층에서 갖는
   것이다.
3. 채택 시 위성 마이그레이션: StatusAssessment가 `<Table banded rowHeaderKey
   getRowProps …>` 위임으로 복귀하고 손말이 `<table>`을 지운다. 이 문서
   Status를 Adopted로 올린다.

## 기각해도 되는 조건

Timeline orientation과 같은 판단 축이다: 표 시각의 복제가 위성에 서
있는 동안 유지 비용이 재개 트리거다. 다만 이쪽은 2(변수 경유)가 없으면
1(밴딩)만으로는 위임이 성립하지 않으므로, 부분 채택은 복제를 못 지운다.

## 후속 — 그룹 행 (2026-08-17)

밴딩(1)과 변수 경유(2)만으로도 위성의 복제는 지워지지 않았다: StatusAssessment가
손말이 `<table>`을 유지한 **세 번째 이유가 그룹 행 부재**였다. `groupKey`를
추가했다 — 같은 값의 **연속 구간**마다 `<th scope="colgroup">` 헤더가 한 번
열리고, 흩어진 같은 값은 모으지 않는다(호출자의 행 순서가 곧 보고의 순서라
재정렬은 호출자의 주장을 고쳐 쓰는 일이다). 그룹 행은 밴드를 입지 않는다 —
밴드가 "데이터 행"을 말하는데 라벨은 데이터 행이 아니다.

이로써 위성 마이그레이션의 업스트림 선행 조건이 모두 충족됐다. 실제 철거는
이 계약이 담긴 코어 릴리스를 위성이 소비한 뒤다.
