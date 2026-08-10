# ListingCard 표면 제안

| Field | Value |
| --- | --- |
| Type | Plan |
| Status | 채택 · 구현 완료(shipped) |
| Owner | Design system owner |
| Last reviewed | 2026-07-24 |
| Source | 스코프 게이트 → 채택. 구현은 [`COMPONENT_WORKFLOW.md`](COMPONENT_WORKFLOW.md) 절차를 밟았다. |

커버 이미지 · 제목 · 아이콘 메타 행(기간·분류) · 상태 배지(진행중·마감)로 구성되는 **리스팅/이벤트
카드**를 정의한다. 이 문서는 처음에 "만들지 말지"를 결정하는 게이트였고, 아래 근거로 **채택**했다.
구현 산출물은 [`components/cards/ListingCard.jsx`](../components/cards/ListingCard.jsx)·
`.d.ts`·`.prompt.md`와 [`stories/CardListing.stories.jsx`](../stories/CardListing.stories.jsx)다.

## 왜 별개 컴포넌트인가 (NewsCard 확장이 아니다)

외부 참조(채용·이벤트 사이트의 카드 그리드)는 겉모습이 `NewsCard`와 닮았지만 **의미가 다르다**.

| 슬롯 | NewsCard (기사·보도) | ListingCard (모집·이벤트) |
| --- | --- | --- |
| 날짜 | 발행일(`date`/`dateTime`) | 모집·행사 **기간**(시작~종료, `meta` 행) |
| 보조 | 출처·바이라인(`source`) | **분류 태그**(직군·유형, `meta` 행) |
| 상태 | 없음 | **수명주기 상태 배지**(진행중·신청 마감) |
| 액션 | "자세히" 읽기 유도 | 항목으로 진입(카드=링크) |

`NewsCard`의 계약은 "article/press card"이며 `category`·`excerpt`·`source`·`date`는 **읽을거리의
발행 정보** 문법이다. 여기에 모집 상태·기간·분류를 얹으면 "출처"와 "모집 상태"가 같은 슬롯을 두고
경쟁하고, 소비자는 이 카드가 기사인지 이벤트인지 알 수 없게 된다 — 시각적 유사성으로 이질적 의미를
한 컴포넌트에 욱여넣는 것은 이 저장소가 가장 경계하는 실수다. 따라서 **NewsCard 확장이 아니라 별개
컴포넌트**로 만들었다.

## 왜 채택했는가 (일반 목적 DS + 권위 있는 외부 근거)

처음 이 제안은 "고정 제품 3종의 소스에서 리스팅 카드 해부가 확인되기 전까지 보류"로 닫았다. 그
판단은 `COMPONENT_WORKFLOW.md`를 **지나치게 좁게** 적용한 것이었다. 워크플로에서 제품 프런트엔드는
**커버리지 게이트**(공용 표면이 실제 제품 요구를 놓치지 않았는지 확인하는 대조군)이지 설계 **권위**가
아니다. LDS는 고정 제품 3종만을 위한 라이브러리가 아니라 **일반 목적 디자인 시스템**이며, 리스팅/
카탈로그 카드는 특정 제품이 아니라 **보편 UI 카테고리**다.

워크플로가 요구하는 설계 근거는 "제품 anatomy 복제"가 아니라 **LDS sibling + WDS + 권위 있는 외부
category reference**에서의 독립 도출이다. ListingCard는 그 세 근거를 모두 충족한다.

- **LDS sibling** — 같은 카드 계열 `NewsCard`의 커버(장식/정보성 alt 판단, `loading="lazy"`·16:9
  CLS 예약·깨진 이미지 degrade)·링크=카드·heading 계약을 그대로 이었고, 상태 표현은 신설하지 않고
  `ContentBadge`를 재사용했다.
- **권위 있는 외부 category reference** — [Material Card(supporting text + status)](https://m3.material.io/components/cards/guidelines),
  [Shopify Polaris ResourceItem/Card](https://polaris.shopify.com/components/lists/resource-item),
  이벤트·마켓 리스팅 카드의 관용 해부(커버 → 제목 → 메타 → 상태).

즉 "관제 제품에 아직 이 표면이 없다"는 사실은 **만들지 않을 이유가 아니라** 커버리지 원장에 기록할
사실일 뿐이다. 보편 카테고리를 외부 권위 근거로 도출하는 것은 워크플로가 **허용**하는 경로다.

## 소유 경계

- **DS가 소유**: 커버(장식/정보성 alt 판단은 NewsCard 선례), 제목 heading 레벨, 아이콘 메타 행의
  조판(정렬·말줄임·대비), 상태 배지의 시각·의미(재사용: `ContentBadge`), 카드=링크 계약과 그리드
  정렬의 시각·접근성.
- **제품이 소유**: 데이터, 모집 상태 계산, 기간 포맷, 필터·정렬·페이지네이션, route.
- **재사용**: 상태 배지는 신설하지 않고 `ContentBadge`(라벨 칩)를, 분류는 `meta` 아이콘 행을,
  그리드는 `Grid`/`DashboardGrid`를 조합한다.

## 의도적 분기 (NewsCard와 다른 점)

- **상태를 접근 이름에 합성** — 문자열 `status`는 `ContentBadge`로 렌더될 뿐 아니라 링크 접근 이름
  끝에 `제목. 신청 마감`으로 합성된다. NewsCard가 발행일을 이름에 넣지 않는 것과 의도적으로 다르다 —
  모집 상태는 발행일과 달리 **클릭 결정을 바꾸는 정보**여서, 링크 이름만 듣는 사용자도 열림/닫힘을
  알아야 하기 때문이다.
- **meta를 구조화된 `{icon,label}` 행으로** — 자유 슬롯이 아니라 배열 행으로 받아 아이콘 정렬·
  말줄임·대비를 컴포넌트가 소유하게 했다(목록마다 재발명 방지).

## 커버리지 원장 메모

고정 제품(**LK Web Viz**, **LK Control Full Daedeok**, **LK Portal**)은 로컬 체크아웃이 없어
소스로 리스팅 표면을 재확인하지 못했다(`unverified`). ListingCard는 제품 요구가 아니라 보편 카테고리
근거로 채택했으므로 이 미확인은 착수를 막지 않는다. 이후 제품 소스에서 "제목 + 기간 + 상태 배지"
그리드가 확인되면 커버리지 원장에 매핑을 기록한다.
