# Handoff — Storybook IA·설명·네이밍 정규화

Date: 2026-07-12

Branch: `main` · HEAD: `7045e34` · 이 커밋은 **이번 세션에서 만든 체크포인트**(IA 계획 산출물만)이다.

## 최종 네이밍 정규화 — 2026-07-12

IA와 친절 가이드 수습 뒤 공개 탐색 명칭도 전 범위에서 정규화했다. 아래의 과거 체크포인트 섹션은 당시 진행 기록이며, 이 섹션과 바로 다음 완료 업데이트가 현재 상태다.

- **대상:** 168페이지, 공개 스토리 336개. 숨김 스토리 107개의 내부·시각 회귀용 이름은 바꾸지 않았다.
- **스토리 이름:** 모든 페이지의 첫 공개 스토리는 `개요`; 후속 스토리는 `참조 ·`, `사용법 ·`, `변형·상태 ·`, `상호작용 ·`, `반응형 ·`, `시나리오 ·` 중 하나로 시작한다. 공개 이름 안의 불필요한 구현 영어·백틱은 제거했고 표준 키·단위·브랜드만 허용했다.
- **페이지 이름:** `Text`→`Text Primitives`, `Media`→`Media Patterns`, `Essential`→`Mobile System Bars`, `Platform Marks`→`Platform Logos`, `Shared Viewer Frame`→`Viewer Frame`. 다섯 페이지 모두 명시적 `meta.id`로 기존 story ID와 URL을 보존했다.
- **사이드바 순서:** 최상위는 Core→Theme→Product→Robotics, 그룹은 명시 순서, Foundation은 학습 순서, 나머지 페이지는 자연 영문·숫자 정렬이다. 페이지 안에서는 위 역할 접두어 순서로 정렬한다.
- **가드:** IA 리포트가 첫 `개요`, 역할 접두어와 순서, 페이지 내 이름 중복, 허용되지 않은 영문·내부 용어·백틱, 점 구분자 공백, 이전 페이지명 잔존을 검사한다. `check:storybook-ia`는 `check:storybook` 최종 체인에 연결됐다.
- **ID·실화면 검증:** 이전 빌드와 새 빌드의 story ID 누락·추가가 모두 0이었다. 실제 Storybook에서 Core Action의 `Action Area → Button → Button Group`, Robotics Viewer의 `2D Map → 3D Scene → … → Viewer Frame`, 대표 페이지의 `개요 → 변형·상태 → 상호작용 → 반응형` 순서를 확인했다. 다섯 이전 URL도 모두 새 페이지명으로 정상 열렸다.
- **최종 검증:** Storybook build, TypeScript, IA, inventory, public surface, story coverage, WDS alignment, Product frontend evidence, Tooltip alignment, story-subject 중복, diff-check 통과. 접근성은 443 Axe checks에서 위반·이름 누락·implicit button·console error 0. visual smoke는 37/37 모두 0.000% diff다.
- **서버:** `http://127.0.0.1:6006/`에서 다시 실행 중이다.

정규화 작업은 커밋하지 않았다. 동시 작업이 섞인 dirty worktree를 보존했으므로 reset·checkout·통째 스테이징을 하지 말고 필요한 파일만 선별한다.

## 완료 업데이트 — 아래 체크포인트를 대체함

2026-07-12 후속 세션에서 이 핸드오프의 남은 작업을 모두 수습했다. 아래의 “남은 split 13”, “남은 페이지 87개”, “다음 에이전트 재개 순서”는 당시 체크포인트를 보존한 역사 기록이며 **더 이상 실행 목록이 아니다**.

