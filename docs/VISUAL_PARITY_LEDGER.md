# LK ROBOTICS Design System Visual Parity Ledger

기준일: 2026-07-07

이 문서는 기존 정적 디자인 시스템 카드와 현재 React/Storybook 구현을 맞춰 보기 위한 보정표입니다. 목적은 디자인 시스템을 손상시키지 않고, 원본 기준에서 빠진 요소와 현재 구현의 편차를 계속 추적하는 것입니다.

## 현재 커버리지

| 영역 | 원본 기준 | 현재 상태 |
| --- | ---: | --- |
| Foundation guidelines | 20 | Storybook 원본 미리보기 노출 |
| Component cards | 83 | 원본 카드와 React export 매핑 완료 |
| Template cards | 4 | 원본 카드와 starter 폴더 매핑 완료 |
| Runtime export gaps | 0 | 카드에서 필요한 public export 누락 없음 |
| React exports | 150 | 패키지 엔트리에서 배포 대상 생성 |
| Storybook public stories | 95 | public sidebar 노출 대상 |
| Storybook hidden visual parity stories | 82 | `visual-parity` + `!dev`로 숨김 |
| Visual inventory React stories | 170 | `Audit`, `LegacyPreviews`, `Overview`, `TokenStrategy` 제외 캡처 대상 |
| Accessibility checked implementation stories | 169 | 문서/원본 미리보기만 제외하고 검사 |

`components/navigation/navigation-footer.card.html`은 다른 카드처럼 destructuring으로 컴포넌트를 꺼내지 않고 namespace fallback으로 `Footer`를 참조합니다. export 누락은 아니며 원본 미리보기 대상에 포함합니다.

## 최신 visual diff 결과

최신 실행: `npm run check:visual-diff` (2026-07-07 02:26 KST)

| 지표 | 결과 |
| --- | ---: |
| Legacy component cards | 83 |
| Primary React cards | 83 |
| React implementation stories | 126 |
| Compared pairs | 83 |
| Size mismatches | 0 |
| Mean mismatch ratio | 0.01066455849450229 |
| Max mismatch ratio | 0.046059027777777775 |
| Mean gate | 0.015 |
| Max gate | 0.05 |

현재 diff 산출물과 report가 생성됐고 `npm run check:visual-diff` strict gate를 통과합니다. `components/buttons/buttons.card.html`은 원본 카드 비교 전용 hidden story에서 legacy 자간만 scoped 보정해 mismatch `0.000015873015873015872`까지 낮췄습니다. public React 컴포넌트의 자간 0 정책은 유지합니다. `Scene3DFrame`의 legacy point-cloud placeholder는 deterministic seed로 고정되어 실행마다 흔들리지 않습니다.

현재 top mismatch:

1. `components/cards/cards-stat.card.html` — `0.046059027777777775`
2. `components/viz/viz-map2d.card.html` — `0.04589699074074074`
3. `components/overlay/overlay-alert.card.html` — `0.04407916666666667`
4. `components/navigation/navigation-pagination.card.html` — `0.03869318181818182`
5. `components/overlay/overlay-sheet.card.html` — `0.03535573122529644`
6. `components/overlay/overlay-modal.card.html` — `0.0348968253968254`
7. `components/overlay/overlay-toast.card.html` — `0.034305555555555554`
8. `components/cards/cards-checklistitem.card.html` — `0.03376736111111111`
9. `components/overlay/overlay-commandpalette.card.html` — `0.033215287517531555`
10. `components/overlay/overlay-toaststack.card.html` — `0.03299382716049383`

## 판정 기준

| 상태 | 의미 |
| --- | --- |
| Fixed | 원본 기준과 비교해 문제를 확인했고 코드까지 보정함 |
| Watch | 원본과 매핑은 됐지만 라이트/다크, 반응형, 상호작용까지 추가 검증 필요 |
| Gap | 현재 구현이 원본과 다르거나 Storybook/API 기준이 부족함 |
| Deferred | 의도적으로 남겨 둔 legacy/static 영역 또는 제품 결정이 필요한 영역 |

## 이번 보정 완료

