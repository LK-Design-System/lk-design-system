# 도메인 확장 비주얼 감사 — Navigation · Communication · Virtual Keypad

감사일: 2026-07-12 · 후속 감사: 2026-07-13
상태: **감사·개선·재검증 완료**  
분류: LK Product Extension / LK Robotics Extension

## 결론

신규 도메인 9페이지 46스토리는 기능·접근성 계약에 비해 비주얼 검증이 부족했다. 최초 감사에서
**high 3건 · medium 5건**을 확정했고, 사용자 승인 뒤 8건을 모두 구현·재검증했다. 공통 원인은
다음 세 가지였다.

1. 지도 fragment가 전체 semantic label을 직접 그려 라벨 충돌과 정보 과밀을 만든다.
2. composed story가 기존 LDS 형제보다 강한 버튼·카드 언어를 도입해 지도·목록·인스펙터의
   우선순위를 뒤집는다.
3. play 검증용 출력과 기술 문자열이 공개 스토리에 그대로 보여 완성된 제품 패턴보다 테스트
   fixture처럼 읽힌다.

공개 prop은 추가하지 않았다. 공유 disabled token과 Button/Input의 dark-scope 해석은 감사에서 영향
범위를 밝힌 뒤 사용자가 수정 범위를 승인해 함께 처리했으며, token source·생성 CSS·hygiene baseline을
동시에 갱신했다.

## 감사 범위와 방법

- 대상: Navigation 5페이지 23스토리, Communication 3페이지 17스토리, Virtual Keypad 1페이지
  6스토리 — 합계 9페이지 46스토리.
- 일반 폭: 1280×900 또는 1440×1000.
- 좁은 폭: 360×900에서 실제 320px story fixture를 확인.
- 짧은 가로 화면: `Virtual Keypad / Landscape Kiosk`의 568×320 내부 fixture.
- 다크: Message, MessageComposer, VirtualKeypad disabled, SpatialRegion, FacilityTransition.
- 내부 비교: Input state matrix, NumberField, PinInput, LayerPanel, SelectionInspector, Map2DCanvas,
  Legend, ScrollArea, LogViewer, ResourceState.
- 판정 기준: 실제 렌더의 읽기 순서, grouping, 상대 크기, 밀도, 정렬, wrapping, label collision,
  card-within-card, 정상/복합/disabled 상태 구분, normal/narrow 대응.

대표적으로 직접 확인한 story ID:

- `lds-robotics-navigation-route-and-trajectory--semantic-mirror`
- `lds-robotics-navigation-route-and-trajectory--route-and-trajectory-states`
- `lds-robotics-navigation-regions--dark-patterns-and-states`
- `lds-robotics-navigation-facility-transition--facility-transition-overview`
- `lds-robotics-navigation-facility-transition--availability-and-source-states`
- `lds-robotics-navigation-waypoint--compound-roles-and-states`
- `lds-robotics-navigation-lane--lane-states-and-constraints`
- `lds-robotics-navigation-lane--lane-narrow-320`
- `lds-product-communication-message--conversation-composition`
- `lds-product-communication-message--lifecycle-states`
- `lds-product-communication-message--dark-theme`
- `lds-product-communication-message-composer--request-states`
- `lds-product-communication-message-composer--narrow-width`
- `lds-product-communication-message-feed--empty-and-busy`
- `lds-product-communication-message-feed--narrow-320`
- `lds-product-selection-and-input-virtual-keypad--virtual-keypad-overview`
- `lds-product-selection-and-input-virtual-keypad--range-and-disabled-states`
- `lds-product-selection-and-input-virtual-keypad--landscape-kiosk`

## 권위 참고자료와 적용 결론