- 최종 빌드 인덱스: **168페이지 / 443스토리 / 공개 336 / 숨김 107**
- 최종 IA 원장: **168페이지·443스토리 전부 reviewed, stale 0, 공개·숨김 권고 불일치 0, disposition `keep` 168 / `split` 0 / `merge` 0 / `hide` 0**
- 최초 후보 split 18 + merge 1의 결론: **구조 split 13 실행, split 후보 5건 keep 정정, merge 후보 1건 keep 정정**
- Product 친절 가이드: **80/80페이지**, 공개 스토리 설명 **172/172개**
- Robotics 친절 가이드: **24/24페이지**, 공개 스토리 설명 **74/74개**
- 실화면 검수: 첫 공개 스토리 **104/104** 통과(shared `StoryGuide` 98, 기존 inline 3단 헤더 6). 대표 8페이지를 1294px·320px에서 검사해 가로 overflow·헤더/설명 clipping 0, 가이드-예제 간격 24px를 확인했다.
- 숨김 전환 권고 10건을 모두 적용했고, 최종 숨김 역할은 visual parity 82 + internal contract 25다.
- Storybook build, TypeScript, IA, inventory, public surface, story coverage, WDS alignment, Product frontend evidence, Tooltip alignment, diff-check 통과
- 접근성: 443 implementation stories, 126 play functions, 443 Axe checks, 위반·이름 누락·implicit button·console error 0
- visual smoke: 37/37 baseline 재생성 후 0.000% diff

핵심 정정은 `ToastStack`을 Toast의 배치 wrapper로 유지, `Manual Control Session`을 하나의 안전 상태 머신으로 유지, `HistoryToolbar`를 독립 API·keyboard contract 페이지로 유지한 것이다. 구조 분리와 가이드 추가에 맞춰 WDS/Product 증거 경로, story coverage, target-size, visual-smoke baseline, 인벤토리 문서도 동기화했다.

작업은 커밋하지 않았다. 동시 작업이 섞인 dirty worktree를 그대로 보존했으므로 reset·checkout·통째 스테이징을 하지 말고 필요한 파일만 선별한다.

---

Worktree: `git status --porcelain` 기준 **1313 entries dirty**. 여러 에이전트의 작업이 섞여 있다. **이번 세션의 산출물은 아직 커밋하지 않았다**(체크포인트 `7045e34` 이후 전부 미커밋). reset·checkout·대량 정리·무관 파일 수정 금지. 패치 직전 대상 파일을 다시 읽을 것.

선행 문서: [2026-07-11 Storybook 정보 구조 감사](2026-07-11-storybook-information-architecture-audit.md)에서 감사 원장·계약·가드를 만들었고, 이 세션은 **그 계획의 실행**을 이어서 했다.

---

## 이번 세션이 한 일 (요약)

1. **체크포인트 커밋 `7045e34`** — IA 계획 산출물 5개 파일만 선별 커밋(원장 JSON, 계약 MD, 핸드오프 MD, 리포트 스크립트, COMPONENT_WORKFLOW 포인터). 혼합 파일(package.json·HANDOFF·INVENTORY)은 타 작업과 얽혀 제외.
2. **IA split 2건 실행** + **split→keep 정정 3건** (아래 표).
3. **Product/Robotics 친절 설명 개선 착수** — "오버라인+제목+사용 기준" 3단 헤더 템플릿 확립, 6개 페이지 적용.
4. **손상된 Storybook dev 서버 복구**(재시작).

현재 IA 원장: **152 페이지 / 423 스토리 / 전부 reviewed / disposition = keep 138 · split 13 · merge 1 · hide 0**.

---

## IA split/merge 실행 상태

원래 계획(2026-07-11 감사)은 split 18 + merge 1이었다. 이 세션에서 `.fig` 스냅샷(`docs/references/wds/FIGMA_LOCAL_CONTENT_AUDIT.json`)으로 각 split의 WDS 근거를 검증한 결과, **다수 split이 WDS 무근거**임을 확인했다.

### 실행 완료 (2건)
- `Foundation/Effects and Interaction` → `Effects` + `Interaction`
- `Status/Loading State` → `Skeleton` + `Spinner`

