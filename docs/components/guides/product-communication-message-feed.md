# Message Feed

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Communication |
| Owner | `MessageFeed` |
| Storybook | `LDS Product/Communication/Message Feed` |
| Source | `../component-content.json#product-communication-message-feed` |

장문 AI 응답과 짧은 사용자 발화를 시간순으로 읽고 과거 내용을 이어 불러올 때 사용합니다. Feed는 application panel이나 messenger canvas가 아니라 투명한 named log와 history/follow behavior만 제공합니다. 정적이거나 시간순이 아닌 목록에는 적합하지 않으니 일반 List·Table을 사용하세요.

## 사용 판단

### 사용

- 장문 AI 응답과 짧은 사용자 발화를 시간순으로 읽고 과거 내용을 이어 불러올 때 사용합니다. Feed는 application panel이나 messenger canvas가 아니라 투명한 named log와 history/follow behavior만 제공합니다. 정적이거나 시간순이 아닌 목록에는 적합하지 않으니 일반 List·Table을 사용하세요.
- children을 시간순 DOM 순서로 받습니다. 자체 message schema, renderer, participant truth, provider 또는 transport를 만들지 않습니다.
- 기존 Core Divider의 labeled separator 조합을 date/first-unread boundary로 재사용합니다. 날짜 계산, read receipt와 unread truth는 제품이 소유하며 Divider는 message schema나 live region을 만들지 않습니다.
- role="feed"나 article roving focus를 만들지 않습니다. 사용자는 viewport에 Tab으로 진입한 뒤 Home/End로 처음·끝, Page Up/Page Down으로 viewport 한 페이지를 이동합니다. modifier가 있거나 message 내부 action 등 descendant에 focus가 있으면 이 키를 가로채지 않습니다.

### 사용하지 않음

- 분류는 LK Product Extension이며 WDS Core parity를 주장하지 않습니다.
- maxHeight와 viewportMinHeight는 named log viewport의 크기만 제어합니다. 고정 application panel 크기를 강제하지 않습니다.
- history를 prepend할 때 기존 scroll anchor를 복원하고, 과거 항목을 새 message로 발표하지 않도록 live announcement를 일시 억제합니다. onLoadPrevious는 Promise를 반환하거나 비동기 조회 동안 loadingPrevious를 즉시 갱신할 수 있으며, 결과가 없거나 실패해도 억제 상태를 해제합니다.
- liveStatus는 log 바깥의 phase-level status입니다. streaming token을 반복 발표하는 용도로 사용하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | MessageFeed의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Aria Label | Accessible name for the focusable conversation log. @default "메시지 내역" |
| Children | Message nodes in chronological DOM order. MessageFeed does not own a messages[] schema. |
| Load Previous Label | History action label. @default "이전 메시지 불러오기" |
| Jump To Latest Label | Latest-message action label. @default "최신 메시지로 이동" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `ariaLabel` | `string` | No | Accessible name for the focusable conversation log. @default "메시지 내역" |
| `children` | `React.ReactNode` | No | Message nodes in chronological DOM order. MessageFeed does not own a messages[] schema. |
| `empty` | `React.ReactNode` | No | Content shown inside the log when children are empty. |
| `maxHeight` | `number \| string` | No | Maximum viewport height in pixels or CSS units. @default 400 |
| `viewportMinHeight` | `number \| string` | No | Optional minimum viewport height for persistent conversation panels. |
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
| empty | Content shown inside the log when children are empty. 타입 계약: React.ReactNode |
| busy | Mark the log as busy while its current contents are being updated. @default false 타입 계약: boolean |
| loadingPrevious | Disable the history action and mark the log busy while older messages load. @default false 타입 계약: boolean |
| liveStatus | Short phase-level announcement rendered in a live region separate from message tokens. 타입 계약: React.ReactNode |
| 변형·상태 · 다크 테마 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 변형·상태 · 빈 목록과 불러오는 중 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 상호작용 · 이전 메시지 위치 유지 | interaction 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 상호작용 · 읽기 위치와 새 메시지 | interaction 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 반응형 · 320px | responsive 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- maxHeight와 viewportMinHeight는 named log viewport의 크기만 제어합니다. 고정 application panel 크기를 강제하지 않습니다.
- MessageFeed는 named log, history prepend 위치 복원, controlled bottom-follow와 관련 action 순서만 소유합니다.
- focus 가능한 viewport는 role="log", aria-live="polite", aria-relevant="additions", aria-atomic="false"와 접근 가능한 이름을 가집니다.
- role="feed"나 article roving focus를 만들지 않습니다. 사용자는 viewport에 Tab으로 진입한 뒤 Home/End로 처음·끝, Page Up/Page Down으로 viewport 한 페이지를 이동합니다. modifier가 있거나 message 내부 action 등 descendant에 focus가 있으면 이 키를 가로채지 않습니다.
- 최신 message action은 원형 아이콘(아래 방향) 컨트롤이며, unread가 있으면 개수를 장식(aria-hidden) 배지로 함께 보여 줍니다(접근 이름이 개수를 이미 전달). 이전 기록 action은 불러오는 중 같은 loading 상태가 명확하도록 텍스트 action으로 유지합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 320px에서도 history → log → latest의 DOM order와 wrapping을 유지합니다. |
| 명시 규칙 2 | CSS Scroll Anchoring Level 1은 viewport 위 DOM 변경 시 사용자가 읽는 위치를 안정적으로 유지하는 목적을 정의합니다. MessageFeed는 history prepend의 비동기 DOM/height 변화와 live announcement 억제를 함께 제어해야 하므로 browser heuristic에만 맡기지 않고 scrollHeight delta로 수동 복원합니다. |
| 명시 규칙 3 | WCAG 2.2를 focus order, keyboard access, status announcement, visible focus와 contrast의 최종 기준으로 사용합니다. |
| 명시 규칙 4 | 3 Free AI Chatbot App UI Kit의 왼쪽 general-assistant conversation에서 chrome-light reading flow만 secondary inspiration으로 사용합니다. |
| --body2-line | 22px |