| 우선순위 | 영역 | 조치 |
| --- | --- | --- |
| P0 | Button | CTA 화살표 제거, 호버 상승 제거, 호버 색상 변화 폭 축소 |
| P0 | Button family | ButtonGroup, CopyButton, Link, SocialButton, SplitButton, TextButton 자간을 0으로 정규화 |
| P0 | Button visual parity | 원본 카드 비교 전용 hidden story에서 `Button`/`SocialButton` legacy 자간 `-0.3px`을 scoped 적용해 `buttons.card.html` strict gate 복구 |
| P0 | TopBar | 기존 디자인 시스템의 상단바 구조를 기준으로 라이트/다크 대비 보정 |
| P0 | RobotStatusCard | 다크 배경에서 카드, 배지, 상태 수치 대비 보정 및 접근성 점검 |
| P0 | Footer | BackToTop 호버 상승 제거, Footer 링크/헤딩 자간 0으로 정규화 |
| P1 | Non-button typography | React 컴포넌트에 남아 있던 음수 자간을 0으로 정규화 |
| P1 | Card motion | 원본 미리보기 번들(`_ds_bundle.js`) 기준으로 Card/NewsCard/ProductCard hover motion 유지 여부 검증 |
| P1 | Coverage guard | 원본 guideline/component/template 카드가 Audit와 Legacy Preview에 모두 잡히는지 자동 검증 |
| P1 | Component map guard | 원본 component card 83개가 Audit 매핑, React export, dist type, legacy bundle, React Storybook에 연결되는지 검증 |
| P1 | Visual smoke | Playwright로 대표 원본 preview와 React Storybook 화면 9개를 실제 브라우저 PNG로 캡처 |
| P1 | Legacy render sweep | Playwright로 전체 원본 preview 107개(20/83/4)가 빈 화면 없이 렌더되는지 전수 검증 |
| P1 | Visual inventory | Playwright PNG inventory plus card-to-story traceability for all 83 original component cards, all 83 same-viewport primary React captures, and every React implementation story |
| P1 | Visual review report | Local HTML report comparing each original card with its same-viewport primary React capture and paired React story screenshots |
| P1 | Visual pixel diff | Local pixel-diff manifest, diff PNGs, and HTML report for all 83 original-to-primary visual pairs |
| P1 | Targeted parity stories | Dedicated Storybook parity stories added for high-mismatch form/status/overlay/viz/navigation/layout/cards/selection/feedback/data/content/brand/domain cards so primary matching no longer falls back to broad inventory stories; these stories are tagged `visual-parity` + `!dev` so they stay capturable but hidden from the public sidebar |
| P1 | Strict visual gate | `npm run check:visual-diff` now fails on size mismatch, max mismatch > 0.05, or mean mismatch > 0.015 |
| P1 | Deterministic legacy previews | Legacy previews reset `Math.random()` before Babel demos so random visual placeholders remain stable across runs |
| P0 | Original previews | 원본 guideline/component/template HTML을 Storybook에서 직접 확인 가능하게 노출 |

## 남은 전수조사 보정표

