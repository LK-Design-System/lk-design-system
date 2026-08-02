# Select and MessageFeed layout follow-up

| Field | Value |
| --- | --- |
| Type | Implementation follow-up |
| Status | Follow-up |
| Owner | LDS Core owner (`Select`) · LDS Product owner (`MessageFeed`) |
| Last reviewed | 2026-08-02 |
| Consumer evidence | LK Portal floating knowledge chat, `@lk-design-system/*@0.1.0-rc.13` |
| Completion source | Changed component source, focused Storybook contracts, generated workspace packages, immutable release artifact |

이 문서는 LK Portal의 플로팅 지식 대화에서 확인한 두 LDS 레이아웃 finding을
나중에 동일한 근거와 범위로 수정하기 위한 실행 기록이다. 화면별 CSS 보정 목록이
아니며, 하나의 Core 구현 결함과 하나의 Product 조합 계약 부족을 서로 분리해 추적한다.

- `Select`: 숨은 intrinsic-width 측정 요소가 trigger 앞의 세로 공간과 wrapping을 만든다.
- `MessageFeed`: 내부 log viewport의 inline inset이 고정돼 panel composition이 정렬을
  공개 API로 선택할 수 없다.

LK Portal의 배치·밀도 조정은 LDS 수정과 새 immutable package 채택 뒤의 별도 consumer
작업이다. 이 문서는 LK Portal 저장소에 내부 selector override를 추가하는 근거가 아니다.

## 관찰 조건과 재현값

2026-08-02에 LK Portal `http://localhost:3000/`의 열린 플로팅 대화 패널을
1339×792 viewport에서 측정했다. 패널은 460×674px이었다.

### Select

`MessageComposer.leadingActions`에 `size="sm"`, `render="chip"`인 `Select`가 있고,
옵션 집합에는 긴 지식 문서·프로젝트 이름이 포함돼 있었다.

| 대상 | 관찰값 |
| --- | --- |
| `[data-select-root]` | 401×52px, y=594.67 |
| `#chat-context-scope` trigger | 401×32px, y=614.67 |
| trigger 앞의 비가시 공간 | 20px |
| `[data-composer-actions-row]` | 높이 92px |
| 결과 | 범위 선택기가 action band를 한 줄 차지하고 primary send action을 다음 줄로 밀어냄 |

관련 구현은 [`components/forms/Select.jsx`](../components/forms/Select.jsx)의
`data-select-width-sizer`와 trigger를 확인한다. width sizer는 `height: 0`과
`visibility: hidden`을 가지지만 일반 inline formatting context에 남아 있고, 뒤의
`width: 100%` trigger가 다음 line box로 넘어간다. 기존 Storybook 계약은 선택값 변경
전후의 trigger 폭만 검사하고 root 높이, trigger 시작 좌표와 constrained overflow는
검사하지 않는다.

### MessageFeed

같은 패널에서 panel border의 logical start를 기준으로 한 시작 간격은 다음과 같았다.

| 영역 | 관찰된 시작 간격 |
| --- | --- |
| panel header content | 약 16px |
| composer outer shell | 약 12px |
| assistant message article | 약 8px |

[`components/communication/MessageFeed.jsx`](../components/communication/MessageFeed.jsx)의
focusable log viewport가 `padding: var(--space-3) var(--space-2)`를 인라인 구현으로
소유한다. 공개 `style`은 바깥 `<section>`에 병합되므로 consumer가 log viewport의
inline inset을 공개 계약으로 바꿀 수 없다. `ConversationMessage`의 assistant document
presentation은 자체 card/padding을 만들지 않는 것이 의도된 계약이므로 이 finding을
`ConversationMessage`에 해결하지 않는다.

## 책임과 변경 분류