## Responsive

- maxHeight와 viewportMinHeight는 named log viewport의 크기만 제어합니다. 고정 application panel 크기를 강제하지 않습니다.
- focus 가능한 viewport는 role="log", aria-live="polite", aria-relevant="additions", aria-atomic="false"와 접근 가능한 이름을 가집니다.
- role="feed"나 article roving focus를 만들지 않습니다. 사용자는 viewport에 Tab으로 진입한 뒤 Home/End로 처음·끝, Page Up/Page Down으로 viewport 한 페이지를 이동합니다. modifier가 있거나 message 내부 action 등 descendant에 focus가 있으면 이 키를 가로채지 않습니다.
- busy 또는 loadingPrevious 동안 viewport에 aria-busy="true"를 적용합니다.

## Content and writing

- children을 시간순 DOM 순서로 받습니다. 자체 message schema, renderer, participant truth, provider 또는 transport를 만들지 않습니다.
- maxHeight와 viewportMinHeight는 named log viewport의 크기만 제어합니다. 고정 application panel 크기를 강제하지 않습니다.
- MessageFeed는 named log, history prepend 위치 복원, controlled bottom-follow와 관련 action 순서만 소유합니다.
- 기존 Core Divider의 labeled separator 조합을 date/first-unread boundary로 재사용합니다. 날짜 계산, read receipt와 unread truth는 제품이 소유하며 Divider는 message schema나 live region을 만들지 않습니다.

## Accessibility

- focus 가능한 viewport는 role="log", aria-live="polite", aria-relevant="additions", aria-atomic="false"와 접근 가능한 이름을 가집니다.
- role="feed"나 article roving focus를 만들지 않습니다. 사용자는 viewport에 Tab으로 진입한 뒤 Home/End로 처음·끝, Page Up/Page Down으로 viewport 한 페이지를 이동합니다. modifier가 있거나 message 내부 action 등 descendant에 focus가 있으면 이 키를 가로채지 않습니다.
- busy 또는 loadingPrevious 동안 viewport에 aria-busy="true"를 적용합니다.
- 최신 message action은 원형 아이콘(아래 방향) 컨트롤이며, unread가 있으면 개수를 장식(aria-hidden) 배지로 함께 보여 줍니다(접근 이름이 개수를 이미 전달). 이전 기록 action은 불러오는 중 같은 loading 상태가 명확하도록 텍스트 action으로 유지합니다.
- date separator는 Divider label에 을 제공하고, unread separator는 제품이 계산한 첫 미읽음 message 바로 앞에 한 번 둡니다. 둘 다 named role="separator"이며 focus target이나 별도 announcement region이 아닙니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | children을 시간순 DOM 순서로 받습니다. 자체 message schema, renderer, participant truth, provider 또는 transport를 만들지 않습니다. |
| Don't | 분류는 LK Product Extension이며 WDS Core parity를 주장하지 않습니다. |
| Do | 기존 Core Divider의 labeled separator 조합을 date/first-unread boundary로 재사용합니다. 날짜 계산, read receipt와 unread truth는 제품이 소유하며 Divider는 message schema나 live region을 만들지 않습니다. |
| Don't | maxHeight와 viewportMinHeight는 named log viewport의 크기만 제어합니다. 고정 application panel 크기를 강제하지 않습니다. |

## Exceptions

- feed는 chrome-free transparent container입니다. app panel, card, background, header/sidebar와 composer 연결 chrome은 parent가 필요한 경우 조합합니다.
- - 분류는 LK Product Extension이며 WDS Core parity를 주장하지 않습니다. - children을 시간순 DOM 순서로 받습니다. 자체 message schema, renderer, participant truth, provider 또는 transport를 만들지 않습니다. - feed는 chrome-free transparent container입니다. app panel, card, background, header/sidebar와 composer 연결 chrome은 parent가 필요한 경우 조합합니다. - maxHeight와 viewp….
- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 MessageFeed의 범용 API에 넣지 않습니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ConversationMessage` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Divider` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Spinner` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `MessageComposer` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- MessageFeed prompt contract: `components/communication/MessageFeed.prompt.md`
- Storybook implementation evidence: `stories/CommunicationMessageFeed.stories.jsx`
- [WAI-ARIA log](https://www.w3.org/TR/wai-aria/#log)
- [WCAG Technique ARIA23](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA23)
- [WAI-ARIA APG Feed pattern](https://www.w3.org/WAI/ARIA/apg/patterns/feed/)
- [Slack screen reader guidance](https://slack.com/help/articles/360000411963-Use-Slack-with-a-screen-reader)
- [CSS Scroll Anchoring Level 1](https://www.w3.org/TR/css-scroll-anchoring-1/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Carbon AI Chat overview](https://chat.carbondesignsystem.com/tag/latest/docs/documents/Overview.html)
- [Carbon AI Chat server communication](https://chat.carbondesignsystem.com/tag/latest/docs/documents/Server_communication.html)
