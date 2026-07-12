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
```

## Meaning and ownership

- `direction`은 배치와 surface만 소유하고 `authorRole`은 발신자 의미만 소유합니다. `outbound + human-agent`, `inbound + user`처럼 제품이 명시한 조합을 허용하며 한 값에서 다른 값을 추론하지 않습니다.
- lifecycle은 `{ kind: 'static' }`, `{ kind: 'delivery', state }`, `{ kind: 'response', state }`의 판별 공용체입니다. outbound 전송과 assistant 응답 생명주기를 하나의 평면 enum으로 섞지 않습니다.
- 읽기 순서와 DOM 순서는 identity → body → attachments → sources → lifecycle/status → actions입니다. `single`/`first`에만 32px avatar slot을 보이고, `middle`/`last`에서도 author identity는 visually hidden 상태로 접근성 트리에 남깁니다.
- 개별 메시지는 `role="log"`, `aria-live`, `role="status"`를 만들지 않습니다. 순서대로 추가되는 대화의 polite announcement는 상위 `MessageFeed`가 한 번만 소유합니다.
- response `pending`·`streaming`·`stopping`만 article에 `aria-busy="true"`를 둡니다. `delivery: sending`을 response generation과 같은 busy 의미로 바꾸지 않습니다.
- retry는 delivery/response `failed`에서만, stop은 response `pending`/`streaming`에서만 나타납니다. `stopping`은 busy를 유지하지만 중복 stop control을 제거합니다. callback 실행만으로 완료·취소를 추론하지 않으며 제품이 새 lifecycle prop을 전달해야 UI가 바뀝니다.
- `groupPosition`은 연속 메시지의 radius·identity 반복만 조정합니다. `authorLabel`은 비텍스트 author의 접근 가능한 이름, `dateTime`은 machine-readable time 값이며 visible identity를 대체하지 않습니다.
- `statusLabel`은 lifecycle 문구만 재정의합니다. `retryLabel`/`stopLabel`은 각각 `onRetry`/`onStop` 버튼의 이름이고, callback 유무나 lifecycle eligibility를 바꾸지 않습니다.
- `complete`는 성공을 뜻하지 않으므로 녹색 success treatment를 사용하지 않고 neutral caption으로 표시합니다.
- source data는 body 아래 같은 content column의 `SourceDisclosure`로 렌더링합니다. attachments와 추가 actions는 앱이 소유한 slot이며 ConversationMessage가 파일 모델이나 action 의미를 추론하지 않습니다.

## Internal LDS visual-delta inventory

| 기준 | 확인한 계약 | ConversationMessage 결정 |
| --- | --- | --- |
| `Avatar` | person 원형, `small` 32px, identity fallback | `single`/`first` non-system에만 32px slot. avatar의 상태·이미지 로직은 복제하지 않음 |
| `Button` | sm 32px control, ghost/primary emphasis, focus·disabled 계약 | retry/stop은 기존 `Button size="sm" variant="ghost"`를 조합 |
| `StatusBadge` / `Tag` | 상태와 분류를 compact capsule로 강조 | lifecycle은 메시지의 보조 caption이므로 별도 badge/card를 만들지 않고 dot + text로 낮춤 |
| `SourceDisclosure` | source identity → availability → detail/action, 좁은 폭 재배치 | body 다음 같은 column에 그대로 조합하고 source renderer를 복제하지 않음 |
| `FileUploadQueue` | 파일별 identity/lifecycle/action과 하나의 queue live summary | attachment는 queue가 아닌 slot. 업로드 상태와 재시도는 ConversationMessage가 소유하지 않음 |
| `Bubble` | 280px annotation width, tail, `shadow-md`, coach-mark 방향 | 메시지에는 tail과 annotation 폭을 사용하지 않음. inbound는 elevated neutral + hairline + `shadow-xs`, outbound는 solid brand가 아닌 primary-surface, system은 centered neutral line |
| `Textarea` / `ActionArea` | 입력·sticky action composition | 이 컴포넌트는 읽기 항목만 소유하며 composer 입력과 전송 affordance를 포함하지 않음 |

- 본문 surface만 채우고 attachments·sources를 아래에 이어 붙여 card-within-card를 피합니다.
- layout spacing은 identity/body 사이 `space-2`, body inset `space-3/space-4`, slot 사이 `space-2`를 사용합니다. 본문은 `body2`, author는 `label1 semibold`, timestamp·lifecycle은 `caption2`로 내려 identity → content → metadata 위계를 유지합니다.
- 기본 본문 최대 폭은 42rem이며 `overflow-wrap`과 내부 slot의 `min-width: 0`으로 320px에서 긴 한국어·영어 URL을 보존합니다. 긴 code block은 앱이 자체 scroll container를 제공할 수 있습니다.
- group shape는 LDS `radius-md/lg`만 사용합니다. Bubble의 `radius-xl`, tail, `shadow-md`를 계승하지 않습니다.
- inbound는 elevated neutral fill + normal hairline + `shadow-xs`, outbound는 primary-surface + normal hairline + shadow 없음입니다. system은 divider line과 neutral caption뿐이며 별도 surface가 없습니다.
- lifecycle marker는 6px dot + text이고 failure만 negative semantic color를 사용합니다. complete/sent/cancelled는 neutral이며 selected/active chrome나 success fill을 만들지 않습니다.
- article 자체에는 hover·focus·disabled 상태가 없습니다. retry/stop의 focus·hover·disabled와 source disclosure의 keyboard 상태는 조합한 `Button`과 `SourceDisclosure`가 소유하며 새 interaction 문법을 추가하지 않습니다.
- dark theme에서도 semantic token을 그대로 재해석하며 별도의 hard-coded inverse palette를 만들지 않습니다.

## Authoritative external basis

- [WAI-ARIA 1.2 `log` role](https://www.w3.org/TR/wai-aria/#log)은 chat history를 의미 있는 순서로 끝에 추가되는 하나의 live region으로 정의합니다. 그래서 개별 message article은 live region이 아니며 상위 feed가 log 경계를 소유합니다.
- [WCAG Technique ARIA23](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA23)는 chat conversation container에 `role="log"`를 두어 새 항목을 알리는 예시를 제공합니다. message 자체에 반복 live region을 만들지 않는 근거입니다.
- [Carbon AI Chat server communication](https://chat.carbondesignsystem.com/tag/latest/docs/documents/Server_communication.html)은 partial/complete/final response를 구분하고, stop 요청이 transport를 자동 종료하지 않으며 final state를 별도로 전달해야 한다고 명시합니다. stop callback 뒤 lifecycle을 임의 완료 처리하지 않는 근거입니다.
- [Carbon AI Chat `PublicConfigMessaging`](https://chat.carbondesignsystem.com/tag/latest/docs/interfaces/Type_reference.PublicConfigMessaging.html)은 첫 streaming chunk 전의 느린 pending 단계에도 stop을 제공할 수 있게 합니다. 그래서 LDS도 response `pending`과 `streaming`을 active stop 상태로 취급합니다. Carbon은 stop을 input field에 배치하지만 LDS는 message-local lifecycle action으로 제공한다는 의도적 배치 차이가 있으며, 제품은 composer와 message에 같은 stop을 중복 노출하지 않습니다.
- [Carbon AI Chat `InputConfig`](https://chat.carbondesignsystem.com/tag/latest/docs/interfaces/Type_reference.InputConfig.html)은 main chat input의 visible·disabled·character-limit 계약을 message response와 분리합니다. ConversationMessage가 입력, 전송 affordance 또는 character limit을 포함하지 않는 근거입니다.
- [Carbon AI Chat MessageResponseTypes](https://chat.carbondesignsystem.com/tag/latest/docs/enums/Type_reference.MessageResponseTypes.html)는 system-only message를 avatar와 bubble 없는 centered line으로 구분합니다. LDS system direction도 같은 정보 계층을 따르되 Carbon 시각 스타일을 복사하지 않습니다.

## Intentional exclusions

- 읽음/전달 receipt, reaction, edit/regenerate, thread/reply UI는 실제 제품 요구와 별도 상태 모델이 확인될 때 확장합니다.
- markdown/code/link sanitizer, attachment renderer, source fetch·permission, transport/provider 연결, optimistic update, retry/abort 실행과 persistence는 앱 영역입니다.
- 대화 전체 scroll anchoring, 새 메시지 announcement, unread boundary와 composer focus 이동은 `MessageFeed`/`MessageComposer`가 소유합니다.