### split→keep 정정 (3건, `.fig` 무근거)
- `Layout/Scroll and Accessibility` — WDS `1 Layout`은 Essential/Divider/Layout만 정의. ScrollArea·Center·VisuallyHidden은 대응 component-set 없음(Center는 변형 값, VisuallyHidden 전무). AspectRatio는 WDS `1 Basic` 요소(회수는 별건).
- `Content/Disclosure` — WDS에 Accordion/Collapsible 없음(Folder 아이콘만).
- `Selection and Input/Search and Autocomplete` — WDS에 Search Field/Autocomplete/Combobox/Tag Input 없음(Search·Tag 아이콘만). 모두 Textinput의 LDS 확장.

### 남은 split 13 + merge 1 — `.fig` 스팟체크 분류

**이 분류가 핵심이다. 원장의 남은 split은 대부분 WDS 근거가 약하다.** 실행 전 반드시 `.fig`로 개별 확인할 것.

- **🟢 실행 가능(WDS component-set 실재)**: `Selection Groups → Select·Checkbox·Radio`(`Select/Select`, `Control/Checkbox`, `Control/Radio` 실재). **단 Selection Groups는 tangled** — 현재 페이지가 Switch·ChoiceCard·Input·CheckboxGroup·RadioGroup을 섞고 교차 매트릭스가 있어, stray를 각자 소유 페이지로 회수하는 반경 큰 재작성 필요. 전용 배치로.
- **🟡 부분/혼합(1개 WDS 앵커 + LDS 확장 — 타깃별 판단)**: Action Controls(FAB는 Button 변형, Button Group·Split Button은 WDS 없음), Annotations(Tooltip만 WDS·집은 Presentation / Bubble·Bookmark는 아이콘만), Anchored Overlay(Popover 프레임만·HoverCard 없음·Dropdown≈Menu), Menu(WDS는 `Menu` 하나·Menubar 없음), Toast(Toast만 WDS·Toast Stack은 래퍼), Segmented and Toggle(Segmented Control만 WDS·Toggle Button은 Toggle Icon), Text Input(WDS `Textinput` 한 세트·4분할은 과분할), Progress(Progress≈Progress Tracker·Meter 없음).
- **⚪ Product/Robotics(WDS 무관·LDS 재사용 계약으로 판단)**: Utility Actions, File Upload Queue, Manual Control Session, Telemetry, (merge) History Toolbar→Command Bar.

**결론: 남은 split은 "실행 목록"이 아니다.** 대부분 keep으로 정정하거나 부분 split이 맞을 가능성이 높다. 각 건은 `.fig` 확인 → 사용자 판정 후 진행.

---

## Product/Robotics 설명 개선 (사용자 최우선 관심사)

**원래 문제**: "Foundation은 친절한데 Product·Robotics로 가면 스토리가 fixture처럼 불친절하다." 원장 확인 결과 **Product 68 + Robotics 23 = 91페이지 전부가 가이드 결손**이었다.

### 확정된 "친절한" 템플릿 (모범: `stories/FoundationBasic.stories.jsx` RatioTokens)

각 페이지의 **첫 공개 스토리 render 맨 위**에 아래 3단 헤더를 넣는다. **오버라인 라벨이 핵심** — 사용자가 이게 빠지면 "다르다"고 즉시 지적했다.

```jsx
<header style={{ display: 'grid', gap: 'var(--space-2)' }}>
  <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
    Robotics / Battery Gauge      {/* 오버라인: "카테고리 / 컴포넌트" */}
  </p>
  <h1 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--title2-size)', lineHeight: 'var(--title2-line)' }}>
    운영자 관점의 한 줄 정의       {/* h1 */}
  </h1>
  <p style={{ margin: 0, maxWidth: 640, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
    …할 때 적합합니다. …. …에는 이 컴포넌트 대신 X를 쓰세요.   {/* 사용/비사용 기준. "적합" 포함 필수 */}
  </p>
</header>
```

그리고 각 공개 스토리에 `parameters.docs.description.story`("상황 + 확인할 점" 1~2문장)를 넣는다. `<main>`을 grid로 하고 헤더를 첫 자식으로. flex/center 레이아웃 페이지는 헤더를 위에 두고 본문을 `<section>`으로 감쌀 것(Connection Badge·Joystick 참고).