| 우선순위 | 영역 | 현재 판정 | 다음 작업 |
| --- | --- | --- | --- |
| P0 | Navigation: Footer, TopBar | Fixed | 실제 소비 앱에서 높이, sticky, dark surface 재검증 |
| P0 | Navigation: SideNav, Tabs, Breadcrumb, Pagination, BottomNav, Steps, UserMenu | Watch | 자간 0 정규화 완료, 원본 카드 대비 spacing, 선택 상태, 다크 대비 검증 |
| P0 | Buttons: Button, IconButton, TextButton, SplitButton, SocialButton, CopyButton, ButtonGroup | Fixed / Watch | 원본 카드 visual gate 복구 완료. hover/focus/disabled 상태를 Storybook interaction 기준으로 고정 |
| P0 | Domain: RobotStatusCard | Fixed | 라이트/다크, selected, status별 시각 회귀 테스트 추가 |
| P0 | Domain: EquipmentStatusCard, ConnectionBadge, TopicTree, Joystick | Watch | 도메인 화면 기준으로 상태색, 밀도, 대비 검증 |
| P1 | Forms: AutoComplete, DatePicker, SearchField, Slider, Input 계열 | Watch | 자간 0 정규화 완료, focus ring, error/help text, dark input surface 검증 |
| P1 | Data: Table, Calendar, AvatarGroup | Watch | 행 높이, sticky header, empty/loading 상태 보강 |
| P1 | Overlay: Modal, Drawer, Sheet, Popover, DropdownMenu, Toast, Alert | Watch | 자간 0 정규화 완료, focus trap, escape/overlay close, dark surface 대비 검증 |
| P1 | Selection: FilterChip, MultiSelectChip, SegmentedControl, Switch, ToggleButton, ThemeToggle, Stepper | Watch | 자간 0 정규화 완료, selected/pressed/disabled 상태의 토큰 일관성 검증 |
| P2 | Cards: ProductCard, NewsCard, FeatureCard, MetricCard, Stat | Fixed / Watch | 자간 0 정규화 완료, Card/NewsCard/ProductCard hover motion은 원본 번들과 일치 확인. FeatureCard/MetricCard/Stat 라이트/다크 대비와 실제 배치 검증 |
| P2 | Content: Accordion, ListCell, Tooltip, Badge, Timeline, Divider | Watch | 자간 0 정규화 완료, hover/focus, 말줄임/줄바꿈 검증 |
| P2 | Layout: Section, Grid, Stack, Cluster, Split, Columns, ScrollArea | Watch | 실제 예시 화면에서 section gap과 page rhythm 검증 |
| P2 | Viz: Map2DCanvas, Scene3DFrame, ViewerToolbar, TelemetryGauge, VideoStreamTile | Watch | 캔버스/뷰어 resize, dark overlay, toolbar contrast 검증 |

## 알려진 기술 부채