| Work item | 분류 | LDS 책임 | Consumer 책임 |
| --- | --- | --- | --- |
| A. Select 측정기 | WDS Core 구현 버그 수정 | 기존 intrinsic-width와 접근성 계약을 유지하면서 측정 subtree를 세로 layout·wrapping·scroll overflow에서 격리 | 지원된 root `style` API로 composition 폭을 지정 |
| B. MessageFeed inset | LK Product Extension의 additive API 변경 | 제한된 semantic inset 축과 responsive/scroll 계약 제공 | panel 또는 full-page 맥락에 맞는 축을 명시적으로 선택 |

Work item A는 새 variant나 visual language가 아니다. Work item B는 재사용 가능한 layout
축을 추가하므로 구현 전에 [`COMPONENT_WORKFLOW.md`](COMPONENT_WORKFLOW.md)의 sibling,
product-workflow, external-reference, normal/narrow visual gate를 다시 수행한다.

## Work item A — Select intrinsic-width 측정기

### 유지할 계약

- 현재 선택값이 아니라 전체 option 집합의 가장 긴 label을 기준으로 안정된 폭을 유지한다.
- width sizer는 접근성 트리와 pointer interaction에서 제외한다.
- controlled/uncontrolled value, keyboard, light-dismiss와 listbox 위치 계약을 바꾸지 않는다.
- `style`은 현재처럼 root에 병합되고 consumer가 `minWidth`, `width`, `maxWidth`를
  제한할 수 있어야 한다.
- 공개 prop과 `.d.ts`에는 변경이 없어야 한다.

### 구현 방향

폭 측정 subtree를 일반 inline flow 밖으로 격리한다. 단순히 `height: 0`만 유지하거나
trigger를 block으로 바꾸는 방식은 line box가 남을 수 있으므로 완료 조건이 아니다.
absolute measurement layer, single-cell overlay 또는 동등한 격리 방식 중 하나를 사용하되
다음 두 결과를 브라우저에서 함께 검증한다.

1. 측정 subtree가 root의 높이와 trigger의 y 좌표를 바꾸지 않는다.
2. 긴 option을 측정하더라도 폭이 제한된 root의 `scrollWidth`를 늘리지 않는다.

측정 로직을 DOM에서 제거하거나 label을 단순 문자열로만 측정하는 재설계는 이번
버그 수정 범위가 아니다. `ReactNode` label과 icon reserve를 포함한 기존 폭 계약을
보존한다.

### 변경 파일

- [`components/forms/Select.jsx`](../components/forms/Select.jsx)
- [`stories/FormSelect.stories.jsx`](../stories/FormSelect.stories.jsx)
- 필요할 때만 [`components/forms/Select.prompt.md`](../components/forms/Select.prompt.md)에
  out-of-flow measurement 불변식을 추가한다.

`packages/core/src/**`는 생성물이다. 직접 먼저 수정하지 않는다.

### 수락 기준

- label/helper가 없는 `sm`, `md`, `lg` Select에서 root 높이와 trigger 높이가 같다.
- 같은 조건에서 root top과 trigger top의 차이가 0~1px 이내다.
- 긴 값과 짧은 값을 전환해도 현재 stable-width 허용 오차 0.5px을 유지한다.
- 긴 option과 `style={{ minWidth: 0, width: 220, maxWidth: '100%' }}` 조합에서
  root와 trigger가 220px을 넘지 않는다.
- 위 constrained 사례에서 root와 가장 가까운 layout wrapper에 가로 overflow가 없다.
- `render="text"`와 `render="chip"`, label/helper 유무, open/closed 상태를 확인한다.
- keyboard, focus, outside-dismiss와 listbox alignment 기존 contract가 회귀하지 않는다.

기존 hidden story `SelectStableOptionWidthContract`에 높이·좌표 검증을 추가하고,
긴 label을 제한 폭 안에서 검증하는 실제 Select variant/contract를 같은 Storybook 페이지에
둔다. audit dashboard나 별도 reference-only story는 만들지 않는다.

## Work item B — MessageFeed viewport inset

### 권장 공개 계약

임의의 `viewportStyle`, raw pixel prop 또는 내부 selector hook을 열지 않는다. LDS가
간격 값을 소유하면서 실제 두 composition을 표현하는 제한된 축을 추가한다.

