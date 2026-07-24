**FeedCard** — 소셜 피드 게시물 카드: 작성자 헤더(아바타 · 이름 · 출처·시간 · 팔로우 · ⋮) · 본문(더 보기로 접힘) · 커버(선택) · 인게이지먼트 바(좋아요·댓글·공유).

```jsx
<FeedCard
  author={{ name: '글로벌 리더십과 HR', variant: 'company', href: '/teams/hr' }}
  meta="원티드 뉴스 · 6시간 전"
  following={false}
  onFollowToggle={toggleFollow}
  menuItems={[{ label: '신고', danger: true, onClick: report }]}
  like={{ count: 12, active: liked, onToggle: setLiked }}
  comment={{ count: 3, onClick: openComments }}
  share={{ onClick: openShare }}
>
  {postBody}
</FeedCard>
```

## 계약

- **카드 = 링크가 아니다** — `NewsCard`·`ListingCard`는 카드 전체가 하나의 `a`지만, 피드 게시물은 작성자 링크·팔로우·오버플로·좋아요·댓글·공유·더 보기까지 **여러 컨트롤**을 담습니다. 그래서 FeedCard는 `article` 영역이며 각 컨트롤이 독립 포커스 스톱입니다. 카드 전체를 링크로 만들면 중첩 인터랙티브가 되어 잘못됩니다.
- **article 이름** — `article`은 `aria-label`(기본 `{author.name}님의 게시물`)로 이름을 가져 랜드마크 이동에서 어떤 게시물인지 구분됩니다. 필요하면 `aria-label`로 덮어씁니다.
- **작성자 헤더는 `ListCell`을 재사용** — leading 아바타(`Avatar`) + title 이름 + description(출처·시간) + trailing(팔로우 `Button`·오버플로 `DropdownMenu`). 새 헤더 컴포넌트를 만들지 않습니다. `headingLevel`을 주면 이름이 heading이 되어 피드 문서 아웃라인을 만들고, `author.href`면 이름이 프로필 링크가 되며, `author.badge`(인증 체크·"1촌" 등)는 이름 뒤에 인라인으로 붙습니다.
- **타임스탬프는 `<time>`** — 보조 줄은 `meta`(출처)와 시간으로 구성됩니다. `time`(상대 라벨 "6시간 전")과 `datetime`(ISO 값)을 주면 `<time datetime>`으로 렌더되어, 보이는 라벨은 상대적이어도 보조기기·크롤러는 정확한 시각을 읽습니다. `meta`와 `time`을 함께 주면 `출처 · 시간`으로 합쳐지고, `meta` 하나에 전체 문자열을 넣던 기존 사용법도 그대로 동작합니다.
- **본문은 `ExpandableText`** — `clamp` 줄로 접히고 "더 보기"로 펼칩니다(`clamp={false}`면 전체 렌더). 전체 텍스트는 항상 DOM에 있어 스크린리더가 전문을 읽습니다.
- **커버(`cover` / `coverAlt`)** — `cover` 이미지는 16:9로 `loading="lazy"`·`decoding="async"` 지연 로드되고 로드 전 레이아웃을 예약합니다(NewsCard 선례). `coverAlt`가 비면 장식으로 처리됩니다.
- **인게이지먼트 바는 `ReactionBar`** — `like`(토글)·`comment`·`share`를 그대로 전달합니다. 각 수는 컨트롤 접근 이름에 합성됩니다.
- **팔로우 버튼** — `following`이나 `onFollowToggle` 중 하나라도 주면 나타납니다. `followLabel`로 라벨을 덮어쓰며 기본값은 `following ? "팔로잉" : "팔로우"`. 오버플로(⋮) 트리거의 접근 라벨은 `menuLabel`(기본 "게시물 옵션")이며, 본문 펼치기 "더 보기"와 접근 이름이 겹치지 않도록 일부러 구분했습니다.
- **제품이 소유**: 게시물 데이터, 팔로우·좋아요 상태와 낙관적 업데이트, 권한(비로그인 유도), 정렬·페이지네이션, route. FeedCard는 게시물 해부와 영역 접근성만 소유합니다.

## 비교와 결정 근거

소셜 피드 게시물 카드는 보편 UI 카테고리이므로 외부 category reference에서 도출했습니다 — X·LinkedIn·Facebook 피드의 게시물 해부(작성자 헤더 → 본문 → 미디어 → 인게이지먼트), ARIA `article` 영역 관례. 사내 근거는 카드 계열(`NewsCard`의 커버·heading 계약), 행 primitive `ListCell`, 그리고 이번에 함께 신설한 `ExpandableText`·`ReactionBar`입니다.

- **`NewsCard`가 아니다** — NewsCard는 카드=링크의 **기사** 카드입니다(작성자 헤더·좋아요·댓글·공유 없음). 피드 게시물은 작성자 상호작용과 인게이지먼트를 가진 **영역**이라 의미가 다른 별개 컴포넌트입니다.
- 헤더·본문·인게이지먼트를 각각 `ListCell`·`ExpandableText`·`ReactionBar`로 **조립**해 각 조각을 다른 표면에서도 재사용하고, 한 곳에서 조판·접근성을 소유하게 했습니다.
- **여러 장 배치** — 기본은 일반 리스트(`<ul>`/`<li>` 또는 이름 붙인 `<section aria-label>`)나 `Grid`로 나열합니다. `role="feed"`(WAI-ARIA APG)는 각 `article`의 `aria-posinset`·`aria-setsize`와 화살표 포커스 관리·지연 로딩 계약을 요구하므로, **무한 스크롤 피드에서 그 계약을 직접 구현할 때만** 쓰세요. FeedCard는 `article` 하나만 제공하고 그 계약은 제품이 소유합니다. 로딩·정렬·페이지네이션도 제품이 소유합니다.
