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
  {messages.map(renderMessage)}
</MessageFeed>
```

## 분류와 책임

- 분류는 **LK Product Extension**이며 WDS Core parity를 주장하지 않습니다.
- `children`을 시간순 DOM 순서로 받습니다. 자체 message schema, renderer, participant truth, provider 또는 transport를 만들지 않습니다.
- feed는 chrome-free transparent container입니다. app panel, card, background, header/sidebar와 composer 연결 chrome은 parent가 필요한 경우 조합합니다.
- `maxHeight`와 `viewportMinHeight`는 named log viewport의 크기만 제어합니다. 고정 application panel 크기를 강제하지 않습니다.
- 제품은 streaming token 병합, persistence, search, moderation, unread 계산과 history retrieval을 소유합니다.
- MessageFeed는 named log, history prepend 위치 복원, controlled bottom-follow와 관련 action 순서만 소유합니다.

## semantics와 interaction

- focus 가능한 viewport는 `role="log"`, `aria-live="polite"`, `aria-relevant="additions"`, `aria-atomic="false"`와 접근 가능한 이름을 가집니다.
- `role="feed"`나 article roving focus를 만들지 않습니다. 사용자는 viewport에 Tab으로 진입한 뒤 native scrolling을 사용합니다.
- `busy` 또는 `loadingPrevious` 동안 viewport에 `aria-busy="true"`를 적용합니다.
- 이전 기록 action은 log보다 먼저, 최신 message action은 log 뒤에 둡니다. action이 message를 overlay하거나 가리지 않습니다.
- `loadPreviousLabel`과 `jumpToLatestLabel`은 두 action의 접근 가능한 이름을 현지화합니다. unread count가 있으면 latest label에 개수를 함께 알립니다.
- 최신 message action은 원형 아이콘(아래 방향) 컨트롤이며, unread가 있으면 개수를 장식(`aria-hidden`) 배지로 함께 보여 줍니다(접근 이름이 개수를 이미 전달). 이전 기록 action은 `불러오는 중` 같은 loading 상태가 명확하도록 텍스트 action으로 유지합니다.
- history를 prepend할 때 기존 scroll anchor를 복원하고, 과거 항목을 새 message로 발표하지 않도록 live announcement를 일시 억제합니다. `onLoadPrevious`는 Promise를 반환하거나 비동기 조회 동안 `loadingPrevious`를 즉시 갱신할 수 있으며, 결과가 없거나 실패해도 억제 상태를 해제합니다.
- `following=false`이면 children 추가나 resize가 사용자의 읽기 위치를 bottom으로 끌어내리지 않습니다.
- 최신 message action은 bottom으로 이동한 뒤 `onFollowingChange(true, "jump-to-latest")`와 `onJumpToLatest`를 호출합니다.
- `liveStatus`는 log 바깥의 phase-level status입니다. streaming token을 반복 발표하는 용도로 사용하지 않습니다.

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
- 320px에서도 history → log → latest의 DOM order와 wrapping을 유지합니다.
- dark theme는 parent semantic background를 그대로 받고 별도 inverse/console surface prop을 만들지 않습니다.

## authoritative external review

- [WAI-ARIA `log`](https://www.w3.org/TR/wai-aria/#log)는 새 정보가 의미 있는 순서로 추가되는 live region이며 chat history를 대표 예로 듭니다. MessageFeed 하나만 named polite log를 소유합니다.
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
- 320px: 긴 rich response, multiline prompt, history/latest action과 horizontal overflow 부재를 확인합니다.
- dark: 별도 feed fill 없이 parent background에서 focus, message identity, system 칩과 text contrast를 확인합니다.
- history/follow: prepend anchor, 성공·무결과·실패 뒤 announcement 억제 해제, following=false 위치 보존과 latest action의 focus/callback을 확인합니다.
- empty/busy: empty는 log 안, phase status는 log 밖에 두고 busy 구간에만 `aria-busy`가 있어야 합니다.