```ts
export type MessageFeedViewportInset = 'compact' | 'comfortable';

export interface MessageFeedProps {
  /** @default "compact" */
  viewportInset?: MessageFeedViewportInset;
}
```

권장 내부 매핑은 다음과 같다.

```js
const VIEWPORT_INLINE_INSET = {
  compact: 'var(--space-2)',
  comfortable: 'var(--space-4)',
};
```

- `compact`: 현재 좌우 8px을 보존한다.
- `comfortable`: panel composition용 좌우 16px이다.
- block padding 12px은 이 finding에서 바꾸지 않는다.
- 구현은 `paddingBlock`과 `paddingInline` logical property를 사용한다.
- 기존 default를 16px로 변경하지 않는다. default 변경은 모든 consumer 영향과
  design-owner 승인을 요구하는 별도 shared visual decision이다.
- 실제 세 번째 사용례가 확인되기 전에는 `none`, raw CSS length 또는 추가 density를
  만들지 않는다.

### 이 API를 선택하는 이유

- 바깥 `style`은 section layout용이라는 현재 Storybook 설명을 보존한다.
- `viewportStyle`은 consumer가 focus outline, scrollbar, overflow, fill까지 다시 그리게
  하므로 LDS와 Product의 소유 경계를 무너뜨린다.
- component 내부 data attribute에 CSS를 적용하는 방식은 private anatomy에 결합된다.
- global `--space-2` 값이나 공유 semantic token을 바꾸면 MessageFeed 밖의 표면까지
  이동하므로 허용하지 않는다.
- scrollbar는 viewport 가장자리에 남고 content만 안쪽으로 이동해야 하므로 바깥 wrapper
  padding으로 대체하지 않는다.

### 구현 전 재검토

- LDS sibling: `ScrollArea`, `LogViewer`, `ConversationMessage`, `Container`의 scroll,
  reading column과 inset 소유권을 비교한다.
- LK Context Hub: panel형 대화에서 `comfortable` 필요성을 실제 source와 정상/좁은 폭으로
  다시 확인한다.
- LK Web Viz와 LK Control Full Daedeok: 대화 feed 사용 근거가 없으면 구체적 이유와 함께
  `not applicable`을 기록한다.
- [`components/communication/MessageFeed.prompt.md`](../components/communication/MessageFeed.prompt.md)의
  WAI-ARIA, Slack, Carbon AI Chat, Ant Design X 근거를 다시 열고 layout/inset 결론을
  보강한다. reusable pattern change이므로 코딩 전에 현재 authoritative external source를
  확인한다.

### 변경 파일

- [`components/communication/MessageFeed.jsx`](../components/communication/MessageFeed.jsx)
- [`components/communication/MessageFeed.d.ts`](../components/communication/MessageFeed.d.ts)
- [`components/communication/MessageFeed.prompt.md`](../components/communication/MessageFeed.prompt.md)
- [`stories/CommunicationMessageFeed.stories.jsx`](../stories/CommunicationMessageFeed.stories.jsx)
- [`COMPONENT_API_STATE_MATRIX.md`](COMPONENT_API_STATE_MATRIX.md)
- 생성되는 component guide/runtime과 package source

`packages/product/src/**`는 생성물이며 canonical source 반영 뒤 생성한다.

### 수락 기준

- prop을 생략하면 현재 inline padding 8px을 유지한다.
- `viewportInset="comfortable"`이면 logical start/end padding이 16px이다.
- 두 값 모두 feed background, border, radius와 shadow가 없는 chrome-free 계약을 유지한다.
- 760px reading column, 460px panel-width specimen과 320px narrow specimen을 확인한다.
- 320px `comfortable`에서 message, history/latest action과 viewport에 가로 overflow가 없다.
- scrollbar gutter는 viewport 바깥쪽 가장자리에 유지되고 content inset만 변한다.
- assistant document, user/human bubble, system pill, separator와 empty/busy 상태를 확인한다.
- Home/End/Page Up/Page Down, follow/unread와 history anchoring contract가 회귀하지 않는다.

