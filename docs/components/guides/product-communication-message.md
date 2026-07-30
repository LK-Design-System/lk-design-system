# Message

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Communication |
| Owner | `ConversationMessage` |
| Storybook | `LDS Product/Communication/Message` |
| Source | `../component-content.json#product-communication-message` |

AI 응답, 사용자 발화, 상담원과 시스템 알림이 한 대화에 섞일 때 사용합니다. 긴 응답의 목록·코드·출처는 읽기 흐름으로, 짧은 발화는 화자별 말풍선으로 구분합니다. 대화 맥락이 없는 안내나 폼 오류에는 사용하지 말고 Callout·FormField를 사용하세요.

## 사용 판단

### 사용

- participant는 presentation="document" | "bubble"로 표현 방식을 명시할 수 있습니다. presentation은 정보 위계이지 protocol, 권한, 신뢰도 또는 발신자 role을 바꾸지 않습니다.
- direction은 participant 배치만 재정의합니다. user는 기본 outbound, assistant와 human-agent는 기본 inbound이며 system은 항상 system 방향입니다. 시각 정렬 때문에 DOM 순서를 뒤집지 않습니다.
- Ant Design X Bubble은 role, placement, content, variant, loading과 footer action을 분리합니다. LDS도 role과 presentation을 분리하되 일반 AI 장문 응답은 borderless document, 짧은 사용자 발화는 bubble로 적응했습니다.
- user 자신의 발화는 primary fill bubble로 화자를 표식하되, 특정 제품(slothpilot/Context Hub)의 messenger shell·palette·app chrome을 통째로 차용하지는 않습니다. 오른쪽 search/research 화면도 complete screen으로 가져오지 않고, provenance가 필요할 때 SourceDisclosure를 slot에 조합합니다.

### 사용하지 않음

- sources에는 SourceDisclosure, attachments에는 FileUploadQueue나 제품의 완료된 attachment 표현을 조합합니다. source 개수나 파일 상태에서 presentation을 추론하지 않습니다.
- onRetry는 failed lifecycle에서만 나타나는 요청 callback이며 refresh 아이콘 버튼으로 액션바 앞에 자동 편입됩니다. callback 뒤 성공이나 다음 lifecycle을 추론하지 않습니다.
- Carbon AI Chat overview는 streamed/non-streamed response와 확장 가능한 rich content를 하나의 chat surface에서 다룹니다. 그래서 assistant body를 plain text bubble로 제한하지 않습니다.
- Carbon AI Chat server communication은 partial, final, cancel과 history를 transport lifecycle로 구분합니다. ConversationMessage는 현재 상태를 표현할 뿐 callback 뒤 전이를 추론하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| authorLabel | Accessible author name when author is not plain text. |
| roleBadgeLabel | Visible role badge next to the author name. Defaults to 'AI' for assistant and '상담원' for human-agent; null hides it. Decorative — the accessible role name is always announced separately. |
| avatar | Avatar shown for single/first participant messages. Grouped runs reserve the same 32px token column even when later items omit this prop. |
| statusLabel | Optional lifecycle label override. null suppresses it; delivery sent, delivery read, and response complete are silent by default (read surfaces as a bubble-foot receipt instead). |
| actions | Additional message-level actions rendered as a composition slot after the built-in action bar. |
| messageActions | Primary icon action bar rendered below the body. Each entry becomes an icon-only IconButton; products own the glyph and handlers. Coexists with the actions slot. |
| error | Failed-response body content. When set, a muted warning glyph is prefixed and the redundant lifecycle status label is suppressed by default. Not a live region — the MessageFeed log announces it. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `groupPosition` | `ConversationMessageGroupPosition` | No | Position within a visually grouped run from the same author. @default 'single' |
| `lifecycle` | `ConversationMessageLifecycle` | No | Static content, outbound delivery state, or inbound response generation state. @default { kind: 'static' } |
| `author` | `React.ReactNode` | Yes | Visible author identity. |
| `authorLabel` | `string` | No | Accessible author name when author is not plain text. |
| `roleBadgeLabel` | `React.ReactNode` | No | Visible role badge next to the author name. Defaults to 'AI' for assistant and '상담원' for human-agent; null hides it. Decorative — the accessible role name is always announced separately. |
| `avatar` | `React.ReactNode` | No | Avatar shown for single/first participant messages. Grouped runs reserve the same 32px token column even when later items omit this prop. |
| `timestamp` | `React.ReactNode` | No | Human-readable timestamp. |
| `dateTime` | `string` | No | Machine-readable ISO date/time for the time element. |
| `statusLabel` | `React.ReactNode` | No | Optional lifecycle label override. null suppresses it; delivery sent, delivery read, and response complete are silent by default (read surfaces as a bubble-foot receipt instead). |
| `attachments` | `React.ReactNode` | No | Attachment content rendered after the response status and message body. |
| `sources` | `React.ReactNode` | No | Source or provenance content supplied as a composition slot. |
| `inlineSources` | `boolean` | No | Render the sources slot on the same footer row as the action bar (ChatGPT-style) instead of its own row above the actions. The sources node stays a sibling of the 메시지 동작 group — not a member — so it still announces as provenance. Pair with a collapsible SourceDisclosure so its resting footprint is a single "출처" toggle. @default false |
| `actions` | `React.ReactNode` | No | Additional message-level actions rendered as a composition slot after the built-in action bar. |
| `messageActions` | `ConversationMessageAction[]` | No | Primary icon action bar rendered below the body. Each entry becomes an icon-only IconButton; products own the glyph and handlers. Coexists with the actions slot. |
| `error` | `React.ReactNode` | No | Failed-response body content. When set, a muted warning glyph is prefixed and the redundant lifecycle status label is suppressed by default. Not a live region — the MessageFeed log announces it. |
| `onRetry` | `() = void` | No | Called only from failed delivery/response retry controls. No lifecycle transition is inferred. |
| `retryLabel` | `React.ReactNode` | No |  |
| `children` | `React.ReactNode` | No |  |

