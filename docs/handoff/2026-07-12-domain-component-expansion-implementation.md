# Handoff — 도메인 컴포넌트 확장 구현 중간 체크포인트

Date: 2026-07-12  
Branch: `main`  
HEAD: `04eb718`  
Goal: `계획 문서를 토대로 구현 / 중간중간에 과도한 전체 점검을 삼가`  
Status: **표적 검증 완료 · 미커밋** (2026-07-12 후속 세션에서 마무리)

## 2026-07-12 후속 세션 완료 기록

계획의 N1–N6 · C1–C4 · K1이 모두 구현·연결·검증됐다. 사용자 선택에 따라 저장소 전체 `npm run check` 대신
**신규 스토리 표적 검증**으로 G5를 닫았다.

- **구현 완료**: N6 세만틱 미러(지도+이름 목록+LayerPanel+SelectionInspector+Legend, 지도 전체폭 배치로 24px hit target 확보),
  C4 대화 구성(Message+Feed+Composer+SourceDisclosure, ChatWindow/가짜 백엔드 없음). C2/C3/K1은 중단된 백그라운드
  에이전트가 완성해 둔 것을 계약 대조로 검증.
- **공개 연결**: `npm run generate:entry`로 신규 10개 public export 생성, 9개 신규 스토리 import를 `../src/index.js`로 통일,
  `consumer-contract.tsx`에 10개 추가 → React 18/19 타입 검증 통과.
- **접근성 가드 통과**: 46개 신규 스토리, 42개 play, 0 violations. 검증 중 발견한 실결함 6건 수정 — MessageComposer 다크
  텍스트 대비(component 토큰이 `:root`에서 고정 상속되어 dark scope 미반영 → semantic 토큰 직접 참조), ConversationMessage
  실패 status 대비(텍스트 label-normal + dot이 색 신호), N6 리스트 버튼 undersized, N6 map fragment undersized(전체폭 배치),
  WaypointMarker hit area 24→26px, Waypoint 다크 secondary 서브텍스트 대비.
- **문서/분류/인벤토리**: PUBLIC_EXPORT/LAYER 분류에 Communication 그룹+VirtualKeypad+storyTitles, COMPONENT_API_STATE_MATRIX
  ·ACCESSIBILITY_CONTRACTS에 C/K 행. 실제 index 수치(516 stories / 397 public / 202 컴포넌트 / 208 export)로
  REPOSITORY_INVENTORY·VISUAL_PARITY·readme·Audit.data·CardsExtended 갱신. **`check:inventory` 통과**.
- **IA 감사 통과**: `report:storybook-ia --update` 후 신규 9개 페이지 reviewed 승격. 설명-품질 보정(decisionGuidance "적합"
  키워드 7건, Message 두 스토리 인라인 export로 name/description 정상 해석, "IME"→"조합 입력", "상태 ·"→"변형·상태 ·").
  동시 작업의 사소한 에셋 경로(`/`→`./`) 변경으로 stale해진 Avatar/AnnotatedImage 2개 페이지는 diff 검토 후 re-stamp.
  **`check:storybook-ia` 통과**.

- **실화면 시각 검수**: in-app 브라우저 스크린샷으로 N6·C4·VirtualKeypad·MessageComposer(다크)·Route/Trajectory 개요·320px를
  눈으로 확인. N6 세만틱 미러에서 **지도 라벨 10쌍 겹침**을 발견(axe/기하 검사는 못 잡는 결함) → keep-out 영역을 픽업
  웨이포인트에서 분리하고, 면적·점 feature(영역·웨이포인트) 라벨만 끄고 얇은 선 feature(경로·레인·궤적·설비)는 라벨을
  유지(hit target 높이 확보)해 겹침 10→3(같은 corridor를 지나는 선 라벨 근접)로 정리, target-size 결함 0 유지. 나머지
  스토리는 시각적으로 양호(다크 대비 수정 확인, 320px 코드 자체 스크롤·wrap 확인).

**남은 것**: 저장소 전체 `npm run check`(사용자 요청 시), 자동 visual-regression 베이스라인 갱신(`update:visual-baseline`,
신규 스토리 스크린샷 등록), 커밋/`origin` push(사용자 판단). 작업트리는 여전히 미커밋.

