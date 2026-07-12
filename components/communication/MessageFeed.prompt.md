# MessageFeed

`MessageFeed`는 시간순 메시지를 읽고 과거 기록을 불러오는 스크롤 영역을 제공하는 **LK Product Extension**입니다. 로컬 WDS `.fig`에는 MessageFeed에 해당하는 독립 component set이 확인되지 않았으므로 WDS Core나 WDS variant parity를 주장하지 않습니다.

```jsx
<MessageFeed
  ariaLabel="운영 지원 대화"
  following={following}
  onFollowingChange={setFollowing}
  unreadCount={unreadCount}
  hasPrevious={hasPrevious}
  onLoadPrevious={loadPrevious}
>
  {messages.map((message) => <ConversationMessage key={message.id} {...message} />)}
</MessageFeed>
```

## 책임과 제외 범위

- `children`을 시간순 DOM 순서로 받습니다. 자체 `messages[]` schema, renderer, provider를 만들지 않습니다.
- 제품은 전송, 스트리밍 병합, 영속화, 검색, moderation, unread 계산과 history retrieval을 소유합니다.
- MessageFeed는 named scroll viewport, live-region 경계, history prepend 위치 복원, controlled bottom-follow와 관련 action 배치만 소유합니다.
- 전체 채팅 화면, header, composer, thread switcher를 포함하는 `ChatWindow` wrapper가 아닙니다.
- 메시지별 lifecycle과 action은 `ConversationMessage`, 작성과 전송은 `MessageComposer`의 책임입니다.

## 의미와 상호작용 계약

- 포커스 가능한 스크롤 viewport는 `role="log"`, `aria-live="polite"`, `aria-relevant="additions"`, `aria-atomic="false"`와 접근 가능한 이름을 가집니다.
- `role="feed"`, article roving focus, Arrow/Page key 재구현을 사용하지 않습니다. `Tab`으로 viewport에 진입한 뒤 브라우저의 native Arrow/Page scrolling을 그대로 사용합니다.
- `busy` 또는 `loadingPrevious` 동안 viewport에 `aria-busy="true"`를 적용합니다.
- `maxHeight`는 log viewport의 최대 높이만 바꾸며 주변 page layout을 소유하지 않습니다. `loadPreviousLabel`과 `jumpToLatestLabel`은 각 action의 visible base label이고 unread count 등 계산된 접근성 문구는 그대로 보존됩니다.
- 이전 기록 action은 viewport보다 먼저, 최신 메시지 action은 viewport 뒤에 놓습니다. 어느 action도 메시지를 가리지 않습니다.
- 이전 기록을 요청하기 직전 `scrollHeight`와 `scrollTop`을 저장합니다. controlled children/loading 갱신 뒤 `oldScrollTop + (newScrollHeight - oldScrollHeight)`로 복원하며, 이 복원은 bottom-follow와 ResizeObserver보다 우선합니다.
- 과거 기록을 prepend하는 동안 log의 `aria-live`를 일시적으로 `off`로 전환하고 위치 복원이 끝난 다음 paint에서 `polite`로 되돌립니다. WAI-ARIA `log`의 “새 정보는 끝에 추가”되는 계약과 달리 과거 DOM 항목은 새 메시지가 아니므로, 여러 과거 메시지와 별도 `liveStatus` 완료 문구가 중복 발표되지 않게 합니다.
- `following=false`이면 children 추가와 content resize가 자동으로 bottom scroll을 만들지 않습니다. 사용자가 bottom을 떠나거나 돌아오면 `onFollowingChange(next, 'user-scroll')`을 호출합니다.
- 최신 메시지 action은 먼저 bottom으로 이동하고 `onFollowingChange(true, 'jump-to-latest')`와 `onJumpToLatest`를 호출합니다. 버튼은 포커스가 빠져나갈 때까지 DOM에 남아 `focus({preventScroll:true})`를 유지합니다.
- `liveStatus`는 message log 밖의 visually-hidden `role="status"`입니다. “응답 생성 중”, “기록 불러오기 완료”처럼 짧은 phase만 전달하며 streaming token 본문을 반복해서 넣지 않습니다. 초기 busy 상태는 이 숨은 문구에만 의존하지 않고 `empty` slot에 Spinner와 짧은 visible label을 조합해 빈 상태와 시각적으로 구분합니다.
- `ResizeObserver`는 사용할 수 있을 때만 bottom-follow를 보완합니다. Observer가 없는 SSR/구형 환경에서도 기본 동작과 렌더링은 유지됩니다.