## States

| State | Contract |
| --- | --- |
| statusLabel | Optional lifecycle label override. null suppresses it; delivery sent, delivery read, and response complete are silent by default (read surfaces as a bubble-foot receipt instead). |
| error | Failed-response body content. When set, a muted warning glyph is prefixed and the redundant lifecycle status label is suppressed by default. Not a live region — the MessageFeed log announces it. |

## Behavior and interaction

- authorRole은 user | assistant | human-agent | system입니다. assistant 기본 presentation은 document, user와 human-agent는 bubble, system은 centered neutral chip입니다. user bubble은 solid primary fill, human-agent bubble은 neutral fill(--color-semantic-fill-strong)로 구분합니다.
- feedback 저장·선택 상태, edit, branch/thread, 읽음 판정(read tracking; delivery read 상태 표시는 지원하되 읽음 여부 계산은 제품 몫), voice recorder와 tool execution. 긍정·부정 feedback과 재생성 control은 canonical messageActions 조합으로 지원하지만 해당 동작과 상태 전이는 제품이 구현합니다.
- 전체 화면 shell, header/sidebar, sticky composer, scroll anchoring과 unread 계산.
- 선택한 reading hierarchy.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | groupPosition은 single \| first \| middle \| last이며 grouped run은 avatar를 first에만 전달해도 같은 32px identity column을 예약합니다. authorLabel은 비문자 author의 접근 가능한 이름, dateTime은 의 machine-readable 값입니다. |
| 명시 규칙 2 | WCAG 2.2의 구조, focus, name과 contrast 요구를 최종 접근성 기준으로 사용합니다. |
| 명시 규칙 3 | 3 Free AI Chatbot App UI Kit의 왼쪽 slothGPT/general-assistant archetype만 secondary visual inspiration으로 사용합니다. |
| 명시 규칙 4 | 약 760px: long rich assistant document → compact user solid primary bubble → system 중앙 pill 칩 → optional human-agent neutral fill bubble의 reading order를 확인합니다. |
| --body1-line | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |

