# Feed Card

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Content |
| Owner | `FeedCard` |
| Storybook | `LDS Product/Content/Feed Card` |
| Source | `../component-content.json#product-content-feed-card` |

작성자 헤더·본문·좋아요/댓글/공유가 반복되는 소셜 피드에 적합합니다. 발행일·출처를 쓰는 기사·보도 카드나, 카드 전체가 하나의 링크인 목록 카드에는 이 컴포넌트를 사용하지 마세요 — 게시물은 링크가 아니라 여러 컨트롤을 담는 영역입니다.

## Anatomy

| Part | Contract |
| --- | --- |
| followLabel | 팔로우 버튼 라벨. @default following ? "팔로잉" : "팔로우" |
| menuLabel | 오버플로 트리거 접근 라벨. 본문 펼치기("더 보기")와 겹치지 않게 기본값을 구분합니다. @default "게시물 옵션" |
| like | 좋아요 토글(선택) — ReactionBar로 전달됩니다. |
| comment | 댓글 액션(선택). |
| share | 공유 액션(선택). |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `author` | `FeedAuthor` | No | 작성자 identity(아바타·이름·링크). |
| `meta` | `React.ReactNode` | No | 헤더 보조 줄의 출처 부분(예: "운영 업데이트"). time과 함께 주면 출처 · 시간으로 합쳐집니다. |
| `time` | `React.ReactNode` | No | 상대 시간 라벨(예: "6시간 전"). 주면 으로 렌더되어 보조 줄에 합쳐집니다. |
| `datetime` | `string` | No | time의 기계판독 값(ISO 8601, 예: "2026-07-24T09:00:00Z"). 에 들어갑니다. |
| `following` | `boolean` | No | 팔로우 상태. 지정하거나 onFollowToggle을 주면 팔로우 버튼이 나타납니다. |
| `onFollowToggle` | `(event: React.MouseEvent) = void` | No | 팔로우 버튼 클릭 핸들러. |
| `followLabel` | `React.ReactNode` | No | 팔로우 버튼 라벨. @default following ? "팔로잉" : "팔로우" |
| `menuItems` | `DropdownMenuItem[]` | No | ⋮ 오버플로 메뉴 항목. 있을 때만 메뉴가 나타납니다. |
| `menuLabel` | `string` | No | 오버플로 트리거 접근 라벨. 본문 펼치기("더 보기")와 겹치지 않게 기본값을 구분합니다. @default "게시물 옵션" |
| `cover` | `string` | No | 커버 이미지 URL(선택). 16:9로 지연 로드됩니다. |
| `coverAlt` | `string` | No | 커버 대체 텍스트. @default "" |
| `clamp` | `number \| false` | No | 본문 클램프 줄 수. false면 클램프 없이 전체를 렌더합니다. @default 3 |
| `like` | `ReactionLike` | No | 좋아요 토글(선택) — ReactionBar로 전달됩니다. |
| `comment` | `ReactionAction` | No | 댓글 액션(선택). |
| `share` | `ReactionAction` | No | 공유 액션(선택). |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | No | 작성자 이름의 heading 레벨. 주면 이름이 heading이 되어 피드 아웃라인을 만듭니다. |
| `children` | `React.ReactNode` | No | 게시물 본문. |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 작성자 헤더는 ListCell을 재사용 — leading 아바타(Avatar) + title 이름 + description(출처·시간) + trailing(팔로우 Button·오버플로 DropdownMenu). 새 헤더 컴포넌트를 만들지 않습니다. headingLevel을 주면 이름이 heading이 되어 피드 문서 아웃라인을 만들고, author.href면 이름이 프로필 링크가 되며, author.badge(인증 체크·"1촌" 등)는 이름 뒤에 인라인으로 붙습니다. |
| 명시 규칙 2 | 타임스탬프는 — 보조 줄은 meta(출처)와 시간으로 구성됩니다. time(상대 라벨 "6시간 전")과 datetime(ISO 값)을 주면 으로 렌더되어, 보이는 라벨은 상대적이어도 보조기기·크롤러는 정확한 시각을 읽습니다. meta와 time을 함께 주면 출처 · 시간으로 합쳐지고, meta 하나에 전체 문자열을 넣던 기존 사용법도 그대로 동작합니다. |
| 명시 규칙 3 | 커버(cover / coverAlt) — cover 이미지는 16:9로 loading="lazy"·decoding="async" 지연 로드되고 로드 전 레이아웃을 예약합니다(NewsCard 선례). coverAlt가 비면 장식으로 처리됩니다. |
| --body1-line | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --body1-size | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |

## Content and writing

- 본문은 ExpandableText — clamp 줄로 접히고 "더 보기"로 펼칩니다(clamp={false}면 전체 렌더). 전체 텍스트는 항상 DOM에 있어 스크린리더가 전문을 읽습니다.
- 인게이지먼트 바는 ReactionBar — like(토글)·comment·share를 그대로 전달합니다. 각 수는 컨트롤 접근 이름에 합성됩니다.
- 팔로우 버튼 — following이나 onFollowToggle 중 하나라도 주면 나타납니다. followLabel로 라벨을 덮어쓰며 기본값은 following ? "팔로잉" : "팔로우". 오버플로(⋮) 트리거의 접근 라벨은 menuLabel(기본 "게시물 옵션")이며, 본문 펼치기 "더 보기"와 접근 이름이 겹치지 않도록 일부러 구분했습니다.
- FeedCard — 소셜 피드 게시물 카드: 작성자 헤더(아바타 · 이름 · 출처·시간 · 팔로우 · ⋮) · 본문(더 보기로 접힘) · 커버(선택) · 인게이지먼트 바(좋아요·댓글·공유).

## Accessibility

- article 이름 — article은 aria-label(기본 {author.name}님의 게시물)로 이름을 가져 랜드마크 이동에서 어떤 게시물인지 구분됩니다. 필요하면 aria-label로 덮어씁니다.
- 제품이 소유: 게시물 데이터, 팔로우·좋아요 상태와 낙관적 업데이트, 권한(비로그인 유도), 정렬·페이지네이션, route. FeedCard는 게시물 해부와 영역 접근성만 소유합니다.
- 헤더·본문·인게이지먼트를 각각 ListCell·ExpandableText·ReactionBar로 조립해 각 조각을 다른 표면에서도 재사용하고, 한 곳에서 조판·접근성을 소유하게 했습니다.
- 여러 장 배치 — 기본은 일반 리스트(/ 또는 이름 붙인 )나 Grid로 나열합니다. role="feed"(WAI-ARIA APG)는 각 article의 aria-posinset·aria-setsize와 화살표 포커스 관리·지연 로딩 계약을 요구하므로, 무한 스크롤 피드에서 그 계약을 직접 구현할 때만 쓰세요. FeedCard는 article 하나만 제공하고 그 계약은 제품이 소유합니다. 로딩·정렬·페이지네이션도 제품이 소유합니다.
- 소셜 피드 게시물 카드는 보편 UI 카테고리이므로 외부 category reference에서 도출했습니다 — X·LinkedIn·Facebook 피드의 게시물 해부(작성자 헤더 → 본문 → 미디어 → 인게이지먼트), ARIA article 영역 관례. 사내 근거는 카드 계열(NewsCard의 커버·heading 계약), 행 primitive ListCell, 그리고 이번에 함께 신설한 ExpandableText·ReactionBar입니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ChecklistItem` | 대표 시나리오에서 조합 |
| `FeatureCard` | 대표 시나리오에서 조합 |
| `ListingCard` | 대표 시나리오에서 조합 |
| `MetricCard` | 대표 시나리오에서 조합 |
| `NewsCard` | 대표 시나리오에서 조합 |
| `ProductCard` | 대표 시나리오에서 조합 |
| `SpecRow` | 대표 시나리오에서 조합 |
| `Stat` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<FeedCard
  author={{ name: '로봇 운영팀', variant: 'company', href: '/teams/robot-operations' }}
  meta="운영 업데이트 · 6시간 전"
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

## Tokens and API

### Tokens

- `--body1-line`
- `--body1-size`
- `--body2-size`
- `--color-semantic-background-normal-alternative`
- `--color-semantic-label-alternative`
- `--color-semantic-label-normal`
- `--color-semantic-label-strong`
- `--component-card-bg`
- `--component-card-border`
- `--component-card-radius`
- `--fw-bold`
- `--space-1`
- `--space-2`
- `--space-3`
- `--space-4`

### Source contracts

- `components/cards/FeedCard.jsx`
- `components/cards/FeedCard.d.ts`
- `components/cards/FeedCard.prompt.md`
- `stories/CardFeed.stories.jsx`

## Sources

- FeedCard prompt contract: `components/cards/FeedCard.prompt.md`
- Storybook implementation evidence: `stories/CardFeed.stories.jsx`
