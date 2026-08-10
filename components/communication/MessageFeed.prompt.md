# MessageFeed

`MessageFeed`는 chronological message children을 담는 접근 가능한 scroll log입니다. 장문 AI 응답이 페이지의 읽기 흐름처럼 이어지도록 별도 fill, border, radius와 shadow를 만들지 않는 **LK Product Extension**입니다.

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

## 분류와 책임

- 분류는 **LK Product Extension**이며 WDS Core parity를 주장하지 않습니다.
- `children`을 시간순 DOM 순서로 받습니다. 자체 message schema, renderer, participant truth, provider 또는 transport를 만들지 않습니다.
- feed는 chrome-free transparent container입니다. app panel, card, background, header/sidebar와 composer 연결 chrome은 parent가 필요한 경우 조합합니다.
- `maxHeight`와 `viewportMinHeight`는 named log viewport의 크기만 제어합니다. 고정 application panel 크기를 강제하지 않습니다.
- `density="comfortable | compact"`은 message 사이 vertical gap과 viewport block padding만 선택합니다. 기본 `comfortable`은 기존 24px/12px을 보존하고 `compact`는 16px/8px token 단계로 줄이며 scroll, DOM/ARIA와 action 크기는 바꾸지 않습니다.
- `viewportInset="compact | comfortable"`은 scrollbar가 붙는 named log viewport의 inline content inset만 선택합니다. 기본 `compact`는 좌우 8px, reading/panel composition용 `comfortable`은 좌우 16px이며 block padding은 `density`가 독립적으로 소유합니다. raw viewport style이나 CSS selector hook은 공개하지 않습니다.
- `density`와 `viewportInset`은 독립 축입니다. 따라서 prop을 모두 생략하면 기존 렌더링과 같은 comfortable vertical rhythm과 compact inline inset을 사용합니다.
- 제품은 streaming token 병합, persistence, search, moderation, unread 계산과 history retrieval을 소유합니다.
- MessageFeed는 named log, history prepend 위치 복원, controlled bottom-follow와 관련 action 순서만 소유합니다.
- 기존 Core `Divider`의 labeled separator 조합을 date/first-unread boundary로 재사용합니다. 날짜 계산, read receipt와 unread truth는 제품이 소유하며 Divider는 message schema나 live region을 만들지 않습니다.

## semantics와 interaction

- focus 가능한 viewport는 `role="log"`, `aria-live="polite"`, `aria-relevant="additions"`, `aria-atomic="false"`와 접근 가능한 이름을 가집니다.
- `role="feed"`나 article roving focus를 만들지 않습니다. 사용자는 viewport에 Tab으로 진입한 뒤 Home/End로 처음·끝, Page Up/Page Down으로 viewport 한 페이지를 이동합니다. modifier가 있거나 message 내부 action 등 descendant에 focus가 있으면 이 키를 가로채지 않습니다.
- `busy` 또는 `loadingPrevious` 동안 viewport에 `aria-busy="true"`를 적용합니다.
- 이전 기록 action은 log보다 먼저, 최신 message action은 log 뒤에 둡니다. action이 message를 overlay하거나 가리지 않습니다.
- `loadPreviousLabel`과 `jumpToLatestLabel`은 두 action의 접근 가능한 이름을 현지화합니다. unread count가 있으면 latest label에 개수를 함께 알립니다.
- 최신 message action은 원형 아이콘(아래 방향) 컨트롤이며, unread가 있으면 개수를 장식(`aria-hidden`) 배지로 함께 보여 줍니다(접근 이름이 개수를 이미 전달). 이전 기록 action은 `불러오는 중` 같은 loading 상태가 명확하도록 텍스트 action으로 유지합니다.
- history를 prepend할 때 기존 scroll anchor를 복원하고, 과거 항목을 새 message로 발표하지 않도록 live announcement를 일시 억제합니다. `onLoadPrevious`는 Promise를 반환하거나 비동기 조회 동안 `loadingPrevious`를 즉시 갱신할 수 있으며, 결과가 없거나 실패해도 억제 상태를 해제합니다.
- `following=false`이면 children 추가나 resize가 사용자의 읽기 위치를 bottom으로 끌어내리지 않습니다.
- `following=true`일 때만 append/resize를 bottom으로 따릅니다. 사용자가 위로 스크롤하면 `onFollowingChange(false, "user-scroll")`를 요청하고 읽던 위치를 보존합니다.
- date separator는 `Divider` label에 `<time dateTime>`을 제공하고, unread separator는 제품이 계산한 첫 미읽음 message 바로 앞에 한 번 둡니다. 둘 다 named `role="separator"`이며 focus target이나 별도 announcement region이 아닙니다.
- 최신 message action은 bottom으로 이동한 뒤 `onFollowingChange(true, "jump-to-latest")`와 `onJumpToLatest`를 호출합니다.
- `liveStatus`는 log 바깥의 phase-level status입니다. streaming token을 반복 발표하는 용도로 사용하지 않습니다.
- 그 status region은 문구가 생길 때 mount하지 않고 **feed 수명 내내 비어 있는 상태로 상시 mount**한 뒤 텍스트만 교체합니다. 텍스트와 함께 삽입된 status node는 기존 live region의 변경이 아니어서 첫 phase 알림이 누락됩니다. 비어 있는 region은 시각적으로 숨겨져 있고 절대 위치라 layout에 영향을 주지 않습니다.

