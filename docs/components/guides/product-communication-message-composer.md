# Message Composer

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Communication |
| Owner | `MessageComposer` |
| Storybook | `LDS Product/Communication/Message Composer` |
| Source | `../component-content.json#product-communication-message-composer` |

사람 또는 AI와 대화하면서 짧은 요청과 여러 줄 초안을 작성할 때 사용합니다. 첨부와 보조 행동은 slot으로 조합하고 Composer는 값·전송·중지만 소유합니다. 단발성 검색이나 한 칸짜리 폼에는 사용하지 말고 SearchField·Textarea를 사용하세요.

## 사용 판단

### 사용

- light/dark 모두 LDS semantic input token을 사용하며 exact Figma color, product logo, provider selector와 custom shadow를 만들지 않습니다.
- Slack — Use Slack with a screen reader는 conversation 진입 시 message composer에 focus가 놓이고 Tab으로 primary action toolbar에 접근하며, 입력 후 Enter로 보내는 흐름을 설명합니다. 이에 따라 form/textarea/action에 각각 명시적 accessible name을 제공하고 제출 뒤 textarea focus를 복귀시키며, slot action을 DOM reading order에 유지합니다.
- MDN — disabled HTML attribute는 native form control의 focus·interaction·form submission 차단 semantics를 정의합니다. 내부 textarea는 실제 disabled attribute를 사용합니다.
- 3 Free AI Chatbot App UI Kit의 왼쪽 slothGPT/general-assistant composer를 secondary visual inspiration으로 사용합니다.

### 사용하지 않음

- 분류는 LK Product Extension이며 WDS Core parity를 주장하지 않습니다.
- state는 idle | submitting | streaming | stopping이며 제품이 갱신합니다. callback만으로 다음 lifecycle이나 성공을 추론하지 않습니다.
- 이 세 모드는 제품이 명시적으로 선택하는 계약이며 사용자 환경을 추측해 런타임에 전환하지 않습니다. enterKeyHint는 enter 모드에서 send, 나머지 모드에서 enter를 기본값으로 제공합니다.
- submit 뒤 textarea focus를 복귀시키되 value clear, loading 종료와 response 완료는 수행하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| statusLabel | Visible status text. Defaults to the current non-idle state's neutral label; null suppresses it. |
| formLabel | Accessible name for the composer form. @default "메시지 작성" |
| inputLabel | Accessible label for the internal textarea. @default "메시지 입력" |
| description | Supporting text announced with the textarea. |
| leadingActions | Actions rendered at the leading edge of the action band below the textarea. |
| trailingActions | Actions rendered at the trailing edge of the action band before the primary send/stop control. |
| submitLabel | Accessible name for the 32px submit control. @default "메시지 보내기" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `value` | `string` | Yes | Controlled draft value. MessageComposer never clears it after submit. |
| `onValueChange` | `(value: string, event: React.ChangeEvent) = void` | Yes | Receives the next controlled value and original textarea change event. |
| `onSubmit` | `(value: string, reason: MessageComposerSubmitReason) = void` | Yes | Receives the current value and the explicit submit trigger. |
| `state` | `MessageComposerState` | No | Product-owned request/response lifecycle. @default "idle" |
| `submitMode` | `MessageComposerSubmitMode` | No | Keyboard submission rule. modifier-enter accepts Alt-free Ctrl/Meta+Enter only. @default "enter" |
| `canSubmit` | `boolean` | No | Explicit submit eligibility. Defaults to whether the trimmed value is non-empty. |
| `readOnly` | `boolean` | No | Keep the draft focusable but prevent editing and submission. @default false |
| `statusLabel` | `React.ReactNode` | No | Visible status text. Defaults to the current non-idle state's neutral label; null suppresses it. |
| `formLabel` | `string` | No | Accessible name for the composer form. @default "메시지 작성" |
| `inputLabel` | `string` | No | Accessible label for the internal textarea. @default "메시지 입력" |
| `placeholder` | `string` | No | Internal textarea placeholder. @default "메시지를 입력하세요." |
| `description` | `React.ReactNode` | No | Supporting text announced with the textarea. |
| `maxLength` | `number` | No | Native maximum character count and visible counter. |
| `minRows` | `number` | No | Minimum autosize rows; one row starts at 48px. @default 1 |
| `maxRows` | `number` | No | Maximum autosize rows before internal scrolling. @default 6 |
| `attachments` | `React.ReactNode` | No | Attachment preview/list slot rendered inside the composer shell before the control row. |
| `leadingActions` | `React.ReactNode` | No | Actions rendered at the leading edge of the action band below the textarea. |
| `trailingActions` | `React.ReactNode` | No | Actions rendered at the trailing edge of the action band before the primary send/stop control. |
| `submitLabel` | `string` | No | Accessible name for the 32px submit control. @default "메시지 보내기" |
| `stopLabel` | `string` | No | Accessible name for the 32px stop control. @default "응답 중지" |
| `onStop` | `() = void` | No | Requests transport cancellation in submitting/streaming states. |
| `textareaProps` | `MessageComposerTextareaProps` | No | Native textarea attributes and event hooks not owned by the controlled contract. |
| `disabled` | `false` | No |  |
| `disabledReason` | `never` | No |  |