## 이 문서의 목적

사용자가 요청한 세 가지 공백을 디자인 시스템의 재사용 가능한 계약으로 확장하는 작업을 이어가기 위한
핸드오프다.

1. 채팅·메시지: 메시지, 피드, 작성기
2. 로보틱스 내비게이션: waypoint, lane, route/trajectory, 공간 구역, lift/door/dock 전환
3. 가상 입력: native keyboard 우선 감사 후 숫자 `VirtualKeypad`

실행 계획과 외부 근거는 먼저
[`DOMAIN_COMPONENT_EXPANSION_PLAN.md`](../DOMAIN_COMPONENT_EXPANSION_PLAN.md)에 문서화했다. 이 문서는 그 계획을
기준으로 실제 구현된 범위, 아직 파일이 없는 설계, 검증 상태와 정확한 재개 순서를 기록한다.

사용자는 구현 중 저장소 전체 검증을 반복하지 말고, **관련 표적 검증만 수행한 뒤 모든 트랙이 끝나는 G5에서
전체 검증을 한 번 수행**하라고 명시했다. 이 원칙을 유지한다.

## 한눈에 보는 현재 상태

| 영역 | 상태 | 핵심 결과 / 다음 작업 |
| --- | --- | --- |
| G0 기존 패밀리 기준선 | 완료 | 470개 기존 Storybook story 기준의 build·IA·a11y·visual·package 체크포인트 확보 |
| N0 의미·renderer 결정 | 완료 | Open-RMF/Nav2 의미 모델 + renderer-neutral data + SVG reference fragment로 고정 |
| N1–N5 Navigation | 구현 완료, 통합 전 | 6개 public component와 5개 story page 생성; 표적 parse/type/SSR 검증 통과 |
| N6 semantic mirror | 미구현 | 기존 Route/Trajectory story에 Map + named list + LayerPanel + SelectionInspector + Legend 조합 추가 |
| C0 메시지 모델 audit | 완료 | Message/Feed/Composer를 독립 컴포넌트로, `ChatWindow`는 export하지 않기로 고정 |
| C1 ConversationMessage | 구현 완료, export 전 | 신규 4파일 생성; 표적 parse/type/SSR 통과; Storybook 실화면 미검수 |
| C2 MessageFeed | 설계 완료, 파일 없음 | 아래 계약대로 4파일 신규 작성 필요 |
| C3 MessageComposer | 설계 완료, 파일 없음 | 아래 계약대로 4파일 신규 작성 필요 |
| C4 composition | 미구현 | Message + Feed + Composer + SourceDisclosure 조합 story만 추가; wrapper export 금지 |
| K0 native field audit | 완료 | 기존 주요 field가 native 입력 속성을 전달함; 공용 field API 대량 변경 불필요 |
| K1 VirtualKeypad | 설계 완료, 파일 없음 | 숫자/소수/부호용 Product Extension 구현 필요 |
| G5 공개·전체 검증 | 미실행 | entry/type/docs/classification/inventory/IA 동기화 후 full suite 단 한 번 |

## 작업트리와 서버 상태

핸드오프 작성 직전 기준:

- tracked dirty: **60파일**
- untracked: **1,801파일**
- 그중 untracked `dist/`: **1,772파일**
- 이 핸드오프 문서가 추가되므로 최종 untracked 수는 1개 늘어난다.
- 커밋·push 없음.
- `127.0.0.1:6006`에는 현재 listener가 없다. in-app Browser에 남은 URL은 살아 있는 서버의 증거가 아니다.

대규모 dirty worktree에는 다른 패밀리 안정화 작업과 생성물이 함께 있다. **reset, checkout, clean, dist 일괄 삭제,
대량 포맷을 하지 않는다.** 현재 변경은 다른 에이전트의 작업으로 간주하고 파일별로 병합한다.

## G0 — 기존 기준선

새 도메인 파일을 만들기 전 기존 안정화 기준선을 한 번 닫았다.

