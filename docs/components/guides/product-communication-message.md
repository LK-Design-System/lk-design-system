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
- 3 Free AI Chatbot App UI Kit의 왼쪽 slothGPT/general-assistant archetype만 secondary visual inspiration으로 사용합니다.

### 사용하지 않음

- sources에는 SourceDisclosure, attachments에는 FileUploadQueue나 제품의 완료된 attachment 표현을 조합합니다. source 개수나 파일 상태에서 presentation을 추론하지 않습니다.
- onRetry는 failed lifecycle에서만 나타나는 요청 callback이며 refresh 아이콘 버튼으로 액션바 앞에 자동 편입됩니다. callback 뒤 성공이나 다음 lifecycle을 추론하지 않습니다.
- Carbon AI Chat overview는 streamed/non-streamed response와 확장 가능한 rich content를 하나의 chat surface에서 다룹니다. 그래서 assistant body를 plain text bubble로 제한하지 않습니다.
- Carbon AI Chat server communication은 partial, final, cancel과 history를 transport lifecycle로 구분합니다. ConversationMessage는 현재 상태를 표현할 뿐 callback 뒤 전이를 추론하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| authorLabel | Accessible author name when author is not plain text. |
| messageActionsVisibility | 'on-demand' rests the action bar at opacity 0 and reveals it on hover or focus-within. Layout and the accessible tree are unchanged; coarse pointers and failed-turn retry bars stay always visible. @default 'always' |
| roleBadgeLabel | Visible role badge next to the author name. Defaults to 'AI' for assistant and '상담원' for human-agent; null hides it. Decorative — the accessible role name is always announced separately. |
| avatar | Avatar shown for single/first participant messages. Grouped runs reserve the density-selected 32px comfortable or 24px compact token column even when later items omit this prop. |
| statusLabel | Optional lifecycle label override. null suppresses it; delivery sent, delivery read, and response complete are silent by default (read surfaces as a bubble-foot receipt instead). |
| actions | Additional message-level actions rendered as a composition slot after the built-in action bar. |
| messageActions | Primary icon action bar rendered below the body. Each entry becomes an icon-only IconButton; products own the glyph and handlers. Coexists with the actions slot. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `groupPosition` | `ConversationMessageGroupPosition` | No | Position within a visually grouped run from the same author. @default 'single' |
| `density` | `ConversationMessageDensity` | No | Message-owned spatial density. Comfortable preserves the legacy 32px avatar, bubble padding, and internal gaps; compact reduces only those spaces without changing typography, semantics, or action targets. @default 'comfortable' |
| `lifecycle` | `ConversationMessageLifecycle` | No | Static content, outbound delivery state, or inbound response generation state. @default { kind: 'static' } |
| `author` | `React.ReactNode` | Yes | Visible author identity. |
| `authorLabel` | `string` | No | Accessible author name when author is not plain text. |
| `identityVisibility` | `'visible' \| 'hidden'` | No | 'hidden' keeps the author in the accessible name only, for surfaces where alignment and fill already state the speaker (e.g. the outbound bubble in a two-party chat). Grouped middle/last items are already hidden regardless. @default 'visible' |
| `messageActionsVisibility` | `'always' \| 'on-demand'` | No | 'on-demand' rests the action bar at opacity 0 and reveals it on hover or focus-within. Layout and the accessible tree are unchanged; coarse pointers and failed-turn retry bars stay always visible. @default 'always' |
| `roleBadgeLabel` | `React.ReactNode` | No | Visible role badge next to the author name. Defaults to 'AI' for assistant and '상담원' for human-agent; null hides it. Decorative — the accessible role name is always announced separately. |
| `avatar` | `React.ReactNode` | No | Avatar shown for single/first participant messages. Grouped runs reserve the density-selected 32px comfortable or 24px compact token column even when later items omit this prop. |
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
| identityVisibility | 'hidden' keeps the author in the accessible name only, for surfaces where alignment and fill already state the speaker (e.g. the outbound bubble in a two-party chat). Grouped middle/last items are already hidden regardless. @default 'visible' |
| statusLabel | Optional lifecycle label override. null suppresses it; delivery sent, delivery read, and response complete are silent by default (read surfaces as a bubble-foot receipt instead). |
| error | Failed-response body content. When set, a muted warning glyph is prefixed and the redundant lifecycle status label is suppressed by default. Not a live region — the MessageFeed log announces it. |

