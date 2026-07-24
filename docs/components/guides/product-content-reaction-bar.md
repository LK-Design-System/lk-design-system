# Reaction Bar

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Content |
| Owner | `ReactionBar` |
| Storybook | `LDS Product/Content/Reaction Bar` |
| Source | `../component-content.json#product-content-reaction-bar` |

소셜 게시물이나 기사 하단의 인게이지먼트 액션에 적합합니다. 저장·전송 같은 단일 확정 액션이나 폼 제출에는 이 바 대신 버튼을 사용하세요.

## 사용 판단

### 사용

- 소셜 게시물이나 기사 하단의 인게이지먼트 액션에 적합합니다. 저장·전송 같은 단일 확정 액션이나 폼 제출에는 이 바 대신 버튼을 사용하세요.
- 데이터·낙관적 업데이트·권한(비로그인 시 로그인 유도)은 제품이 소유합니다. 이 컴포넌트는 표현과 접근성만 소유합니다.
- 좋아요·댓글·공유를 각각 선택적으로 두어, 공유만 있는 바·좋아요만 있는 바처럼 부분 구성도 가능합니다.
- - 맨 아이콘 (감싸지 않음) — 컨트롤은 쉼 상태에서 배경·테두리가 없고 글리프만 보입니다. 호버/포인터 누름에서만 옅은 원형 배경이 잠깐 뜹니다. 툴바용 아이콘 버튼 프리미티브는 각 글리프를 칩/원으로 감싸므로, 피드 인게이지먼트에는 쓰지 않고 맨 버튼으로 렌더합니다. 키보드 포커스·활성화와 :focus-visible 링은 native button에서 옵니다. - 좋아요 = 토글 — aria-pressed로 눌림 상태를 전달합니다. 접근 이름(label)은 상태에 따라 바뀌지 않는 명사("좋아요")로 두고, 눌림/해제는 aria-pressed가 낭독합니다. 글리….

### 사용하지 않음

- 수는 접근 이름에 합성 — 각 컨트롤의 수는 접근 이름에 좋아요 12개처럼 합성되고, 눈에 보이는 숫자는 aria-hidden 이라 보조기기가 한 번만 낭독합니다. count를 생략하면 숫자를 렌더하지 않습니다.
- - 맨 아이콘 (감싸지 않음) — 컨트롤은 쉼 상태에서 배경·테두리가 없고 글리프만 보입니다. 호버/포인터 누름에서만 옅은 원형 배경이 잠깐 뜹니다. 툴바용 아이콘 버튼 프리미티브는 각 글리프를 칩/원으로 감싸므로, 피드 인게이지먼트에는 쓰지 않고 맨 버튼으로 렌더합니다. 키보드 포커스·활성화와 :focus-visible 링은 native button에서 옵니다. - 좋아요 = 토글 — aria-pressed로 눌림 상태를 전달합니다. 접근 이름(label)은 상태에 따라 바뀌지 않는 명사("좋아요")로 두고, 눌림/해제는 aria-pressed가 낭독합니다. 글리….
- Reaction Bar가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | ReactionBar의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Like | 좋아요 토글(선택). 생략하면 렌더되지 않습니다. |
| Comment | 댓글 액션(선택). |
| Share | 공유 액션(선택). |
| Align | 정렬. start는 왼쪽 정렬, between은 양끝 배분. @default "start" |
| Children | 추가 액션(북마크 등)을 뒤에 덧붙입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `like` | `ReactionLike` | No | 좋아요 토글(선택). 생략하면 렌더되지 않습니다. |
| `comment` | `ReactionAction` | No | 댓글 액션(선택). |
| `share` | `ReactionAction` | No | 공유 액션(선택). |
| `size` | `'sm' \| 'md'` | No | 컨트롤 크기. @default "md" |
| `align` | `'start' \| 'between'` | No | 정렬. start는 왼쪽 정렬, between은 양끝 배분. @default "start" |
| `formatCount` | `(count: number) = React.ReactNode` | No | 눈에 보이는 수의 표기 방식. 기본은 한국식 축약(1240 → "1.2천", 12800 → "1.2만"). 접근 이름에는 축약 없이 정확한 수가 들어갑니다. (n) = String(n)로 끄거나 K/M 포맷터로 바꿀 수 있습니다. |
| `children` | `React.ReactNode` | No | 추가 액션(북마크 등)을 뒤에 덧붙입니다. |

## States

