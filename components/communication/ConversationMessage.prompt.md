# ConversationMessage

`ConversationMessage`는 한 건의 AI 또는 사람 간 대화 항목을 읽기 가능한 문서 응답, 짧은 발화 bubble, 시스템 칩으로 표현하는 **LK Product Extension**입니다. WDS Core parity를 주장하지 않습니다.

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

## 분류와 책임

- 분류는 **LK Product Extension**입니다. 특정 제품 화면이나 transport를 LDS Core로 끌어오지 않습니다.
- `authorRole`은 `user | assistant | human-agent | system`입니다. assistant 기본 presentation은 `document`, user와 human-agent는 `bubble`, system은 centered neutral chip입니다. user bubble은 solid primary fill, human-agent bubble은 neutral fill(`--color-semantic-fill-strong`)로 구분합니다.
- participant는 `presentation="document" | "bubble"`로 표현 방식을 명시할 수 있습니다. presentation은 정보 위계이지 protocol, 권한, 신뢰도 또는 발신자 role을 바꾸지 않습니다.
- `direction`은 participant 배치만 재정의합니다. user는 기본 outbound, assistant와 human-agent는 기본 inbound이며 system은 항상 system 방향입니다. 시각 정렬 때문에 DOM 순서를 뒤집지 않습니다.
- `children`은 본문, `attachments`, `sources`, `actions`는 각각 `ReactNode` 조합 slot입니다. `messageActions`는 복사·재생성·더보기 같은 하단 quick-action을 배열로 받아 컴포넌트가 icon-only 버튼 액션바로 렌더하며 `actions` slot과 공존합니다. `error`는 실패 응답 본문을 받아 무채색 경고 glyph를 앞에 붙입니다. Message가 source schema, 파일 처리, Markdown renderer 또는 action 정책을 소유하지 않습니다.
- 완료된 AI 응답의 canonical 제품 조합은 **응답 복사 → 응답 다시 생성 → 긍정 평가 → 부정 평가** 순서이며 provenance가 있으면 `inlineSources`의 접힌 출처 토글을 같은 footer에 형제로 둡니다. 각 icon-only action의 `label`은 대상과 동작을 함께 말해야 합니다. 선택형 평가 action은 제품이 소유한 상태를 `pressed`로 전달해 `aria-pressed`와 primary selected surface를 함께 노출합니다. 생성 중에는 아직 확정되지 않은 결과를 대상으로 하는 네 동작을 비활성화하고, 실패 시에는 불완전한 결과의 액션 대신 `error`와 `onRetry`만 제공합니다. action 실행, clipboard 결과 안내, 재생성 요청, feedback 저장과 선택 상태, transport 및 lifecycle truth는 제품이 소유합니다.
- `sources`에는 `SourceDisclosure`, `attachments`에는 `FileUploadQueue`나 제품의 완료된 attachment 표현을 조합합니다. source 개수나 파일 상태에서 presentation을 추론하지 않습니다.
- `inlineSources`는 `sources` 슬롯을 body 아래 별도 행이 아니라 action bar와 같은 footer 행에 배치합니다(ChatGPT식). 접힌 `<SourceDisclosure compact collapsible/>`를 넣으면 resting 상태가 아이콘+`출처` 토글 한 줄이 되어 copy·재생성 아이콘 옆에 나란히 놓이고, 누르면 출처 목록이 `SourceDisclosure`의 앵커드 Popover(드롭다운)로 떠서 열려 본문 레이아웃을 밀지 않습니다. 이때 provenance는 `메시지 동작` 그룹의 **형제**로 남아(그룹 **안**이 아니라) 스크린리더에서 액션이 아닌 출처로 announce되며, 팝오버 열림/닫힘과 dismiss는 `SourceDisclosure`(내부 `Popover`)가 소유합니다. 출처를 항상 노출해야 하는 고신뢰 답변에서는 `inlineSources` 없이 기본 `sources` 행(항상 보이는 compact chip 또는 card)을 유지하세요.
- `lifecycle`은 static, outbound delivery, inbound response 상태를 구분합니다. delivery는 `queued | sending | sent | read | failed | cancelled`이며, outbound 턴(기본 user bubble)은 하단 meta에 전송 시각과 `read`의 `읽음` 표식을 표시합니다. 읽음 여부의 truth는 제품이 소유하고 component는 주어진 상태만 렌더합니다. response 생성 중에도 message 자체에 stop action을 넣지 않습니다. 중지는 `MessageComposer`의 현재 요청 action이 소유합니다.
- `onRetry`는 failed lifecycle에서만 나타나는 요청 callback이며 `refresh` 아이콘 버튼으로 액션바 앞에 자동 편입됩니다. callback 뒤 성공이나 다음 lifecycle을 추론하지 않습니다.
- 개별 article은 live region을 만들지 않습니다. chronological announcement는 상위 `MessageFeed`의 named `role="log"` 하나가 소유합니다.
- semantic DOM과 시각 reading order는 identity(author/timestamp) → body → response status → attachments → sources → delivery/static status → actions입니다. rich content는 document surface 안에서 자연스럽게 길어지고, compact 발화는 bubble로 묶입니다. `inlineSources`일 때 sources는 이 자리에서 빠져 마지막 footer 행에서 action group **뒤에** 형제로 배치됩니다.
- `groupPosition`은 `single | first | middle | last`이며 grouped run은 `avatar`를 first에만 전달해도 같은 32px identity column을 예약합니다. `authorLabel`은 비문자 author의 접근 가능한 이름, `dateTime`은 `<time>`의 machine-readable 값입니다.
- `statusLabel={null}`은 기본 lifecycle 문구를 숨기고, `error`를 지정하면 중복 lifecycle status 문구가 기본 억제됩니다. failed message의 retry 아이콘 접근 이름은 `retryLabel`로 현지화합니다.
- `roleBadgeLabel`은 이름 옆 역할 배지를 덮어씁니다. assistant 기본 `AI`, human-agent 기본 `상담원`이며 `null`은 배지를 숨깁니다. 배지는 장식이고 접근 가능한 역할명(`ROLE_LABELS`)은 항상 별도로 announce됩니다.
- `identityVisibility="hidden"`은 작성자 행을 시각적으로만 숨기고 접근 가능한 이름(`author` + 역할명)은 유지합니다. 2자 대화에서 outbound solid primary bubble처럼 정렬과 fill이 이미 화자를 말하는 표면 전용입니다. 화자가 셋 이상이거나 bubble/fill 구분이 없는 표면에서는 쓰지 않습니다. grouped `middle | last`는 이 prop과 무관하게 이미 숨겨집니다.
- `messageActionsVisibility="on-demand"`는 액션바를 opacity 0으로 쉬게 하고 hover 또는 focus-within에서 드러냅니다. 레이아웃 행과 접근성 트리는 그대로라 reflow가 없고 키보드 초점이 그대로 드러내므로 disclosure가 아니라 시각적 감쇠입니다. hover가 없는 coarse pointer와, 복구 경로인 실패 턴의 retry 바에는 적용되지 않고 항상 보입니다.