## Responsive

- inlineSources는 sources 슬롯을 body 아래 별도 행이 아니라 action bar와 같은 footer 행에 배치합니다(ChatGPT식). 접힌 를 넣으면 resting 상태가 아이콘+출처 토글 한 줄이 되어 copy·재생성 아이콘 옆에 나란히 놓이고, 누르면 출처 목록이 SourceDisclosure의 앵커드 Popover(드롭다운)로 떠서 열려 본문 레이아웃을 밀지 않습니다.
- semantic DOM과 시각 reading order는 identity(author/timestamp) → body → response status → attachments → sources → delivery/static status → actions입니다. rich content는 document surface 안에서 자연스럽게 길어지고, compact 발화는 bubble로 묶입니다. inlineSources일 때 sources는 이 자리에서 빠져 마지막 footer 행에서 action group 뒤에 형제로 배치됩니다.
- 채택한 것은 long-form assistant document, compact user prompt, answer action과 하단 composer의 상대적 위계입니다. exact color, typography, avatar artwork, logo, sidebar, app shell, shadow와 asset은 복사하지 않습니다.
- 320px: 긴 한글·영문·URL·code와 source/attachment/action slot이 horizontal overflow 없이 wrapping 또는 자체 overflow를 갖는지 확인합니다.

## Content and writing

- children은 본문, attachments, sources, actions는 각각 ReactNode 조합 slot입니다. messageActions는 복사·재생성·더보기 같은 하단 quick-action을 배열로 받아 컴포넌트가 icon-only 버튼 액션바로 렌더하며 actions slot과 공존합니다. error는 실패 응답 본문을 받아 무채색 경고 glyph를 앞에 붙입니다. Message가 source schema, 파일 처리, Markdown renderer 또는 action 정책을 소유하지 않습니다.
- lifecycle은 static, outbound delivery, inbound response 상태를 구분합니다. delivery는 queued | sending | sent | read | failed | cancelled이며, outbound 턴(기본 user bubble)은 하단 meta에 전송 시각과 read의 읽음 표식을 표시합니다. 읽음 여부의 truth는 제품이 소유하고 component는 주어진 상태만 렌더합니다. response 생성 중에도 message 자체에 stop action을 넣지 않습니다.
- statusLabel={null}은 기본 lifecycle 문구를 숨기고, error를 지정하면 중복 lifecycle status 문구가 기본 억제됩니다. failed message의 retry 아이콘 접근 이름은 retryLabel로 현지화합니다.
- roleBadgeLabel은 이름 옆 역할 배지를 덮어씁니다. assistant 기본 AI, human-agent 기본 상담원이며 null은 배지를 숨깁니다. 배지는 장식이고 접근 가능한 역할명(ROLELABELS)은 항상 별도로 announce됩니다.

## Accessibility

- 완료된 AI 응답의 canonical 제품 조합은 응답 복사 → 응답 다시 생성 → 긍정 평가 → 부정 평가 순서이며 provenance가 있으면 inlineSources의 접힌 출처 토글을 같은 footer에 형제로 둡니다. 각 icon-only action의 label은 대상과 동작을 함께 말해야 합니다. 선택형 평가 action은 제품이 소유한 상태를 pressed로 전달해 aria-pressed와 primary selected surface를 함께 노출합니다.
- 개별 article은 live region을 만들지 않습니다. chronological announcement는 상위 MessageFeed의 named role="log" 하나가 소유합니다.
- WAI-ARIA log는 순서대로 추가되는 chat history를 대표 사례로 정의합니다. message마다 live region을 만들지 않고 MessageFeed 한 곳에만 둡니다.
- dark: document는 배경과 불필요한 card 경계를 만들지 않고, solid primary user bubble·neutral fill human-agent bubble·system 칩·metadata가 identity와 WCAG AA 대비를 유지해야 합니다.
- | 확인한 sibling | 계승한 규칙 | ConversationMessage 결정 | | --- | --- | --- | | Avatar | 32px small identity, text fallback | 필요한 participant identity에 조합하며 message가 avatar 로직을 복제하지 않음 | | Button / IconButton | named action, focus, disabled, small control | retry와 response action을 slot에서 조합하고 자체 button 스타일을 만들지 않음 | | Bubble…

