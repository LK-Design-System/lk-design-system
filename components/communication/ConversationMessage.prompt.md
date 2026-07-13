# ConversationMessage

`ConversationMessage`는 한 건의 대화 항목이 보낸 사람, 본문, 첨부·출처, 처리 상태와 해당 동작을 예측 가능한 순서로 보여주는 **LK Product Extension**입니다. WDS Core parity를 주장하지 않습니다.

```jsx
<ConversationMessage
  direction="inbound"
  authorRole="assistant"
  author="LK Assistant"
  avatar={<Avatar name="LK Assistant" size="small" />}
  lifecycle={{ kind: 'response', state: 'streaming' }}
  onStop={stopResponse}
>
  현재 경로의 충돌 가능 구간을 확인하고 있습니다.
</ConversationMessage>

<ConversationMessage
  direction="outbound"
  authorRole="user"
  variant="solid"
  author="김서윤"
>
  선택한 프로젝트 범위에서 배포 정책을 찾아 주세요.
</ConversationMessage>
```

## Meaning and ownership

- `direction`은 배치를 소유하고, 기본 `soft`에서만 inbound neutral/outbound tint surface branch를 선택합니다. `authorRole`은 발신자 의미만 소유합니다. `outbound + human-agent`, `inbound + user`처럼 제품이 명시한 조합을 허용하며 한 값에서 다른 값을 추론하지 않습니다.
- `variant="soft" | "solid"`는 direction·authorRole과 독립적인 명시적 시각 축입니다. 기본 `soft`는 기존 internal messenger의 neutral/primary-tint 문법을 보존하고, `solid`는 짧은 chatbot 사용자 발화를 primary-heavy surface와 white foreground로 강하게 식별합니다. 어느 role이나 direction에서도 자동 선택하지 않습니다.
- `system` direction은 variant와 무관하게 avatar·bubble 없는 centered neutral line을 유지합니다. provider 변경이나 session reset처럼 영향 설명이 필요한 상태는 제품이 `Callout` 또는 `ConfirmDialog`로 구성합니다.
- lifecycle은 `{ kind: 'static' }`, `{ kind: 'delivery', state }`, `{ kind: 'response', state }`의 판별 공용체입니다. outbound 전송과 assistant 응답 생명주기를 하나의 평면 enum으로 섞지 않습니다.
- 읽기 순서와 DOM 순서는 identity → body를 공통 시작점으로 합니다. response lifecycle/status는 본문 직후, attachments → sources보다 먼저 오고, delivery/static status는 전체 payload 뒤에 옵니다. actions는 항상 마지막입니다. `single`/`first`에만 32px avatar slot을 보이고, `middle`/`last`에서도 author identity는 visually hidden 상태로 접근성 트리에 남깁니다.
- 개별 메시지는 `role="log"`, `aria-live`, `role="status"`를 만들지 않습니다. 순서대로 추가되는 대화의 polite announcement는 상위 `MessageFeed`가 한 번만 소유합니다.
- response `pending`·`streaming`·`stopping`만 article에 `aria-busy="true"`를 둡니다. `delivery: sending`을 response generation과 같은 busy 의미로 바꾸지 않습니다.
- retry는 delivery/response `failed`에서만, stop은 response `pending`/`streaming`에서만 나타납니다. `stopping`은 busy를 유지하지만 중복 stop control을 제거합니다. callback 실행만으로 완료·취소를 추론하지 않으며 제품이 새 lifecycle prop을 전달해야 UI가 바뀝니다.
- `groupPosition`은 연속 메시지의 radius·identity 반복만 조정합니다. `authorLabel`은 비텍스트 author의 접근 가능한 이름, `dateTime`은 machine-readable time 값이며 visible identity를 대체하지 않습니다.
- `statusLabel`은 lifecycle 문구만 재정의하고 `null`은 marker를 숨깁니다. `retryLabel`/`stopLabel`은 각각 `onRetry`/`onStop` 버튼의 이름이고, callback 유무나 lifecycle eligibility를 바꾸지 않습니다.
- response `complete`는 정상 steady state이며 본문 완료 자체로 인지되므로 기본 marker를 표시하지 않습니다. 제품이 완료 문구를 반드시 보여야 할 때만 `statusLabel`을 명시하고 neutral caption을 사용합니다. success fill은 만들지 않습니다.
- source data는 body 아래 같은 content column의 `SourceDisclosure`로 렌더링합니다. 기본 `sourcePresentation="full"`은 독립 provenance 비교 목록을 그대로 보여주고, 명시적 `compact`는 `근거 N개` disclosure를 먼저 보여준 뒤 요청 시 같은 목록을 펼칩니다. source 개수나 role에서 presentation을 자동 추론하지 않습니다. attachments와 추가 actions는 앱이 소유한 slot이며 ConversationMessage가 파일 모델이나 action 의미를 추론하지 않습니다.

