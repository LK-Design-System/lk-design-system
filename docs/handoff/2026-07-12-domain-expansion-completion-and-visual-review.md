# Handoff — 도메인 컴포넌트 확장 완료 · 검증 · 실화면 시각 검수

Date: 2026-07-12
Branch: `main`
HEAD: `04eb718` (이 세션의 모든 변경은 **미커밋**, `origin` push 없음)
Status: **표적 검증 완료 (a11y · IA · inventory 3게이트 green) · 미커밋**

이전 단계: [도메인 컴포넌트 확장 구현 중간 체크포인트](2026-07-12-domain-component-expansion-implementation.md) ·
[실행 계획](../DOMAIN_COMPONENT_EXPANSION_PLAN.md)

## 이 세션이 한 일

중단된 Codex 세션(로보틱스 내비게이션 N · 채팅/메시지 C · 가상 키패드 K 확장)을 이어받아 **구현을 완성하고,
공개 API를 연결하고, 신규 스토리를 표적 검증**해 G5를 닫았다. 사용자 지시로 저장소 전체 `npm run check`는
돌리지 않고 **신규 스토리 표적 검증**(build + a11y guard + IA + inventory)으로 마무리했다.

중요: 착수 시점에 실제 파일 상태가 이전 핸드오프보다 앞서 있었다. 중단 직전에 스폰된 백그라운드 에이전트들이
**MessageFeed(C2) · MessageComposer(C3) · VirtualKeypad(K1)** 를 이미 완성해 뒀다(파일 timestamp가 이전 핸드오프
작성 이후). 이들은 새로 만들지 않고 **계약 대조로 검증**했고, 실제로 없던 **N6 · C4**는 이 세션에서 구현했다.

## 트랙별 상태

| 트랙 | 상태 | 비고 |
| --- | --- | --- |
| N1–N5 로보틱스 (6 컴포넌트 + 5 스토리) | 검증 완료 | 백그라운드 완성분, 파싱·계약·타입 대조 |
| **N6 세만틱 미러** | **이 세션 구현** | `RoboticsNavigationRouteTrajectory.stories.jsx`에 `사용법 · 레이어·목록·선택 요약` 추가 |
| C1 ConversationMessage | 검증 완료 | 백그라운드 완성분 |
| C2 MessageFeed / C3 MessageComposer | 검증 완료 | 백그라운드 완성분 |
| **C4 대화 구성** | **이 세션 구현** | `CommunicationMessage.stories.jsx`에 `사용법 · 피드·메시지·작성기 구성` 추가 |
| K1 VirtualKeypad | 검증 완료 | 백그라운드 완성분 |
| 공개 entry + consumer types | 이 세션 완료 | `generate:entry` 실행, import 통일, 타입 계약 |
| 문서 · 분류 · 인벤토리 | 이 세션 완료 | 아래 참조 |
| 실화면 시각 검수 | 이 세션 완료 | 아래 참조 |

## N6 세만틱 미러 (이 세션 구현)

`Map2DCanvas` + region→lane→route/trajectory→waypoint/facility 렌더 + 이름 있는 feature 목록(키보드 경로) +
`LayerPanel`(controlled `visibleLayerIds`) + `SelectionInspector` + `Legend`를 **하나의 선택 identity**로 연동.

- 지도 fragment는 pointer activation 유지 + `tabIndex={-1}`(키보드는 목록이 소유).
- `LaneOverlay`가 entry/exit endpoint 참조로 `data-waypoint-id`/`data-transition-id`를 렌더하므로, play는
  interactive 루트를 `[role="button"]`으로 특정해야 한다(초기 selector 버그의 원인).
- **레이아웃**: 지도를 전체 너비로 배치한다. 3열 그리드로 지도를 좁히면 inverse-scaled SVG가 통째로 축소돼
  pointer target이 24px 미만이 된다(실제로 처음엔 15px로 axe 실패).
- **라벨 균형**: 면적·점 feature(영역·웨이포인트)는 `showLabel={false}`(이름은 목록·범례가 담당), 얇은 선
  feature(경로·레인·궤적·설비)는 라벨 유지(hit target 높이 확보). 라벨을 전부 끄면 얇은 선이 8px로 undersized.

## C4 대화 구성 (이 세션 구현)

`ConversationMessage` + `MessageFeed` + `MessageComposer` + `SourceDisclosure`를 하나의 작은 story로 조합.
`ChatWindow` public export나 새 application page를 만들지 않고, 성공한 transport/streaming을 연출하지 않는다
(fixture callback이 사용자 자기 메시지만 로컬 echo하고 controlled value를 비운다).

## 공개 entry · 타입