## 내부 LDS 비교와 visual delta

| 확인한 sibling | 계승한 규칙 | ConversationMessage 결정 |
| --- | --- | --- |
| `Avatar` | 32px small identity, text fallback | 필요한 participant identity에 조합하며 message가 avatar 로직을 복제하지 않음 |
| `Button` / `IconButton` | named action, focus, disabled, small control | retry와 response action을 slot에서 조합하고 자체 button 스타일을 만들지 않음 |
| `Bubble` | 짧은 발화의 compact containment | annotation tail, 고정 280px 폭, coach-mark shadow는 계승하지 않음. user는 solid primary, human-agent는 neutral fill로 화자를 구분 |
| `SourceDisclosure` | provenance, availability, 원본 action | 완성된 component를 `sources` slot에 명시적으로 조합 |
| `FileUploadQueue` | 파일별 처리 상태와 action | upload lifecycle은 attachment component나 제품이 소유 |
| `Textarea` / input tokens | 읽기 쉬운 text color와 focus 체계 | 읽기 article에는 input chrome을 도입하지 않음 |
| `ScrollArea` / `LogViewer` | overflow와 chronological content 관례 | message 한 건은 scroll/live-region을 소유하지 않음 |

### 선택한 reading hierarchy

1. assistant의 장문·목록·코드·출처 응답은 **borderless document**가 기본입니다. full-width card나 bubble 안에 다시 가두지 않고 conversation column의 읽기 폭을 사용합니다.
2. user의 짧은 요청은 **solid primary bubble**이 기본입니다. 배경 `--color-semantic-primary-heavy`, 글자 `--color-semantic-static-white`로 화자 자신의 발화를 즉시 구분하고, 전송 시각과 읽음 상태를 bubble 하단 meta로 제공합니다. 이 대비쌍은 라이트/다크 모두 WCAG AA를 통과합니다(`primary-normal`은 다크에서 미달이라 `primary-heavy`를 사용).
3. human-agent는 사람의 짧은 발화이므로 **neutral fill bubble**이 기본입니다. 배경 `--color-semantic-fill-strong`(반투명 중립 fill)으로 라이트·다크 모두 페이지와 확실히 분리되며 solid primary user bubble과도 구분됩니다. assistant·user와의 추가 구분은 `상담원` role 배지로 전달합니다.
4. system은 avatar나 bubble 없이 **centered neutral pill 칩**으로 표시합니다. 배경 `--color-semantic-fill-normal`, 글자 `--color-semantic-label-neutral`이라 비인격적 이벤트가 참여자 역할 배지(blue pill)와 구분되며, 영향 설명이나 확인이 필요한 변경은 제품이 `Callout` 또는 dialog로 구성합니다.
5. document와 bubble은 같은 typography, spacing, focus와 dark semantic token을 사용합니다. 별도의 product palette나 messenger 전용 shadow를 만들지 않습니다.