## Internal LDS visual-delta inventory

| 기준 | 확인한 계약 | ConversationMessage 결정 |
| --- | --- | --- |
| `Avatar` | person 원형, `small` 32px, identity fallback | `single`/`first` non-system에만 32px slot. avatar의 상태·이미지 로직은 복제하지 않음 |
| `Button` | sm 32px control, ghost/primary emphasis, focus·disabled 계약 | retry/stop은 기존 `Button size="sm" variant="ghost"`를 조합 |
| `StatusBadge` / `Tag` | 상태와 분류를 compact capsule로 강조 | lifecycle은 메시지의 보조 caption이므로 별도 badge/card를 만들지 않고 dot + text로 낮춤 |
| `SourceDisclosure` | source identity → availability → detail/action, 좁은 폭 재배치 | 같은 content column에서 기본 full 목록 또는 명시적 compact count disclosure로 조합하고 source renderer를 복제하지 않음. compact 내부의 중복 visible `출처` heading만 숨기되 section name은 접근성 트리에 유지. 정상 complete marker는 생략해 source availability와 혼동하지 않음 |
| `FileUploadQueue` | 파일별 identity/lifecycle/action과 하나의 queue live summary | attachment는 queue가 아닌 slot. 업로드 상태와 재시도는 ConversationMessage가 소유하지 않음 |
| `Bubble` | 280px annotation width, tail, `shadow-md`, coach-mark 방향 | 메시지에는 tail과 annotation 폭을 사용하지 않음. soft inbound는 elevated neutral + hairline + `shadow-xs`, soft outbound는 primary-surface, system은 centered neutral line |
| `Button` / `Chip` / `IconButton` solid | 불투명 semantic fill과 짝지어진 foreground를 사용하고 soft/solid를 명시적으로 선택 | message `solid`도 같은 LK 색 계층을 재사용하되 control state, hover, pressed를 만들지 않음 |
| `Textarea` / `ActionArea` | 입력·sticky action composition | 이 컴포넌트는 읽기 항목만 소유하며 composer 입력과 전송 affordance를 포함하지 않음 |

- 본문 surface만 채우고 attachments·sources를 아래에 이어 붙여 card-within-card를 피합니다.
- chatbot composition의 compact source는 닫힌 32px count disclosure로 시작합니다. 펼쳤을 때 기존 `SourceDisclosure`가 provenance·availability·원본 action을 모두 보존하며, 외부 summary의 `근거 N개`와 내부 `출처` heading이 연속으로 중복되지 않도록 내부 제목만 visually hidden 처리합니다.
- compact의 `근거 N개`는 제품이 응답을 실제로 뒷받침한다고 검증한 citation 배열에만 사용합니다. missing·restricted·error 항목을 먼저 경고해야 하거나 목록 자체를 provenance 조사 대상으로 비교할 때는 기본 `full`을 사용해 availability를 숨기지 않습니다.
- layout spacing은 identity/body 사이 `space-2`, body inset `space-3/space-4`, slot 사이 `space-2`를 사용합니다. 본문은 `body2`, author는 `label1 semibold`, timestamp·lifecycle은 `caption2`로 내려 identity → content → metadata 위계를 유지합니다.
- response 진행·실패 marker는 본문과 하나의 상태 단위로 읽히도록 evidence보다 먼저 두고, delivery receipt는 attachment/source를 포함한 outbound payload 뒤에 둡니다. 모든 status를 같은 trailing 위치에 강제해 서로 다른 소유 범위를 섞지 않습니다.
- 기본 본문 최대 폭은 42rem이며 `overflow-wrap`과 내부 slot의 `min-width: 0`으로 320px에서 긴 한국어·영어 URL을 보존합니다. `soft`는 content column을 채우고 `solid`는 `fit-content`로 짧은 사용자 발화를 감싸되 같은 42rem/100% 상한에서 긴 문장을 줄바꿈합니다. solid plain text는 `white-space: pre-wrap`으로 Composer의 Shift+Enter 줄바꿈과 연속 공백을 보존합니다. 긴 code block은 앱이 자체 scroll container를 제공할 수 있습니다.
- group shape는 LDS `radius-md/lg`만 사용합니다. Bubble의 `radius-xl`, tail, `shadow-md`를 계승하지 않습니다.
- 기본 `soft`에서 inbound는 elevated neutral fill + normal hairline + `shadow-xs`, outbound는 primary-surface + normal hairline + shadow 없음입니다. `solid`는 body에 primary-heavy fill + static-white foreground를 사용하고 border·shadow 강조를 추가하지 않습니다. system은 divider line과 neutral caption뿐이며 별도 surface가 없습니다.
- `solid`의 primary-heavy/static-white 대비는 light 6.59:1, dark 4.85:1입니다. primary-normal/static-white는 dark에서 3.39:1이므로 solid foreground 조합에서 제외했습니다.
- chatbot 피아식별은 사용자 발화에 `solid`를 명시하고 assistant 발화는 `soft`에 남기는 composition으로 표현합니다. non-system `solid`는 타입에서 children 존재와 plain string/number 범위를 제한하고 런타임에서 비어 있지 않은 값을 검증하며, 링크·heading·markdown 같은 rich content에는 `soft`를 사용하게 합니다. 이는 전역 link/heading 색이 inverse surface 대비를 깨뜨리는 것을 막습니다. system direction은 variant와 무관하게 neutral line이므로 rich content 제한을 받지 않습니다. AI의 긴 문서형 응답을 위한 borderless/plain surface는 이번 축에 포함하지 않으며 실제 반복 소비 근거가 생기기 전에는 별도 variant를 만들지 않습니다.
- lifecycle marker는 6px dot + text이고 failure만 negative semantic color를 사용합니다. sent/cancelled와 명시적으로 요청한 complete label은 neutral이며 selected/active chrome나 success fill을 만들지 않습니다.
- article 자체에는 hover·focus·disabled 상태가 없습니다. retry/stop의 focus·hover·disabled와 source disclosure의 keyboard 상태는 조합한 `Button`과 `SourceDisclosure`가 소유하며 새 interaction 문법을 추가하지 않습니다.
- dark theme에서도 semantic token을 그대로 재해석하며 별도의 hard-coded inverse palette를 만들지 않습니다.

