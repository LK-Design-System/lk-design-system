# MessageComposer

`MessageComposer`는 AI 또는 사람 간 대화의 controlled draft, attachment, leading/trailing utility와 send/stop action을 하나의 elevated input shell에 구성하는 **LK Product Extension**입니다. provider, transport, persistence와 sticky application layout은 소유하지 않습니다.

```jsx
<MessageComposer
  value={draft}
  onValueChange={setDraft}
  onSubmit={(value, reason) => send(value, reason)}
  state={requestState}
  density="compact"
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
- `density`는 `comfortable | compact`입니다. 2026-10-09 승인된 D03 개정으로 stacked 한 줄 입력은 comfortable 40px, compact 32px에서 시작합니다. 16px 입력 글자, 24px line-height와 기존 버튼 모서리는 유지합니다. stacked send/stop은 32px입니다.
- `layout`은 `stacked | inline`이며 기본값은 `stacked`입니다. 단순 작성에서 명시한 `inline`은 textarea와 send/stop을 같은 행에 배치합니다. 입력/내장 action 최소 44px, shell 2px inset과 1px border를 합해 빈 초안 shell은 약 50px입니다. density와 별도 anatomy 축이며 설치된 0.4.7에는 없습니다.
- `attachments`, `leadingActions`, `trailingActions`는 `ReactNode` slot입니다. attachment selection/upload, voice capture, model/tool picker와 permission은 slot consumer가 소유합니다.
- reading order는 description/disabled reason → shell의 attachments → textarea → 하단 leading actions → trailing actions → primary send/stop → status/counter입니다.
- leading/trailing action은 position만 설명합니다. 특정 attachment/template/provider 기능을 고정하지 않습니다.
- idle은 send, submitting/streaming은 stop을 같은 primary-action 위치에 둡니다. stopping은 중복 stop 요청을 막습니다.
- `canSubmit`을 생략하면 trim한 값이 있을 때만 submit할 수 있습니다. `readOnly`는 focus와 copy를 유지하되 편집·submit을 막습니다.
- `statusLabel={null}`은 기본 lifecycle 문구를 숨깁니다. `undefined`일 때만 non-idle 기본 문구를 사용합니다.
- status live region은 내용이 있을 때 mount하지 않고 **composer 수명 내내 비어 있는 상태로 상시 mount**한 뒤 텍스트만 교체합니다. 텍스트와 함께 삽입된 status node는 기존 live region의 변경이 아니어서 첫 idle→submitting 알림이 누락되기 때문입니다. 보이는 status 문구는 같은 내용을 중복 발표하지 않도록 `aria-hidden` 장식으로 둡니다.
- stop 버튼은 `stopping`에서도 native `disabled`가 되지 않고 `aria-disabled`로 중복 요청만 거부합니다. native disabled는 방금 누른 사용자의 초점을 `<body>`로 떨어뜨립니다. 요청이 끝나 idle로 돌아갈 때 primary action이 초점을 잃으면 submit 뒤와 같은 규칙으로 textarea에 초점을 되돌립니다.
- `disabled: true`는 visible `disabledReason`을 요구하며 textarea의 description에 연결합니다. shell 전체를 inert subtree로 만들어 slot으로 조합한 button/link도 focus와 activation에서 제외합니다.
- `formLabel`과 `inputLabel`은 form/textarea의 접근 가능한 이름, `submitLabel`과 `stopLabel`은 icon-only primary action 이름을 현지화합니다.
- `maxLength`는 native 제한과 visible counter를 함께 제공하고, `textareaProps`는 controlled value·rows·disabled 같은 소유 prop을 제외한 native textarea 속성/이벤트를 전달합니다.

## keyboard와 IME

### D03/V02 자동 높이

minRows=1로 더 낮게 시작하며 value뿐 아니라 textarea 폭도 ResizeObserver로 관찰합니다.
같은 폭에서는 높이를 쓰지 않아 feedback loop를 피합니다. minRows/maxRows를 지키고 긴 초안은 내부 스크롤입니다.
observer는 cleanup에서 해제합니다. 형제 Input·SearchField와 textarea/action band의 anatomy를 유지합니다.
[MDN ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)와
[WCAG Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)를 검토했습니다.
형제 비교·제품 seam은 [소스 검토 기록](../../docs/handoff/2026-10-09-portal-density-source-review.md)에 있습니다.

### D03 단순 작성의 inline anatomy

```jsx
<MessageComposer layout="inline" density="compact" minRows={1} maxRows={6}
  value={draft} onValueChange={setDraft} onSubmit={send}
  placeholder="무엇을 도와드릴까요?" />