## Behavior and interaction

- authorRole은 user | assistant | human-agent | system입니다. assistant 기본 presentation은 document, user와 human-agent는 bubble, system은 centered neutral chip입니다. user bubble은 solid primary fill, human-agent bubble은 neutral fill(--color-semantic-fill-strong)로 구분합니다.
- WCAG 2.2의 구조, focus, name과 contrast 요구를 최종 접근성 기준으로 사용합니다.
- 320px: comfortable/compact 모두 긴 한글·영문·URL·code와 source/attachment/action slot이 horizontal overflow 없이 wrapping 또는 자체 overflow를 갖고, action target이 최소 24×24 CSS px를 유지하는지 확인합니다.
- feedback 저장·선택 상태, edit, branch/thread, 읽음 판정(read tracking; delivery read 상태 표시는 지원하되 읽음 여부 계산은 제품 몫), voice recorder와 tool execution. 긍정·부정 feedback과 재생성 control은 canonical messageActions 조합으로 지원하지만 해당 동작과 상태 전이는 제품이 구현합니다.
- 전체 화면 shell, header/sidebar, sticky composer, scroll anchoring과 unread 계산.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | density는 comfortable \| compact이며 기본 comfortable은 기존 32px avatar column, bubble padding과 내부 gap을 그대로 보존합니다. compact는 이 공간만 작은 LDS token 단계로 줄이고 typography, color, lifecycle, DOM/ARIA와 action 크기는 바꾸지 않습니다. |
| 명시 규칙 2 | groupPosition은 single \| first \| middle \| last이며 grouped run은 avatar를 first에만 전달해도 density가 선택한 32px comfortable 또는 24px compact identity column을 예약합니다. authorLabel은 비문자 author의 접근 가능한 이름, dateTime은 의 machine-readable 값입니다. |
| 명시 규칙 3 | identityVisibility="hidden"은 작성자 행을 시각적으로만 숨기고 접근 가능한 이름(author + 역할명)은 유지합니다. 2자 대화에서 outbound solid primary bubble처럼 정렬과 fill이 이미 화자를 말하는 표면 전용입니다. 화자가 셋 이상이거나 bubble/fill 구분이 없는 표면에서는 쓰지 않습니다. grouped middle \| last는 이 prop과 무관하게 이미 숨겨집니다. |
| 명시 규칙 4 | messageActionsVisibility="on-demand"는 액션바를 opacity 0으로 쉬게 하고 hover 또는 focus-within에서 드러냅니다. 레이아웃 행과 접근성 트리는 그대로라 reflow가 없고 키보드 초점이 그대로 드러내므로 disclosure가 아니라 시각적 감쇠입니다. hover가 없는 coarse pointer와, 복구 경로인 실패 턴의 retry 바에는 적용되지 않고 항상 보입니다. |
| --body1-line | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |

## Responsive

