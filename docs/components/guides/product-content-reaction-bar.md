# Reaction Bar

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Content |
| Owner | `ReactionBar` |
| Storybook | `LDS Product/Content/Reaction Bar` |
| Source | `../component-content.json#product-content-reaction-bar` |

소셜 게시물이나 기사 하단의 인게이지먼트 액션에 적합합니다. 저장·전송 같은 단일 확정 액션이나 폼 제출에는 이 바 대신 버튼을 사용하세요.

## Anatomy

| Part | Contract |
| --- | --- |
| like | 좋아요 토글(선택). 생략하면 렌더되지 않습니다. |
| comment | 댓글 액션(선택). |
| share | 공유 액션(선택). |
| align | 정렬. start는 왼쪽 정렬, between은 양끝 배분. @default "start" |
| children | 추가 액션(북마크 등)을 뒤에 덧붙입니다. |

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

## Behavior and interaction

- 좋아요·댓글·공유를 각각 선택적으로 두어, 공유만 있는 바·좋아요만 있는 바처럼 부분 구성도 가능합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 댓글·공유 = 1회 액션 — 단발 액션입니다. 댓글은 보통 스레드를 열고, 공유는 공유 시트를 엽니다. |
| 명시 규칙 2 | 수는 접근 이름에 합성 — 각 컨트롤의 수는 접근 이름에 좋아요 12개처럼 합성되고, 눈에 보이는 숫자는 aria-hidden 이라 보조기기가 한 번만 낭독합니다. count를 생략하면 숫자를 렌더하지 않습니다. |
| 명시 규칙 3 | 큰 수 축약 — 눈에 보이는 수는 formatCount로 한국식 축약합니다(1240 → "1.2천", 12800 → "1.2만"). 단위를 넘지 않게 내림하고(9999 → "9.9천"), 접근 이름에는 축약 없이 정확한 수가 들어가 스크린리더는 정확한 값을 듣습니다. formatCount={(n) = String(n)}로 끄거나 K/M 포맷터로 교체할 수 있습니다. |
| 명시 규칙 4 | 의도적으로 아이콘 버튼 프리미티브를 쓰지 않음 — X·LinkedIn·Facebook의 인게이지먼트 아이콘은 배경·테두리로 감싸지 않습니다. 툴바용 ToggleIcon·IconButton은 각 글리프를 칩/원으로 감싸 이 관용과 어긋나므로, 여기서는 맨 button으로 렌더하고 aria-pressed·포커스·타깃 크기(24px+) 계약을 직접 소유합니다. |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Content and writing

- 수를 자유 슬롯이 아니라 count 숫자로 받아 정렬(tabular-nums)·접근 이름 합성을 컴포넌트가 소유합니다.

## Accessibility

- 맨 아이콘 (감싸지 않음) — 컨트롤은 쉼 상태에서 배경·테두리가 없고 글리프만 보입니다. 호버/포인터 누름에서만 옅은 원형 배경이 잠깐 뜹니다. 툴바용 아이콘 버튼 프리미티브는 각 글리프를 칩/원으로 감싸므로, 피드 인게이지먼트에는 쓰지 않고 맨 버튼으로 렌더합니다. 키보드 포커스·활성화와 :focus-visible 링은 native button에서 옵니다.
- 좋아요 = 토글 — aria-pressed로 눌림 상태를 전달합니다. 접근 이름(label)은 상태에 따라 바뀌지 않는 명사("좋아요")로 두고, 눌림/해제는 aria-pressed가 낭독합니다. 글리프는 눌림에서 heart → heart-fill로 바뀌고 색이 accent로 바뀝니다(감싸는 상자 없음). 제어형은 like.active, 비제어형은 like.defaultActive.
- 바 = role="group" — 한 화면에 여러 바가 있으면 aria-label로 각각 이름을 주세요(어떤 게시물의 바인지 구분).
- 데이터·낙관적 업데이트·권한(비로그인 시 로그인 유도)은 제품이 소유합니다. 이 컴포넌트는 표현과 접근성만 소유합니다.
- 인게이지먼트 바는 보편 UI이므로 외부 category reference에서 도출했습니다 — 소셜 피드(X·LinkedIn·Facebook)의 좋아요/댓글/공유 관용, ARIA aria-pressed 토글 버튼 패턴.

## Related components

| Component | Relationship |
| --- | --- |
| `ContentEditor` | 대표 시나리오에서 조합 |
| `ExpandableText` | 대표 시나리오에서 조합 |
| `LogViewer` | 대표 시나리오에서 조합 |
| `RecordHeader` | 대표 시나리오에서 조합 |
| `ReorderList` | 대표 시나리오에서 조합 |
| `SourceDisclosure` | 대표 시나리오에서 조합 |
| `StatList` | 대표 시나리오에서 조합 |

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

## Sources

- ReactionBar prompt contract: `components/content/ReactionBar.prompt.md`
- Storybook implementation evidence: `stories/ContentReactionBar.stories.jsx`
