# LK ROBOTICS Design System Handoff

기준일: 2026-07-06
작업 레포: `/home/jinhyuk2me/lk_ws/shared/lk-design-system-core`
원격: `https://github.com/LK-ROBOTICS/lk-design-system-core.git`
브랜치: `main`

## 현재 상태

- 원본 디자인시스템 기준: `guidelines/*.html` 20개, `components/**/*.card.html` 83개, `templates-cards/*.html` 4개.
- React/Storybook 이관 기준: package exports 145개, 원본 component card 83개 모두 React export 및 primary React story와 매핑됩니다.
- 최신 visual diff는 83/83쌍을 전수 비교했고 평균 mismatch 1.08%, 최대 mismatch 4.90%입니다.
- `npm run check:visual-diff`는 strict gate를 포함합니다.
  - 이미지 크기 mismatch 0개 필수
  - max mismatch ratio ≤ `0.05`
  - mean mismatch ratio ≤ `0.015`
- 산출물은 `visual-artifacts/inventory/` 아래에 생성되며 git에는 포함하지 않습니다.

## 이번 세션 완료 작업

### 원본/React visual diff 리스크 제거

- legacy preview 캡처에서 Storybook-only chrome을 제거했습니다.
  - `#__om-theme-toggle` 숨김
  - legacy iframe border/radius 제거
- legacy iframe을 스크롤 후 정확한 원본 viewport 크기로 crop하여 1px/부분 캡처 오차를 제거했습니다.
- React primary 캡처에서 `[data-visual-crop-root]`가 있으면 해당 root를 우선 캡처하도록 보정했습니다.
- `Scene3DFrame` 원본 preview의 `Math.random()` point cloud를 deterministic seed로 고정했습니다.
- original-to-primary diff에 strict release gate를 추가했습니다.
- story matching은 같은 `story-block` 안에서 더 많은 mapped exports를 커버하는 story를 우선하도록 보정했습니다.

### targeted parity story 추가/보강

원본 card HTML과 같은 viewport/배경/padding/초기 상태를 갖는 전용 Storybook story를 다수 추가했습니다. 대표 항목:

- Forms: `AutoComplete`, `DatePicker`, `SearchField`, `Slider`
- Layout: `Cluster`, `Columns/Col`, `Grid`, `Section`, `Split`
- Navigation: `SideNav/UserMenu`, `BottomNav`, `TopBar`, `Footer`, `Tabs`, `Steps`, `Breadcrumb`, `Pagination`
- Content: `Thumbnail`, `SourceTag`, `Tooltip/Bubble/Bookmark/Divider`, `ListCell/Accordion`
- Cards: `ProductCard`, `NewsCard`, `SpecRow`, `Card`, `ChecklistItem`, `Stat`, `FeatureCard`
- Buttons: `Button · IconButton · SocialButton`
- Brand/Data/Feedback: `BrandLogo`, `Lockup/Overline`, `Calendar`, `Table`, `AvatarGroup`, `Avatar`, `Badge`, `Chip`, `Tag`, `PushBadge`, `Rating`
- Overlay: `DropdownMenu`, `Toast`, `Lightbox`, `Sheet`, `Dimmer`, `Popover`, `Alert`, `Alert/Toast`, `HoverCard`, `CommandPalette`, `ToastStack`, `Modal`
- Selection/Status: `ChoiceCard`, `FilterChip`, `MultiSelectChip`, `ThemeToggle`, `SegmentedControl`, `ToggleButton`, `Switch`, `Stepper`, `ProgressBar`, `EmptyState`, `Skeleton`, `Spinner`, `CircularProgress`
- Robotics/Viz: `ConnectionBadge`, `EquipmentStatusCard`, `RobotStatusCard`, `Joystick`, `TopicTree`, `VideoStreamTile`, `Scene3DFrame`, `TelemetryGauge`, `Map2DCanvas`, `ViewerToolbar`

### 운영 품질 마감