- Storybook IA: **168 pages / 470 stories**, 전부 reviewed/current
- consumer smoke 통과
- WDS rendered style / nested parity 통과
- Storybook public surface 통과
- 접근성: **470/470**, play 155개, axe/name/button/console 위반 0
- visual smoke: 37 screenshots, 전부 threshold 이내
- package artifact: ESM/CJS/subpath/SSR 통과

격리한 두 항목:

- `check:generated`는 `git diff --exit-code -- src dist` 성격이어서 의도적으로 dirty인 현재 worktree에서는 구조적으로
  실패한다. 구현 결함으로 해석하지 않는다.
- Windows에서 기본 package smoke가 `spawnSync npm ENOENT`를 냈지만 아래 npm CLI 경로를 사용하면 동일 검사가
  통과했다.

```powershell
$env:npm_execpath='C:\nvm4w\nodejs\node_modules\npm\bin\npm-cli.js'
node scripts/check-package-artifact.mjs
```

이후 새 파일에 대해 repository-wide build, full a11y, full visual smoke, `npm run check`는 실행하지 않았다.

## Track N — 로보틱스 내비게이션

### N0에서 고정한 의미와 renderer 경계

Open-RMF는 UI를 복사하는 자료가 아니라 domain semantics의 권위 근거로 사용했다.

- waypoint는 점과 복수 role/annotation이다. 면적 zone이나 lift cabin으로 합치지 않는다.
- lane은 정적 graph topology다. runtime availability/conflict, entry/exit facility event를 별도 축으로 둔다.
- route는 선택된 graph segment 순서이고 trajectory/path는 한 map의 조밀한 시간/기하 sample이다.
- region은 behavior/facility/terrain 면적이고 marker나 lane이 아니다.
- lift/door/dock는 facility transition이다. waypoint variant나 lane availability로 축약하지 않는다.
- door state, lift phase, motion, operating mode, session, availability는 서로 독립적인 source-provided state다.
- public domain data는 React/SVG/Canvas 명령이 없는 serializable model이다.
- 기본 renderer는 완성 viewport가 아니라 `<g>`, `<path>`, `<circle>` SVG fragment다. `Map2DCanvas` 또는 제품 renderer가
  viewport·projection·source lifecycle을 소유한다.
- paint order: **region → lane → route/trajectory → waypoint/facility → selection/focus**.
- map 자체를 유일한 키보드 탐색 경로로 만들지 않는다. N6의 named list/inspector가 동일 identity와 state를 제공한다.

사용한 upstream pin:

- `rmf_traffic` `39f09e7971c8e666e12c8e9b12199014f631c0bb`
- `rmf_traffic_editor` `922a66315fb374a8c4640a4f25ad447c4c58b218`
- `rmf_internal_msgs` `26a7f25740ad28c7a838ef7407dba38304a564f5`
- `rmf_visualization` `6c06184c3ec33441b2f94d356c2d43df4233b74a`
- `rmf_ros2` `75594b75d99b7b0686d2ef2f302f425c261153a9`
- `navigation2` `4a40bb9357f3bd11414be6573522ef1613f1cdd3`

구체적인 source URL과 적용 결론은 계획 문서와 각 `.prompt.md`에 있다.

### N1–N5 생성 파일

컴포넌트:

- `components/robotics/WaypointMarker.{jsx,d.ts,prompt.md}`
- `components/robotics/LaneOverlay.{jsx,d.ts,prompt.md}`
- `components/robotics/RouteOverlay.{jsx,d.ts,prompt.md}`
- `components/robotics/TrajectoryOverlay.{jsx,d.ts,prompt.md}`
- `components/robotics/SpatialRegion.{jsx,d.ts,prompt.md}`
- `components/robotics/FacilityTransition.{jsx,d.ts,prompt.md}`

스토리:

- `stories/RoboticsNavigationWaypoint.stories.jsx` — 5 stories
- `stories/RoboticsNavigationLane.stories.jsx` — 4 stories
- `stories/RoboticsNavigationRouteTrajectory.stories.jsx` — 5 stories
- `stories/RoboticsNavigationRegions.stories.jsx` — 4 stories
- `stories/RoboticsNavigationFacilities.stories.jsx` — 4 stories

핵심 공개 계약:

