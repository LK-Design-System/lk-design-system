# MessageComposer

`MessageComposer`는 대화 초안을 입력하고 명시적으로 제출하거나 진행 중인 응답의 중지를 요청하는 **LK Product Extension**입니다. transport, provider, persistence, 메시지 목록은 소유하지 않습니다.

```jsx
<MessageComposer
  value={draft}
  onValueChange={setDraft}
  onSubmit={(value, reason) => sendMessage(value, reason)}
  state={requestState}
  onStop={stopResponse}
/>
```

## 책임과 상태

- `value`는 완전한 controlled value입니다. submit callback 뒤에도 내부에서 값을 지우지 않습니다.
- `state`는 `idle`, `submitting`, `streaming`, `stopping`으로 제품이 갱신합니다. callback 호출만으로 다음 상태나 요청 완료를 추론하지 않습니다.
- `idle`에서는 40px send action을, 그 밖의 상태에서는 40px stop action을 같은 trailing 위치에 둡니다. 실제 중지는 `submitting`·`streaming`과 `onStop`이 함께 있을 때만 가능합니다. `stopping`은 중복 요청을 막습니다.
- `canSubmit`이 생략되면 공백을 제외한 값이 있을 때만 제출합니다. `readOnly`는 focus와 복사를 유지하지만 편집·제출을 막습니다.
- `disabled: true`에는 `disabledReason`이 타입과 런타임 모두에서 필수입니다. 이유는 attachment와 control보다 먼저 렌더되고 textarea의 `aria-describedby`에 연결됩니다.
- attachment preview는 control row 앞의 `attachments` slot에 둡니다. `attachmentAction`과 `secondaryActions`는 32px `IconButton` 계열을 사용하는 utility slot입니다.
- `formLabel`과 `inputLabel`은 form/textarea의 접근 가능한 이름이며 visible description을 대신하지 않습니다. `statusLabel`은 non-idle phase 문구만 재정의합니다.
- `submitLabel`과 `stopLabel`은 동일 trailing control 위치에서 현재 action을 이름 붙입니다. `maxLength`는 native limit와 visible counter를 함께 제공하고, `textareaProps`는 controlled 계약이 소유하지 않는 native textarea 속성만 전달합니다.

## Keyboard와 IME

- `submitMode="enter"`: modifier 없는 Enter로 제출하고 Shift+Enter는 줄바꿈입니다.
- `submitMode="modifier-enter"`: Ctrl+Enter 또는 Meta+Enter만 제출합니다. Enter와 Shift+Enter는 줄바꿈입니다.
- `submitMode="button-only"`: textarea의 모든 Enter를 줄바꿈으로 남기며 button만 제출합니다.
- composition session ref와 native `isComposing`/keyCode 229를 함께 확인해 한글·일본어·중국어 IME 확정 Enter가 제출로 이어지지 않게 합니다.
- Escape는 stop shortcut이 아닙니다. stop은 이름이 있는 버튼으로만 요청합니다.
- 제출 뒤 textarea focus를 복귀시키되 value clear, loading 종료, response 완료는 수행하지 않습니다.

## LDS sibling 비교와 시각 결정

| 비교 대상 | 확인한 규칙 | MessageComposer 결정 |
| --- | --- | --- |
| `Textarea` | label/helper/error, semantic input border·focus ring, 최소 120px 문서 입력 | 대화 작성은 한 줄에서 시작해야 하므로 Core Textarea를 변경하거나 중첩하지 않고 같은 input tokens를 쓰는 44px 내부 autosize textarea를 둠 |
| `Input` | 40px control scale, elevated field fill, disabled/read-only 구분 | border·fill·focus를 계승하되 multiline 성장만 추가 |
| `Button` | md 40px primary action, native disabled와 focus | send/stop을 같은 trailing primary surface에 두고 glyph와 accessible name으로 현재 행동을 구분 |
| `IconButton` | small 32px one-shot utility | attachment/secondary action의 권장 크기와 역할로 사용 |
| `ActionArea` | persistent bottom action region과 divider/safe-area | composer는 단일 입력 control이므로 사용하지 않음. 화면 고정·keyboard inset 배치는 제품 shell이 소유 |
| `ConversationMessage` | message content와 lifecycle action, 최대 42rem 읽기 폭 | composer를 message surface 안에 중첩하지 않고 feed 다음의 독립 form으로 둠 |

- 읽기 순서와 DOM 순서는 input label → description → disabled reason → attachments → utility/input/send-stop → status/counter입니다.
- control row는 card 안의 또 다른 card처럼 보이지 않도록 input border 하나만 사용합니다. 첨부 예시는 공용 `Chip`과 `Icon`을 조합하고, 제품 shell은 composer 바깥에 중복 border·radius·surface를 덧씌우지 않습니다. 별도 header, footer divider, shadow를 추가하지 않습니다.
- textarea는 44px에서 시작해 `minRows`/`maxRows` 범위에서 커지고 최대 높이 이후에만 자체 스크롤합니다. 320px에서도 `minmax(0, 1fr)`로 utility와 submit action 사이를 벗어나지 않습니다.
- non-idle state는 성공·실패를 뜻하지 않으므로 neutral status text를 사용합니다. 성공 badge나 임의의 transport error UI를 만들지 않습니다.

## Authoritative external review

- [W3C UI Events — Composition Events](https://www.w3.org/TR/uievents/#events-compositionevents)는 composition 시작부터 종료까지의 입력 세션과 keyboard event의 composition 여부를 별도로 정의합니다. 이 근거로 composition ref와 event signal을 함께 확인하며 IME 확정 키를 일반 Enter submit으로 해석하지 않습니다.
- [W3C UI Events — KeyboardEvent `isComposing`](https://www.w3.org/TR/uievents/#dom-keyboardevent-iscomposing)는 key event가 composition session 중 발생했는지를 노출합니다. key 값만 비교하지 않고 `isComposing`과 legacy 229 fallback을 확인합니다.
- [Carbon AI Chat hierarchy](https://chat.carbondesignsystem.com/tag/latest/docs/hierarchy.html)는 message input과 response item을 서로 다른 구조적 영역으로 둡니다. LDS도 composer를 message bubble이나 feed live region에 합치지 않습니다.
- [Carbon AI Chat server communication](https://chat.carbondesignsystem.com/tag/latest/docs/documents/Server_communication.html)는 loading, streaming, stop/cancel 요청, final response를 독립적인 server lifecycle로 다룹니다. 따라서 LDS callback은 요청 의도만 전달하고 완료 상태나 value clear를 내부에서 추론하지 않습니다.

## 의도적으로 제외한 범위

- provider 호출, abort controller, timeout, retry, optimistic message 생성, persistence
- markdown·mention·command editor, rich text, voice recording, attachment upload lifecycle
- feed scrolling, unread/live announcement, virtual keyboard viewport 보정, sticky positioning
- send 성공·실패 toast와 moderation·permission 정책

이 기능들은 제품 또는 `MessageFeed`/attachment 전용 컴포넌트가 소유합니다. `ChatWindow` 같은 workflow wrapper도 이 컴포넌트 계약에 포함하지 않습니다.
