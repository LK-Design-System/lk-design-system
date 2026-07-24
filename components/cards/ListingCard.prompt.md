**ListingCard** — 사용자가 훑어보고 들어가는 목록·카탈로그 항목 카드: 커버 · 제목 · 아이콘 메타 행(기간·장소·분류) · 수명주기 상태 배지(진행중·신청 마감). 이벤트·강좌·모집·리소스 목록에.

```jsx
<ListingCard
  image="/covers/global-hire.webp"
  title="글로벌 인재 채용 프로모션"
  meta={[
    { icon: 'calendar', label: '2026.06.08 ~ 2026.07.31 · 온라인' },
    { icon: 'tag', label: '이벤트, HR, 취업/이직' },
  ]}
  status="진행중" statusTone="positive"
  href="/events/global-hire"
/>
```

## 계약

- **NewsCard가 아니다** — NewsCard는 기사·보도 카드로 `date`는 발행일, `source`는 바이라인입니다. 리스팅의 날짜는 모집·행사 **기간**, 배지는 **수명주기 상태**입니다. 시각적으로 닮았다고 모집 상태·기간을 NewsCard에 넣으면 한 컴포넌트가 두 의미를 갖게 되므로, 의미가 다른 **별개 컴포넌트**입니다.
- **image / imageAlt** — 커버는 기본 장식(`alt=""`)이며 제목이 이름을 소유합니다. 정보성 사진은 `imageAlt`를 주면 링크 접근 이름에 `제목. imageAlt`로 합성됩니다. 커버는 `loading="lazy"`·`decoding="async"`로 지연 로드되고 16:9 래퍼가 로드 전 레이아웃을 예약(CLS 방지), 로드 실패 시 중립 패널로 degrade됩니다(NewsCard 선례).
- **meta** — `{ icon, label }` 배열의 아이콘 메타 행(기간·장소·분류). 아이콘은 `aria-hidden` 장식이고 텍스트가 의미를 전달하며 한 줄로 말줄임됩니다.
- **status / statusTone** — 수명주기 상태입니다. 문자열이면 `ContentBadge`로 렌더하고 **링크 접근 이름 끝에 합성**해 낭독합니다 — 진행중·신청 마감처럼 열림/닫힘이 클릭 결정을 바꾸므로 링크 이름만 듣는 사용자도 상태를 알아야 하기 때문입니다. 직접 만든 배지 노드를 넘기면 그대로 렌더하되 이름 합성은 하지 않습니다.
- **카드 = 링크** — 카드 전체가 하나의 `a`이므로 **안에 버튼·링크 같은 포커스 가능한 요소를 두지 마세요**(중첩 인터랙티브 금지). 링크의 접근 이름은 `제목`(+정보성 커버 alt +상태)이며 메타 행은 보조 시각 정보입니다. 다른 이름이 필요하면 `aria-label`로 덮어씁니다.
- **headingLevel** — 제목은 실제 heading(기본 `h3`)으로 렌더되고 목록 문서 계층에 맞춥니다(WCAG 1.3.1). 레벨은 건너뛰지 않습니다.
- **포커스** — 키보드 포커스에서도 호버와 같은 리프트/줌 어포던스를 재현합니다(포커스 링은 `tokens/focus.css` 전역 규칙).
- 여러 장은 `Grid`/`DashboardGrid`로 배치합니다. 필터·정렬·페이지네이션·상태 계산은 제품이 소유합니다.

## 비교와 결정 근거

리스팅/카탈로그 카드는 보편 UI 카테고리이므로 외부 category reference에서 독립적으로 도출했습니다 — [Material Card(supporting text + actions)](https://m3.material.io/components/cards/guidelines), [Shopify Polaris ResourceItem/Card](https://polaris.shopify.com/components/lists/resource-item), 이벤트·마켓 리스팅 카드의 관용 해부(커버 → 제목 → 메타 → 상태). 사내 근거는 같은 카드 계열(`NewsCard`의 커버·링크·heading 계약)과 상태 표현의 `ContentBadge`입니다.

- 상태를 신설 배지로 만들지 않고 `ContentBadge`를 재사용해 사이트 전반의 배지 언어를 유지합니다.
- 메타를 자유 슬롯이 아니라 `{icon,label}` 행으로 구조화한 것은 아이콘 정렬·말줄임·대비를 컴포넌트가 소유해 목록마다 재발명하지 않게 하기 위함입니다.
- 상태를 접근 이름에 합성하는 것은 NewsCard(발행일을 이름에 넣지 않음)와 의도적으로 다릅니다 — 모집 상태는 발행일과 달리 클릭 결정을 바꾸는 정보이기 때문입니다.