- inlineSources는 sources 슬롯을 body 아래 별도 행이 아니라 action bar와 같은 footer 행에 배치합니다(ChatGPT식). 접힌 를 넣으면 resting 상태가 아이콘+출처 토글 한 줄이 되어 copy·재생성 아이콘 옆에 나란히 놓이고, 누르면 출처 목록이 SourceDisclosure의 앵커드 Popover(드롭다운)로 떠서 열려 본문 레이아웃을 밀지 않습니다.
- semantic DOM과 시각 reading order는 identity(author/timestamp) → body → response status → attachments → sources → delivery/static status → actions입니다. rich content는 document surface 안에서 자연스럽게 길어지고, compact 발화는 bubble로 묶입니다. inlineSources일 때 sources는 이 자리에서 빠져 마지막 footer 행에서 action group 뒤에 형제로 배치됩니다.
- SELECTANDMESSAGEFEEDLAYOUTFOLLOWUP.md에 기록된 LK Portal floating knowledge chat은 460×674px의 제한된 panel입니다. 이 consumer 근거는 optional compact spacing을 정당화하지만 panel width, chrome과 viewport inset은 각각 Portal과 MessageFeed가 계속 소유합니다.
- compact의 24px avatar는 비상호작용 identity입니다. retry와 message action은 기존 32px IconButton을 유지해 실제 pointer target이 24×24 CSS px 아래로 줄지 않습니다.

## Content and writing

- children은 본문, attachments, sources, actions는 각각 ReactNode 조합 slot입니다. messageActions는 복사·재생성·더보기 같은 하단 quick-action을 배열로 받아 컴포넌트가 icon-only 버튼 액션바로 렌더하며 actions slot과 공존합니다. error는 실패 응답 본문을 받아 무채색 경고 glyph를 앞에 붙입니다. Message가 source schema, 파일 처리, Markdown renderer 또는 action 정책을 소유하지 않습니다.
- lifecycle은 static, outbound delivery, inbound response 상태를 구분합니다. delivery는 queued | sending | sent | read | failed | cancelled이며, outbound 턴(기본 user bubble)은 하단 meta에 전송 시각과 read의 읽음 표식을 표시합니다. 읽음 여부의 truth는 제품이 소유하고 component는 주어진 상태만 렌더합니다. response 생성 중에도 message 자체에 stop action을 넣지 않습니다.
- statusLabel={null}은 기본 lifecycle 문구를 숨기고, error를 지정하면 중복 lifecycle status 문구가 기본 억제됩니다. failed message의 retry 아이콘 접근 이름은 retryLabel로 현지화합니다.
- roleBadgeLabel은 이름 옆 역할 배지를 덮어씁니다. assistant 기본 AI, human-agent 기본 상담원이며 null은 배지를 숨깁니다. 배지는 장식이고 접근 가능한 역할명(ROLELABELS)은 항상 별도로 announce됩니다.

## Accessibility

- 완료된 AI 응답의 canonical 제품 조합은 응답 복사 → 응답 다시 생성 → 긍정 평가 → 부정 평가 순서이며 provenance가 있으면 inlineSources의 접힌 출처 토글을 같은 footer에 형제로 둡니다. 각 icon-only action의 label은 대상과 동작을 함께 말해야 합니다. 선택형 평가 action은 제품이 소유한 상태를 pressed로 전달해 aria-pressed와 primary selected surface를 함께 노출합니다.
- 개별 article은 live region을 만들지 않습니다. chronological announcement는 상위 MessageFeed의 named role="log" 하나가 소유합니다.
- compact는 avatar를 --space-6, bubble padding을 --space-2 var(--space-3), 내부 gap을 --space-1로 줄입니다. 기본 comfortable의 기존 pixel geometry는 그대로이며, 320px에서도 document/bubble content는 wrapping 또는 자체 overflow로 reflow되어야 합니다.
- WAI-ARIA log는 순서대로 추가되는 chat history를 대표 사례로 정의합니다. message마다 live region을 만들지 않고 MessageFeed 한 곳에만 둡니다.
- WCAG 2.2 Understanding 1.4.10 Reflow는 세로 scrolling content가 320 CSS px 상당 폭에서 정보·기능 손실이나 2차원 scrolling 없이 reflow되어야 한다고 설명합니다. density는 content 폭·wrapping 계약을 바꾸지 않습니다.

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
  density="compact"
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
- `--color-semantic-static-white`
- `--color-semantic-status-negative`
- `--dur-fast`
- `--ease-out`
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
- `--space-6`
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