## 내부 LDS 비교와 visual delta

| 확인한 sibling | 계승한 규칙 | MessageFeed 결정 |
| --- | --- | --- |
| `ScrollArea` | native overflow와 scrollbar | named log, history anchor와 follow state 때문에 전용 viewport를 소유 |
| `LogViewer` | chronological log와 latest/tail 개념 | console fill, level filter, monospace row, search와 copy toolbar는 제외 |
| `Button` / `IconButton` | named action, focus, loading/disabled | history/latest action에 조합하고 floating overlay를 만들지 않음 |
| `ConversationMessage` | document, bubble, system presentation | feed가 child presentation을 다시 해석하거나 card로 감싸지 않음 |
| `Avatar`, `SourceDisclosure`, `FileUploadQueue` | message 내부 identity와 payload | feed anatomy에는 복제하지 않음 |

- transparent feed 위에서 assistant document는 reading column을 사용하고 user/human-agent bubble만 compact surface를 가집니다.
- child 간 vertical rhythm은 chronological grouping을 보조하지만 문서 응답 전체를 messenger card stack으로 바꾸지 않습니다.
- viewport inset은 logical `padding-inline`으로 적용해 RTL에서도 start/end가 뒤집히며, outer section surface나 scrollbar 위치를 이동시키지 않습니다.
- 320px에서도 history → log → latest의 DOM order와 wrapping을 유지합니다.
- dark theme는 parent semantic background를 그대로 받고 별도 inverse/console surface prop을 만들지 않습니다.

### LK Portal consumer evidence와 compact 계약

- [`SELECT_AND_MESSAGE_FEED_LAYOUT_FOLLOWUP.md`](../../docs/SELECT_AND_MESSAGE_FEED_LAYOUT_FOLLOWUP.md)의 LK Portal floating knowledge chat은 460×674px panel에서 실제 feed를 조합합니다. `density="compact"`는 이처럼 세로 공간이 제한된 panel의 message rhythm만 줄이고, Portal chrome이나 `viewportInset` 선택을 추론하지 않습니다.
- 320px에서는 두 density 모두 message content와 history/latest control이 가로 overflow 없이 reflow되어야 합니다. compact는 control 크기를 줄이지 않으므로 내장 action의 pointer target은 계속 24×24 CSS px 이상입니다.

## authoritative external review