## States

| State | Contract |
| --- | --- |
| state | Product-owned request/response lifecycle. @default "idle" |
| readOnly | Keep the draft focusable but prevent editing and submission. @default false |
| statusLabel | Visible status text. Defaults to the current non-idle state's neutral label; null suppresses it. |
| disabledReason | Required explanation rendered before controls and referenced by the textarea. |

## Behavior and interaction

- value는 완전한 controlled value입니다. submit callback 뒤에도 내부에서 지우지 않습니다.
- attachments, leadingActions, trailingActions는 ReactNode slot입니다. attachment selection/upload, voice capture, model/tool picker와 permission은 slot consumer가 소유합니다.
- idle은 send, submitting/streaming은 stop을 같은 primary-action 위치에 둡니다. stopping은 중복 stop 요청을 막습니다.
- Escape는 암묵적 stop shortcut이 아닙니다. stop은 접근 가능한 이름과 visible focus를 가진 primary action으로 요청합니다.
- disabled는 native textarea disabled, form/shell의 aria-disabled, shell의 inert를 함께 사용합니다. native control의 비활성 동작과 slot으로 들어온 button/link의 focus·activation 차단을 모두 충족하기 위한 조합입니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | composition session과 KeyboardEvent.isComposing을 함께 확인하고 legacy IME keyCode 229도 방어해 한글·일본어·중국어 확정 Enter가 submit으로 이어지지 않게 합니다. 조합 확정 직후에는 같은 keydown을 제출 동작으로 재사용하지 않습니다. |
| 명시 규칙 2 | textarea는 compact row에서 시작해 minRows/maxRows 범위에서 커지고 최대 높이 뒤에는 내부 scrolling을 사용합니다. |
| 명시 규칙 3 | 320px에서는 textarea가 먼저 전체 draft 폭을 확보하고 하단 action band가 wrap합니다. action을 숨기거나 action 수 때문에 입력 열을 축소하지 않으며, slot content도 자체 wrapping/overflow policy를 제공해야 합니다. |
| 명시 규칙 4 | WCAG 2.2를 accessible name, keyboard, focus, disabled explanation, target와 contrast의 최종 기준으로 사용합니다. |
| --body1-line | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |

## Responsive

- submitMode="button-only": Enter를 항상 줄바꿈으로 남기고 button만 제출합니다.
- Slack — Set your Enter key preference는 Enter를 보내기로 선택하면 Shift+Enter로 줄바꿈하고, Enter를 줄바꿈으로 선택하면 Mac의 Command+Enter 또는 Windows/Linux의 Ctrl+Enter로 보내는 공식 제품 관습을 설명합니다. 이를 enter와 modifier-enter 계약에 반영했고, 긴 형식 작성에는 더 명시적인 button-only도 제공합니다.
- 채택한 것은 conversation column 하단의 단일 elevated shell, expanding draft와 명시적 send action입니다. exact purple, logo, provider tool, voice control, desktop/mobile frame와 shadow 값은 복사하지 않습니다.
- 320px: 긴 attachment와 multiline draft가 전체 입력 폭을 먼저 확보하고 하단 action band만 wrap하며 horizontal overflow를 만들지 않는지 확인합니다.

## Content and writing