## Authoritative external basis

- [WHATWG HTML `details`/`summary`](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-details-element)는 추가 정보를 요청 시 여는 disclosure의 기본 의미를 정의합니다. compact source는 탭이나 메뉴가 아니라 출처 목록을 여는 동작이므로 이 네이티브 구조를 사용합니다.
- [WAI-ARIA APG Disclosure Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)은 trigger가 Enter와 Space로 펼침 상태를 전환하고 상태가 보조 기술에 전달되어야 한다고 설명합니다. LDS는 `details`/`summary`의 브라우저 계약을 재구현하지 않고 실제 `SourceDisclosure` 목록만 내부에 조합합니다.
- [WAI-ARIA 1.2 `log` role](https://www.w3.org/TR/wai-aria/#log)은 chat history를 의미 있는 순서로 끝에 추가되는 하나의 live region으로 정의합니다. 그래서 개별 message article은 live region이 아니며 상위 feed가 log 경계를 소유합니다.
- [WCAG Technique ARIA23](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA23)는 chat conversation container에 `role="log"`를 두어 새 항목을 알리는 예시를 제공합니다. message 자체에 반복 live region을 만들지 않는 근거입니다.
- [Carbon AI Chat server communication](https://chat.carbondesignsystem.com/tag/latest/docs/documents/Server_communication.html)은 partial/complete/final response를 구분하고, stop 요청이 transport를 자동 종료하지 않으며 final state를 별도로 전달해야 한다고 명시합니다. stop callback 뒤 lifecycle을 임의 완료 처리하지 않는 근거입니다.
- [Carbon AI Chat `PublicConfigMessaging`](https://chat.carbondesignsystem.com/tag/latest/docs/interfaces/Type_reference.PublicConfigMessaging.html)은 첫 streaming chunk 전의 느린 pending 단계에도 stop을 제공할 수 있게 합니다. 그래서 LDS도 response `pending`과 `streaming`을 active stop 상태로 취급합니다. Carbon은 stop을 input field에 배치하지만 LDS는 message-local lifecycle action으로 제공한다는 의도적 배치 차이가 있으며, 제품은 composer와 message에 같은 stop을 중복 노출하지 않습니다.
- [Carbon AI Chat server communication](https://chat.carbondesignsystem.com/tag/latest/docs/documents/Server_communication.html)은 final response 수신 시 streaming UI를 정리하고 steady message로 전환합니다. 완료를 별도 visible receipt로 덧붙이지 않는 이 상태 전이를 따라 LDS도 response `complete`를 기본 silent state로 두며, 진행·중단·실패만 필요한 동안 표시합니다.
- [Carbon AI Chat `InputConfig`](https://chat.carbondesignsystem.com/tag/latest/docs/interfaces/Type_reference.InputConfig.html)은 main chat input의 visible·disabled·character-limit 계약을 message response와 분리합니다. ConversationMessage가 입력, 전송 affordance 또는 character limit을 포함하지 않는 근거입니다.
- [Carbon AI Chat MessageResponseTypes](https://chat.carbondesignsystem.com/tag/latest/docs/enums/Type_reference.MessageResponseTypes.html)는 system-only message를 avatar와 bubble 없는 centered line으로 구분합니다. LDS system direction도 같은 정보 계층을 따르되 Carbon 시각 스타일을 복사하지 않습니다.
- [Carbon AI Chat `ConversationalSearchText`](https://github.com/carbon-design-system/carbon-ai-chat/blob/main/packages/ai-chat/src/chat/components-legacy/responseTypes/conversationalSearch/ConversationalSearchText.tsx)는 답변 뒤 citation count toggle을 두고 요청 시 citation content를 response 안에서 엽니다. LDS compact source도 본문 뒤 count disclosure를 사용하되, provenance 목록·availability·원본 action은 기존 `SourceDisclosure`에 위임합니다.
- [Android official Jetchat sample](https://github.com/android/compose-samples/blob/main/Jetchat/app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt)은 self message에 Material primary, 상대 message에 surface variant를 사용합니다. LDS는 self를 role에서 추론하지 않고 제품이 `solid`를 명시하게 하며 LK 토큰만 재사용합니다.
- 같은 Jetchat message anatomy는 steady message를 author/time과 body로 읽고 별도 response-complete caption을 추가하지 않습니다. LDS도 정상 완료를 숨기되 delivery receipt와 비정상 response state는 명시적 lifecycle로 유지합니다.
- [Microsoft Teams color swatches](https://learn.microsoft.com/en-us/microsoftteams/platform/assets/downloads/MicrosoftTeams-ColorSwatches.pdf)는 self bubble을 brand color가 섞인 별도 surface로 정의합니다. LDS internal messenger의 soft tint는 유지하되, 빠른 chatbot 피아식별이 필요한 조합에서만 더 강한 solid surface를 선택합니다.
- [WCAG 2.2 Contrast (Minimum)](https://www.w3.org/TR/WCAG22/#contrast-minimum)에 따라 regular text 4.5:1을 light/dark 모두 만족하는 primary-heavy/static-white 조합만 사용합니다.

## Product source adaptation

- `docs/references/product-frontends/COVERAGE_AUDIT.json`에 고정된 Context Hub `PortalChatPanel.tsx`는 user를 solid blue + white plain text, assistant를 neutral surface + rich markdown으로 분리합니다. LDS는 이 제품 역할 매핑을 자동화하지 않고 `variant`를 명시적 축으로만 제공하며, 실제 Context Hub composition이 user→solid/assistant→soft를 선택합니다.
- 같은 source의 bubble은 flex item의 intrinsic width와 max-width 상한을 사용합니다. 따라서 LDS `solid`도 짧은 발화를 shrink-wrap하고, 기존 internal messenger에 쓰이는 `soft` full-width card 문법은 보존합니다.
- 같은 고정 source는 assistant body 뒤 divider와 `근거 N개` trigger를 먼저 보여주고 compact links는 펼친 상태에서만 노출합니다. LDS는 이 배치 결론을 `sourcePresentation="compact"`로 재현하지만, 제품별 citation truth와 link selection은 계속 Context Hub가 소유합니다.
- LK Web Viz pin `a984def117c05acd213f494cbb8a42e990595505`는 WF-15 map navigation/facility authoring의 spatial canvas·editor만 소비하고 message/chat surface가 없어 이 variant 검토에는 **not applicable**입니다.
- LK Control Full Daedeok pin `93802fc2aa5d29f930380ae58d51dcb68322b5e7`는 WF-01/02/03/05/09/13의 supervision, guarded action, procedure, manual control, scheduling을 소비하며 scoped-knowledge conversation surface가 없어 이 variant 검토에는 **not applicable**입니다.

## Intentional exclusions

- 읽음/전달 receipt, reaction, edit/regenerate, thread/reply UI는 실제 제품 요구와 별도 상태 모델이 확인될 때 확장합니다.
- `solid`를 user/assistant/human-agent에 자동 연결하거나 색으로 전송 protocol·권한·신뢰도를 추론하지 않습니다. Apple Messages처럼 bubble color가 transport 의미를 갖는 제품과 달리 LDS variant는 시각적 피아식별만 소유합니다.
- markdown/code/link sanitizer, attachment renderer, source fetch·permission, transport/provider 연결, optimistic update, retry/abort 실행과 persistence는 앱 영역입니다.
- 대화 전체 scroll anchoring, 새 메시지 announcement, unread boundary와 composer focus 이동은 `MessageFeed`/`MessageComposer`가 소유합니다.