- [Carbon AI Chat demo and examples](https://chat.carbondesignsystem.com/tag/latest/docs/documents/Demo_and_Examples.html):
  message list, message input, loading/streaming action을 하나의 chat hierarchy로 비교하는 기준으로 사용했다.
- [Carbon AI Chat server communication](https://chat.carbondesignsystem.com/tag/latest/docs/documents/Server_communication.html):
  delayed response에는 loading indicator를 노출하고, streaming stop은 final response까지 별도 상태로 유지한다.
  LDS도 lifecycle 축 분리는 유지하되 sighted busy cue가 사라지지 않아야 한다.
- [Esri Calcite — Create a mapping app](https://developers.arcgis.com/calcite-design-system/tutorials/create-a-mapping-app/):
  map을 중심 surface로 두고 Layer List·Legend 같은 도구는 이름 있는 panel/action으로 분리한다.
- [Esri Calcite Panel](https://developers.arcgis.com/calcite-design-system/components/panel/) 및
  [Block](https://developers.arcgis.com/calcite-design-system/components/block/): 관련 control과 content는 heading이
  있는 panel/block으로 묶고, 일관된 spacing과 action placement를 유지한다.
- [Mapbox — Optimize map label placement](https://docs.mapbox.com/help/ja/dive-deeper/optimize-map-label-placement/):
  label overlap은 기본적으로 막고, variable placement와 우선순위로 legibility와 density를 조절한다.
  LDS fragment가 map engine은 아니어도 긴 label을 항상 중심에 그리는 현재 기본값은 이 원칙과 충돌한다.
- [Apple HIG — Virtual keyboards](https://developer.apple.com/design/human-interface-guidelines/virtual-keyboards):
  입력 내용에 맞는 keyboard 유형을 우선하고, custom keyboard는 화면과 통합된 입력 경험으로 제공한다.
  숫자 배열 자체보다 값 readout·단위·완료 action의 위계가 함께 읽혀야 한다.
- Open-RMF/Nav2 자료는 geometry와 상태 축의 의미론 근거로는 유효하지만, panel layout·label density·시각
  위계의 근거로 사용하지 않았다.

## 확정 finding

| ID | 심각도 | 범위 | 요약 | 상태 |
| --- | --- | --- | --- | --- |
| DV-01 | high | SpatialRegion / Robotics stories | 긴 map label이 geometry와 상태 marker를 가로지름 | 해결 |
| DV-02 | high | VirtualKeypad + shared disabled styling | 다크 disabled 값과 키가 배경에 거의 합쳐짐 | 해결 |
| DV-03 | high | N6 Semantic Mirror | 객체 목록의 강한 button chrome이 map과 inspector보다 우세함 | 해결 |
| DV-04 | medium | FacilityTransition overview | 접근과 도착이 거의 같은 그림이라 phase 차이가 시각적으로 약함 | 해결 |
| DV-05 | medium | MessageFeed busy | empty와 busy가 문장 외에는 사실상 같은 화면임 | 해결 |
| DV-06 | medium | MessageComposer stories | inline SVG·수제 attachment chip이 LDS icon/chip 언어와 충돌함 | 해결 |
| DV-07 | medium | VirtualKeypad landscape | 값 readout은 약하고 이중 card와 무설명 key lock이 강조됨 | 해결 |
| DV-08 | medium | Public domain stories | play/debug 출력과 기술 placeholder가 공개 화면을 fixture처럼 보이게 함 | 해결 |

## 구현 및 재검증 결과

- DV-01: `SpatialRegion`의 visible label을 짧은 identity로 제한하고 전체 의미는 접근성 이름에 유지했다.
  N6처럼 semantic mirror가 있는 dense map에서는 route·trajectory·facility label을 끄고 목록/inspector가
  이름과 상태를 담당하게 했다.
- DV-02: `label-disable`을 light/dark 모두 0.52 alpha로 재조정하고 Button/Input이 semantic role을 rendered
  theme scope에서 해석하게 했다. 값·키·label은 식별 가능하지만 활성 control보다 낮은 위계를 유지한다.
- DV-03: N6 객체 목록을 full-width primary/secondary Button stack에서 LayerPanel과 같은 neutral selectable
  row, 작은 layer dot, 한 개의 subtle selected fill로 변경했다.
- DV-04: 같은 설비 identity의 1층은 `접근·문 닫힘·세션 요청`, 2층은 `도착·문 열림·세션 소유`로 실제
  source state를 분리하고, 지도 label은 `출발/도착 → identity → phase·availability → 장치 상태`로 재배열했다.
- DV-05: busy empty slot에 공용 Spinner와 visible 처리 문구를 조합했다. `liveStatus`는 중복 읽기를 막기 위해
  log 밖의 visually-hidden status로 유지했다.
- DV-06: custom SVG와 수제 attachment surface를 공용 `Icon`·`IconButton`·`Chip` 조합으로 교체하고 narrow
  제품 shell의 중복 border/radius를 제거했다.
- DV-07: landscape keypad를 한 surface에 통합하고 단위를 label에 올렸으며, 최대 5자리 도달 시 지우기
  안내를 visible helper로 제공했다.
- DV-08: callback/count/activation 출력은 hidden test hook으로 옮기고 lifecycle 본문과 state caption을
  실제 한국어 제품 문구로 교체했다.
- 접근성 전체 검사에서 추가로 발견한 경로도 해결했다. `FacilityTransition`은 active map에 endpoint가 없으면
  label 계산 전 안전하게 반환하며, `RouteOverlay` interactive segment는 보이지 않는 최소 24px bounds를
  포함해 평평한 SVG 경로도 role target box가 24px 아래로 줄지 않는다.

최종 시각 확인:

- N6 Semantic Mirror: 1280×900, 390×844 — map/list/layer/inspector 순서, 라벨 충돌, 선택 행, overflow.
- FacilityTransition overview: 1280×900 — 접근/도착 compound state와 동일 identity 구분.
- MessageFeed empty/busy: 1000×760; MessageComposer narrow: 390×700; lifecycle: 1280×1400.
- VirtualKeypad disabled: 1280×1100 light/dark side-by-side; landscape: 700×500 안의 568×320 fixture.

최종 자동 검증:

- package build, TypeScript, token source/color/contrast/layering/hygiene, prompt contract 통과.
- Storybook static build 통과.
- 집중 a11y/play: facility transition + route/trajectory 10 stories, play 10, Axe violation 0,
  new undersized target 0.
- 전체 a11y/play: 516 implementation stories, 197 completed play functions, Axe violation 0,
  missing name 0, implicit button type 0, console error 0.

### DV-01 — SpatialRegion label collision

**증거**

- `SpatialRegion.jsx:320-334`는 전체 `semanticLabel(region)`을 geometry 중심에 단일 `<text>`로 그린다.
- `RoboticsNavigationRegions / DarkPatternsAndStates`에서 경사 영역의 긴 label이 invalid door circle과
  겹치고, 패턴과 상태 mark를 가로지른다.
- `SemanticMirror`에서 일부 label을 수동으로 끄는 방식은 특정 fixture만 완화하며 component 기본 계약에는
  collision, priority, short visual label, fallback placement가 없다.

**판정**

지도 label은 geometry·상태보다 앞에 읽혀야 하지만 geometry를 가리면 안 된다. accessible name에 필요한
전체 문장과 지도에 그릴 짧은 label을 같은 문자열로 쓰는 것이 근본 원인이다.

**권고**

- visual label과 accessible full name을 분리한다.
- dense composite에서는 label priority/숨김/외부 semantic list 사용 규칙을 둔다.
- renderer가 collision 배치를 소유할 수 있도록 label render/placement 확장 지점을 검토한다.
- normal/dark/narrow에서 긴 한국어 label과 invalid/stale/selected compound 상태를 다시 검수한다.

공개 API를 추가하지 않고 short visual identity + full accessible name + dense-story label suppression으로 해결했다.

### DV-02 — 다크 disabled VirtualKeypad 가독성 붕괴

**증거**

`Virtual Keypad / Range and Disabled States`의 다크 disabled fixture에서 실측한 computed color:

- fixture background: `rgb(27, 28, 30)`
- disabled input value: `rgba(152, 155, 162, 0.16)`
- disabled digit key foreground: `rgba(55, 56, 60, 0.28)`
- disabled digit key background: `rgba(112, 115, 124, 0.08)`

값 `5`, 숫자 키, C/backspace/확인이 모두 배경과 거의 합쳐져 disabled라는 사실보다 control 자체가 사라진
것처럼 보인다. WCAG disabled contrast 예외 여부와 별개로 현재 값과 입력면을 읽기 어렵다.

**권고**

- dark scope에서 disabled semantic token이 실제로 재해석되는지 먼저 추적한다.
- 공유 token **값**을 바로 바꾸지 말고 Button/Input/VirtualKeypad에 미치는 blast radius를 측정한다.
- 정상 dark disabled sibling과 나란히 렌더해 값·경계·action shape는 남고 activation emphasis만 낮아지는지
  확인한다.

사용자 승인 뒤 source token과 Button/Input theme-scope 해석을 함께 수정하고 전체 Storybook으로 회귀를 확인했다.

### DV-03 — N6 Semantic Mirror의 시각 위계 역전

**증거**

- `RoboticsNavigationRouteTrajectory.stories.jsx:783`에서 선택 객체 목록을 selected=`primary`,
  unselected=`secondary`인 full-width Button으로 렌더한다.
- 실제 화면에서 모든 unselected row가 짙은 막대로 보이고, map·Legend·LayerPanel·SelectionInspector보다
  목록이 가장 강하게 읽힌다.
- 내부 sibling `LayerPanel / Interactive`는 neutral row, 작은 상태 dot, trailing visibility/lock action,
  한 개의 subtle selected row를 사용한다.
- map은 1120×300 surface지만 실제 route geometry는 좌측 일부에 몰려 있고, 아래 두 column에서 목록과
  LayerPanel이 동일한 visibility/identity 정보를 다시 경쟁한다.

**판정**

의도한 읽기 순서는 map → 이름 있는 equivalent path → layer control → selected detail이지만, 실제 위계는
dark button list → map → layer panel → inspector다. 같은 저장소 sibling과도 충돌한다.

**권고**

- 객체 목록을 Button stack이 아닌 neutral selectable row/list/tree 언어로 맞춘다.
- selected 한 행에만 accent를 사용하고 unselected는 LayerPanel과 같은 surface density를 사용한다.
- normal 폭에서는 map을 중심으로, object list/layer/inspector를 하나의 도구 panel 계층으로 재구성한다.
- 좁은 폭에서는 map → selected summary → 탐색 목록 → layer settings 순으로 실제 읽기 우선순위를 다시 검토한다.

composed story 구조 변경이므로 N6 범위 안에서 수정 가능하지만, 기존 공용 component API 변경은 필요 없다.

### DV-04 — FacilityTransition의 phase 차이가 그림에 드러나지 않음

**증거**

- `RoboticsNavigationFacilities.stories.jsx:110-120`의 1층 접근과 2층 도착은 같은 path geometry를 그린다.
- 두 panel의 transition marker와 cabin 위치도 거의 같아 heading과 작은 inline text를 읽지 않으면 접근/도착을
  구분하기 어렵다.
- 독립 상태 축을 보존한다는 semantic 계약은 좋지만 phase·door·motion·mode·session을 한 작은 label에 모두
  넣어 주요 상태와 보조 metadata의 위계가 없다.

**권고**

- current/destination endpoint와 direction을 별도 시각 단서로 둔다.
- phase를 첫 줄, door/motion/session을 보조 줄 또는 inspector로 분리한다.
- 같은 좌표를 쓰는 multi-floor 예시는 현재 floor가 무엇인지 marker 자체에서도 식별되게 한다.

### DV-05 — MessageFeed empty/busy의 시각 구분 부족

**증거**

- `MessageFeed.jsx:304-313`의 `liveStatus`는 `VisuallyHidden`이다.
- `Message Feed / Empty and Busy`는 두 card가 같은 height·surface·중앙 문구를 사용하고, busy는 문장만
  “준비하고 있습니다”로 바뀐다.
- Carbon AI Chat은 응답 지연 시 visible loading indicator를 제공한다.

**판정**

문구가 있으므로 상태가 완전히 숨겨진 것은 아니지만, 정적 empty와 진행 중 busy가 빠른 스캔에서 같은
상태로 읽힌다.

**권고**

- MessageFeed core가 spinner를 강제하기보다 visible busy content/slot 조합을 문서화한다.
- 대표 story에서는 기존 Spinner 또는 ResourceState 표현을 조합해 sighted progress cue를 보여준다.
- 초기 loading과 과거 기록 prepend loading의 위치·크기를 별도로 검토한다.

### DV-06 — MessageComposer story가 LDS icon/chip 언어를 우회함

**증거**

- `CommunicationMessageComposer.stories.jsx:27-48`은 Paperclip/Template SVG를 직접 그린다.
- 같은 파일의 `AttachmentChip`은 기존 Chip/Tag/File 계열을 쓰지 않고 border·radius·background를 직접 조합한다.
- 360px narrow 화면에서는 outer composer, full-width rounded attachment surface, rounded control row가 중첩되어
  card-within-card처럼 읽힌다.
- `MessageComposer.prompt.md`는 control row가 card 안의 또 다른 card처럼 보여서는 안 된다고 명시한다.

**권고**

- icon registry의 기존 attachment/template icon을 사용한다.
- attachment는 기존 Chip 또는 attachment 전용 sibling과 비교해 한 줄 compact row로 맞춘다.
- narrow에서 attachment·input·counter·utility action의 reading order와 border 중복을 다시 본다.

스토리와 fixture 수준의 저위험 수정으로 처리 가능하다.

### DV-07 — VirtualKeypad landscape 정보 위계

**증거**

- `SelectionVirtualKeypad.stories.jsx:157`은 568×320을 input column + 304px keypad card로 나눈다.
- outer bordered card 안에 keypad bordered card가 다시 들어간다.
- 값/단위는 작은 일반 Input과 보조 문장으로 표시되고, 화면 대부분은 keypad가 차지한다.
- play가 maxLength에 도달한 뒤 모든 digit key를 disabled로 만들지만 이유나 remaining length cue는 없다.

**판정**

숫자 배열과 48px target, primary confirm은 적절하다. 다만 kiosk에서 가장 중요한 현재 값·단위·허용 범위가
keypad chrome보다 약하고, max-length lock은 고장처럼 보일 수 있다.

**권고**

- outer/inner card 중 하나를 제거하고 입력면을 하나의 surface로 통합한다.
- current value와 unit을 더 명확한 readout hierarchy로 올린다.
- maxLength 도달 상태에는 helper/counter로 이유를 표시한다.
- Apple의 centered zero 배열은 유지 가능하며, 이를 이유로 숫자 grid 자체를 재설계할 필요는 없다.

### DV-08 — 공개 story에 테스트 fixture가 노출됨

**증거**

- `CommunicationMessage.stories.jsx:457`: `보낸 메시지 N건`
- `CommunicationMessageComposer.stories.jsx:81`: `마지막 행동: ...`
- `RoboticsNavigationRegions.stories.jsx:235`: `활성화: ...`
- `RoboticsNavigationWaypoint.stories.jsx:411-412`: `activated: ...`
- Message lifecycle bubble이 `delivery: failed`, `response: pending` 같은 기술 placeholder를 본문으로 사용하고,
  Composer state caption은 `Idle`, `Submitting`, `Streaming`, `Stopping`을 그대로 노출한다.

**판정**

play assertion에는 유용하지만 공개 Storybook에서는 완성된 component state보다 test harness가 먼저 보인다.
스토리의 상태 비교 역할은 유지하되 제품 UI처럼 읽히는 fixture와 테스트 측정값을 분리해야 한다.

**권고**

- callback count/last action은 visually hidden 또는 play 내부 state로 옮긴다.
- state 이름은 story caption으로 유지하고 실제 message body는 현실적인 한국어 content로 교체한다.
- domain abbreviation은 map label에서 줄이고 full value는 inspector/aria name에 둔다.

## 유지해도 되는 결정

- ConversationMessage 다크 테마는 inbound/outbound/system hierarchy와 본문 대비가 안정적이다.
- MessageComposer의 trailing send/stop 위치와 feed/message/composer 책임 분리는 Carbon hierarchy와 맞는다.
- MessageFeed narrow는 history action → log → latest action의 DOM/시각 순서가 일치하고 8px 간격으로 겹치지 않는다.
- VirtualKeypad의 1–9, centered 0, edit row, primary confirm 구조와 48px target은 유지 가능하다.
- Lane/Route/Trajectory의 color + dash/pattern 이중 encoding과 map/list equivalent path 방향은 타당하다.
- LayerPanel과 SelectionInspector 자체는 neutral row·section hierarchy가 안정적이며 N6가 이 언어에 맞춰야 한다.

## 완료 판정

8개 finding의 before/after를 normal/narrow와 필요한 light/dark 조건에서 직접 확인했고, 공개 API 추가 없이
기존 LDS sibling 언어와 외부 category reference의 anatomy를 결합했다. 지도 의미론·대화 lifecycle·키패드
문자열 계약은 유지했으며, 변경된 공용 disabled/theme 경계는 전체 Storybook 접근성·play 검사로 회귀가
없음을 확인했다.

## 2026-07-13 Communication 후속 감사

`LDS Product / Communication`의 현재 3페이지 19스토리를 새 정적 Storybook과 공식 category reference로
다시 비교했다. 이전 감사에서 해결한 busy, icon/chip, public fixture 문제는 재발하지 않았고, 이번에는
새 `soft`/`solid` surface 비교와 통합 composition의 첫 화면 완성도를 추가로 점검했다.

### 일반 레퍼런스 재검색과 비교

| 검증 축 | 공식 레퍼런스에서 확인한 기준 | LDS 판정 |
| --- | --- | --- |
| 전체 anatomy | [Carbon AI Chat demo](https://chat.carbondesignsystem.com/tag/latest/demo/index.html)는 header/workspace, `Chat messages` 영역, history begin/end focus action, input과 trailing send를 하나의 전체 shell로 제공한다. | Message·Feed·Composer의 읽기 순서와 trailing action은 일치한다. Carbon의 F6 전환, message selection, header/workspace는 `ChatWindow` 제품 계층이므로 LDS primitive에 추가하지 않는다. |
| 순차 메시지 알림 | [W3C ARIA23](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA23)는 끝에 추가되는 chat history container 하나에 named `role="log"`를 적용한다. | `MessageFeed`만 polite log를 소유하고 개별 `ConversationMessage`에는 live region이 없다. 현재 계약과 일치한다. |
| streaming·stop | [Carbon server communication](https://chat.carbondesignsystem.com/tag/latest/docs/documents/Server_communication.html)은 pending/loading, streaming, stop 요청, final state를 분리하고 final response 전까지 stop 상태를 임의 완료하지 않는다. | `ConversationMessage` lifecycle과 `MessageComposer`의 submitting/streaming/stopping을 controlled state로 유지한다. 두 위치에 stop을 동시에 노출할지는 제품이 결정하며 LDS가 중복 action을 추론하지 않는다. |
| input·focus·IME | [Android Jetchat](https://github.com/android/compose-samples/tree/main/Jetchat)은 conversation `scrollState`, 별도 `UserInput`, focus 관리와 IME padding을 함께 검증한다. | MessageFeed의 읽기 위치와 Composer의 focus·IME Enter 계약은 LDS가 소유한다. navigation bar/IME safe area와 화면 고정은 제품 shell 책임으로 남긴다. |
| adaptive shell | [Android adaptive chat codelab](https://developer.android.com/codelabs/codelab-adaptive-apps?hl=en)은 폭에 따라 chat list와 chat detail을 한 pane 또는 두 pane으로 전환한다. | LDS는 320px primitive overflow와 읽기 순서만 보장하고, list/detail pane 전환과 route는 제품이 소유한다. |
| system message | [Fluent 2 handoffs](https://fluent2.microsoft.design/handoffs)는 system message를 짧은 3인칭 완전 문장으로 쓰고 한 줄을 우선한다. | `상담원이 대화에 참여했습니다.` 같은 neutral line은 이 계층과 맞으며 avatar·bubble·별도 CTA를 추가하지 않는다. |

### 추가 finding과 해결

| ID | 심각도 | 범위 | 발견 | 해결 |
| --- | --- | --- | --- | --- |
| C-F01 | medium | Message overview | 같은 user·content의 soft/solid 예시가 설명 없이 연속되어 중복 메시지처럼 읽힘 | `동일 메시지의 표면 비교`와 `Soft · 전체 너비` / `Solid · 내용 너비` 라벨을 실제 Storybook canvas에 추가하고 play assertion으로 고정 |
| C-F02 | medium | Message composition | bottom-follow 뒤 첫 메시지가 일부 가려져 대표 composition이 중간 message boundary에서 시작하고 Storybook Axe가 contrast 3개를 `Inconclusive`로 남김 | representative feed 높이를 440px로 조정해 네 메시지의 경계를 모두 보이고, play에서 부분 clipping을 금지 |

후속 시각 확인은 Message overview·composition·dark·320px long content, MessageFeed empty/busy·dark·320px,
MessageComposer request states·dark·320px에서 수행했다. 정상 폭의 identity → body → evidence/status → action,
system line, bottom-follow, narrow wrapping, code-only horizontal scroll, disabled/read-only 대비와 trailing action 정렬을
다시 확인했다.

후속 자동 검증:

- `npm run build:storybook` 통과.
- `A11Y_STORY_PATTERN=lds-product-communication` 표적 검사: 19 stories, play 17, Axe 19, violation 0,
  undersized target 0, missing name 0, implicit button type 0, console error 0.
- 통합 composition의 Storybook Accessibility panel: `Violations 0`, `Inconclusive 0`.
- `check:types`, `check:type-consumer`, `check:contracts`, `check:prompt-contracts`, `check:story-subjects` 통과.
- 전체 Storybook build, rendered component style, nested style, public surface(408 public / 126 hidden), tooltip
  alignment와 37개 visual regression smoke를 통과했다.
- 이 후속 감사 직후의 전역 `check:storybook`은 Communication 검사에 도달하기 전 repository inventory와
  IA 문서가 534 implementation / 408 public story 수를 아직 반영하지 않아 중단됐다. 해당 당시 실패는
  이 historical 감사에 보존하고, 현재 수치와 stale-review 해소 여부는
  [`STORYBOOK_INFORMATION_ARCHITECTURE.md`](../../STORYBOOK_INFORMATION_ARCHITECTURE.md)와 machine audit을 따른다.