레이어 계약: Foundation은 `.storybook`이 아니라 `docs/STORYBOOK_INFORMATION_ARCHITECTURE.md`의 영역별 순서를 따른다. Robotics는 **운영자 목표 → 연결/권한/안전 전제 → 읽기 순서 → 상태 구분 → 실패/복구**. 안전은 색만으로 전달 금지.

### 완료된 페이지 (10개)
- split하며 완결: `Foundation/Effects`, `Foundation/Interaction`, `Status/Skeleton`, `Status/Spinner` (모두 `missingGuidance: []`)
- Robotics 설명 추가: `Robotics/Status/Robot State`, `Robotics/Status/Equipment State`, `Robotics/Status/Battery Gauge`, `Robotics/Status/Connection Badge`, `Robotics/Control/Directional Pad`, `Robotics/Control/Joystick`

**주의**: Robot State·Equipment State는 `missingGuidance`에 `audience-entry-overview`가 남는다. **이는 분류기 한계**(스토리 이름 "…상태"의 "상태"가 variants-states로 분류돼 overview가 될 수 없음)이며 실제 안내는 다 들어있다. 가드는 이 플래그로 실패하지 않는다. 이름을 왜곡해 지우지 말 것.

### 남은 페이지 (87개)
Robotics 15 (Manual Control Session, Editor 7, Viewer 7, Topic Tree, Assets/Icons) + Product 68. 다음 배치 추천: **Robotics Editor 클러스터**(Canvas Shell, Command Bar, Editor Toolbar, History Toolbar, Layer Panel, Selection Inspector, Viewport Status Bar).

---

## 핵심 메커니즘 (반드시 알아야 함)

1. **content-only 편집(헤더·설명 추가)은 Storybook 재빌드 불필요.** 가드가 소스에서 직접 가이드 증거를 읽는다. 편집 → `npm run report:storybook-ia`(원장 갱신) → 재검토 → `check:storybook-ia`. HMR 서버가 떠 있으면 화면도 즉시 반영.
2. **split(구조 변경)은 재빌드 필수.** 가드는 `storybook-static/index.json`(빌드 산출물)에서 스토리 목록을 읽는다. 순서: 소스 편집 → `npm run build:storybook` → `npm run update:story-coverage-baseline` → `npm run report:storybook-ia` → 신규/변경 페이지 검토 → 가드.
3. **split마다 WDS 증거 파일이 6~9개 딸려온다.** 스토리 파일을 옮기면 이 파일들의 경로/증거를 repoint해야 `check:wds-alignment`가 통과한다: `LAYER_CLASSIFICATION`, `FOUNDATION_AUDIT`/`FOUNDATION_SOURCE_PDFS`(또는 `COMPONENT_SOURCE_PDFS`), `FIGMA_NODE_AUDIT_QUEUE`, `COVERAGE_AUDIT`, `COVERAGE_DETAIL_AUDIT`, `PUBLIC_EXPORT_CLASSIFICATION`, `VARIANT_AUDIT_CHECKLIST`. 스토리 수가 바뀌면 인벤토리 문서(readme.md·REPOSITORY_INVENTORY.md·VISUAL_PARITY_LEDGER.md·CardsExtended.shared.jsx)의 수치도 갱신(`check:inventory`).
4. **검토 승격은 사용자가 위임함.** 원래 핸드오프는 "자동 reviewed 금지"였으나 이 세션에서 사용자가 명시적으로 검토 승격을 위임했다. 신규/변경 페이지를 실제로 레이어 계약에 대조해 검토한 뒤, 원장에서 해당 page/story의 `reviewStatus:"reviewed"`, `reviewMethod:"source-ast+layer-human-review"`, `reviewedAt:"2026-07-12"`, `reviewedSourceSha256 = sourceSha256`를 설정한다. `report --update`는 이 수동 필드를 title/id로 보존한다.
5. **`STORY_COVERAGE_BASELINE.json`은 untracked 생성물** — 손으로 편집하지 말고 `update:story-coverage-baseline`로 재생성.