기존 MessageFeed Storybook 페이지에 실제 `compact`/`comfortable` variant를 추가하고,
`Narrow320` 또는 동등한 narrow story에 comfortable 상태를 포함한다. complete LK Portal
screen이나 audit dashboard를 Storybook에 추가하지 않는다.

## 정본, 생성물과 검증 순서

정본은 repository root의 `components/`, `stories/`, `docs/`다. workspace package source는
[`scripts/generate-workspace-sources.mjs`](../scripts/generate-workspace-sources.mjs)가 복사하고
cross-package import를 재작성한다.

권장 작업 순서:

1. 시작 시 branch와 dirty worktree를 확인하고 기존 변경을 보존한다.
2. Work item A를 독립 변경으로 구현하고 Select focused story를 검증한다.
3. Work item B의 workflow/external review를 완료한 뒤 독립 변경으로 구현한다.
4. canonical source와 `.d.ts`, prompt, story를 맞춘다.
5. `npm run generate:workspace-sources`로 workspace source를 재생성한다.
6. 새 API가 의도된 경우에만 API drift baseline과 generated component docs를 갱신한다.
7. 관련 Storybook을 정상·460px·320px에서 실제 렌더 검수한다.
8. 관련 검증이 통과한 뒤 최종 checkpoint에서 전체 gate를 한 번 실행한다.

표적 검증 후보:

```powershell
npm run build
npm run check:types
npm run check:api-drift
npm run check:generated
npm run build:storybook
```

최종 검증:

```powershell
npm run check
npm run check:pack:ci
npm run check:workspace-consumer:windows
```

Windows canonical artifact를 사용하고 필요하면 동일 package set을 Linux consumer matrix로
검증한다. repository의 [`OPERATING_MODEL.md`](OPERATING_MODEL.md)와
[`PACKAGE_MIGRATION_GUIDE.md`](PACKAGE_MIGRATION_GUIDE.md)를 따른다.

## 릴리스와 LK Portal 후속

- 기존 `0.1.0-rc.13` tarball을 덮어쓰지 않는다.
- 구현 시점의 release policy가 정한 새 unpublished version으로 Core/Product/Theme package
  set을 생성하고 immutability 검사를 통과시킨다.
- LK Portal은 새 tarball을 `vendor/`에 넣고 세 package를 같은 release set으로 pin한다.
- Portal에서 `Select` root의 지원된 `style` API로 composition 폭을 제한하고, LDS 내부
  `#chat-context-scope` selector override는 제거한다.
- Portal의 floating panel에는 `MessageFeed viewportInset="comfortable"`을 적용한다.
- `MessageComposer`의 `minRows`와 scope control 위치는 LDS 결함과 별개의 product density
  결정이므로 Portal에서 따로 검토한다.

## 범위 밖

- LK Portal chat workflow, retrieval, persistence, source selection policy
- complete `ChatWindow` 또는 LK Portal 전용 scope-picker component 추가
- `ConversationMessage` assistant document에 product panel padding 삽입
- `MessageFeed`의 background, border, radius 또는 product surface axis 추가
- shared spacing token 값 변경
- 모든 consumer의 기본 inset을 일괄 변경

## 완료 체크리스트

- [ ] Work item A: Select root/trigger 높이와 좌표 회귀 계약 추가
- [ ] Work item A: constrained long-option overflow 계약 추가
- [ ] Work item A: 구현 수정과 기존 keyboard/overlay 검증 통과
- [ ] Work item B: workflow·sibling·product coverage·external review 기록
- [ ] Work item B: `viewportInset` source/type/prompt/story/API matrix 반영
- [ ] Canonical source에서 workspace packages 재생성
- [ ] 정상·460px·320px 시각 검수
- [ ] 전체 gate와 package/consumer 검증 통과
- [ ] 새 immutable LDS package set 생성
- [ ] LK Portal이 새 package set을 pin하고 내부 workaround를 제거
- [ ] 이 문서의 Status를 `Completed`로 바꾸고 완료 revision/release를 기록
