**ReactionBar** — 게시물·댓글·기사 하단의 인게이지먼트 바: 좋아요(토글) · 댓글 · 공유와 각 수. 아이콘 컨트롤을 새로 만들지 않고 `ToggleIcon`(좋아요)·`IconButton`(댓글·공유)을 조립합니다.

```jsx
<ReactionBar
  like={{ count: 12, active: liked, onToggle: setLiked }}
  comment={{ count: 3, onClick: openComments }}
  share={{ onClick: openShare }}
/>
```

## 계약

- **좋아요 = 토글** — `ToggleIcon`으로 렌더되어 `aria-pressed`로 눌림 상태를 전달합니다. 그래서 접근 이름(`label`)은 상태에 따라 바뀌지 않는 **명사**("좋아요")로 두고, 눌림/해제는 `aria-pressed`가 낭독합니다. 글리프는 눌림에서 `heart` → `heart-fill`로 바뀌고 색도 활성 토큰으로 바뀝니다. 제어형은 `like.active`, 비제어형은 `like.defaultActive`.
- **댓글·공유 = 1회 액션** — `IconButton`(ghost)으로 렌더되는 단발 액션입니다. 댓글은 보통 스레드를 열고, 공유는 공유 시트를 엽니다.
- **수는 접근 이름에 합성** — 각 컨트롤의 수는 접근 이름에 `좋아요 12개`처럼 합성되고, **눈에 보이는 숫자는 `aria-hidden`** 이라 보조기기가 한 번만 낭독합니다. `count`를 생략하면 숫자를 렌더하지 않습니다.
- **바 = `role="group"`** — 한 화면에 여러 바가 있으면 `aria-label`로 각각 이름을 주세요(어떤 게시물의 바인지 구분).
- **size** `sm · md`, **align** `start · between`(양끝 배분). **children**으로 북마크 등 추가 액션을 뒤에 덧붙입니다.
- 데이터·낙관적 업데이트·권한(비로그인 시 로그인 유도)은 제품이 소유합니다. 이 컴포넌트는 표현과 접근성만 소유합니다.

## 비교와 결정 근거

인게이지먼트 바는 보편 UI이므로 외부 category reference에서 도출했습니다 — 소셜 피드(X·LinkedIn·Facebook)의 좋아요/댓글/공유 관용, ARIA `aria-pressed` 토글 버튼 패턴. 사내 근거는 `ToggleIcon`(눌림 상태 아이콘)·`IconButton`(아이콘 단발 액션)이며, 이들을 재사용해 사이트 전반의 아이콘 컨트롤 언어를 유지합니다.

- 좋아요를 새 버튼으로 만들지 않고 `ToggleIcon`을 재사용해 `aria-pressed`·포커스·비활성 계약을 물려받습니다.
- 수를 자유 슬롯이 아니라 `count` 숫자로 받아 정렬(`tabular-nums`)·접근 이름 합성을 컴포넌트가 소유합니다.
- 좋아요·댓글·공유를 각각 **선택적**으로 두어, 공유만 있는 바·좋아요만 있는 바처럼 부분 구성도 가능합니다.