## Related components

| Component | Relationship |
| --- | --- |
| `Avatar` | 대표 시나리오에서 조합 |
| `Chip` | 대표 시나리오에서 조합 |
| `Icon` | 대표 시나리오에서 조합 |
| `IconButton` | 대표 시나리오에서 조합 |
| `MessageComposer` | 대표 시나리오에서 조합 |
| `MessageFeed` | 대표 시나리오에서 조합 |
| `SourceDisclosure` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<ConversationMessage
  authorRole="assistant"
  author="AI Assistant"
  inlineSources
  sources={<SourceDisclosure sources={sources} />}
  messageActions={[
    { key: 'copy', icon: <Icon name="copy" size={16} />, label: '응답 복사' },
    { key: 'regenerate', icon: <Icon name="refresh" size={16} />, label: '응답 다시 생성' },
    { key: 'positive-feedback', icon: <Icon name="like" size={16} />, label: '좋은 응답으로 평가', pressed: feedback === 'positive' },
    { key: 'negative-feedback', icon: <Icon name="dislike" size={16} />, label: '좋지 않은 응답으로 평가', pressed: feedback === 'negative' },
  ]}
>
  <AssistantAnswer />
</ConversationMessage>

<ConversationMessage authorRole="user" author="김서윤">
  핵심만 세 문장으로 요약해 주세요.
</ConversationMessage>
```

## Tokens and API

### Tokens

- `--body1-line`
- `--body1-size`
- `--body2-line`
- `--body2-size`
- `--border-thin`
- `--caption1-line`
- `--caption1-size`
- `--caption2-line`
- `--caption2-size`
- `--color-semantic-accent-blue-text`
- `--color-semantic-fill-normal`
- `--color-semantic-fill-strong`
- `--color-semantic-label-alternative`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-label-strong`
- `--color-semantic-primary-heavy`
- `--color-semantic-primary-normal`
- `--color-semantic-primary-surface-normal`
- `--color-semantic-primary-surface-strong`
- `--color-semantic-static-white`
- `--color-semantic-status-negative`
- `--font-sans`
- `--fw-medium`
- `--fw-semibold`
- `--label1-line`
- `--label1-size`
- `--radius-pill`
- `--radius-sm`
- `--radius-xl`
- `--space-1`
- `--space-2`
- `--space-3`
- `--space-4`
- `--space-8`

### Source contracts

- `components/communication/ConversationMessage.jsx`
- `components/communication/ConversationMessage.d.ts`
- `components/communication/ConversationMessage.prompt.md`
- `stories/CommunicationMessage.stories.jsx`

## Sources

- ConversationMessage prompt contract: `components/communication/ConversationMessage.prompt.md`
- Storybook implementation evidence: `stories/CommunicationMessage.stories.jsx`
- [Ant Design X Bubble](https://x.ant.design/components/bubble/)
- [Ant Design X Sender](https://x.ant.design/components/sender/)
- [Carbon AI Chat overview](https://chat.carbondesignsystem.com/tag/latest/docs/documents/Overview.html)
- [Carbon AI Chat server communication](https://chat.carbondesignsystem.com/tag/latest/docs/documents/Server_communication.html)
- [Slackbot 사용 안내](https://slack.com/help/articles/202026038-How-to-use-Slackbot)
- [ChatGPT 오류 문제 해결](https://help.openai.com/en/articles/7996703)
- [Ant Design X Attachments](https://x.ant.design/components/attachments/)
- [WAI-ARIA log](https://www.w3.org/TR/wai-aria/#log)