## 내부 LDS 비교와 시각 델타

| 비교 대상 | 계승 | 의도적으로 다른 점 |
| --- | --- | --- |
| `ScrollArea` | native overflow와 얇은 스크롤 surface 개념 | MessageFeed가 log 의미, focus, follow와 prepend anchor를 직접 소유합니다. ScrollArea를 중첩하지 않습니다. |
| `LogViewer` | `role="log"`, tail/latest의 개념 | 어두운 console surface, level filter, search, virtualization, 행별 copy를 제외합니다. 채팅 읽기 흐름을 위한 중립 elevated surface를 사용합니다. |
| `ResourceState` | `aria-busy`와 별도 phase announcement | 리소스 전체를 empty/error 화면으로 교체하지 않고 message children과 읽기 위치를 보존합니다. |
| `Button` | history/latest action의 크기, focus, disabled/loading 처리 | 새로운 전용 control chrome이나 token을 추가하지 않습니다. |
| `VisuallyHidden` | phase-level status 전달 | 개별 메시지나 streaming token을 별도 live region으로 복제하지 않습니다. |

surface는 `background-elevated`, Card border/radius/shadow, 기존 spacing·typography token만 사용합니다. 메시지 child 주위에 별도 card를 만들지 않으며, 320px에서 action과 긴 본문이 가로 overflow를 만들지 않아야 합니다.

## 외부 근거와 적용 결론

- [W3C ARIA23: role=log for sequential updates](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA23)는 채팅 기록처럼 끝에 추가되는 순차 정보에 `role="log"`를 적용하는 예를 제시합니다. 따라서 feed 전체만 live region을 소유하고 메시지마다 live region을 만들지 않습니다.
- [WAI-ARIA 1.2 log role](https://www.w3.org/TR/wai-aria-1.2/#log)은 새 정보가 의미 있는 순서로 추가되는 live region을 정의합니다. named polite log와 additions-only announcement를 사용합니다.
- [WAI-ARIA `log` role](https://www.w3.org/TR/wai-aria/#log)은 새 정보가 log 끝에 추가되는 의미 순서를 전제로 합니다. 사용자가 요청한 과거 history prepend는 새 도착 메시지가 아니므로 해당 commit과 scroll-anchor 복원 동안 live announcement를 억제합니다.
- [WAI-ARIA APG Feed Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/feed/)은 infinite-loading article feed와 assistive-technology focus/scroll 상호운용 계약을 요구합니다. MessageFeed는 scroll-triggered infinite feed가 아니므로 `role="feed"`, article position metadata, roving article focus를 도입하지 않습니다.
- [Carbon AI Chat server communication](https://chat.carbondesignsystem.com/tag/latest/docs/documents/Server_communication.html)은 partial streaming, complete item, final response, cancellation과 history를 서로 다른 lifecycle 단계로 다룹니다. MessageFeed는 token 병합을 소유하지 않고 `liveStatus`로 짧은 phase만 알리며, 최종 메시지 DOM은 제품이 `children`으로 갱신합니다.

## 대표 검수 조건

- 일반 폭: overview log의 이름, live 속성, 시간순 DOM과 neutral surface를 확인합니다.
- history: 중간 위치에서 과거 메시지를 prepend한 뒤 기존 anchor의 화면상 위치가 유지되어야 합니다.
- history announcement: prepend·anchor 복원 동안 `aria-live="off"`, 안정화 뒤 `polite`로 복귀해야 합니다.
- follow/unread: 사용자가 위로 이동한 동안 새 child가 추가되어도 `scrollTop`이 바뀌지 않고, 최신 action 후 bottom·callback·button focus가 모두 유지되어야 합니다.
- empty/busy: empty content는 log 안에 있고 phase status는 log 밖에 있으며 `aria-busy`가 loading 구간만 표시되어야 합니다. busy 예시는 visible Spinner와 처리 문구를 함께 보여 정적인 빈 목록과 즉시 구분되어야 합니다.
- 320px: history action → log → latest action의 읽기 순서와 가로 overflow 부재를 확인합니다.
- dark: 별도 inverse prop 없이 log surface, 행 divider, author, body, time, focusable viewport의 대비와 위계가 유지되어야 합니다.