- `WaypointMarker`
  - 공통 type owner: `NavigationPoint`, `NavigationAvailability`, `NavigationActivateEvent`,
    `NavigationSvgFeatureProps`
  - role은 `holding|passthrough|parking|charger`의 복수 배열, 제품 annotation은 별도 object 배열
  - inverse viewport scale, 24 CSS px hit target, pointer/Enter/Space activation
- `LaneOverlay`
  - directed points + entry/exit waypoint/orientation/transition reference + single/paired relation
  - `speedLimitMps`, `mutexGroupId`는 정적 data; `availability`, `conflict`는 runtime prop
- `RouteOverlay`
  - route status와 segment phase/condition을 독립 축으로 유지
  - map별 segment filter, 명시적 progress; 다른 층 사이의 가짜 연결선을 만들지 않음
- `TrajectoryOverlay`
  - single-map samples + optional time/heading/currentSampleIndex
  - planned route와 다른 dense layer
- `SpatialRegion`
  - polygon/circle shape
  - behavior: keep-out/speed-limit/preferred/operation/custom
  - facility: lift cabin/lobby, door/dock/charger area
  - terrain: slope/rough/clearance + traversability/grade
- `FacilityTransition`
  - from/to endpoint + facility identity
  - door/lift/dock union; availability와 door/lift/dock source state 분리

모두 LK Robotics Extension이며 WDS parity로 주장하지 않는다.

표적 검증 기록:

- component/story esbuild parse 통과
- focused `.d.ts` TypeScript 검사 통과
- SSR contract 검사 통과
- Lane/Route/Trajectory는 direct geometry/state/map-filter checks 통과
- Regions/Facilities는 headless layout/map filtering/activation checks 통과
- full Storybook/a11y/visual/IA는 아직 하지 않음

### 이미 갱신한 Navigation 공유 문서

- [`ROBOTICS_PATTERNS.md`](../ROBOTICS_PATTERNS.md)
- [`COMPONENT_API_STATE_MATRIX.md`](../COMPONENT_API_STATE_MATRIX.md)
- [`ACCESSIBILITY_CONTRACTS.md`](../ACCESSIBILITY_CONTRACTS.md)
- `docs/references/wds/LAYER_CLASSIFICATION.json`
- `docs/references/wds/PUBLIC_EXPORT_CLASSIFICATION.json`

분류 JSON에는 Navigation 6개 public export가 들어갔지만 `classifiedAt` 등 날짜 메타는 최종 통합 시 다시 확인한다.

### N6 — 다음 작업자가 먼저 구현할 것

새 public page를 만들지 말고
`stories/RoboticsNavigationRouteTrajectory.stories.jsx`에
`사용법 · 레이어·목록·선택 요약` story를 추가하는 편이 현재 IA와 맞는다.

조합:

1. `Map2DCanvas`
2. region → lane → route/trajectory → waypoint/facility 순으로 렌더
3. map feature에는 pointer activation을 유지하되 `tabIndex={-1}`를 전달
4. 별도 이름 있는 feature list를 실제 `Button`/native list semantics로 제공
5. `LayerPanel`을 controlled `visibleLayerIds`로 연결
6. 선택 identity를 `SelectionInspector`에 동일하게 반영
7. `Legend`는 상태를 색만으로 구분하지 않도록 line/pattern label과 함께 제공

play에서 최소 확인할 것:

- 목록에서 lane/waypoint/facility를 선택하면 map의 `data-selected`와 inspector heading이 함께 바뀜
- LayerPanel visibility action으로 해당 SVG fragment만 사라짐
- map의 interactive fragments는 모두 `tabindex="-1"`; keyboard selection은 named list가 담당
- hidden layer의 selection을 유지한다면 inspector/list에 “숨김” 상태를 명시
- desktop와 320px에서 가로 overflow 없음

N6는 이 핸드오프 요청 때문에 코딩을 시작하기 직전에 중단됐다.

## Track C — 채팅·메시지

### C0에서 고정한 family 경계