| State | Contract |
| --- | --- |
| 변형·상태 · 부분 구성과 눌린 좋아요 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 반응형 · 320px | responsive 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- 맨 아이콘 (감싸지 않음) — 컨트롤은 쉼 상태에서 배경·테두리가 없고 글리프만 보입니다. 호버/포인터 누름에서만 옅은 원형 배경이 잠깐 뜹니다. 툴바용 아이콘 버튼 프리미티브는 각 글리프를 칩/원으로 감싸므로, 피드 인게이지먼트에는 쓰지 않고 맨 버튼으로 렌더합니다. 키보드 포커스·활성화와 :focus-visible 링은 native button에서 옵니다.
- 좋아요 = 토글 — aria-pressed로 눌림 상태를 전달합니다. 접근 이름(label)은 상태에 따라 바뀌지 않는 명사("좋아요")로 두고, 눌림/해제는 aria-pressed가 낭독합니다. 글리프는 눌림에서 heart → heart-fill로 바뀌고 색이 accent로 바뀝니다(감싸는 상자 없음). 제어형은 like.active, 비제어형은 like.defaultActive.
- 댓글·공유 = 1회 액션 — 단발 액션입니다. 댓글은 보통 스레드를 열고, 공유는 공유 시트를 엽니다.
- 의도적으로 아이콘 버튼 프리미티브를 쓰지 않음 — X·LinkedIn·Facebook의 인게이지먼트 아이콘은 배경·테두리로 감싸지 않습니다. 툴바용 ToggleIcon·IconButton은 각 글리프를 칩/원으로 감싸 이 관용과 어긋나므로, 여기서는 맨 button으로 렌더하고 aria-pressed·포커스·타깃 크기(24px+) 계약을 직접 소유합니다.
- 수를 자유 슬롯이 아니라 count 숫자로 받아 정렬(tabular-nums)·접근 이름 합성을 컴포넌트가 소유합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 댓글·공유 = 1회 액션 — 단발 액션입니다. 댓글은 보통 스레드를 열고, 공유는 공유 시트를 엽니다. |
| 명시 규칙 2 | 수는 접근 이름에 합성 — 각 컨트롤의 수는 접근 이름에 좋아요 12개처럼 합성되고, 눈에 보이는 숫자는 aria-hidden 이라 보조기기가 한 번만 낭독합니다. count를 생략하면 숫자를 렌더하지 않습니다. |
| 명시 규칙 3 | 큰 수 축약 — 눈에 보이는 수는 formatCount로 한국식 축약합니다(1240 → "1.2천", 12800 → "1.2만"). 단위를 넘지 않게 내림하고(9999 → "9.9천"), 접근 이름에는 축약 없이 정확한 수가 들어가 스크린리더는 정확한 값을 듣습니다. formatCount={(n) = String(n)}로 끄거나 K/M 포맷터로 교체할 수 있습니다. |
| 명시 규칙 4 | 의도적으로 아이콘 버튼 프리미티브를 쓰지 않음 — X·LinkedIn·Facebook의 인게이지먼트 아이콘은 배경·테두리로 감싸지 않습니다. 툴바용 ToggleIcon·IconButton은 각 글리프를 칩/원으로 감싸 이 관용과 어긋나므로, 여기서는 맨 button으로 렌더하고 aria-pressed·포커스·타깃 크기(24px+) 계약을 직접 소유합니다. |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- 좋아요 = 토글 — aria-pressed로 눌림 상태를 전달합니다. 접근 이름(label)은 상태에 따라 바뀌지 않는 명사("좋아요")로 두고, 눌림/해제는 aria-pressed가 낭독합니다. 글리프는 눌림에서 heart → heart-fill로 바뀌고 색이 accent로 바뀝니다(감싸는 상자 없음). 제어형은 like.active, 비제어형은 like.defaultActive.
- 수는 접근 이름에 합성 — 각 컨트롤의 수는 접근 이름에 좋아요 12개처럼 합성되고, 눈에 보이는 숫자는 aria-hidden 이라 보조기기가 한 번만 낭독합니다. count를 생략하면 숫자를 렌더하지 않습니다.
- 큰 수 축약 — 눈에 보이는 수는 formatCount로 한국식 축약합니다(1240 → "1.2천", 12800 → "1.2만"). 단위를 넘지 않게 내림하고(9999 → "9.9천"), 접근 이름에는 축약 없이 정확한 수가 들어가 스크린리더는 정확한 값을 듣습니다. formatCount={(n) = String(n)}로 끄거나 K/M 포맷터로 교체할 수 있습니다.
- 바 = role="group" — 한 화면에 여러 바가 있으면 aria-label로 각각 이름을 주세요(어떤 게시물의 바인지 구분).