```

긴 초안은 같은 textarea DOM에서 minRows/maxRows 범위로 커지고 내장 send/stop은 아래에 정렬됩니다.
첨부 또는 leading/trailing action slot을 전달하면 textarea의 전체 폭과 utility band wrapping을 보존하는
stacked 구조로 확장합니다. 이때도 inline을 요청한 내장 action은 44px입니다. slot의 44px touch target은
consumer가 구성합니다. shell의 `data-layout`은 요청한 축, `data-composer-layout`은 실제 inline/stacked 구조를
표시합니다. 초안 높이로 구조를 반복 전환하지 않아 폭/높이 계산 진동을 피합니다. 초점·IME·상태·읽기 순서는 같습니다.

외부 근거는 구현 전에 확인했습니다. [OpenAI UI guidelines](https://developers.openai.com/plugins/concepts/ui-guidelines)는
composer를 통해 대화 맥락에서 자연스럽게 이어가는 원칙을 설명하며 픽셀 규격을 제공하지 않습니다.
[Claude Academy](https://academy.claude.com/tutorials/getting-started-with-claude)는 자연어 작성과 파일 첨부의 흐름을 설명합니다.
[Claude 제품 페이지](https://claude.com/ko/product/overview)의 AskCTA rows=1·36px textarea 관찰은 부모가 제공한
마케팅 CTA 관찰이며 실사용 Claude 홈 배치의 증거가 아닙니다. Claude 실사용 홈은 로그인 경계로 확인하지 못했습니다.
사용자 첨부 ChatGPT 1920×900 화면의 약 54px 한 행 pill은 부모의 이미지 관찰이며 공식 pixel specification이 아닙니다.
LDS는 형제 Button/Input의 token·semantic 색·모서리를 계승하고, 44px target+기존 spacing으로 약 50px을 정했습니다.

- `submitMode="enter"`: modifier 없는 Enter로 제출하고 Shift+Enter는 줄바꿈입니다.
- `submitMode="modifier-enter"`: Alt가 없는 Ctrl+Enter 또는 Meta+Enter만 제출합니다. Ctrl+Alt/AltGr와 Option+Command 조합은 문자 입력 충돌을 피하기 위해 제출하지 않습니다.
- `submitMode="button-only"`: Enter를 항상 줄바꿈으로 남기고 button만 제출합니다.
- 이 세 모드는 제품이 명시적으로 선택하는 계약이며 사용자 환경을 추측해 런타임에 전환하지 않습니다. `enterKeyHint`는 `enter` 모드에서 `send`, 나머지 모드에서 `enter`를 기본값으로 제공합니다.
- composition session과 `KeyboardEvent.isComposing`을 함께 확인하고 legacy IME keyCode 229도 방어해 한글·일본어·중국어 확정 Enter가 submit으로 이어지지 않게 합니다. 조합 확정 직후에는 같은 keydown을 제출 동작으로 재사용하지 않습니다.
- Escape는 암묵적 stop shortcut이 아닙니다. stop은 접근 가능한 이름과 visible focus를 가진 primary action으로 요청합니다.
- submit 뒤 textarea focus를 복귀시키되 value clear, loading 종료와 response 완료는 수행하지 않습니다.

## read-only와 disabled 결정

- `readOnly`는 textarea를 tab order에 남겨 내용을 읽고 선택·복사할 수 있게 하되 send를 비활성화합니다. unavailable reason을 전달하는 용도로 사용하지 않습니다.
- `disabled`는 native textarea `disabled`, form/shell의 `aria-disabled`, shell의 `inert`를 함께 사용합니다. native control의 비활성 동작과 slot으로 들어온 button/link의 focus·activation 차단을 모두 충족하기 위한 조합입니다.
- `aria-disabled`만으로는 동작이 차단되지 않으므로 단독 사용하지 않습니다. 반대로 form의 disabled 상태가 보조 기술에도 명확하도록 `aria-disabled="true"`를 유지합니다.
- `disabledReason`은 `disabled=true`일 때 빈 값이 아닌 visible content로 필수이며 controls보다 먼저 렌더링합니다. 생성한 id를 textarea의 `aria-describedby`에 합쳐 이용 불가 이유를 입력과 직접 연결합니다.
- 비활성 상태를 placeholder, tooltip, 색상 변화만으로 설명하지 않습니다. slot content는 shell 전체의 `inert` 경계 안에 둡니다.

## 내부 LDS 비교와 visual delta

| 확인한 sibling | 계승한 규칙 | MessageComposer 결정 |
| --- | --- | --- |
| `Textarea` | label/helper, text input token, focus, disabled/read-only | controlled autosize textarea를 composer shell 안에 두고 Core API를 변경하지 않음 |
| input tokens | field border/fill, semantic dark mode | 하나의 elevated rounded shell에 적용. focus는 input의 primary border·halo 대신 shell의 중립 border 한 단계(`--component-message-composer-border-focus`)로 표시 |
| `Button` / `IconButton` | named action, focus footprint, disabled | utility와 send/stop의 실제 control로 조합 |
| `FileUploadQueue` | 파일별 upload/conversion status | `attachments` slot에서 조합하고 composer가 queue lifecycle을 소유하지 않음 |
| `ConversationMessage` | response lifecycle presentation | composer는 message article이나 live region 안에 중첩하지 않음 |
| `ActionArea` | persistent action과 safe-area 고려 | sticky, keyboard inset과 safe-area는 product shell에 남김 |

### one-shell hierarchy

- attachment preview, textarea와 하단 action band는 하나의 border, radius, fill과 focus-within state를 공유합니다. composer 바깥에 별도 footer card를 추가하지 않습니다.
- focus 표시는 shell 하나가 소유합니다. textarea에 focus가 있으면 shell border만 중립 회색 `--component-message-composer-border-focus`(`cool-neutral-60`, 흰 shell 대비 3.45:1, 다크 elevated shell 대비 4.61:1)로 한 단계 진해지고, primary 색 border·`focus-ring` halo·두께 변화는 없습니다(2026-10-09 owner 결정, Claude·ChatGPT 작성창처럼 작성 중에는 caret이 입력 위치를 알립니다). 안쪽 textarea는 전역 `:focus-visible` 사각 링에서 제외되어(`tokens/components.css`의 product 규칙) shell 안에 두 번째 사각형을 그리지 않습니다. leading/trailing slot과 send/stop button은 전역 2px focus ring을 그대로 유지합니다. forced-colors에서는 border 색 단계가 사라지므로 focused shell이 `outline: 2px solid Highlight`를 그립니다. WCAG 2.4.7은 shell border와 caret으로, 1.4.11은 border 3:1 이상으로 충족합니다.
- stacked textarea는 `comfortable` 40px 또는 `compact` 32px, inline은 44px의 한 줄 높이에서 시작해 `minRows`/`maxRows` 범위에서 커지고 최대 높이 뒤에는 내부 scrolling을 사용합니다. 초안과 컨테이너 폭 변경 모두 재계산합니다.
- utility와 primary action은 multiline input의 하단 action band에 정렬합니다. exact pixel보다 LDS control size와 focus token을 따릅니다.
- 320px stacked 및 slot을 전달한 확장 구조에서는 textarea가 먼저 전체 draft 폭을 확보하고 하단 action band가 wrap합니다. 단순 inline은 send44px을 제외한 입력 폭을 쓰고 긴 초안을 높이로 확장합니다. action을 숨기지 않으며 slot content도 자체 wrapping/overflow policy를 제공해야 합니다.
- `compact`는 textarea 세로 padding, shell inset, attachment 상단 inset과 action/status gap을 LDS spacing token의 작은 단계로 줄이고 primary send/stop의 radius를 shell corner에 맞춥니다. DOM/read order, focus ring, autosize, state, submit/stop과 live-region 계약은 `comfortable`과 같습니다.
- stacked 내장 send/stop은 32×32px, inline을 요청한 내장 action은 확장 후에도 44×44px입니다. stacked slot target은 최소 24×24 CSS px, inline mobile slot target은 44×44px로 구성합니다. composer는 slot consumer의 control 크기를 덮어쓰지 않습니다.
- non-idle은 성공이나 실패를 의미하지 않으므로 neutral phase text를 사용합니다. unavailable/error 이유는 visible text로 제공합니다.
- light/dark 모두 LDS semantic input token을 사용하며 exact Figma color, product logo, provider selector와 custom shadow를 만들지 않습니다.

### LK Portal consumer evidence와 compact 계약

- 2026-10-09 부모 CUA 소스 비교 통과: 빈 inline shell50px / compact stacked72px, 입력16px. 같은55자 초안은 desktop textarea44px → viewport390px에서88px로 확장되며 값이 유지되고 클리핑·overflow가 없었으며 첨부 stacked 재배치도 통과했습니다. 부모 제공 screenshot 참조는 `ui-improvement/composer-inline-comparison.jpg`입니다. 이 composer 증거는 normal light이며 exhaustive dark/touch, composer forced-colors 및 추가 responsive 판정은 포함하지 않습니다.

- [`SELECT_AND_MESSAGE_FEED_LAYOUT_FOLLOWUP.md`](../../docs/SELECT_AND_MESSAGE_FEED_LAYOUT_FOLLOWUP.md)에 기록된 LK Portal floating knowledge chat은 460×674px 패널에서 scope control이 action band를 키우고 primary action을 다음 줄로 미는 사례를 보였습니다. Select 결함 수정과 별개로 `minRows`, scope 위치와 composer 밀도는 Portal composition 결정입니다.
- Portal처럼 폭과 세로 공간이 제한된 consumer는 `density="compact"`, 필요한 최소 `minRows`, 우선순위가 높은 utility만 composer 안에 조합합니다. 긴 scope/model selector를 compact가 임의로 숨기거나 재배치하지 않습니다.
- `compact`는 한 줄 textarea를 `--space-8`, textarea 세로 padding을 `--space-1`, shell/action 간격을 `--space-0-5` 중심으로 구성합니다. primary action은 기존 `--component-button-height-sm`과 Button `--lds-button-radius`의 `--radius-md`를 유지합니다. comfortable은 textarea 40px와 세로 inset16px를 쓰며 버튼 geometry와 interaction은 보존합니다.

### slot으로 조합하는 앵커드 오버레이

- `leadingActions`에는 추가·출처처럼 선택 즉시 실행되는 명령을 `DropdownMenu`로 조합합니다. `trailingActions`에는 읽기 전용·안전 안내, 응답 모드처럼 설명을 읽거나 값을 연속 조정하는 내용을 `Popover`로 조합합니다. `RadioGroup`과 `Slider`는 menu roving focus와 섞지 않고 Popover 안에 둡니다.
- MessageComposer의 public API와 source는 overlay를 위해 변경하지 않습니다. slot consumer가 선택된 출처, read-only, 응답 모드·자세함 상태와 제품의 provider·권한·정책을 소유하고, `DropdownMenu`/`Popover`가 owner-document Portal, flip, light dismiss, Escape와 trigger focus 복원을 소유합니다.
- 좁고 짧은 대화 열에서는 body Portal로 clipping을 탈출하되, 공유 primitive가 제공하는 `collisionBoundary`에 visible conversation column ref를 전달해 viewport와 그 열의 교집합 안에서 panel을 배치합니다. Portal target과 geometry boundary는 같은 책임이 아닙니다.
- Storybook은 완성 제품 화면이나 Portal 복제가 아닌 `MessageFeed` → `ConversationMessage` → `MessageComposer` generic composition으로 확인합니다. public 360px와 hidden 460px/296px short-height contract에서 모든 panel을 닫힌 상태로 시작하고, 실제 open·select·Escape·focus return, 긴 한국어 menu row의 wrap/scroll, feed/composer geometry와 horizontal overflow를 검증합니다.

## authoritative external review

- [Slack — Set your Enter key preference](https://slack.com/help/articles/115005523006-Set-your-Enter-key-preference)는 Enter를 보내기로 선택하면 Shift+Enter로 줄바꿈하고, Enter를 줄바꿈으로 선택하면 Mac의 Command+Enter 또는 Windows/Linux의 Ctrl+Enter로 보내는 공식 제품 관습을 설명합니다. 이를 `enter`와 `modifier-enter` 계약에 반영했고, 긴 형식 작성에는 더 명시적인 `button-only`도 제공합니다.
- [Slack — Use Slack with a screen reader](https://slack.com/help/articles/360000411963-Use-Slack-with-a-screen-reader)는 conversation 진입 시 message composer에 focus가 놓이고 Tab으로 primary action toolbar에 접근하며, 입력 후 Enter로 보내는 흐름을 설명합니다. 이에 따라 form/textarea/action에 각각 명시적 accessible name을 제공하고 제출 뒤 textarea focus를 복귀시키며, slot action을 DOM reading order에 유지합니다.
- [MDN — `disabled` HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/disabled)는 native form control의 focus·interaction·form submission 차단 semantics를 정의합니다. 내부 textarea는 실제 `disabled` attribute를 사용합니다.
- [MDN — `aria-disabled`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-disabled)는 상태만 보조 기술에 노출하며 기능을 자동으로 차단하지 않는다고 명시합니다. 그래서 composer는 `aria-disabled`를 상태 전달에 사용하되, slot subtree의 실제 차단은 `inert`와 event guard로 구현하고 visible `disabledReason`을 별도로 제공합니다.
- [Ant Design X Sender](https://x.ant.design/components/sender/)는 autosize input, submit/cancel, prefix/header/footer와 speech/action extension을 독립 composition slot으로 다룹니다. LDS의 controlled input과 leading/trailing slot 구분에 반영했습니다.
- [Ant Design X Attachments](https://x.ant.design/components/attachments/)는 drag/drop과 file/image/audio/video/document attachment를 Sender와 별도 anatomy로 구성합니다. composer가 upload schema를 소유하지 않는 근거입니다.
- [Ant Design X Bubble](https://x.ant.design/components/bubble/)은 response content와 input action을 분리합니다. Composer는 document/bubble presentation이나 message-level action을 소유하지 않습니다.
- [Carbon AI Chat overview](https://chat.carbondesignsystem.com/tag/latest/docs/documents/Overview.html)는 rich, extensible chat input/response를 여러 제품에 조합하는 방향을 제시합니다. 특정 product tool을 public composer API에 고정하지 않습니다.
- [Carbon AI Chat server communication](https://chat.carbondesignsystem.com/tag/latest/docs/documents/Server_communication.html)은 submit, streaming, cancel과 final을 분리합니다. callback 뒤 상태나 value clear를 추론하지 않습니다.
- [WAI-ARIA `log`](https://www.w3.org/TR/wai-aria/#log)는 chronological message announcement를 log container에 둡니다. Composer form은 log 밖에 남아 draft 입력이 새 message announcement로 반복되지 않게 합니다.
- [WAI-ARIA APG Menu Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/)은 menu trigger의 `aria-haspopup`, `aria-expanded`, 선택적 `aria-controls`, Arrow key로 여는 흐름과 Escape dismiss를 설명합니다. 추가·출처 slot은 이 관계와 Escape 뒤 trigger focus return을 지킵니다.
- [WCAG 2.2 Understanding 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)는 세로 scrolling content가 320 CSS px 상당 폭에서 정보·기능 손실이나 2차원 scrolling 없이 reflow되어야 한다고 설명합니다. compact도 textarea 우선 reading order와 wrapping을 유지하며 별도 horizontal scroll을 만들지 않습니다.
- [WCAG 2.2 Understanding 2.4.11 Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)은 keyboard focus indicator가 다른 author-created content에 완전히 가려지지 않아야 한다고 설명합니다. slot trigger와 Popover 안의 control은 panel boundary·Escape 뒤 focus return을 함께 검증합니다.
- [WCAG 2.2 Understanding 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)는 pointer target의 최소 크기를 24×24 CSS px로 정의합니다. density는 내장 32px primary action을 줄이지 않고 slot target에도 최소 24×24px 계약을 요구합니다.
- [React Aria Popover](https://react-spectrum.adobe.com/react-aria/Popover.html)는 Portal overlay의 placement와 `boundaryElement`를 분리하고 Escape/focus 흐름을 제공하는 비교 기준입니다. LDS는 `collisionBoundary`로 같은 geometry 책임을 primitive에 두며 Composer는 이를 소유하지 않습니다.

## secondary visual inspiration

- [3 Free AI Chatbot App UI Kit](https://www.figma.com/design/ss5Fq2VKd2UDoHk7SE9dPl/3-Free-AI-Chatbot-App-UI-Kit--Community-?node-id=10301-21963)의 왼쪽 slothGPT/general-assistant composer를 secondary visual inspiration으로 사용합니다.
- 채택한 것은 conversation column 하단의 단일 elevated shell, expanding draft와 명시적 send action입니다. exact purple, logo, provider tool, voice control, desktop/mobile frame와 shadow 값은 복사하지 않습니다.
- 중앙 slothpilot/Context Hub composer는 design authority가 아니며 product-specific tool row를 public API에 고정하지 않습니다.
- 사용자가 제공한 추가/플러그인 menu, 읽기 전용·안전 Popover, 모델·자세함 Popover 스크린샷도 secondary inspiration으로만 검토했습니다. compact panel을 작성기 위에 앵커링하고 긴 항목은 내부 scroll로 읽는 단서만 취했으며, 제품명·모델명·권한 정책·색·아이콘 조합·완성 화면 chrome은 복제하지 않습니다.

## product workflow gate

- **LK Context Hub — supported by composition only.** attachment, retrieval scope 또는 provider control을 leading/trailing slot에 조합할 수 있지만 현재 product composer의 anatomy, order, color와 API를 그대로 가져오지 않습니다.
- **LK Web Viz — not applicable.** map command entry와 viewport selection은 AI conversation draft가 아니며 해당 editor/control이 소유합니다.
- **LK Control Full Daedeok — not applicable.** safety-critical manual control과 task command는 chat submit으로 모델링하지 않습니다.
- product repository는 필요한 component/state coverage만 확인하고 design, anatomy, public API와 style 근거로 사용하지 않습니다.

## representative review

- 약 760px: attachment → draft → 하단 leading/trailing action → send/stop의 hierarchy와 elevated one-shell focus를 확인합니다.
- 320px: 긴 attachment와 multiline draft가 전체 입력 폭을 먼저 확보하고 하단 action band만 wrap하며 horizontal overflow를 만들지 않는지 확인합니다.
- 460px/360px/296px short-height generic conversation column: add/source menu, read-only/safety Popover, response mode/detail Popover가 body Portal로 clipping을 탈출하고 `collisionBoundary` 안에 배치되며 feed와 composer의 rect·scroll geometry를 바꾸지 않는지 확인합니다. 각 panel은 Escape 뒤 원래 slot trigger로 focus를 돌리고, 296px에서는 긴 한국어 command가 wrap·scroll하는지 확인합니다.
- dark: shell border/fill/focus, placeholder, disabled reason, counter와 icon action contrast를 확인합니다.
- interaction: enter/modifier-enter/button-only, Shift+Enter, Ctrl+Alt/AltGr 차단, Ctrl/Meta+Enter, IME 확정 Enter, submit focus return과 explicit streaming stop을 확인합니다.
- compound: long assistant response 아래에서도 composer가 별도 app footer card나 fixed product shell로 보이지 않아야 합니다.

## intentional exclusions

- provider 호출, abort controller, timeout, retry, optimistic message 생성과 persistence
- Markdown/mention/command editor, voice capture와 attachment upload lifecycle
- feed scrolling, unread/live announcement, virtual-keyboard viewport 보정과 sticky positioning
- send success/failure toast, moderation, permission과 scope policy
- 실제 source selection·persistence, provider/model 호출과 제품별 read-only·safety policy
- overlay primitive의 Portal target, floating placement, light dismiss와 focus-restoration 구현

이 기능은 제품 또는 `MessageFeed`, attachment 전용 component가 소유합니다. complete `ChatWindow` workflow wrapper는 이 계약에 포함하지 않습니다.