- `ConversationMessage`, `MessageFeed`, `MessageComposer`는 독립 public component다.
- `ChatWindow`/`ScopedConversation` 같은 application workflow wrapper는 export하지 않는다.
- `Bubble`은 annotation/coach-mark로 유지하며 chat bubble variant로 재사용하지 않는다.
- message의 `direction`과 `authorRole`은 독립이다.
- feed만 `role="log"` live-region semantics를 소유한다. 개별 message는 live region이 아니다.
- transport/provider/persistence/retrieval/citation truth/moderation은 제품 소유다.
- C4는 Storybook의 작은 composition example일 뿐 새 wrapper component가 아니다.

### C1 — ConversationMessage 구현 완료

신규 파일:

- `components/communication/ConversationMessage.jsx`
- `components/communication/ConversationMessage.d.ts`
- `components/communication/ConversationMessage.prompt.md`
- `stories/CommunicationMessage.stories.jsx` — 5 stories

계약:

- root는 한 메시지의 `<article>`
- `direction`: `inbound|outbound|system`
- `authorRole`: `user|assistant|human-agent|system`
- `groupPosition`: `single|first|middle|last`
- middle/last는 avatar를 반복하지 않지만 visually hidden author identity를 유지
- lifecycle:
  - `{kind:'static'}`
  - delivery `queued|sending|sent|failed|cancelled`
  - response `pending|streaming|stopping|complete|cancelled|failed`
- response pending/streaming/stopping만 `aria-busy`
- retry는 failed + `onRetry`일 때만, stop은 pending/streaming + `onStop`일 때만
- `stopping`에는 중복 stop action이 없고 callback 이후 상태를 내부 추론하지 않음
- DOM reading order: identity → body → attachments → sources → status → actions
- SourceDisclosure를 기존 item contract로 조합; avatar/attachment/action은 slot
- system message는 avatar/bubble 없이 중립 divider 문법

스토리에는 overview, grouping/attachment/source, dark/state, lifecycle action, 320px long Korean/English/code/link가 있다.

통과:

- component + story esbuild JSX parse
- focused `.d.ts` TypeScript 검사
- bundled SSR contract: DOM order, busy/no-live, stop/retry gating, grouped identity, system avatar omission

미완:

- `src/index.js` / `src/index.d.ts` export 없음
- story가 현재 `../src/index.js`에서 `ConversationMessage`를 import하므로 **entry 생성 전 Storybook bundle이 실패할 수 있음**
- browser normal/dark/320 visual check 없음
- shared API/accessibility/classification/inventory/IA 문서 반영 없음

### C2 — MessageFeed 설계 완료, 파일 없음

다음 4파일은 아직 존재하지 않는다.

- `components/communication/MessageFeed.jsx`
- `components/communication/MessageFeed.d.ts`
- `components/communication/MessageFeed.prompt.md`
- `stories/CommunicationMessageFeed.stories.jsx`

고정 계약:

- `children` slot만 받으며 자체 `messages[]` schema를 만들지 않는다.
- named, focusable scroll viewport에 `role="log"`, `aria-live="polite"`, `aria-relevant="additions"`,
  `aria-atomic="false"`.
- `role="feed"`나 roving focus를 사용하지 않는다.
- API:
  - `ariaLabel`, `children`, `empty`, `maxHeight`, `busy`
  - `hasPrevious`, `loadingPrevious`, `onLoadPrevious`, `loadPreviousLabel`
  - controlled `following`, `onFollowingChange(next, reason)`; reason은 `user-scroll|jump-to-latest`
  - `unreadCount`, jump label/callback, `liveStatus`
- history button은 log 앞, jump-to-latest button은 viewport 뒤에 배치; overlay하지 않는다.
- 과거 prepend 전 `scrollHeight/scrollTop`을 보관하고 다음 children/loading 갱신 후 높이 delta만큼 복원한다.
- prepend anchor restoration은 bottom-follow/ResizeObserver보다 우선한다.
- `following=false`이면 children 변화나 ResizeObserver로 자동 bottom scroll하지 않는다.
- jump 후 bottom scroll + button focus `preventScroll:true`; callback과 controlled follow reason을 모두 전달한다.
- `liveStatus`는 별도 visually-hidden `role="status"`; streaming token text를 그대로 announce하지 않는다.
- SSR-safe effect fallback, ResizeObserver는 optional enhancement.

