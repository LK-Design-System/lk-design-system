# MessageComposer

`MessageComposer`는 AI 또는 사람 간 대화의 controlled draft, attachment, leading/trailing utility와 send/stop action을 하나의 elevated input shell에 구성하는 **LK Product Extension**입니다. provider, transport, persistence와 sticky application layout은 소유하지 않습니다.

```jsx
<MessageComposer
  value={draft}
  onValueChange={setDraft}
  onSubmit={(value, reason) => send(value, reason)}
  state={requestState}
  attachments={<FileUploadQueue items={draftFiles} />}
  leadingActions={<IconButton label="파일 첨부" />}
  trailingActions={<IconButton label="음성 입력" />}
  onStop={stopResponse}
/>
```

## 분류와 책임

- 분류는 **LK Product Extension**이며 WDS Core parity를 주장하지 않습니다.
- `value`는 완전한 controlled value입니다. submit callback 뒤에도 내부에서 지우지 않습니다.
- `state`는 `idle | submitting | streaming | stopping`이며 제품이 갱신합니다. callback만으로 다음 lifecycle이나 성공을 추론하지 않습니다.
- `attachments`, `leadingActions`, `trailingActions`는 `ReactNode` slot입니다. attachment selection/upload, voice capture, model/tool picker와 permission은 slot consumer가 소유합니다.
- reading order는 description/disabled reason → shell의 attachments → textarea → 하단 leading actions → trailing actions → primary send/stop → status/counter입니다.
- leading/trailing action은 position만 설명합니다. 특정 attachment/template/provider 기능을 고정하지 않습니다.
- idle은 send, submitting/streaming은 stop을 같은 primary-action 위치에 둡니다. stopping은 중복 stop 요청을 막습니다.
- `canSubmit`을 생략하면 trim한 값이 있을 때만 submit할 수 있습니다. `readOnly`는 focus와 copy를 유지하되 편집·submit을 막습니다.
- `statusLabel={null}`은 기본 lifecycle 문구를 숨깁니다. `undefined`일 때만 non-idle 기본 문구를 사용합니다.
- `disabled: true`는 visible `disabledReason`을 요구하며 textarea의 description에 연결합니다. shell 전체를 inert subtree로 만들어 slot으로 조합한 button/link도 focus와 activation에서 제외합니다.
- `formLabel`과 `inputLabel`은 form/textarea의 접근 가능한 이름, `submitLabel`과 `stopLabel`은 icon-only primary action 이름을 현지화합니다.
- `maxLength`는 native 제한과 visible counter를 함께 제공하고, `textareaProps`는 controlled value·rows·disabled 같은 소유 prop을 제외한 native textarea 속성/이벤트를 전달합니다.

## keyboard와 IME

- `submitMode="enter"`: modifier 없는 Enter로 제출하고 Shift+Enter는 줄바꿈입니다.
- `submitMode="modifier-enter"`: Ctrl+Enter 또는 Meta+Enter만 제출합니다.
- `submitMode="button-only"`: Enter를 항상 줄바꿈으로 남기고 button만 제출합니다.
- composition session과 `KeyboardEvent.isComposing`을 확인해 한글·일본어·중국어 확정 Enter가 submit으로 이어지지 않게 합니다.
- Escape는 암묵적 stop shortcut이 아닙니다. stop은 접근 가능한 이름과 visible focus를 가진 primary action으로 요청합니다.
- submit 뒤 textarea focus를 복귀시키되 value clear, loading 종료와 response 완료는 수행하지 않습니다.

## 내부 LDS 비교와 visual delta

| 확인한 sibling | 계승한 규칙 | MessageComposer 결정 |
| --- | --- | --- |
| `Textarea` | label/helper, text input token, focus, disabled/read-only | controlled autosize textarea를 composer shell 안에 두고 Core API를 변경하지 않음 |
| input tokens | field border/fill, focus ring, semantic dark mode | 하나의 elevated rounded shell에 적용 |
| `Button` / `IconButton` | named action, focus footprint, disabled | utility와 send/stop의 실제 control로 조합 |
| `FileUploadQueue` | 파일별 upload/conversion status | `attachments` slot에서 조합하고 composer가 queue lifecycle을 소유하지 않음 |
| `ConversationMessage` | response lifecycle presentation | composer는 message article이나 live region 안에 중첩하지 않음 |
| `ActionArea` | persistent action과 safe-area 고려 | sticky, keyboard inset과 safe-area는 product shell에 남김 |

### one-shell hierarchy

