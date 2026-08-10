# Message Feed

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Communication |
| Owner | `MessageFeed` |
| Storybook | `LDS Product/Communication/Message Feed` |
| Source | `../component-content.json#product-communication-message-feed` |

시간순 대화를 읽고 이전 기록을 이어 불러올 때 사용합니다. Feed는 접근 가능한 log, 이전 기록 위치 유지와 새 메시지 따라가기를 맡습니다. 정적 목록이나 시간순이 아닌 정보에는 사용하지 말고 List·Table을 사용하세요.

## 사용 판단

### 사용

- following=false이면 children 추가나 resize가 사용자의 읽기 위치를 bottom으로 끌어내리지 않습니다.
- WCAG 2.2를 focus order, keyboard access, status announcement, visible focus와 contrast의 최종 기준으로 사용합니다.
- 3 Free AI Chatbot App UI Kit의 왼쪽 general-assistant conversation에서 chrome-light reading flow만 secondary inspiration으로 사용합니다.
- LK Control Full Daedeok — not applicable. event supervision과 command history는 LogViewer 또는 domain status component가 적합하며 AI conversation log가 필수로 확인되지 않았습니다.

### 사용하지 않음

- 분류는 LK Product Extension이며 WDS Core parity를 주장하지 않습니다.
- history를 prepend할 때 기존 scroll anchor를 복원하고, 과거 항목을 새 message로 발표하지 않도록 live announcement를 일시 억제합니다. onLoadPrevious는 Promise를 반환하거나 비동기 조회 동안 loadingPrevious를 즉시 갱신할 수 있으며, 결과가 없거나 실패해도 억제 상태를 해제합니다.
- liveStatus는 log 바깥의 phase-level status입니다. streaming token을 반복 발표하는 용도로 사용하지 않습니다.
- 그 status region은 문구가 생길 때 mount하지 않고 feed 수명 내내 비어 있는 상태로 상시 mount한 뒤 텍스트만 교체합니다. 텍스트와 함께 삽입된 status node는 기존 live region의 변경이 아니어서 첫 phase 알림이 누락됩니다. 비어 있는 region은 시각적으로 숨겨져 있고 절대 위치라 layout에 영향을 주지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| ariaLabel | Accessible name for the focusable conversation log. @default "메시지 내역" |
| children | Message nodes in chronological DOM order. MessageFeed does not own a messages[] schema. |
| loadPreviousLabel | History action label. @default "이전 메시지 불러오기" |
| jumpToLatestLabel | Latest-message action label. @default "최신 메시지로 이동" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `ariaLabel` | `string` | No | Accessible name for the focusable conversation log. @default "메시지 내역" |
| `children` | `React.ReactNode` | No | Message nodes in chronological DOM order. MessageFeed does not own a messages[] schema. |
| `empty` | `React.ReactNode` | No | Content shown inside the log when children are empty. |
| `maxHeight` | `number \| string` | No | Maximum viewport height in pixels or CSS units. @default 400 |
| `viewportMinHeight` | `number \| string` | No | Optional minimum viewport height for persistent conversation panels. |
| `density` | `MessageFeedDensity` | No | Feed-owned vertical density. Comfortable preserves the legacy message gap and block padding; compact reduces only those spaces and does not change viewportInset. @default "comfortable" |
| `viewportInset` | `MessageFeedViewportInset` | No | Inline viewport padding. Use comfortable for reading surfaces and compact for dense embedded panels. @default "compact" |
| `busy` | `boolean` | No | Mark the log as busy while its current contents are being updated. @default false |
| `hasPrevious` | `boolean` | No | Show the history-loading action before the log. @default false |
| `loadingPrevious` | `boolean` | No | Disable the history action and mark the log busy while older messages load. @default false |
| `onLoadPrevious` | `() = void \| Promise` | No | Request older messages. Return a promise or synchronously set loadingPrevious while retrieval runs; the product prepends the resulting children. |
| `loadPreviousLabel` | `string` | No | History action label. @default "이전 메시지 불러오기" |
| `following` | `boolean` | Yes | Controlled bottom-follow state. The consumer must update it from onFollowingChange. The focusable log supports Home, End, Page Up, and Page Down scrolling. |
| `onFollowingChange` | `(following: boolean, reason: MessageFeedFollowingReason) = void` | No | Called when user scrolling changes the follow state or the latest-message action restores it. |
| `unreadCount` | `number` | No | Product-owned count displayed with the latest-message action. @default 0 |
| `jumpToLatestLabel` | `string` | No | Latest-message action label. @default "최신 메시지로 이동" |
| `onJumpToLatest` | `() = void` | No | Called after the latest-message action scrolls the viewport to the bottom. |
| `liveStatus` | `React.ReactNode` | No | Short phase-level announcement rendered in a live region separate from message tokens. |

