**ConversationList** — 사람이 만든 대화·세션 목록을 날짜 묶음, 링크 행, 형제 「더 보기」 메뉴, 현재 항목 표시로 보여 주는 탐색 목록.

Classification: **LK Product Extension · Communication**. `MessageFeed`·`ConversationMessage`와 같은 계열이며 `ShellPanel`의 스크롤 구역에 두는 것이 기본입니다. 데이터, 라우트, 날짜 계산과 지역화, 이름 바꾸기·삭제 실행은 제품이 소유합니다.

```jsx
<ConversationList
  groups={[{ id: 'today', label: '오늘', items: [{ id: 'c1', title: '장비 점검 로그 요약', href: '/chat/c1' }] }]}
  currentId={conversationId}
  itemActions={[{ id: 'rename', label: '이름 바꾸기' }, { id: 'divider', divider: true }, { id: 'delete', label: '삭제', danger: true }]}
  onItemAction={(actionId, item) => (actionId === 'delete' ? confirmDelete(item) : openRename(item))}
  hasMore={hasNextPage}
  onLoadMore={fetchNextPage}
/>
```

## 구조

```
nav[aria-labelledby=panel-title]
  > section[aria-labelledby=g-today]
    > h3#g-today 「오늘」
    > ul[role=list]
      > li[data-current]
        > a[href][aria-current]
        + button[aria-haspopup=menu] 「{제목} 더 보기」
```

- 링크와 「더 보기」 버튼은 **형제**입니다. `ListCell`처럼 `role="button"` 행 안에 trailing 버튼을 넣는 중첩 상호작용을 만들지 않습니다(axe `nested-interactive`).
- `ShellPanel` 안에서는 nav 이름을 생략하면 패널 제목을 `aria-labelledby`로 씁니다. 단독 사용은 `aria-label`을 줍니다.
- 묶음 제목은 `headingLevel`(기본 3)이며 SideNav 섹션 제목과 같은 문장형 13px medium, subtle 잉크입니다. 묶음 계산과 문구는 제품이 넘깁니다.

## Props

- `groups`, `currentId`, `headingLevel` — 묶음과 현재 대화, 묶음 제목 단계.
- `renderLink` — 링크를 router link로 치환합니다. DS가 만든 `aria-current`, class, `href`를 그대로 넘깁니다.
- `itemActions`, `onItemAction`, `moreLabel` — 행 메뉴 항목(배열 또는 항목별 함수), 실행 요청, 「더 보기」 버튼 이름(기본 `{제목} 더 보기`).
- `loading`, `error`, `onRetry`, `retryLabel`, `emptyLabel` — 첫 로딩·오류·빈 목록 상태.
- `hasMore`, `onLoadMore`, `loadingMore`, `loadMoreLabel` — 목록 끝 「더 불러오기」. `loadingMore` 동안 버튼을 비활성화하고 목록을 `aria-busy`로 둡니다.
- `aria-label`, `aria-labelledby` — nav 이름. ShellPanel 안에서는 생략하면 패널 제목을 씁니다.

## 행과 상태

- 행 높이 36px(`--component-conversation-list-row-height`, SideNav 자식 행과 같음), 한 줄 제목과 말줄임. 전체 제목은 링크의 접근 이름에 남고 `title` 툴팁은 두지 않습니다.
- hover와 현재 항목은 행 전체(링크 + 버튼)에 무채색 채움을 주며 `li`가 `:hover`, `[data-current]`로 소유합니다. 현재 항목은 `aria-current="page"`, `cool-neutral-96` 채움, `label-normal`, 굵기입니다. 채움 대비가 낮아(1.23:1) 굵기를 비색상 단서로 함께 씁니다(WCAG 1.4.1). forced-colors에서는 현재 링크가 `SelectedItem`을 받습니다.
- 「더 보기」는 **늘 DOM에 있고** 포인터 hover 환경에서는 행 hover, focus-within, 현재 행, 메뉴 열림일 때만 보입니다. `@media (hover: none)`에서는 늘 보입니다. 버튼 이름은 `{제목} 더 보기`, 조작 영역은 24px 이상입니다.
- 메뉴는 `DropdownMenu`입니다. 항목과 실행은 제품이 소유하고, 삭제 확인은 제품의 `ConfirmDialog`입니다. 삭제 뒤 focus는 제품이 다음 행(없으면 이전 행, 그것도 없으면 「새 질문」)으로 옮깁니다.
- 키보드: Tab 순서는 링크 → 더 보기 → 다음 링크입니다. 행 사이 방향키 이동(roving)은 v1에 넣지 않았습니다(L-S7b).
- 상태: 첫 `loading`은 Skeleton 행과 `aria-busy`, 빈 목록은 한 줄 문장(`emptyLabel`), `error`는 축약 `ResourceState`와 선택 `onRetry`, 목록 끝은 `hasMore` + `onLoadMore`의 「더 불러오기」 TextButton입니다. 무한 스크롤은 쓰지 않습니다.

## 내부 시각 차이 점검

- `ListCell selectedPresentation="tint"`의 「지금 열린 항목」 무채색 문법을 계승하되, 단계는 SideNav neutral과 같은 opaque `cool-neutral` 단계를 써서 ShellPanel·NavRail과 한 셸로 읽히게 했습니다.
- 행 radius, inset 포커스 링(`outline-offset: -2px`), 굵기 규칙은 SideNav 행과 같습니다. 아이콘은 두지 않습니다(제목만으로 스캔되는 목록).

## 외부 기준과 적용 결론

- [Fluent 2 Nav usage](https://fluent2.microsoft.design/components/web/react/core/nav/usage) — hover나 focus에서만 보이는 동작도 늘 DOM에 있어야 하고 컨텍스트 메뉴로도 제공합니다. 「더 보기」를 늘 렌더하고 opacity로만 숨기는 근거입니다.
- [WAI-ARIA APG Landmark Regions](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/) — nav를 보이는 제목으로 이름 붙입니다.
- [MDN aria-current](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-current) — 집합에서 하나만 current입니다.
- (제품 참고, 권위 근거 아님) ChatGPT·Claude 대화 목록 — 날짜 묶음, 링크 행, hover 시 행 동작. 아이콘 전용 동작 노출 방식만 참고했습니다.

의도적 제외: 행 안 이름 편집(v1은 메뉴에서 대화상자), 방향키 roving, 무한 스크롤, 고정/보관 상태 아이콘, 날짜 계산.

## LK 제품 workflow coverage

- **LK Portal** `438c131e`(dev, 2026-10-09) — 질문 영역 대화 목록. supported by new contract(미적용). 대화 URL, 이름 바꾸기 API, 목록 커서는 Portal gap입니다.
- **LK Control Full Daedeok** `d8c215fd` — 대화·세션 목록 없음, not applicable.
- **LK Web Viz** `7e535341`(unverified pin) — 대화 목록 없음, not applicable.
