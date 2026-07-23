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

## 비교 요약 (2026-07-24)

| 축 | seed-design | LDS | 판정 |
| --- | --- | --- | --- |
| 컴포넌트 폭 | styled 84 + headless 패키지 38 | 173 (+robotics 별도 저장소) | 대등 |
| 접근성 자동 강제 | CI에 axe 게이트 없음(유닛 테스트 83개) | axe 480스토리 + 타깃 크기 래칫 + play 261개 | LDS 우위 |
| 계약 문서 | 컴포넌트 문서 49 + 패키지별 AGENTS.md | prompt.md 173개(외부 근거 인용) + API 3자 동기화 강제 | LDS 우위 |
| 토큰 파이프라인 | Figma→rootage YAML(IR)→qvism recipe→CSS·Swift·Kotlin 자동 생성 | 손으로 관리하는 CSS + 검증 스크립트 | seed 압승 |
| 아키텍처 계층 | headless(행동)/recipe(외형)/styled(조립) 3층 분리 | 모놀리식(행동+인라인 스타일 결합), 내부 공유 엔진은 존재 | seed 우위 |
| 비주얼 회귀 | Chromatic, 전 스토리, PR마다 | 자체 스크립트 36장면 (스토리 480개 중) | seed 우위 |
| 릴리스 공학 | changesets, codemod, migration-index, CLI(레지스트리 설치), continuous release | rc 수동 관리, 마이그레이션은 CHANGELOG 문구 | seed 압승 |
| 플랫폼 | Web + Lynx 런타임 + iOS/Android 토큰 출력 | Web | seed 압승 |
| AI 소비 표면 | llms.txt/llms-full, 자체 MCP 서버 2종, skills, 패키지별 AGENTS.md | prompt.md 계약(깊이는 우위), 배포 표면 없음 | 상호 보완 |
| 실전 검증 | 당근 앱 대규모 사용자에 탑재 | 소비자 없음 (pre-release) | seed 압승 |

seed가 앞선 축은 전부 인프라·제품화 축이다. 컴포넌트 단위 품질·계약 강제는 LDS가 뒤지지
않으며, 특히 접근성 자동 강제는 seed에 없는 체계다. 격차의 본질은 "계약을 두들기는 소비자의
존재"이고, 이는 코드 정비가 아니라 소비 제품 확보로만 좁혀진다.

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

기존 173개 컴포넌트의 일괄 재작성은 하지 않는다. 픽셀 감시가 480스토리 중 36장면인 상태의
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
  현행 36장면 = 2.2MB(평균 58KB/장), 전 스토리(480장) 확장 시 베이스라인 약 30~50MB가
  저장소에 추가되고 갱신마다 히스토리가 그만큼 자란다(pack 131MB 기준 유의미 — Git LFS 또는
  아티팩트 저장 검토). 캡처 시간은 스토리당 ~2초 × 480 ≈ 16분, a11y 하네스의 `A11Y_SHARD`
  선례로 4분할 시 ~5분. 간헐 흔들림(툴팁 0.005% 사례)이 표면적 13배로 늘므로 재캡처-재대조
  재시도가 필수다. 대안 Chromatic은 저장소 부담 0·리뷰 UI 제공이지만 무료 5천 스냅샷/월로는
  월 ~10회 push가 한계라 유료 단계 진입이 전제고, 내부 DS 화면의 외부 업로드 정책 판단이
  필요하다. **권고: 자체 확장(비용 0, 기존 Playwright 인프라 재사용)을 먼저 하고, Chromatic은
  다중 소비자·PR 리뷰 수요가 생기는 시점에 재평가.** 실행은 저장소 용량 정책(LFS 여부) 결정과
  함께 착수한다.
- **changesets 기반 릴리스 + codemod** — 외부 publish를 여는 시점에 도입. BrandLogo 장식
  기본값 전환, ButtonGroup 기본 라벨 제거 같은 소비자 가시 변경은 codemod 대상이다.
- **AI 소비 표면** — prompt.md 계약을 llms.txt 형태로 노출하는 것은 저비용이며, seed의
  docs-mcp 패턴을 참고한다.

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

같은 격차의 컴포넌트판도 있다. seed의 컴포넌트 문서([Menu Sheet](https://seed-design.io/components/menu-sheet)
등)는 **디자이너 독자를 위한 시각 가이드**다: 부위 이름을 붙인 anatomy 다이어그램, Do/Don't
시각 반례, 정량 구성 규칙("그룹은 아이템 3개 이상부터, 최대 3그룹, 한 그룹 최소 2개, 스크롤
금지"), Figma 속성 패널과의 연결. LDS의 prompt.md는 같은 컴포넌트에 대해 행동·접근성 계약이
더 깊지만 독자가 엔지니어·AI뿐이다. 디자이너가 소비자로 붙는 시점에 컴포넌트 디자인
가이드라인 장르(anatomy·Do/Don't·정량 규칙)를 추가한다. 정량 규칙은 디자인 리뷰에서 반복
지적된 것을 응고시키는 방식으로 축적하며, 리뷰 이력이 없는 동안 임의로 숫자를 지어내지
않는다.

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