## authoritative external review

- [Ant Design X Bubble](https://x.ant.design/components/bubble/)은 role, placement, content, variant, loading과 footer action을 분리합니다. LDS도 role과 presentation을 분리하되 일반 AI 장문 응답은 borderless document, 짧은 사용자 발화는 bubble로 적응했습니다.
- [Ant Design X Sender](https://x.ant.design/components/sender/)는 draft, submit/cancel과 utility extension을 message content와 분리합니다. 따라서 response 중지는 message action이 아니라 현재 request를 소유한 `MessageComposer`에 둡니다.
- [Carbon AI Chat overview](https://chat.carbondesignsystem.com/tag/latest/docs/documents/Overview.html)는 streamed/non-streamed response와 확장 가능한 rich content를 하나의 chat surface에서 다룹니다. 그래서 assistant body를 plain text bubble로 제한하지 않습니다.
- [Carbon AI Chat server communication](https://chat.carbondesignsystem.com/tag/latest/docs/documents/Server_communication.html)은 partial, final, cancel과 history를 transport lifecycle로 구분합니다. ConversationMessage는 현재 상태를 표현할 뿐 callback 뒤 전이를 추론하지 않습니다.
- [Slackbot 사용 안내](https://slack.com/help/articles/202026038-How-to-use-Slackbot)는 생성 중인 AI 응답에 Stop 동작이 필요함을 확인해 줍니다. 문서는 control 위치까지 규정하지 않으므로, 현재 요청을 시작하고 제어하는 `MessageComposer`가 stop을 소유한다는 배치는 LDS의 interaction-boundary 결정입니다. 따라서 ConversationMessage의 완료 응답 액션과 response cancellation을 분리합니다.
- [ChatGPT 오류 문제 해결](https://help.openai.com/en/articles/7996703)는 실패한 응답에서 오류 복구와 재생성을 제공하는 제품 관습을 설명합니다. LDS는 이를 실패 lifecycle의 명시적 `error`와 제품 소유 `onRetry` callback으로 표현하며, 성공 전이를 컴포넌트가 추론하지 않습니다.
- [Ant Design X Attachments](https://x.ant.design/components/attachments/)는 file, image, audio, video와 document attachment를 composer와 message content에 조합하는 독립 anatomy로 다룹니다. LDS도 attachment를 schema가 아닌 `ReactNode` slot으로 둡니다.
- [WAI-ARIA `log`](https://www.w3.org/TR/wai-aria/#log)는 순서대로 추가되는 chat history를 대표 사례로 정의합니다. message마다 live region을 만들지 않고 `MessageFeed` 한 곳에만 둡니다.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)의 구조, focus, name과 contrast 요구를 최종 접근성 기준으로 사용합니다.

## secondary visual inspiration

- [3 Free AI Chatbot App UI Kit](https://www.figma.com/design/ss5Fq2VKd2UDoHk7SE9dPl/3-Free-AI-Chatbot-App-UI-Kit--Community-?node-id=10301-21963)의 **왼쪽 slothGPT/general-assistant archetype**만 secondary visual inspiration으로 사용합니다.
- 채택한 것은 long-form assistant document, compact user prompt, answer action과 하단 composer의 상대적 위계입니다. exact color, typography, avatar artwork, logo, sidebar, app shell, shadow와 asset은 복사하지 않습니다.
- user 자신의 발화는 primary fill bubble로 화자를 표식하되, 특정 제품(slothpilot/Context Hub)의 messenger shell·palette·app chrome을 통째로 차용하지는 않습니다. 오른쪽 search/research 화면도 complete screen으로 가져오지 않고, provenance가 필요할 때 `SourceDisclosure`를 slot에 조합합니다.

## product workflow gate

- **LK Context Hub — supported by composition only.** rich answer, citation, attachment와 action slot을 조합할 수 있지만 product source의 card, color, width, API 또는 화면 anatomy를 차용하지 않습니다.
- **LK Web Viz — not applicable.** 지도, layer, viewport와 task targeting workflow에는 chronological AI message item이 필수 surface로 확인되지 않았습니다.
- **LK Control Full Daedeok — not applicable.** supervision, command와 manual-control state는 대화 article이 아니라 해당 domain control이 소유합니다.
- 세 제품 repository는 필요한 component 종류와 state coverage를 확인하는 자료일 뿐 design, anatomy, public API, spacing 또는 style 권위가 아닙니다.
- route, provider, transport, retrieval, permission, persistence, participant truth와 content sanitization은 제품 책임입니다.

## representative review

- 약 760px: long rich assistant document → compact user solid primary bubble → system 중앙 pill 칩 → optional human-agent neutral fill bubble의 reading order를 확인합니다.
- 320px: 긴 한글·영문·URL·code와 source/attachment/action slot이 horizontal overflow 없이 wrapping 또는 자체 overflow를 갖는지 확인합니다.
- dark: document는 배경과 불필요한 card 경계를 만들지 않고, solid primary user bubble·neutral fill human-agent bubble·system 칩·metadata가 identity와 WCAG AA 대비를 유지해야 합니다.
- lifecycle: response status는 source/action보다 먼저 읽고, failed에서만 retry가 나타나며 complete/sent steady state는 중복 success badge를 만들지 않아야 합니다.

## intentional exclusions

- Markdown parser와 sanitizer, citation 생성, attachment upload, provider/transport, persistence와 moderation
- feedback 저장·선택 상태, edit, branch/thread, 읽음 판정(read tracking; delivery `read` 상태 표시는 지원하되 읽음 여부 계산은 제품 몫), voice recorder와 tool execution. 긍정·부정 feedback과 재생성 control은 canonical `messageActions` 조합으로 지원하지만 해당 동작과 상태 전이는 제품이 구현합니다.
- 전체 화면 shell, header/sidebar, sticky composer, scroll anchoring과 unread 계산

이 항목은 제품 또는 `MessageFeed`, `MessageComposer`, `SourceDisclosure`, attachment 전용 component가 소유합니다.