- stale Storybook 보고 문구를 제거하고, 감사/이관 매핑은 Storybook 밖의 `stories/Audit.data.jsx` 숨김 데이터로 고정했습니다.
- `npm run check:type-surface`를 추가해 145개 React 구현과 145개 `.d.ts` 계약, 149개 public export, `any` 누출 0개를 검증합니다.
- `npm run check:publish-policy`를 추가해 현재 `private: true` 내부 Git 소비 정책과 향후 GitHub Packages 전환 의도를 문서와 package metadata 양쪽에서 검증합니다.
- `npm run check:consumer`를 추가해 `@lk-robotics/design-system-core` package-name import, `styles.css` export, Vite production build, 실제 운영형 조합 화면 렌더를 확인합니다.
- `npm run check:a11y`를 추가해 Storybook 구현 story 전체의 접근성 이름, 명시적 button type, console/page error를 검사합니다.
- `npm run check:storybook-public`을 추가해 public sidebar에 `card parity`/중복/`상세` 분기 story가 다시 노출되지 않도록 차단합니다.
- `npm run check:ops-release`를 추가해 일반 check, audit, legacy render, visual diff를 한 번에 실행할 수 있게 했습니다.

### 문서/상태 기록

- `docs/VISUAL_PARITY_LEDGER.md`에 최신 visual diff 수치와 strict gate 정책을 반영했습니다.
- 보고/보정표와 전수조사 UI는 Storybook에서 분리하고 `docs/` 문서와 `visual-artifacts/` 리포트로만 유지합니다. Public sidebar는 50개 story만 노출하고 82개 visual parity story는 `!dev` 태그로 숨깁니다.
- `.omx/state/visual-parity/ralph-progress.json`에 visual verdict를 저장합니다.

## 최신 검증 결과

마지막 통과 명령:

- `npm run check:type-surface`
- `npm run check:publish-policy`
- `npm run check:consumer`
- `npm run check:a11y`
- `npm run check:storybook-public`
- `npm run check:map`
- `npm run check:visual-diff`

마지막 visual diff 수치:

- legacy component cards: `83`
- primary React cards: `83`
- React stories: `125`
- compared pairs: `83`
- size mismatches: `0`
- mean mismatch ratio: `0.010758524112121904`
- max mismatch ratio: `0.04897569444444445`
- mean gate: `0.015`
- max gate: `0.05`

현재 top mismatch도 모두 5% 미만입니다.

1. `components/cards/cards-stat.card.html` — `0.04897569444444445`
2. `components/buttons/buttons.card.html` — `0.04811904761904762`
3. `components/viz/viz-map2d.card.html` — `0.046168981481481484`
4. `components/overlay/overlay-alert.card.html` — `0.0450375`
5. `components/navigation/navigation-pagination.card.html` — `0.03939393939393939`
6. `components/overlay/overlay-sheet.card.html` — `0.03578557312252965`
7. `components/overlay/overlay-modal.card.html` — `0.0353015873015873`
8. `components/overlay/overlay-commandpalette.card.html` — `0.033807854137447406`

## 다음 작업 권장 순서

1. `npm run check:visual-diff`의 strict gate를 유지해 원본 대비 시각 drift를 차단합니다.
2. 새 원본 card HTML이 추가되면 반드시 Audit row, React export, dedicated parity story를 함께 추가합니다.
3. pixel-perfect 수준이 필요해지면 Storybook 밖의 `visual-artifacts/inventory/diffs/report.html`에서 현재 3~5%대 항목을 확인해 안티앨리어싱/그림자/portal 위치 차이를 추가 보정합니다.
4. 전체 release-like 검증은 `npm run check:ops-release` + `git diff --check` 순서로 실행합니다.

## 운영 메모

- Storybook 로컬 서버: `npm run storybook` (기본 URL `http://127.0.0.1:6006`)
- 시각 검증: `npm run check:visual-diff`
- 운영 품질 종합 검증: `npm run check:ops-release`
- 산출물:
  - `visual-artifacts/inventory/manifest.json`
  - `visual-artifacts/inventory/review.html`
  - `visual-artifacts/inventory/diffs/manifest.json`
  - `visual-artifacts/inventory/diffs/report.html`
- 브랜드 표기는 `LK Robotics`가 아니라 `LK ROBOTICS`를 사용합니다.