- [WAI-ARIA `log`](https://www.w3.org/TR/wai-aria/#log)는 새 정보가 의미 있는 순서로 추가되는 live region이며 chat history를 대표 예로 듭니다. MessageFeed 하나만 named polite log를 소유합니다.
- [WCAG Technique ARIA23](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA23)는 순차 정보가 추가되는 chat history를 `role="log"`로 식별해 assistive technology에 알리는 예를 제공합니다. 따라서 개별 message와 separator에는 live region을 중복하지 않습니다.
- [WAI-ARIA APG Feed pattern](https://www.w3.org/WAI/ARIA/apg/patterns/feed/)은 infinite article feed의 Page Up/Page Down 계약과 keyboard help의 discoverability를 강조합니다. MessageFeed는 article focus를 이동시키는 `role="feed"`가 아니므로 같은 키 이름을 focusable log의 viewport scrolling에만 적용하고 `aria-keyshortcuts`로 노출합니다.
- [Slack screen reader guidance](https://slack.com/help/articles/360000411963-Use-Slack-with-a-screen-reader)는 Home/End, Page Up/Page Down, first unread, 그리고 “where I left off” 시작 위치를 conversation convention으로 문서화합니다. MessageFeed는 roving message focus를 복제하지 않고 scroll 위치 보존, first-unread separator composition, viewport 단축키만 채택합니다.
- [CSS Scroll Anchoring Level 1](https://www.w3.org/TR/css-scroll-anchoring-1/)은 viewport 위 DOM 변경 시 사용자가 읽는 위치를 안정적으로 유지하는 목적을 정의합니다. MessageFeed는 history prepend의 비동기 DOM/height 변화와 live announcement 억제를 함께 제어해야 하므로 browser heuristic에만 맡기지 않고 `scrollHeight` delta로 수동 복원합니다.
- [WCAG 2.2 Understanding 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)는 세로 scrolling content가 320 CSS px 상당 폭에서 정보·기능 손실이나 2차원 scrolling 없이 reflow되어야 한다고 설명합니다. density는 inline inset과 overflow 계약을 바꾸지 않습니다.
- [WCAG 2.2 Understanding 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)는 pointer target의 최소 크기를 24×24 CSS px로 정의합니다. compact도 history/latest action을 축소하지 않습니다.
- [Carbon spacing](https://carbondesignsystem.com/elements/spacing/overview/)은 spacing token의 작은 단계로 component density를 조정하면서 정보 관계와 hierarchy를 유지하도록 안내합니다. MessageFeed도 typography나 semantic surface 대신 vertical spacing token만 전환합니다.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)를 focus order, keyboard access, status announcement, visible focus와 contrast의 최종 기준으로 사용합니다.
- [Carbon AI Chat overview](https://chat.carbondesignsystem.com/tag/latest/docs/documents/Overview.html)는 rich chat content와 extensible response surface를 설명합니다. feed는 그 content를 제한하지 않는 generic chronological container로 남습니다.
- [Carbon AI Chat server communication](https://chat.carbondesignsystem.com/tag/latest/docs/documents/Server_communication.html)은 history, partial response와 cancellation을 분리합니다. history retrieval과 lifecycle truth는 제품이 소유하고 feed는 위치와 announcement만 관리합니다.
- [Ant Design X Bubble](https://x.ant.design/components/bubble/)은 role presentation과 list/container behavior를 분리합니다. feed가 message surface를 고르지 않는 근거입니다.
- [Ant Design X Sender](https://x.ant.design/components/sender/)와 [Ant Design X Attachments](https://x.ant.design/components/attachments/)는 composer action과 payload anatomy를 conversation list 밖의 독립 composition으로 둡니다. Feed는 input이나 attachment schema를 소유하지 않습니다.

## secondary visual inspiration

- [3 Free AI Chatbot App UI Kit](https://www.figma.com/design/ss5Fq2VKd2UDoHk7SE9dPl/3-Free-AI-Chatbot-App-UI-Kit--Community-?node-id=10301-21963)의 왼쪽 general-assistant conversation에서 chrome-light reading flow만 secondary inspiration으로 사용합니다.
- exact background, sidebar, fixed desktop/mobile frame, blue/purple accent와 shadow는 복사하지 않습니다. 중앙 slothpilot messenger canvas는 design authority가 아닙니다.

## product workflow gate

- **LK Context Hub — supported by composition only.** product가 retrieval 결과와 session을 제공하면 feed와 message를 조합할 수 있지만 product panel의 width, background, border와 scroll behavior를 설계 근거로 사용하지 않습니다.
- **LK Web Viz — not applicable.** 지도 viewport history는 chronological conversation log가 아니며 map interaction component가 소유합니다.
- **LK Control Full Daedeok — not applicable.** event supervision과 command history는 `LogViewer` 또는 domain status component가 적합하며 AI conversation log가 필수로 확인되지 않았습니다.
- product repository는 필요한 component/state coverage만 확인하며 design, anatomy, API와 style의 권위가 아닙니다.

## representative review

- 약 760px: transparent log 안의 document/bubble/system reading flow, named log와 parent chrome 경계를 확인합니다.
- 320px: comfortable/compact 모두 긴 rich response, multiline prompt, history/latest action과 horizontal overflow 부재 및 최소 24×24 CSS px action target을 확인합니다.
- dark: 별도 feed fill 없이 parent background에서 focus, message identity, system 칩과 text contrast를 확인합니다.
- history/follow: prepend anchor, 성공·무결과·실패 뒤 announcement 억제 해제, following=false 위치 보존과 latest action의 focus/callback을 확인합니다.
- empty/busy: empty는 log 안, phase status는 log 밖에 두고 busy 구간에만 `aria-busy`가 있어야 합니다.