외부 근거:

- WAI-ARIA `log`
- WCAG ARIA23 log semantics
- APG feed pattern은 여기서 `role=feed`를 사용하지 말아야 하는 비교 근거
- Carbon AI Chat server lifecycle

스토리 계획: 개요, history anchoring, follow/unread, empty/busy, 320px. play는 exact ARIA, prepend delta,
false-follow 보존, jump focus/callback, no-role-feed, horizontal overflow를 확인한다.

### C3 — MessageComposer 설계 완료, 파일 없음

다음 4파일은 아직 존재하지 않는다.

- `components/communication/MessageComposer.jsx`
- `components/communication/MessageComposer.d.ts`
- `components/communication/MessageComposer.prompt.md`
- `stories/CommunicationMessageComposer.stories.jsx`

고정 API/행동:

- controlled `value`, `onValueChange(value,event)`, `onSubmit(value,reason)`
- `state`: `idle|submitting|streaming|stopping`
- `submitMode`: `enter|modifier-enter|button-only`
- submit reason: `enter|modifier-enter|button`
- `canSubmit`, `readOnly`, `statusLabel`, form/input label, placeholder/description, maxLength, min/maxRows
- attachment slot/action, secondaryActions, submit/stop label, `onStop`, `textareaProps`
- `disabled: true`이면 `disabledReason` 필수. 이유 text는 control보다 먼저 DOM에 두고 `aria-describedby`로 연결
- Core `Textarea`를 바꾸지 않고 내부 44–48px autosize textarea를 사용
- utility control 32px, send/stop 40px
- composition session + `event.isComposing`으로 IME Enter 오발송 방지
- `Shift+Enter`는 줄바꿈; modifier mode는 Ctrl/Meta+Enter; button-only는 keyboard submit 없음
- Escape로 stop하지 않음
- submit/stop callback 후 transport 완료나 value clear를 내부 추론하지 않음
- 제출 후 value 유지, textarea focus 유지/복귀
- `ActionArea`를 사용하지 않음

스토리 경로는 `LDS Product/Communication/Message Composer`; normal/dark/states/IME behavior/320px가 필요하다.

### C4 — composition

C2/C3 완료 후 Message + Feed + Composer + SourceDisclosure를 하나의 작은 story에서 조합한다. provider request,
실제 streaming timer, persistence, retrieval을 성공한 backend처럼 표현하지 않는다. `ChatWindow` public export나 새
application page는 만들지 않는다.

## Track K — native input와 VirtualKeypad

### K0 감사 결과

`Input`, `Textarea`, `InputGroup`, `PasswordInput`, `NumberField`는 native input element로 `inputMode`,
`enterKeyHint`, composition 관련 DOM props를 전달할 수 있다. 현재 근거로 `PinInput`, `TagInput` 등 여러 shared API를
한꺼번에 확장하지 않는다. 숫자 keypad는 LK Product Extension으로 분류한다.

### K1 고정 후보 계약

제안 경로: `LDS Product/Selection and Input/Virtual Keypad`

- `value: string`
- `onChange(value, {action, key})`
- `onConfirm(value)`
- `mode: integer|decimal`
- `allowNegative`, `locale`, `min`, `max`, `maxLength`
- `disabled`, `confirmDisabled`, `targetId`
- clear/backspace/sign/confirm label

행동:

- string value로 `-`, `0.`, leading zeros를 보존한다.
- 내부 decimal separator는 `.`로 유지하고 display만 locale에 맞춘다.
- min/max는 confirm validity에만 적용하고 사용자의 중간 입력을 강제로 clamp하지 않는다.
- 기존 `Button size="lg"` 48px를 3열로 조합한다.
- document/global keydown, long press, W3C VirtualKeyboard API 필수 의존성을 만들지 않는다.
- pointer down 당시 `targetId` input이 이미 focused였을 때만 preventDefault로 그 focus를 보존한다.
- 별도 targetRef/shared hook은 K1 범위에 넣지 않는다.
- 범용 한글/영문 가상 키보드는 구현하지 않는다. OS IME가 없는 kiosk/embedded 증거가 생길 때 K3로 재심사한다.