- attachment preview, textarea와 하단 action band는 하나의 border, radius, fill과 focus-within state를 공유합니다. composer 바깥에 별도 footer card를 추가하지 않습니다.
- textarea는 compact row에서 시작해 `minRows`/`maxRows` 범위에서 커지고 최대 높이 뒤에는 내부 scrolling을 사용합니다.
- utility와 primary action은 multiline input의 하단 action band에 정렬합니다. exact pixel보다 LDS control size와 focus token을 따릅니다.
- 320px에서는 textarea가 먼저 전체 draft 폭을 확보하고 하단 action band가 wrap합니다. action을 숨기거나 action 수 때문에 입력 열을 축소하지 않으며, slot content도 자체 wrapping/overflow policy를 제공해야 합니다.
- non-idle은 성공이나 실패를 의미하지 않으므로 neutral phase text를 사용합니다. unavailable/error 이유는 visible text로 제공합니다.
- light/dark 모두 LDS semantic input token을 사용하며 exact Figma color, product logo, provider selector와 custom shadow를 만들지 않습니다.

## authoritative external review

- [Ant Design X Sender](https://x.ant.design/components/sender/)는 autosize input, submit/cancel, prefix/header/footer와 speech/action extension을 독립 composition slot으로 다룹니다. LDS의 controlled input과 leading/trailing slot 구분에 반영했습니다.
- [Ant Design X Attachments](https://x.ant.design/components/attachments/)는 drag/drop과 file/image/audio/video/document attachment를 Sender와 별도 anatomy로 구성합니다. composer가 upload schema를 소유하지 않는 근거입니다.
- [Ant Design X Bubble](https://x.ant.design/components/bubble/)은 response content와 input action을 분리합니다. Composer는 document/bubble presentation이나 message-level action을 소유하지 않습니다.
- [Carbon AI Chat overview](https://chat.carbondesignsystem.com/tag/latest/docs/documents/Overview.html)는 rich, extensible chat input/response를 여러 제품에 조합하는 방향을 제시합니다. 특정 product tool을 public composer API에 고정하지 않습니다.
- [Carbon AI Chat server communication](https://chat.carbondesignsystem.com/tag/latest/docs/documents/Server_communication.html)은 submit, streaming, cancel과 final을 분리합니다. callback 뒤 상태나 value clear를 추론하지 않습니다.
- [WAI-ARIA `log`](https://www.w3.org/TR/wai-aria/#log)는 chronological message announcement를 log container에 둡니다. Composer form은 log 밖에 남아 draft 입력이 새 message announcement로 반복되지 않게 합니다.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)를 accessible name, keyboard, focus, disabled explanation, target와 contrast의 최종 기준으로 사용합니다.

## secondary visual inspiration

- [3 Free AI Chatbot App UI Kit](https://www.figma.com/design/ss5Fq2VKd2UDoHk7SE9dPl/3-Free-AI-Chatbot-App-UI-Kit--Community-?node-id=10301-21963)의 왼쪽 slothGPT/general-assistant composer를 secondary visual inspiration으로 사용합니다.
- 채택한 것은 conversation column 하단의 단일 elevated shell, expanding draft와 명시적 send action입니다. exact purple, logo, provider tool, voice control, desktop/mobile frame와 shadow 값은 복사하지 않습니다.
- 중앙 slothpilot/Context Hub composer는 design authority가 아니며 product-specific tool row를 public API에 고정하지 않습니다.

## product workflow gate

- **LK Context Hub — supported by composition only.** attachment, retrieval scope 또는 provider control을 leading/trailing slot에 조합할 수 있지만 현재 product composer의 anatomy, order, color와 API를 그대로 가져오지 않습니다.
- **LK Web Viz — not applicable.** map command entry와 viewport selection은 AI conversation draft가 아니며 해당 editor/control이 소유합니다.
- **LK Control Full Daedeok — not applicable.** safety-critical manual control과 task command는 chat submit으로 모델링하지 않습니다.
- product repository는 필요한 component/state coverage만 확인하고 design, anatomy, public API와 style 근거로 사용하지 않습니다.

## representative review

- 약 760px: attachment → draft → 하단 leading/trailing action → send/stop의 hierarchy와 elevated one-shell focus를 확인합니다.
- 320px: 긴 attachment와 multiline draft가 전체 입력 폭을 먼저 확보하고 하단 action band만 wrap하며 horizontal overflow를 만들지 않는지 확인합니다.
- dark: shell border/fill/focus, placeholder, disabled reason, counter와 icon action contrast를 확인합니다.
- interaction: enter/modifier-enter/button-only, IME 확정 Enter, submit focus return과 explicit streaming stop을 확인합니다.
- compound: long assistant response 아래에서도 composer가 별도 app footer card나 fixed product shell로 보이지 않아야 합니다.

## intentional exclusions

- provider 호출, abort controller, timeout, retry, optimistic message 생성과 persistence
- Markdown/mention/command editor, voice capture와 attachment upload lifecycle
- feed scrolling, unread/live announcement, virtual-keyboard viewport 보정과 sticky positioning
- send success/failure toast, moderation, permission과 scope policy

이 기능은 제품 또는 `MessageFeed`, attachment 전용 component가 소유합니다. complete `ChatWindow` workflow wrapper는 이 계약에 포함하지 않습니다.