- `npm run generate:entry` → `src/index.js` / `src/index.d.ts`에 신규 10개 export
  (WaypointMarker · LaneOverlay · RouteOverlay · TrajectoryOverlay · SpatialRegion · FacilityTransition ·
  ConversationMessage · MessageFeed · MessageComposer · VirtualKeypad).
- 신규 9개 스토리 import를 `../src/index.js`로 통일.
- `scripts/type-tests/consumer-contract.tsx`에 10개 컴포넌트 사용 예 추가 → **React 18/19 타입 검증 통과**
  (consumer tsconfig가 패키지를 `src/index.d.ts`로 해석하므로 dist 재빌드 없이 검증됨).

## 검증 결과 (표적, 3게이트 green)

| 게이트 | 결과 | 방법 |
| --- | --- | --- |
| 접근성 가드 (`check:a11y`) | ✅ 46 스토리 · 42 play · **0 violations · 0 undersized · 0 missing names** | `A11Y_STORY_PATTERN='robotics-navigation\|communication\|virtual-keypad'`로 신규만 표적 |
| `check:storybook-ia` | ✅ 177 pages / 516 stories, 전 페이지 reviewed·current | 아래 IA 절차 |
| `check:inventory` | ✅ | 실제 index 수치로 문서 갱신 |

`npm run build:storybook` → 신규 스토리 컴파일·번들 성공. IA 절차:
`report:storybook-ia --update` → 신규 9 페이지 reviewed 승격 → `--update`(JS 직렬화 정규화) → `--check`.

### 검증이 발견하고 수정한 실결함

**접근성(axe)** — 검증이 잡은 실결함 6건:
1. **MessageComposer 다크 텍스트 대비 1.12** — `--component-input-text-color`가 `:root`에서 `var(--color-semantic-label-normal)`로
   해석·상속되어 dark scope에서 안 뒤집힘(CSS var indirection 함정) → 컴포넌트가 semantic 토큰 직접 참조.
2. **ConversationMessage 실패 status 3.44** — status-negative는 11px 텍스트에 4.5:1 미달 → 텍스트 `label-normal`,
   색 신호는 dot(그래픽 3:1 충족)이 담당(색-비의존 개선).
3. N6 리스트 버튼 undersized → `minHeight:32`.
4. N6 지도 fragment undersized → 지도 전체폭 배치.
5. WaypointMarker hit area 23.x → r 12→13(26px), `data-screen-target-size="24"` 계약 유지.
6. Waypoint 다크 secondary 서브텍스트 1.05 — 라이트 테마 neutral 하드코딩이 자기 다크 fill 위에서 안 보임 → 선택 시
   inverse-label로 전환.

**실화면 시각 검수(axe·기하 검사가 못 잡음)** — 스크린샷으로 발견:
- **N6 지도 라벨 10쌍 겹침** + keep-out 영역이 픽업 웨이포인트 위에 얹힘 → keep-out 이동 + 라벨 균형(위 N6 절)으로
  겹침 10→3(같은 corridor를 지나는 선 라벨 근접, 허용 가능), target-size 결함 0 유지.
- 나머지(C4·VirtualKeypad·MessageComposer 다크·Route/Trajectory 개요·Message 320px)는 양호. 320px는 줄바꿈 +
  코드 자체 스크롤 + overflow 없음 확인.

**play 테스트 정확성**:
- N6: 리스트 클릭 후 `waitFor`로 리렌더 대기, 지도 fragment는 `[role="button"]`으로 특정(lane endpoint 배제).
- MessageFeed HistoryAnchoring: history control이 언마운트되며 log가 이동 → anchor 위치를 **log-상대**로 측정.
- MessageFeed FollowAndUnread: `waitFor` 안에서 scroll 재발생(초기 programmatic scroll 억제 극복).

**IA 설명·네이밍 보정**: decisionGuidance 키워드("적합") 7건, Message 두 스토리를 인라인 export로(간접 export는 CSF
인덱서가 name/description을 정적 해석 못 함), "IME"→"조합 입력", "상태 ·"→"변형·상태 ·".

## 문서 · 분류 · 인벤토리 갱신

- `PUBLIC_EXPORT_CLASSIFICATION.json`: **Communication product extension** 그룹 신설 + Selection 그룹에 VirtualKeypad.
- `LAYER_CLASSIFICATION.json`: storyTitles에 Communication 3 + SelectionVirtualKeypad.
- `COMPONENT_API_STATE_MATRIX.md` · `ACCESSIBILITY_CONTRACTS.md`: C/K 행 추가.
- 실제 index 수치로 갱신: **516 stories / 397 public / 119 hidden / 82 visual-parity / 202 컴포넌트 / 208 export**
  — `REPOSITORY_INVENTORY.md` · `VISUAL_PARITY_LEDGER.md` · `readme.md` · `stories/Audit.data.jsx` ·
  `stories/CardsExtended.shared.jsx`.