## States

| State | Contract |
| --- | --- |
| empty | Content shown inside the log when children are empty. |
| busy | Mark the log as busy while its current contents are being updated. @default false |
| loadingPrevious | Disable the history action and mark the log busy while older messages load. @default false |
| liveStatus | Short phase-level announcement rendered in a live region separate from message tokens. |

## Behavior and interaction

- following=true일 때만 append/resize를 bottom으로 따릅니다. 사용자가 위로 스크롤하면 onFollowingChange(false, "user-scroll")를 요청하고 읽던 위치를 보존합니다.
- WAI-ARIA APG Feed pattern은 infinite article feed의 Page Up/Page Down 계약과 keyboard help의 discoverability를 강조합니다. MessageFeed는 article focus를 이동시키는 role="feed"가 아니므로 같은 키 이름을 focusable log의 viewport scrolling에만 적용하고 aria-keyshortcuts로 노출합니다.
- Slack screen reader guidance는 Home/End, Page Up/Page Down, first unread, 그리고 “where I left off” 시작 위치를 conversation convention으로 문서화합니다. MessageFeed는 roving message focus를 복제하지 않고 scroll 위치 보존, first-unread separator composition, viewport 단축키만 채택합니다.
- CSS Scroll Anchoring Level 1은 viewport 위 DOM 변경 시 사용자가 읽는 위치를 안정적으로 유지하는 목적을 정의합니다. MessageFeed는 history prepend의 비동기 DOM/height 변화와 live announcement 억제를 함께 제어해야 하므로 browser heuristic에만 맡기지 않고 scrollHeight delta로 수동 복원합니다.
- WCAG 2.2 Understanding 1.4.10 Reflow는 세로 scrolling content가 320 CSS px 상당 폭에서 정보·기능 손실이나 2차원 scrolling 없이 reflow되어야 한다고 설명합니다. density는 inline inset과 overflow 계약을 바꾸지 않습니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | density="comfortable \| compact"은 message 사이 vertical gap과 viewport block padding만 선택합니다. 기본 comfortable은 기존 24px/12px을 보존하고 compact는 16px/8px token 단계로 줄이며 scroll, DOM/ARIA와 action 크기는 바꾸지 않습니다. |
| 명시 규칙 2 | viewportInset="compact \| comfortable"은 scrollbar가 붙는 named log viewport의 inline content inset만 선택합니다. 기본 compact는 좌우 8px, reading/panel composition용 comfortable은 좌우 16px이며 block padding은 density가 독립적으로 소유합니다. raw viewport style이나 CSS selector hook은 공개하지 않습니다. |
| 명시 규칙 3 | 320px에서도 history → log → latest의 DOM order와 wrapping을 유지합니다. |
| 명시 규칙 4 | SELECTANDMESSAGEFEEDLAYOUTFOLLOWUP.md의 LK Portal floating knowledge chat은 460×674px panel에서 실제 feed를 조합합니다. density="compact"는 이처럼 세로 공간이 제한된 panel의 message rhythm만 줄이고, Portal chrome이나 viewportInset 선택을 추론하지 않습니다. |
| --body2-line | 22px |

## Responsive

- maxHeight와 viewportMinHeight는 named log viewport의 크기만 제어합니다. 고정 application panel 크기를 강제하지 않습니다.
- density와 viewportInset은 독립 축입니다. 따라서 prop을 모두 생략하면 기존 렌더링과 같은 comfortable vertical rhythm과 compact inline inset을 사용합니다.
- transparent feed 위에서 assistant document는 reading column을 사용하고 user/human-agent bubble만 compact surface를 가집니다.
- viewport inset은 logical padding-inline으로 적용해 RTL에서도 start/end가 뒤집히며, outer section surface나 scrollbar 위치를 이동시키지 않습니다.

## Content and writing