## Accessibility

- 맨 아이콘 (감싸지 않음) — 컨트롤은 쉼 상태에서 배경·테두리가 없고 글리프만 보입니다. 호버/포인터 누름에서만 옅은 원형 배경이 잠깐 뜹니다. 툴바용 아이콘 버튼 프리미티브는 각 글리프를 칩/원으로 감싸므로, 피드 인게이지먼트에는 쓰지 않고 맨 버튼으로 렌더합니다. 키보드 포커스·활성화와 :focus-visible 링은 native button에서 옵니다.
- 좋아요 = 토글 — aria-pressed로 눌림 상태를 전달합니다. 접근 이름(label)은 상태에 따라 바뀌지 않는 명사("좋아요")로 두고, 눌림/해제는 aria-pressed가 낭독합니다. 글리프는 눌림에서 heart → heart-fill로 바뀌고 색이 accent로 바뀝니다(감싸는 상자 없음). 제어형은 like.active, 비제어형은 like.defaultActive.
- 수는 접근 이름에 합성 — 각 컨트롤의 수는 접근 이름에 좋아요 12개처럼 합성되고, 눈에 보이는 숫자는 aria-hidden 이라 보조기기가 한 번만 낭독합니다. count를 생략하면 숫자를 렌더하지 않습니다.
- 바 = role="group" — 한 화면에 여러 바가 있으면 aria-label로 각각 이름을 주세요(어떤 게시물의 바인지 구분).
- 데이터·낙관적 업데이트·권한(비로그인 시 로그인 유도)은 제품이 소유합니다. 이 컴포넌트는 표현과 접근성만 소유합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | 데이터·낙관적 업데이트·권한(비로그인 시 로그인 유도)은 제품이 소유합니다. 이 컴포넌트는 표현과 접근성만 소유합니다. |
| Don't | 수는 접근 이름에 합성 — 각 컨트롤의 수는 접근 이름에 좋아요 12개처럼 합성되고, 눈에 보이는 숫자는 aria-hidden 이라 보조기기가 한 번만 낭독합니다. count를 생략하면 숫자를 렌더하지 않습니다. |
| Do | 좋아요·댓글·공유를 각각 선택적으로 두어, 공유만 있는 바·좋아요만 있는 바처럼 부분 구성도 가능합니다. |
| Don't | - 맨 아이콘 (감싸지 않음) — 컨트롤은 쉼 상태에서 배경·테두리가 없고 글리프만 보입니다. 호버/포인터 누름에서만 옅은 원형 배경이 잠깐 뜹니다. 툴바용 아이콘 버튼 프리미티브는 각 글리프를 칩/원으로 감싸므로, 피드 인게이지먼트에는 쓰지 않고 맨 버튼으로 렌더합니다. 키보드 포커스·활성화와 :focus-visible 링은 native button에서 옵니다. - 좋아요 = 토글 — aria-pressed로 눌림 상태를 전달합니다. 접근 이름(label)은 상태에 따라 바뀌지 않는 명사("좋아요")로 두고, 눌림/해제는 aria-pressed가 낭독합니다. 글리…. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 ReactionBar의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ContentEditor` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ExpandableText` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `LogViewer` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ReorderList` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `SourceDisclosure` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `StatList` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<ReactionBar
  like={{ count: 12, active: liked, onToggle: setLiked }}
  comment={{ count: 3, onClick: openComments }}
  share={{ onClick: openShare }}
/>
```

## Tokens and API

### Tokens

- `--caption1-size`
- `--color-semantic-fill-normal`
- `--color-semantic-label-alternative`
- `--color-semantic-primary-normal`
- `--dur-fast`
- `--ease-out`
- `--fw-medium`
- `--radius-full`
- `--space-1`
- `--space-2`

### Source contracts

- `components/content/ReactionBar.jsx`
- `components/content/ReactionBar.d.ts`
- `components/content/ReactionBar.prompt.md`
- `stories/ContentReactionBar.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- ReactionBar prompt contract: `components/content/ReactionBar.prompt.md`
- Storybook implementation evidence: `stories/ContentReactionBar.stories.jsx`
