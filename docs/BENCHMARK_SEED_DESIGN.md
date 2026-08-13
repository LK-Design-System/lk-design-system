# seed-design 벤치마크와 채택 계획

| Field | Value |
| --- | --- |
| Type | Benchmark analysis and adoption roadmap |
| Status | Current |
| Owner | Design system owner |
| Last reviewed | 2026-07-24 |
| Source | [seed-design.io](https://seed-design.io) · [github.com/daangn/seed-design](https://github.com/daangn/seed-design) (2026-07-24 shallow clone 직접 분석) |

당근 seed-design은 이 시스템이 기준선으로 삼는 외부 벤치마크다. 이 문서는 2026-07-24 시점의
정면 비교 결과와, 무엇을 언제 채택할지의 결정을 기록한다. 원칙은 하나다 — **결과물(패키지
구조)이 아니라 원리(소유권 분리)를 가져오고, 도입 시점은 소비자 트리거에 건다.**

아래 비교표의 LDS 쪽 수치(공개 entry·스토리 수 등)는 2026-07-24 스냅샷이다. 현재 수치의
정본은 [`REPOSITORY_INVENTORY.md`](REPOSITORY_INVENTORY.md)이며, 이 문서는 판정과 채택 결정만
소유한다.

## 비교 요약 (2026-07-24)

| 축 | seed-design | LDS | 판정 |
| --- | --- | --- | --- |
| 컴포넌트 폭 | styled 84 + headless 패키지 38 | public entry 179개·named export 182개 (+robotics 별도 저장소) | 대등 |
| 접근성 자동 강제 | CI에 axe 게이트 없음(유닛 테스트 83개) | axe 528스토리 + 타깃 크기 래칫 + play 292개 | LDS 우위 |
| 계약 문서 | 컴포넌트 문서 49 + 패키지별 AGENTS.md | prompt/type/source 179개 + 16섹션 결정 가이드 148개 + API 3자 동기화 강제 | LDS 우위 |
| Foundation 지침 | 15개 탐색 구조와 주제별 editorial guide, 제품 사례 중심 | 15개 모두 공통 10개 판단 섹션 + JSON Schema + 생성 Markdown/Storybook + token/API trace | LDS 우위(coverage·추적성), seed 우위(브랜드 사례) |
| 토큰 파이프라인 | Figma→rootage YAML(IR)→qvism recipe→CSS·Swift·Kotlin 자동 생성 | 손으로 관리하는 CSS + 검증 스크립트 | seed 압승 |
| 아키텍처 계층 | headless(행동)/recipe(외형)/styled(조립) 3층 분리 | 모놀리식(행동+인라인 스타일 결합), 내부 공유 엔진은 존재 | seed 우위 |
| 비주얼 회귀 | Chromatic, 전 스토리, PR마다 | 자체 스크립트 36장면 (스토리 528개 중) | seed 우위 |
| 릴리스 공학 | changesets, codemod, migration-index, CLI(레지스트리 설치), continuous release | rc 수동 관리, 마이그레이션은 CHANGELOG 문구 | seed 압승 |
| 플랫폼 | Web + Lynx 런타임 + iOS/Android 토큰 출력 | Web | seed 압승 |
| AI 소비 표면 | llms.txt/llms-full, 자체 MCP 서버 2종, skills, 패키지별 AGENTS.md | component prompt 계약 + 179-entry registry·component `llms.txt` + 15개 Foundation `llms.txt` bundle + 755행 token reference | LDS 우위(계약 추적), seed 우위(MCP 배포) |
| 실전 검증 | 당근 앱 대규모 사용자에 탑재 | 소비자 없음 (pre-release) | seed 압승 |

seed가 앞선 축은 인프라·다중 플랫폼·제품화 축이다. 컴포넌트와 Foundation 단위 품질·계약
강제는 LDS가 뒤지지 않으며, 특히 접근성 자동 강제와 Foundation source→문서→Storybook→LLM
추적은 seed보다 엄격하다. 반대로 seed의 브랜드 사례는 실사용 제품에서 검증됐고 LDS 예시는
아직 운영 도메인 설계 가설이므로, 이 차이는 코드 정비가 아니라 소비 제품 확보로만 좁혀진다.

## 채택 결정

### 1단계 — 내부 엔진의 계층 승격 (완료, 2026-07-24)

seed의 headless 층에 해당하는 배아가 이미 있다: `components/internal/useMenuKeyboard`,
`components/overlay/anchored-overlay.js`(useLightDismiss·useFloatingPosition),
`components/overlay/dialog-focus.js`, `components/forms/field-shared.js`. 이번 정비에서
HoverCard의 Escape 재오픈을 엔진 한 곳에서 고쳐 Tooltip·Popover가 함께 나은 것이 이 층의
가치 증명이다.

- [x] 이 엔진들에 `.d.ts`와 `.prompt.md` 계약, 전용 테스트를 부여해 내부 구현이 아닌 정식
  계층으로 만든다. — 엔진 5종(useMenuKeyboard, useSubmenuBranch, anchored-overlay,
  dialog-focus, field-shared)에 `.d.ts`·`.prompt.md`를 부여했고, 소비자 없는 Playwright 계약
  하네스 `scripts/check-engine-contracts.mjs`(`npm run check:engine-contracts`)가 roving
  focus·typeahead·entry focus 취소·Escape 래치·초점 트랩·스크롤 잠금·필드 메타데이터 계약을
  검증한다.
- [x] "새 컴포넌트는 포커스·dismiss·roving·필드 메타데이터 로직을 손으로 재구현하지 않고 이
  엔진을 사용한다"를 검사로 강제한다. 아키텍처 규율을 리뷰가 아니라 게이트로 지키는 것이
  이 저장소의 방식이다. — `npm run check:engine-reuse`가 우회 시그니처를 감지하고 기존 위반은
  `docs/references/quality/ENGINE_REUSE_BASELINE.json` 래칫에 잠갔다. 사용 규칙은
  [`COMPONENT_WORKFLOW.md`](COMPONENT_WORKFLOW.md)의 "행동 엔진 사용 규칙" 절이 소유한다.

### 2단계 — 스트랭글러 방식 행동/외형 분리 (상시, 트리거: 파일을 여는 김에)

기존 179개 public component entry의 일괄 재작성은 하지 않는다. 픽셀 감시가 528스토리 중 36장면인 상태의
전면 전환은 검증 불가능한 회귀를 만들고, 2026-07 3라운드 정비로 확보한 검증 가치를 태운다.

- 다른 이유로 컴포넌트를 수정할 때만 행동(훅)과 외형(스타일 모듈)을 분리한다.
- 외형 복제가 이미 발생한 곳을 우선 추출한다. 첫 후보: TreePicker가 복제한 Checkbox 시각
  상수(18px 박스·16px 마크·토큰 세트) — 공유 시각 모듈로 승격해 복제를 제거한다.

### 3단계 — 토큰 IR·recipe 시스템 (트리거 기반, 착수 보류)

rootage(토큰 IR)·qvism(zero-runtime recipe) 상당물은 **두 번째 스킨 또는 두 번째 플랫폼이
생기기 전에는 시작하지 않는다.** 소비자 없는 계층 분리는 비용만 내는 구조다.

- 트리거: robotics 외 제품 프론트엔드가 core를 소비 시작, 라이트·다크 외 테마 변형 요구,
  또는 네이티브 플랫폼 토큰 요구 중 하나가 실현될 때.
- 그 전까지 외형 계약의 단일 원천은 현행 토큰 체계(`tokens/` + `TOKEN_GOVERNANCE.md`)다.

### 병행 채택 (publish 준비와 함께)

- **비주얼 회귀 전 스토리 확대** — 36장면 감시는 이번 정비에서 감시 밖 마크업 변경("픽셀
  동일" 주장)을 측정 없이 신뢰하게 만든 원인이었다. 2026-07-24 스코핑 실측:
  현행 36장면 = 2.2MB(평균 58KB/장), 전 스토리(532장) 확장 시 베이스라인 약 30~50MB가
  저장소에 추가되고 갱신마다 히스토리가 그만큼 자란다(pack 131MB 기준 유의미 — Git LFS 또는
  아티팩트 저장 검토). 캡처 시간은 스토리당 ~2초 × 532 ≈ 18분, a11y 하네스의 `A11Y_SHARD`
  선례로 4분할 시 ~5분. 간헐 흔들림(툴팁 0.005% 사례)이 표면적 13배로 늘므로 재캡처-재대조
  재시도가 필수다. 대안 Chromatic은 저장소 부담 0·리뷰 UI 제공이지만 무료 5천 스냅샷/월로는
  월 ~10회 push가 한계라 유료 단계 진입이 전제고, 내부 DS 화면의 외부 업로드 정책 판단이
  필요하다. **권고: 자체 확장(비용 0, 기존 Playwright 인프라 재사용)을 먼저 하고, Chromatic은
  다중 소비자·PR 리뷰 수요가 생기는 시점에 재평가.** 실행은 저장소 용량 정책(LFS 여부) 결정과
  함께 착수한다.
- **changesets 기반 릴리스 + codemod** — 외부 publish를 여는 시점에 도입. BrandLogo 장식
  기본값 전환, ButtonGroup 기본 라벨 제거 같은 소비자 가시 변경은 codemod 대상이다.
- **AI 소비 표면** — 15개 Foundation의 canonical JSON에서 Markdown·`llms.txt`·755행 token
  reference를 생성하고 `check:foundations`로 drift를 차단했다. Component도 179개 public
  entry의 source·type·prompt·token·Storybook evidence를 canonical registry로 묶고 148개
  Markdown·lazy Storybook guide·component `llms.txt`를 생성해 `check:components`로 drift를
  차단한다. docs MCP 같은 네트워크 배포는 실제 외부 소비자가 생길 때 seed의 docs-mcp
  패턴을 참고한다.

### 병행 채택 2 — 수평 패턴 가이드 (문서 장르의 공백)

seed의 [Loading 패턴 문서](https://seed-design.io/patterns/loading)가 보여주는 장르가 이
저장소에 없다. 컴포넌트별 세로 문서(prompt.md의 사용 기준)는 seed보다 깊지만, **컴포넌트
사이를 중재하는 가로 문서** — "로딩이라는 상황에서 Progress Circle·Bar·Skeleton 중 무엇을,
로딩 시간(1초/4초/10초/1분)에 따라 어떻게 고르고, 시작→진행→완료→실패 단계마다 무엇을
보여주는가" — 는 어느 prompt.md도 소유하지 않는다. 이 장르는 엔지니어만이 아니라
디자이너·PM이 소비하는 결정 가이드다.

- 계획할 패턴 문서(우선순위순): **Loading**(Skeleton·Spinner·ProgressBar·CircularProgress·Dimmer·ResourceState 중재 + 시간 임계 + 단계별 피드백 — v1을 [`LOADING_PATTERN.md`](LOADING_PATTERN.md)로 2026-07-24 작성했고, 디자이너 소비자가 붙으면 Storybook 라이브 렌더 페이지로 승격), **Empty·Error 상태**(EmptyState·
  Banner·Callout·ResourceState), **알림·피드백 선택**(Toast·Snackbar·Notification·Banner·
  Dialog), **폼 검증 흐름**(inline·summary·submit 시점).
- LDS판의 우위 요소를 살린다: 정적 이미지 대신 **Storybook 페이지에서 실제 컴포넌트를
  렌더**하고, 시간 임계는 외부 연구(Nielsen 응답 시간 한계 등)를 인용하며, 시나리오는 당근
  앱 대신 **로보틱스 운영 도메인**(텔레메트리 스트림 진입, 맵 로딩, 명령 제출, 내보내기)
  에서 가져온다. 이미 코드가 강제하는 계약(reduced-motion 정지, ResourceState의 상태 머신, Dimmer의
  aria-busy·inert)은 문서가 코드를 가리키게 한다.
- 흉내 낼 수 없는 것도 기록해 둔다: seed의 시나리오는 실사용 데이터에서 나온 것이다. LDS
  패턴 문서의 시나리오는 소비 제품이 생기기 전까지는 설계 가설이며, 그렇게 표기한다.

### 병행 채택 3 — 컴포넌트 결정 가이드 (완료, 2026-07-24)

seed의 컴포넌트 문서([Action Button](https://seed-design.io/components/action-button),
[Field](https://seed-design.io/components/field),
[Bottom Sheet](https://seed-design.io/components/bottom-sheet),
[Progress Board](https://seed-design.io/components/progress-board))가 가진 디자이너용 장르를
LDS API와 근거 체계에 맞춰 채택했다. 결과는 다음과 같다.

- public component entry 179개·named export 182개를 source·type·prompt·token·Storybook
  evidence와 함께 machine-readable registry로 전수 추적한다.
- 기존 non-Foundation Storybook 페이지 148개에는 purpose/selection, anatomy, properties,
  states, behavior, quantitative rules, responsive, content, accessibility, Do/Don't,
  exceptions, related, examples, token/API, migration, machine reference의 16섹션 가이드를
  첫 `개요` 스토리 앞에 lazy payload로 삽입한다.
- `LDS Core/Components/Overview`는 검색·레이어 필터가 있는 전체 카탈로그를, `Progress Board`는
  Web·Figma·iOS·Android의 **확인된 근거만** 보여 준다. 외부 플랫폼 구현이 없으면 임의로
  완료 상태를 만들지 않는다.
- 정량 규칙은 기존 타입·토큰·prompt·스토리·검사에서 추출하고, 증거가 없으면 숫자를 만들지
  않는다. SEED의 브랜드 이미지·당근 제품 시나리오·우리 API와 맞지 않는 수치 규칙은 복사하지
  않았다.
- 대표 상세 가이드는 SEED 장문 editorial category와 비교한 visual verdict 92/100을 통과했고,
  1440px·390px 모두 page-level horizontal overflow가 없다.

따라서 이전의 “prompt.md는 깊지만 디자이너가 직접 소비할 페이지가 없다”는 공백은 현재
닫혔다. 남은 차이는 문서 구조가 아니라 실제 제품 사례와 다중 플랫폼 구현의 부재다.

### seed 문서 재사용 정책

seed 저장소는 Apache-2.0이지만 NOTICE가 브랜드 리소스(당근마켓·그 제품으로 식별되는 모든
요소)를 상표 자산으로 비상업 용도에 한정하므로, 문서 재사용은 다음 규칙을 따른다.

- **자유 차용**: 문서 뼈대(anatomy → properties → guidelines → spec 구조)와 커버리지
  열거(로딩 use case 분류 등). 구조와 아이디어는 저작권 대상이 아니다.
- **원전 인용**: 시간 임계 같은 보편 지식은 seed의 소화물이 아니라 1차 출처(Nielsen 응답
  시간 연구 등)를 인용한다.
- **금지**: 이미지 일체(당근 앱 화면·Figma 산출물 — 상표 자산), 당근 제품 시나리오, 그리고
  우리 API와 맞지 않는 정량 규칙의 이식. 예시는 우리 Storybook 라이브 렌더로 대체한다.
- **조건부**: 문장을 그대로 옮기는 경우에만 Apache-2.0 고지(라이선스 동봉·저작권 고지
  유지·변경 명시)를 해당 문서에 포함한다.

## 채택하지 않는 것

- **Bun·Biome·bunchee 등 도구 체계 전환** — 도구는 격차의 원인이 아니다.
- **headless의 별도 패키지 분리 배포** — 소비자가 생기기 전에는 계층은 디렉터리·계약
  수준으로 충분하다.
- **CLI 레지스트리 배포(shadcn 방식)** — 소비 모델이 다르다. 이 시스템은 패키지 소비가
  전제다.
