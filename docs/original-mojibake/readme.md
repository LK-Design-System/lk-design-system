# LK ROBOTICS — 디자인 시스템

**LK ROBOTICS Inc. (엘케이로보틱스)** — 한국의 AI·로보틱스 기업 — 을 위한 디자인
시스템입니다. 브랜드를 재사용 가능한 **파운데이션·토큰·React 컴포넌트**로 패키징해,
디자인 에이전트가 브랜드에 맞는 인터페이스·슬라이드·에셋을 만들 수 있게 합니다.
카피는 **이중 언어(KR / EN)**, 한국어 우선입니다.

> **이 문서의 역할** — 브랜드 진입점(개요·보이스·파운데이션 요약·인덱스)입니다.
> 값·스와치·스케일의 **단일 소스**는 Design System 탭의 파운데이션 카드와
> `tokens/*.css`이고, 커버리지·이름 근거는 `COVERAGE.md`, 채택·의사결정은
> `LK-DS-Adoption-Guide.html`에 있습니다(아래 [문서](#문서--추가-근거) 참고).

---

## 폰트

LK는 모든 KR/EN 텍스트에 **Pretendard**를 씁니다 — 한글과 라틴의 조화가 뛰어난
오픈소스(SIL OFL 1.1) 네오그로테스크입니다. 바이너리는 **로컬에 포함**돼 있어
(`assets/fonts/`, woff2, Pretendard 1.3.9, 굵기 400/500/600/700/800) 시스템은
**완전히 독립적·오프라인 — CDN 의존성이 없습니다**. 로컬 `@font-face` 규칙으로
**`Pretendard JP`** 패밀리명 아래 선언돼(`tokens/fonts.css`) 모든 토큰과 컴포넌트가
같은 패밀리로 해석됩니다. 대체 폰트가 아니라 실제 브랜드 폰트입니다. 7단계 타입
**스케일**(`.type-*`)은 `typography.css`에 있으며, `--font-brand`(디스플레이 훅)도
Pretendard로 해석됩니다.

---

## 콘텐츠 원칙 · CONTENT FUNDAMENTALS

LK의 글쓰기 방식:

- **이중 언어, 한국어 우선.** 모든 문자열은 한국어 + 영어로 제공하며 한국어가
  기본입니다. 한국어는 항상 `word-break: keep-all`로 설정해 단어 중간이 아니라 단어
  사이에서 줄바꿈합니다.
- **보이스:** 차분하고 정확하며 엔지니어링 중심. 로봇/현장이 주어이고, 카피는 제품이
  현장에서 *무엇을 하는지* 서술합니다. 과장하거나 장난스럽지 않게, 담백하게 말합니다
  ("…현장 업무를 더 안전하고 효율적으로 바꾸는 로봇 기술 기업입니다").
- **헤드라인:** 짧고 성과 중심, 문장 케이스. KR: *"현장을 지키는 자율주행 AI
  로봇 플랫폼"*, *"주요 제품"*. EN도 문장 케이스로 대응: *"Autonomous AI robots
  that protect the field"*.
- **이브로우 / 오버라인:** 아주 작은 **대문자**, 자간을 넓혀 **기본은 뮤트 그레이**
  (브랜드 시그널도 사용 가능) — 한국어 페이지에서도 영어 라벨을 쓰는 경우가 많습니다
  (`AI ROBOT PLATFORM`, `PRODUCTS`, `KEY CAPABILITIES`).
- **숫자**는 좁은 맥락에서 앞자리 0을 채우고(`01`, `02`) tabular 형식을 씁니다.
- **CTA:** 명령형·짧게 — *"제품 보기"*, *"자세히 보기"*, *"도입 문의"* — 끝에
  `→`를 자주 붙입니다.
- **기능 리스트(capability list)**가 핵심 콘텐츠 단위입니다: 짧은 요약 한 줄 +
  체크 표시된 키워드 문구 그리드(핵심 기능).
- **이모지 없음. 느낌표 과장 없음.** 톤은 계기(instrument) 등급으로 안심을 줍니다.
  케이싱: 제목/버튼은 문장 케이스, 대문자는 이브로우/태그에만.

---

## 비주얼 파운데이션 · VISUAL FOUNDATIONS

> 전체 스펙(값·스와치·스케일)은 Design System 탭의 **`1 파운데이션 ·` 카드**와
> `tokens/*.css`가 단일 소스입니다. 아래는 요약입니다.

- **팔레트.** 브랜드 **네이비 `#0E1329`**(모든 본문 잉크 + 다크 서피스). 쿨 뉴트럴
  라이트 서피스 — 페이지 `#FFFFFF` · 미스트 `#F7F7F8` · 밴드 `#F4F4F5`, 헤어라인
  `#E1E2E4`, 뮤트 텍스트 `#70737C`. 인터랙티브 `primary` = **LK 애저 `#0067A8`**
  (솔리드 CTA), `secondary` = **그래파이트 `#2C3547`**. 시스템을 밝히는 **단 하나의
  시그널** = **스틸-애저 `#4E7CA8`**(이브로우·링크·활성·아이콘·감지 신호·숫자).
  상태색은 의도적으로 차분(positive `#4F765D` · cautionary `#C29A52` · danger
  `#CF6360`). 분류용 멀티휴 강조는 `--accent-*`.
- **타입.** **Pretendard JP** 단일 페이스(제목 Bold/SemiBold · 본문 Medium/Regular).
  7단계 스케일 60/48/36/32/24(제목) → 19/17/15(본문) → 13/12(캡션), 제목 음수 트래킹 ·
  본문 약한 양수 트래킹. 이브로우 13px·700·+1.8 대문자, 큰 숫자 tabular.
- **레이아웃.** 브레이크포인트 xs 0 · sm 768 · md 992 · lg 1200 · xl 1600. 콘텐츠
  컬럼 **1100**(→ xl **1440**), **20px** 여백, **12열** 그리드(20px 거터), 4px 갭
  스케일. `Container · Columns/Col · Split · Section` + `Stack · Cluster · Grid`.
- **서피스 & 반경.** 카드 화이트 · **16–18px** · `#E1E2E4` 헤어라인 및/또는 부드러운
  네이비 틴트 그림자(**진한 검정 금지**). 반경 12(컨트롤) · 16(입력·카드) · 18(제품
  타일) · 24(시트) · 32(모달) · pill. 배경은 플랫 필(paper/mist/band) 또는 풀블리드
  다크 네이비 — 요란한 그라디언트 없음.
- **모션.** 표준 이징 `cubic-bezier(0.4,0,0.2,1)`, 지속 **120/200/320ms**, 프레스
  `scale(0.97)`. 절제된 프로스티드 네이비 글래스(`blur(14px)`)만. 모든 것은
  `prefers-reduced-motion` 준수(최종 표시 상태).
- **이미지.** 실제 현장(시설·전시·방산/산업)의 **쿨톤** 로봇 사진, 카드는 네이비 하단
  그라디언트로 비네트. 따뜻하거나 스톡처럼 밝지 않게.
- **테마 — 라이트 & 다크.** 동일한 아이덴티티가 **시맨틱 토큰**(`--surface-*` ·
  `--text-*`/`--label-*` · `--border-*`/`--fill-*`/`--line-*` · `--accent-text`)으로
  컴포넌트별 작업 없이 전환됩니다. `<html>` 또는 **임의의 하위 트리**에
  `data-theme="dark|light|auto"`로 제어(기본 라이트, OS 무관; `auto`만 OS 추종).
  소비 측은 **`ThemeToggle`** 컴포넌트나 `data-theme` 속성으로 전환합니다.

---

## 아이코노그래피 · ICONOGRAPHY

**얇은 단일 굵기 라인 아이콘** — **Lucide** 지오메트리(1.8–2px 스트로크, 라운드 캡,
`currentColor`, 단색). 맥락에 따라 잉크·시그널 잉크·뮤트 그레이 톤; 기능 타일은 10%
시안 타일 위 시그널 잉크 글리프. 상태는 글리프가 아니라 작은 **컬러 점**(시그널 / 레드).
**이모지·유니코드 기호 아이콘 없음.** `Icon` 컴포넌트가 큐레이션된 93개 글리프 라인
세트(`ICON_NAMES`, robot·waypoint·lidar·battery·joystick 등 로보틱스 포함)를 제공하며,
`1 파운데이션 · 아이콘` 카드가 스펙시멘입니다.

> ⚠ **대체 안내:** 원본 벡터 지오메트리를 추출할 수 없어 이 시스템은 **Lucide**를
> 사용합니다(브랜드 스트로크 굵기·느낌과 일치). 라이선스된 원본이 확보되면 교체하세요.

---

## 인덱스 — 이 폴더의 구성

| 경로 | 설명 |
|------|------|
| `styles.css` | 전역 진입점 — 토큰 `@import` 매니페스트(소비 측이 이 파일을 링크) |
| `tokens/` | `fonts · colors · typography · spacing · grid · effects · base` — CSS 커스텀 프로퍼티(값의 단일 소스) |
| `guidelines/` | 파운데이션 스펙시멘 카드(색상·타이포·스페이싱·브랜드·아이콘) — Design System 탭 `1 파운데이션 ·` |
| `components/` | 재사용 React 프리미티브 — 각각 `.jsx` + `.d.ts` + `.prompt.md` + 데모 카드 |
| `assets/` | 브랜드 로고·파비콘, Pretendard woff2(오프라인), 제품/산업/기술 샘플 사진 |
| `readme.md` · `SKILL.md` | 이 가이드 · 에이전트 스킬 매니페스트 |

### 컴포넌트 라이브러리

번들 네임스페이스 **`window.LKRoboticsDesignSystem_4f14ff`**로 사용합니다.

| 그룹 | 컴포넌트 |
|-------|-----------|
| `icon/` | `Icon` (93개 글리프 라인 세트 · `ICON_NAMES` · 로보틱스 글리프 포함) |
| `brand/` | `Lockup` (LK 로고 mark / stacked / inline), `BrandLogo` (풀컬러 플랫폼 마크) |
| `buttons/` | `Button` (primary/secondary/signal/dark/flat/ghost/on-dark), `IconButton`, `TextButton`, `Fab`, `ButtonGroup`, `SplitButton`, `Link`, `CopyButton`, `SocialButton` (소셜 로그인 — google/apple/facebook × center/left) |
| `forms/` | `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `RadioGroup`, `CheckboxGroup`, `FormField`, `SearchField`, `AutoComplete`, `Combobox`, `DatePicker`, `TimePicker`, `Slider`, `RangeSlider`, `NumberField`, `PinInput`, `PasswordInput`, `InputGroup`, `TagInput`, `ColorSwatch`, `FileUpload` |
| `selection/` | `Switch`, `SegmentedControl`, `ThemeToggle`, `FilterChip`, `MultiSelectChip`, `Stepper`, `ToggleButton`, `ChoiceCard` |
| `feedback/` | `Tag`, `Chip`, `Badge`, `Avatar`, `AvatarGroup`, `PushBadge`, `Rating`, `Notification` |
| `content/` | `Divider`, `Tooltip`, `Accordion`, `Collapsible`, `ContentBadge`, `StatusBadge`, `Bubble`, `ListCell`, `Bookmark`, `Thumbnail`, `Timeline`, `Blockquote`, `Code`, `Kbd`, `Overline`, `SourceTag`, `StepList` |
| `status/` | `Spinner`, `ProgressBar`, `CircularProgress`, `Meter`, `Skeleton`, `Banner`, `Callout`, `EmptyState` |
| `overlay/` | `Alert`, `Modal`, `Drawer`, `Sheet`, `Toast`, `ToastStack`, `DropdownMenu`, `Popover`, `HoverCard`, `CommandPalette`, `Lightbox`, `Dimmer` |
| `navigation/` | `Tabs`, `Pagination`, `Breadcrumb`, `BottomNav`, `NavRail`, `SideNav`, `Menubar`, `Anchor`, `Steps`, `Wizard`, `Toolbar`, `TopBar`, `UserMenu`, `FloorSelector`, `Footer` |
| `cards/` | `Card`, `FeatureCard`, `MetricCard`, `Stat`, `ChecklistItem`, `ProductCard`, `SpecRow`, `NewsCard` |
| `data/` | `Table`, `DataGrid`, `DescriptionList`, `Tree`, `Carousel`, `Sparkline`, `BarChart`, `DonutChart`, `Calendar` |
| `layout/` | `Container`, `Columns`, `Col`, `Split`, `Section`, `Stack`, `Cluster`, `Grid`, `AspectRatio`, `Center`, `Spacer`, `ScrollArea`, `VisuallyHidden` |
| `robotics/` | `RobotStatusCard`, `EquipmentStatusCard`, `ConnectionBadge`, `Joystick`, `TopicTree` — 로봇 관제·텔레옵 도메인 프리미티브 |
| `viz/` | `Map2DCanvas`, `Scene3DFrame`, `VideoStreamTile`, `TelemetryGauge`, `ViewerToolbar`, `ViewerToolbarButton` — 맵·2D/3D 뷰어 크롬 셸 |
| `editor/` | `CanvasEditorShell`, `EditorToolbar`, `HistoryToolbar` — 캔버스 에디터 셸·툴바 |

---

## 의도된 추가 · Intentional additions

LK는 Figma 킷의 1:1 미러가 아니라 **큐레이션 파생본**입니다 — 킷의 슬래시 베리언트
경로(`Button/Round Button/Primary`, `_Badge/Status` 등)를 깔끔한 **PascalCase 컴포넌트
하나**로 통합하고 사이즈·상태를 prop으로 다루며, 실제 프론트엔드 갭 분석
(`lk_web_viz` · `lk_robotics_control_full`)에서 도출한 도메인 프리미티브를 추가합니다.
아래가 **킷 어휘 밖 이름의 전체 목록**이며, 전부 의도된 추가입니다 — 킷 어휘로
rename하면 공개 API가 깨집니다. 자동 체크의 *"named after nothing in the kit"* 플래그는
이 큐레이션 구조상 **상시 표시가 정상**이며(억제 메커니즘 없음 — 문서로 확인하는
방식), 이 섹션과 `COVERAGE.md`가 그 확인입니다.

- **브랜드 & 상수** — 킷에 로고 컴포넌트가 없어 자체 제작한 락업과 이름 상수:
  `BrandLogo`, `Lockup`, `BRAND_LOGO_NAMES`, `ICON_NAMES`
- **킷 베리언트 경로 개명** — 킷 패밀리를 PascalCase 하나로 재명명:
  `IconButton`(← `Button/Icon/Normal`), `TextButton`(← `Button/Text`),
  `StatusBadge`(← `_Badge/Status`), `CircularProgress`(← `Circular/Circular`)
- **버튼 확장** — CTA 조합·복사·플로팅·분할 액션: `ButtonGroup`, `CopyButton`,
  `Fab`, `Link`, `SplitButton` · 소셜 로그인 킷(`Continue with Google/Apple/Facebook`
  × `Centre/Left Aligned` 6심볼)을 통합한 `SocialButton`(provider × align × tone —
  지오메트리·타이포는 LK 컨트롤 문법, 기본 outline은 DS 네이티브, 킷의 플랫폼
  원색 필은 `tone="brand"` 옵션; 마크는 `BrandLogo` 재사용)
- **폼** — 킷이 정의하지 않는 입력 전반(설정·등록·문의 화면 커버): `Input`,
  `Textarea`, `Select`, `Radio`, `RadioGroup`, `CheckboxGroup`, `FormField`,
  `SearchField`, `Combobox`, `DatePicker`, `TimePicker`, `Slider`, `RangeSlider`,
  `NumberField`, `PinInput`, `PasswordInput`, `InputGroup`, `TagInput`,
  `ColorSwatch`, `FileUpload`
- **선택 컨트롤** — 토글·세그먼트·칩 선택: `Switch`, `SegmentedControl`,
  `ThemeToggle`, `FilterChip`, `MultiSelectChip`, `Stepper`, `ToggleButton`,
  `ChoiceCard`
- **피드백** — 태그·평점·알림: `Tag`, `AvatarGroup`, `Rating`, `Notification`
- **콘텐츠** — 문서·상세 화면의 정보 단위: `Divider`, `Tooltip`, `Accordion`,
  `Collapsible`, `Bubble`, `Bookmark`, `Timeline`, `Blockquote`, `Code`, `Kbd`,
  `Overline`, `SourceTag`, `StepList`
- **상태** — 로딩·진행·빈 상태·공지: `Spinner`, `ProgressBar`, `Meter`,
  `Skeleton`, `Banner`, `Callout`, `EmptyState`
- **오버레이** — 다이얼로그·시트·팝오버 계층: `Alert`, `Modal`, `Drawer`, `Sheet`,
  `Toast`, `ToastStack`, `DropdownMenu`, `Popover`, `HoverCard`, `CommandPalette`,
  `Lightbox`, `Dimmer`
- **내비게이션** — 앱·사이트 골격: `Tabs`, `Breadcrumb`, `BottomNav`, `NavRail`,
  `SideNav`, `Menubar`, `Anchor`, `Steps`, `Wizard`, `Toolbar`, `TopBar`,
  `FloorSelector`, `UserMenu`, `Footer`
- **카드** — 마케팅·지표·제품 표면: `Card`, `FeatureCard`, `MetricCard`, `Stat`,
  `ChecklistItem`, `ProductCard`, `SpecRow`, `NewsCard`
- **데이터** — 표·차트·달력: `Table`, `DataGrid`, `DescriptionList`, `Tree`,
  `Carousel`, `Sparkline`, `BarChart`, `DonutChart`, `Calendar`
- **레이아웃** — 그리드 시스템 프리미티브: `Container`, `Columns`, `Col`, `Split`,
  `Section`, `Stack`, `Cluster`, `Grid`, `AspectRatio`, `Center`, `Spacer`,
  `ScrollArea`, `VisuallyHidden`
- **로보틱스(관제·텔레옵)** — `lk_web_viz` 갭 분석 도출: `RobotStatusCard`,
  `EquipmentStatusCard`, `ConnectionBadge`, `Joystick`, `TopicTree`
- **뷰어 크롬** — 맵·2D/3D 뷰어 셸(실제 렌더는 앱 몫): `Map2DCanvas`,
  `Scene3DFrame`, `VideoStreamTile`, `TelemetryGauge`, `ViewerToolbar`,
  `ViewerToolbarButton`
- **에디터 셸** — 캔버스 에디터 크롬·툴바: `CanvasEditorShell`, `EditorToolbar`,
  `HistoryToolbar`

무거운 렌더(three/@react-three/fiber · konva · rerun)는 소비 앱 몫으로 두고 DS는
셸·크롬·툴을 표준화합니다.

→ 전체 패밀리→컴포넌트 매핑·제외 카테고리·이름 근거는 **`COVERAGE.md`**, 채택 경로·토큰
단일화·남은 결정(배포·도메인 경계·상태색·아이콘)은 **`LK-DS-Adoption-Guide.html`**.

---

## 문서 · 추가 근거

| 문서 | 내용 |
|------|------|
| `COVERAGE.md` | 킷 커버리지 · **의도된 추가/이름 근거** · 의도적 제외 카테고리 · 컴포넌트 매핑. 자동 "named after nothing" 플래그가 설계상 뜨는 이유. |
| `LK-DS-Adoption-Guide.html` | 실제 앱 채택 경로 · 토큰/테마 단일화 · `colors.ts` 색 매핑 · 마이그레이션 순서 · **남은 결정 사항**. |
| `LKWebViz-Gap-Analysis.html` · `LKRoboticsControlFull-Gap-Analysis.html` | 실제 프론트엔드 대비 커버리지 갭 분석 — 로보틱스 확장(`robotics/viz/editor`)의 출처. |
| `LK-DS-Completeness-Audit.html` · `Coverage-Audit.html` | 시스템 완성도·커버리지 진단. |

---

## 템플릿 · Templates

소비 프로젝트가 복사해 시작할 수 있는 **시작 폴더** — `templates/<slug>/`. 각 템플릿은 `<Slug>.dc.html`이 엔트리(Design Component)이고, 사이드로 `ds-base.js`(이 DS의 스타일시트 + `_ds_bundle.js` 로드)를 물립니다. Design System 탭 **맨 아래 `4 템플릿 · 시작 폴더` 그룹**에서 미리볼 수 있습니다(카드 소스는 `templates-cards/`). 시작하려면 폴더를 통째로 복사하세요.

| 템플릿 | 설명 |
| --- | --- |
| **마스터-디테일** (`templates/master-detail/`) | 검색·상태·위치 필터 + 타입 그룹 리스트 + 스티키 상세(상태 조건·텔레메트리·이벤트). 관제·목록·로그 등 어느 도메인에나. `Select`·`EquipmentStatusCard` 등 DS 컴포넌트로 구성. |
| **리스트-테이블** (`templates/list-table/`) | 검색·필터(`SearchField`·`Select`) + 데이터 표(`Table`) + 페이지네이션. 로그·목록·이력 화면. |
| **폼-설정** (`templates/form-settings/`) | 섹션별 폼 필드(`Input`·`Select`·`RadioGroup`·`Switch`·`Textarea`) + 저장/취소 액션. 설정·등록·문의 화면. |
| **로그인** (`templates/login/`) | 이메일+비밀번호 로그인(`Input`·`PasswordInput`·`Checkbox`·`Button`·`Banner`·`Lockup` 마크) + 소셜 로그인(`SocialButton`). 중앙 카드 레이아웃, 프로바이더·에러 상태는 tweak으로 켜고 끔. 앱 진입 화면. |