- reading order는 description/disabled reason → shell의 attachments → textarea → 하단 leading actions → trailing actions → primary send/stop → status/counter입니다.
- leading/trailing action은 position만 설명합니다. 특정 attachment/template/provider 기능을 고정하지 않습니다.
- statusLabel={null}은 기본 lifecycle 문구를 숨깁니다. undefined일 때만 non-idle 기본 문구를 사용합니다.
- formLabel과 inputLabel은 form/textarea의 접근 가능한 이름, submitLabel과 stopLabel은 icon-only primary action 이름을 현지화합니다.

## Accessibility

- canSubmit을 생략하면 trim한 값이 있을 때만 submit할 수 있습니다. readOnly는 focus와 copy를 유지하되 편집·submit을 막습니다.
- status live region은 내용이 있을 때 mount하지 않고 composer 수명 내내 비어 있는 상태로 상시 mount한 뒤 텍스트만 교체합니다. 텍스트와 함께 삽입된 status node는 기존 live region의 변경이 아니어서 첫 idle→submitting 알림이 누락되기 때문입니다. 보이는 status 문구는 같은 내용을 중복 발표하지 않도록 aria-hidden 장식으로 둡니다.
- stop 버튼은 stopping에서도 native disabled가 되지 않고 aria-disabled로 중복 요청만 거부합니다. native disabled는 방금 누른 사용자의 초점을 로 떨어뜨립니다. 요청이 끝나 idle로 돌아갈 때 primary action이 초점을 잃으면 submit 뒤와 같은 규칙으로 textarea에 초점을 되돌립니다.
- disabled: true는 visible disabledReason을 요구하며 textarea의 description에 연결합니다. shell 전체를 inert subtree로 만들어 slot으로 조합한 button/link도 focus와 activation에서 제외합니다.
- submitMode="enter": modifier 없는 Enter로 제출하고 Shift+Enter는 줄바꿈입니다.

## Exceptions

- interaction: enter/modifier-enter/button-only, Shift+Enter, Ctrl+Alt/AltGr 차단, Ctrl/Meta+Enter, IME 확정 Enter, submit focus return과 explicit streaming stop을 확인합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `Chip` | 대표 시나리오에서 조합 |
| `Icon` | 대표 시나리오에서 조합 |
| `IconButton` | 대표 시나리오에서 조합 |
| `ConversationMessage` | 대표 시나리오에서 조합 |
| `MessageFeed` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

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

## Tokens and API

### Tokens

- `--body1-line`
- `--caption1-line`
- `--caption1-size`
- `--caption2-line`
- `--caption2-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-background-normal-alternative`
- `--color-semantic-fill-normal`
- `--color-semantic-focus-ring`
- `--color-semantic-label-alternative`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-line-normal-normal`
- `--color-semantic-primary-normal`
- `--component-button-height-sm`
- `--component-input-border-width`
- `--component-input-font-size`
- `--component-input-letter-spacing`
- `--dur-base`
- `--ease-out`
- `--font-sans`
- `--radius-xl`
- `--shadow-sm`
- `--space-1`
- `--space-12`
- `--space-2`
- `--space-3`

### Source contracts

- `components/communication/MessageComposer.jsx`
- `components/communication/MessageComposer.d.ts`
- `components/communication/MessageComposer.prompt.md`
- `stories/CommunicationMessageComposer.stories.jsx`

## Sources

- MessageComposer prompt contract: `components/communication/MessageComposer.prompt.md`
- Storybook implementation evidence: `stories/CommunicationMessageComposer.stories.jsx`
- [Slack — Set your Enter key preference](https://slack.com/help/articles/115005523006-Set-your-Enter-key-preference)
- [Slack — Use Slack with a screen reader](https://slack.com/help/articles/360000411963-Use-Slack-with-a-screen-reader)
- [MDN — disabled HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/disabled)
- [MDN — aria-disabled](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-disabled)
- [Ant Design X Sender](https://x.ant.design/components/sender/)
- [Ant Design X Attachments](https://x.ant.design/components/attachments/)
- [Ant Design X Bubble](https://x.ant.design/components/bubble/)
- [Carbon AI Chat overview](https://chat.carbondesignsystem.com/tag/latest/docs/documents/Overview.html)