필요 파일은 다음 작업자가 내부 형제와 외부 자료를 다시 읽은 뒤 신규 작성한다.

- `components/forms/VirtualKeypad.jsx`
- `components/forms/VirtualKeypad.d.ts`
- `components/forms/VirtualKeypad.prompt.md`
- `stories/SelectionVirtualKeypad.stories.jsx`

실제 repository의 forms naming/location을 재확인하고, 더 가까운 기존 폴더 규칙이 있으면 그 규칙을 따른다.

## 현재 public export와 생성물의 중요한 불일치

현재 `src/index.js`와 `src/index.d.ts`에는 아래 신규 export가 하나도 없다.

- `WaypointMarker`
- `LaneOverlay`
- `RouteOverlay`
- `TrajectoryOverlay`
- `SpatialRegion`
- `FacilityTransition`
- `ConversationMessage`

Navigation stories는 현재 source component를 직접 import해서 표적 검증할 수 있지만 ConversationMessage story는
generated entry를 import한다. 다음 작업자는 모든 신규 파일이 안정된 시점에 아래를 한 번 실행하는 편이 낫다.

```powershell
npm run generate:entry
```

그 뒤 Navigation/Communication public stories의 import를 repository의 기존 public-surface 원칙에 맞게
`../src/index.js`로 통일하고 consumer type test를 `scripts/type-tests/consumer-contract.tsx`에 추가한다. 생성물은
수동 편집하지 않는다. 최종 package build에서 `dist`와 copied types를 다시 만든다.

## 아직 하지 않은 shared integration

Navigation 일부 문서는 이미 갱신됐지만 전체 family 통합은 남았다.

- C/K rows를 `COMPONENT_API_STATE_MATRIX.md`에 추가
- feed/composer/keypad 접근성 계약을 `ACCESSIBILITY_CONTRACTS.md`에 추가
- `PRODUCT_FRONTEND_COVERAGE.md`, `ROBOTICS_PATTERNS.md`의 해당 coverage 확인
- C/K를 `LAYER_CLASSIFICATION.json`, `PUBLIC_EXPORT_CLASSIFICATION.json`에 Product Extension으로 추가
- `REPOSITORY_INVENTORY.md`, `VISUAL_PARITY_LEDGER.md`는 실제 생성된 Storybook index 수로 갱신
- `STORYBOOK_INFORMATION_ARCHITECTURE_AUDIT.json`은 static build 후 재생성하고 실제 검토 후 reviewed SHA 승격
- story page마다 friendly guide, 첫 story `개요`, 이후 역할 접두어와 purpose description 확인

기준선 470 stories 이후 현재 신규 public story export는 Navigation 22 + ConversationMessage 5로 **소스상 27개**다.
정확한 page/story count는 static Storybook index를 재생성하기 전까지 추측으로 문서에 확정하지 않는다.

## 다음 에이전트의 정확한 재개 순서

1. 이 문서, `DOMAIN_COMPONENT_EXPANSION_PLAN.md`, 현재 `git status`를 읽는다.
2. 신규 Navigation 18파일과 ConversationMessage 4파일을 다시 읽고 다른 동시 변경 여부를 확인한다.
3. N6 semantic mirror story를 기존 Route/Trajectory page에 추가하고 표적 parse/play만 확인한다.
4. C2 MessageFeed를 구현하고 its own parse/type/SSR/scroll behavior test만 실행한다.
5. C3 MessageComposer를 구현하고 IME/submit/focus/disabled-reason 표적 test만 실행한다.
6. C4 composition story를 기존 Communication family page에 추가한다. 새 `ChatWindow` page/export는 금지한다.
7. K1 VirtualKeypad를 구현하고 string value/locale/confirm/focus/320px 표적 test만 실행한다.
8. 신규 entry를 한 번 생성하고 모든 public story import와 consumer type contract를 연결한다.
9. Storybook dev를 `127.0.0.1:6006`에 시작하고 normal/dark/compound/320 representative story를 실화면 검수한다.
10. shared docs/classification/inventory 후보를 최신 파일에 병합한다.
11. dev server를 중지한 뒤 G5 final checkpoint에서 static build, IA regeneration/review, full check를 한 번 수행한다.