---

## Storybook dev 서버

- 재시작해서 정상이다. **접속은 `http://127.0.0.1:6006/`** (`localhost` 아님 — IPv4 전용 바인딩이라 Windows에서 `localhost`=IPv6로 막힘).
- launch 설정: `.claude/launch.json`의 `storybook`(= `node scripts/run-storybook-preview.mjs`). preview_start로 관리형 기동 권장(Bash로 dev 서버 직접 실행 금지).
- **`storybook dev`가 도는 동안 `storybook build`를 돌리지 말 것** — 공유 addon 캐시가 충돌해 매니저 번들 404 → 화면 빈 채가 된다(이번에 발생). split 검증용 재빌드가 필요하면 dev를 멈추고 빌드 후 재시작.

---

## 다음 에이전트 재개 순서

1. 이 문서, `docs/STORYBOOK_INFORMATION_ARCHITECTURE.md`, 감사 원장을 읽는다.
2. **Product/Robotics 설명 개선을 이어간다**(사용자 최우선). Robotics Editor 클러스터부터 3단 헤더 템플릿 적용 → `report:storybook-ia` → 검토 승격 → `check:storybook-ia`. content-only라 재빌드 불필요.
3. 남은 split 13은 **실행 목록이 아니다.** 손대기 전 `.fig`로 WDS 근거를 개별 확인하고 사용자 판정을 받는다(대부분 keep 정정 또는 부분 split 예상).
4. Selection Groups split과 AspectRatio→Foundation 회수는 반경이 커서 전용 배치.

---

## 검증 명령

```powershell
npm run report:storybook-ia          # 원장 갱신(소스 기준)
npm run check:storybook-ia           # 원장 검증(전부 reviewed·disposition·id 유일)
npm run check:storybook-public       # 공개/숨김 표면
npm run check:story-coverage         # 커버리지 ratchet
npm run check:inventory              # 문서 수치 = 실측
npm run check:wds-alignment          # WDS 증거 정합(split 후 필수)
```

split 실행 시 추가: `npm run build:storybook`(먼저) · `npm run update:story-coverage-baseline`.

---

## 주의사항

- 이번 세션 산출물은 **전부 미커밋**(체크포인트 `7045e34` 이후). 커밋하려면 이번 세션이 만진 파일만 선별할 것(아래). preview.jsx·WDS JSON 등은 타 작업과 얽혀 있어 통째 스테이징 금지.
- 이번 세션이 만진 파일: 생성 `stories/FoundationInteraction·StatusSkeleton·StatusSpinner.stories.jsx`; 삭제 `stories/StatusLoading.stories.jsx`; 수정 `stories/FoundationDecorate·RoboticsAndViz·RoboticsEquipment·RoboticsBatteryGauge·RoboticsConnectionBadge·RoboticsDirectionalPad·RoboticsJoystick.stories.jsx`, `.storybook/preview.jsx`, IA 원장, WDS refs(LAYER_CLASSIFICATION·FOUNDATION_AUDIT·FOUNDATION_SOURCE_PDFS·FIGMA_NODE_AUDIT_QUEUE·COVERAGE_AUDIT·COVERAGE_DETAIL_AUDIT·COMPONENT_SOURCE_PDFS·PUBLIC_EXPORT_CLASSIFICATION·VARIANT_AUDIT_CHECKLIST), 인벤토리 문서(readme·REPOSITORY_INVENTORY·VISUAL_PARITY_LEDGER·CardsExtended.shared), `docs/STORYBOOK_INFORMATION_ARCHITECTURE.md`.
- 원장의 판정을 무조건 신뢰하지 말 것 — `.fig` 대조로 이미 split 3건이 뒤집혔다.
- 이름/역할을 왜곡해 `missingGuidance` 플래그를 억지로 지우지 말 것(status/state 페이지의 `audience-entry-overview`는 정상 아티팩트).