- `STORYBOOK_INFORMATION_ARCHITECTURE_AUDIT.json`: 신규 9 페이지 reviewed 승격.

## 스코프 밖이라 투명하게 공유한 것

- **Avatar / AnnotatedImage 페이지 2개**: 동시 진행된 다른(family-stabilization) 작업이 스토리의 에셋 경로를
  `/`→`./`로 바꿔 IA 리뷰가 stale해졌다. diff가 사소함을 확인하고 re-stamp했다(제 도메인 작업 아님).
- `readme.md`/`Audit.data.jsx`/`CardsExtended.shared.jsx`의 카운트 표시는 **제 도메인 확장이 카운트를 바꿔서**
  갱신한 것.

## GitHub Actions 정리 (별도 요청)

- 삭제: `.github/workflows/deploy-storybook-pages.yml` (안 쓰는 GitHub Pages 배포, `ENABLE_GITHUB_PAGES` 게이트 뒤에
  있던 사실상 비활성 워크플로, 커밋된 적 없는 untracked 파일).
- 유지: `.github/workflows/ci.yml` (CI 품질 게이트 = `npm run check` + `check:audit`). 사용자 확인 후 유지.

## 파일 상태

- HEAD `04eb718`, **미커밋**. `origin` push 없음.
- tracked dirty(dist 제외) ~66, untracked 신규(dist 제외) ~33.
- 신규 도메인 컴포넌트 파일 22개, 신규 도메인 스토리 9개.
- `dist/`는 이 세션에서 재빌드하지 않았다(패키지 build는 안 함). `src/index.*`는 generate로 최신.
- 대규모 dirty worktree에 다른 에이전트의 미커밋 작업이 함께 있다. **reset/checkout/clean/dist 일괄삭제 금지.**

## 남은 작업

- 저장소 전체 `npm run check` (사용자 요청 시). dirty worktree라 `check:generated`(src/dist diff) 등은 구조적으로
  실패하며 이 도메인 작업과 무관 — 이전 핸드오프대로 격리 해석.
- 자동 visual-regression 베이스라인 등록(`npm run update:visual-baseline`) — 신규 스토리 스크린샷을 기준선으로.
- 커밋 / 브랜치 / `origin` push — 사용자 판단.
- 각 신규 스토리의 다크/컴파운드 변형까지 전수 스크린샷(이번엔 대표 위주).

## 유지해야 할 결정

- Open-RMF/Nav2 이름을 public prop으로 복사하지 않고 domain meaning만 번역.
- route/trajectory, waypoint/region, lane runtime/facility state를 합치지 않음.
- chat message 자체에 live region을 주지 않고 feed만 log announcement 소유.
- `ChatWindow`·범용 `VirtualKeyboard`·`OperatorKeypad`를 근거 없이 추가하지 않음.
- shared token value·repository-wide gate·public API 대량 rename은 사용자 승인 없이 확장하지 않음.
- 지도 SVG/canvas를 유일한 접근성 경로로 만들지 않음(이름 있는 semantic mirror 목록이 동일 identity 제공).

## 가장 먼저 읽을 파일

1. [`DOMAIN_COMPONENT_EXPANSION_PLAN.md`](../DOMAIN_COMPONENT_EXPANSION_PLAN.md)
2. [`2026-07-12-domain-component-expansion-implementation.md`](2026-07-12-domain-component-expansion-implementation.md) (이전 단계 상세)
3. `stories/RoboticsNavigationRouteTrajectory.stories.jsx` (N6)
4. `stories/CommunicationMessage.stories.jsx` (C4)
5. `scripts/type-tests/consumer-contract.tsx`
6. `docs/references/quality/STORYBOOK_INFORMATION_ARCHITECTURE_AUDIT.json` (리뷰 상태)

## 유용한 명령

```powershell
# 신규 스토리 표적 접근성/상호작용 검증
npm run build:storybook
$env:A11Y_STORY_PATTERN='robotics-navigation|communication|virtual-keypad'; node scripts/check-storybook-accessibility.mjs

# IA 재생성·검토·검증
node scripts/report-storybook-information-architecture.mjs --update   # 신규 페이지 pending → 실제 검토 후 reviewed 승격
node scripts/report-storybook-information-architecture.mjs --check
node scripts/report-inventory.mjs --check-docs

# 공개 entry 재생성 (신규 컴포넌트 추가 시)
npm run generate:entry

# consumer 타입 계약
npm run check:type-consumer
```