- children을 시간순 DOM 순서로 받습니다. 자체 message schema, renderer, participant truth, provider 또는 transport를 만들지 않습니다.
- MessageFeed는 named log, history prepend 위치 복원, controlled bottom-follow와 관련 action 순서만 소유합니다.
- 기존 Core Divider의 labeled separator 조합을 date/first-unread boundary로 재사용합니다. 날짜 계산, read receipt와 unread truth는 제품이 소유하며 Divider는 message schema나 live region을 만들지 않습니다.
- 이전 기록 action은 log보다 먼저, 최신 message action은 log 뒤에 둡니다. action이 message를 overlay하거나 가리지 않습니다.

## Accessibility

- focus 가능한 viewport는 role="log", aria-live="polite", aria-relevant="additions", aria-atomic="false"와 접근 가능한 이름을 가집니다.
- role="feed"나 article roving focus를 만들지 않습니다. 사용자는 viewport에 Tab으로 진입한 뒤 Home/End로 처음·끝, Page Up/Page Down으로 viewport 한 페이지를 이동합니다. modifier가 있거나 message 내부 action 등 descendant에 focus가 있으면 이 키를 가로채지 않습니다.
- busy 또는 loadingPrevious 동안 viewport에 aria-busy="true"를 적용합니다.
- 최신 message action은 원형 아이콘(아래 방향) 컨트롤이며, unread가 있으면 개수를 장식(aria-hidden) 배지로 함께 보여 줍니다(접근 이름이 개수를 이미 전달). 이전 기록 action은 불러오는 중 같은 loading 상태가 명확하도록 텍스트 action으로 유지합니다.
- date separator는 Divider label에 을 제공하고, unread separator는 제품이 계산한 첫 미읽음 message 바로 앞에 한 번 둡니다. 둘 다 named role="separator"이며 focus target이나 별도 announcement region이 아닙니다.

## Exceptions

- feed는 chrome-free transparent container입니다. app panel, card, background, header/sidebar와 composer 연결 chrome은 parent가 필요한 경우 조합합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `ConversationMessage` | 대표 시나리오에서 조합 |
| `Divider` | 대표 시나리오에서 조합 |
| `Spinner` | 대표 시나리오에서 조합 |
| `MessageComposer` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<MessageFeed
  ariaLabel="AI 대화 내역"
  following={following}
  onFollowingChange={setFollowing}
  unreadCount={unreadCount}
  hasPrevious={hasPrevious}
  onLoadPrevious={loadPrevious}
>
  <Divider
    data-message-feed-separator="date"
    aria-label="2026년 7월 21일"
    label={<time dateTime="2026-07-21">오늘</time>}
  />
  {messages.map(renderMessage)}
  <Divider
    data-message-feed-separator="unread"
    aria-label="여기부터 읽지 않은 메시지"
    label="여기부터 읽지 않은 메시지"
  />
</MessageFeed>
```

## Tokens and API

### Tokens

- `--body2-line`
- `--body2-size`
- `--border-thin`
- `--caption2-size`
- `--color-semantic-background-normal-normal`
- `--color-semantic-label-alternative`
- `--color-semantic-label-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-static-white`
- `--font-sans`
- `--fw-bold`
- `--radius-pill`
- `--space-1`
- `--space-2`
- `--space-20`
- `--space-3`
- `--space-4`
- `--space-6`

### Source contracts

- `components/communication/MessageFeed.jsx`
- `components/communication/MessageFeed.d.ts`
- `components/communication/MessageFeed.prompt.md`
- `stories/CommunicationMessageFeed.stories.jsx`

## Sources

- MessageFeed prompt contract: `components/communication/MessageFeed.prompt.md`
- Storybook implementation evidence: `stories/CommunicationMessageFeed.stories.jsx`
- [WAI-ARIA log](https://www.w3.org/TR/wai-aria/#log)
- [WCAG Technique ARIA23](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA23)
- [WAI-ARIA APG Feed pattern](https://www.w3.org/WAI/ARIA/apg/patterns/feed/)
- [Slack screen reader guidance](https://slack.com/help/articles/360000411963-Use-Slack-with-a-screen-reader)
- [CSS Scroll Anchoring Level 1](https://www.w3.org/TR/css-scroll-anchoring-1/)
- [WCAG 2.2 Understanding 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [WCAG 2.2 Understanding 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)
- [Carbon spacing](https://carbondesignsystem.com/elements/spacing/overview/)