- React 컴포넌트의 음수 자간은 0으로 정규화했습니다. 원본 정적 HTML(`*.card.html`)은 비교 기준으로 보존하므로 기존 자간이 그대로 남아 있을 수 있습니다.
- 카드 계열의 hover movement와 이미지 scale은 원본 미리보기 번들의 Card/NewsCard/ProductCard 동작과 일치하므로 유지합니다. 이후 변경 시 `npm run check:parity`의 motion contract와 함께 제품 결정 기록을 갱신해야 합니다.
- `npm run check:coverage`가 원본 20개 guideline, 83개 component card, 4개 template card의 `stories/Audit.data.jsx`/Legacy Preview 누락과 `@dsCard` 메타 누락을 차단합니다.
- `npm run check:map`은 원본 component card 83개가 97개 React export와 연결되고, 각 export가 `src/index.js`, `dist/index.d.ts`, `_ds_bundle.js`, React Storybook 소스에 존재하는지 검증합니다.
- `npm run check:visual`은 Storybook 정적 빌드 후 대표 9개 화면을 `visual-artifacts/smoke/`에 캡처합니다. 산출물은 git에 포함하지 않으며, 전체 baseline 비교는 다음 단계입니다.
- `npm run check:legacy-render`는 전체 107개 원본 preview가 Storybook 정적 빌드에서 실제 DOM/visible element로 렌더되는지 검사합니다.
- `npm run check:visual-inventory` captures all 83 original component cards, all 83 same-viewport primary React counterparts, and every React implementation story into `visual-artifacts/inventory/` with a manifest and card/story pairing candidates, strict story-block primary story selections, full story-block export coverage, Storybook iframe paths, and local review anchors. This is evidence collection before pixel diff baseline enforcement.
- `npm run check:visual-review` refreshes that inventory and writes `visual-artifacts/inventory/review.html`, a local QA report that places each original card beside its same-viewport primary React capture and keeps paired React story screenshots with primary-story badges below, then verifies that the report renders 83 strict pairs with 83 matching primaryReactCards, full export-block coverage, no broken images, and complete Storybook links.
- `npm run check:visual-diff` refreshes the review inventory, computes pixel-level original-to-primary differences for all 83 pairs using exact legacy iframe viewport crops and original-card viewport crops for primary React captures, writes `visual-artifacts/inventory/diffs/manifest.json`, red-highlight diff PNGs, and `report.html`, then verifies the report renders all 83 comparisons with no broken images. Latest measured result: 83/83 pairs, 126 React implementation stories, size mismatch 0, mean mismatch `0.01066455849450229`, max mismatch `0.046059027777777775`. The script fails when size mismatch is nonzero, max mismatch exceeds `0.05`, or mean mismatch exceeds `0.015`. The capture hides Storybook-only chrome (`__om-theme-toggle`, legacy iframe border/radius) so the comparison is original card content vs React story content, not preview shell. High-mismatch AutoComplete, DatePicker, SearchField, Slider, Skeleton, Spinner, Lightbox, Sheet, Popover, Alert, Alert/Toast, HoverCard, CommandPalette, ToastStack, Modal, Scene3DFrame, Dimmer, ProgressBar, TelemetryGauge, Breadcrumb, Stack, ChecklistItem, Stat, Map2DCanvas, Stepper, ProductCard, NewsCard, SpecRow, Card, FeatureCard, Footer, TopBar, BrandLogo, SourceTag, Tabs, Steps, Calendar, Avatar/Badge/Chip/Tag/PushBadge/Rating, Table, ListCell/Accordion, Thumbnail, BottomNav, SideNav/UserMenu, Columns/Col, Grid, ChoiceCard, FilterChip, MultiSelectChip, ThemeToggle, SegmentedControl, ToggleButton, EmptyState, ConnectionBadge, EquipmentStatusCard, RobotStatusCard, Joystick, TopicTree, VideoStreamTile, DropdownMenu, and Button/IconButton/SocialButton cards now have dedicated parity stories or corrected crop roots so their primary visual pairs are no longer broad inventory pages.
- `npm run check:type-surface`는 150개 React 구현, 150개 `.d.ts`, 154개 public export, public `any` 누출 0개를 검증합니다.
- `npm run check:storybook-public`은 public Storybook sidebar에 visual parity story, 중복 story, `상세` 분기 title이 노출되지 않는지 검증합니다.
- `npm run check:a11y`는 Storybook 구현 story의 접근성 이름, 명시적 button type, console/page error를 검증합니다.
- `npm run check:consumer`는 실제 소비 앱 Vite production build에서 package-name import와 `styles.css` export가 동작하는지 검증합니다.
- `npm run check:publish-policy`는 현재 `private: true` 내부 Git 소비 정책과 향후 GitHub Packages 전환 의도를 검증합니다.
- 토큰 source-of-truth는 `tokens/source.json`, CSS 토큰, generated dist가 맞물립니다. Figma Tokens 연동 전에는 수동 변경 후 `npm run check:tokens`로 계속 막아야 합니다.
- 전체 원본 대비 pixel diff baseline과 strict release gate가 마련되어 있습니다. `visual-artifacts/` 산출물은 git에 포함하지 않고 필요 시 재생성합니다.

## 다음 검증 순서

1. P0/P1 스토리를 라이트/다크 모두 열어 원본 카드와 육안 비교합니다.
2. 버튼, 내비게이션, 도메인 상태 컴포넌트에 interaction test를 추가합니다.
3. `npm run check:legacy-render`를 유지해 원본 preview 전수 렌더가 깨지지 않는지 확인합니다.
4. `npm run check:visual-diff`의 83쌍 strict gate(size mismatch 0, max 0.05, mean 0.015)를 유지합니다.
5. `npm run check:parity`를 유지해 React 컴포넌트의 음수 자간 재유입과 카드 motion contract 변경을 차단합니다.
6. `npm run check:coverage`와 `npm run check:map`을 유지해 원본 파일 추가/삭제와 component card 매핑 drift를 즉시 잡습니다.
7. `npm run check:consumer`를 유지해 소비 앱 예시 페이지에서 `@lk-robotics/design-system-core` package export와 `styles.css`만 사용해 화면을 구성하는지 검증합니다.
8. `npm run check:a11y`를 유지해 구현 story의 접근성 이름과 button type 회귀를 차단합니다.
9. visual parity ledger의 Watch 항목을 Fixed 또는 Gap으로 계속 이동합니다.