## 실화면 검수 목록

Storybook dev 실행:

```powershell
npm exec -- storybook dev -p 6006 --host 127.0.0.1 --no-open
```

dev server와 `storybook build`를 동시에 실행하지 않는다.

Navigation:

- Waypoint: overview, light/dark, compound roles/states, 320px
- Lane: overview, closed/conflict/constraint, activation, 320px
- Route/Trajectory: overview, status/condition, multi-floor, semantic mirror, 320px
- Regions: overview, dark patterns, filtering/activation, 320px
- Facilities: overview, independent source states, map filter/activation, 320px

Communication:

- Message: inbound/outbound/system, grouped identity, attachment/source, lifecycle controls, dark, long 320px
- Feed: prepend anchor, user-reading no auto-scroll, jump focus, busy/empty, 320px
- Composer: IME Enter, each submit mode, streaming stop, disabled reason, dark, 320px/short-height viewport

VirtualKeypad:

- integer/decimal/signed and partial string values
- min/max confirm invalidity, disabled/confirmDisabled
- locale display vs canonical value
- target input focus preservation
- 320px and landscape kiosk height

각 composed UI는 normal target width와 320px에서 reading order, wrapping, overflow, focus order, nested-card effect를
시각적으로 확인해야 한다. type/axe 통과만으로 visual hierarchy 완료를 주장하지 않는다.

## G5 — 마지막에만 수행할 전체 검증

모든 구현·표적 검수·공개 entry·docs가 끝났을 때만:

1. Storybook dev server 중지
2. `npm run build:storybook`
3. `npm run report:storybook-ia`
4. 신규/변경 page를 실제 검토한 뒤 `reviewedSourceSha256 = sourceSha256` 승격
5. `npm run check:storybook-ia`
6. `npm run check`

full suite 실패 시 해당 failing script만 반복하고, 표적 통과 후 full suite를 마지막에 한 번 다시 실행한다.
Windows `npm ENOENT`가 재현되면 위 npm CLI 경로 workaround를 사용한다.

## 유지해야 할 결정

- Open-RMF 이름을 public prop으로 그대로 복사하지 않는다. domain meaning만 번역한다.
- route와 trajectory, waypoint와 region, lane runtime과 facility state를 합치지 않는다.
- source가 제공하지 않은 상태를 geometry/color에서 추론하지 않는다.
- map SVG/canvas를 유일한 접근성 경로로 만들지 않는다.
- chat message 자체에 live region을 주지 않는다. feed만 log announcement를 소유한다.
- transport/provider처럼 보이는 성공 workflow를 Storybook에서 연출하지 않는다.
- `ChatWindow`, 범용 `VirtualKeyboard`, `OperatorKeypad`를 근거 없이 추가하지 않는다.
- shared token value, repository-wide gate, public API 대량 rename은 사용자 승인 없이 확장하지 않는다.
- 구현 중 전체 검증 반복 금지; G5에서 한 번.

## 가장 먼저 읽을 파일

1. [`DOMAIN_COMPONENT_EXPANSION_PLAN.md`](../DOMAIN_COMPONENT_EXPANSION_PLAN.md)
2. `components/robotics/WaypointMarker.prompt.md`
3. `components/robotics/LaneOverlay.prompt.md`
4. `components/robotics/RouteOverlay.prompt.md`
5. `components/robotics/SpatialRegion.prompt.md`
6. `components/robotics/FacilityTransition.prompt.md`
7. `stories/RoboticsNavigationRouteTrajectory.stories.jsx`
8. `components/communication/ConversationMessage.prompt.md`
9. `stories/CommunicationMessage.stories.jsx`
10. [`ACCESSIBILITY_CONTRACTS.md`](../ACCESSIBILITY_CONTRACTS.md)
11. [`COMPONENT_API_STATE_MATRIX.md`](../COMPONENT_API_STATE_MATRIX.md)

이 goal은 완료가 아니다. N6, C2–C4, K1, public entry/docs/IA, 실화면 검수와 G5가 모두 남아 있다.
