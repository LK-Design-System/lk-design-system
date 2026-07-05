# LK ROBOTICS Design System Visual Parity Ledger

기준일: 2026-07-05

이 문서는 기존 정적 디자인 시스템 카드와 현재 React/Storybook 구현을 맞춰 보기 위한 보정표입니다. 목적은 디자인 시스템을 손상시키지 않고, 원본 기준에서 빠진 요소와 현재 구현의 편차를 계속 추적하는 것입니다.

## 현재 커버리지

| 영역 | 원본 기준 | 현재 상태 |
| --- | ---: | --- |
| Foundation guidelines | 20 | Storybook 원본 미리보기 노출 |
| Component cards | 83 | 원본 카드와 React export 매핑 완료 |
| Template cards | 4 | 원본 카드와 starter 폴더 매핑 완료 |
| Runtime export gaps | 0 | 카드에서 필요한 public export 누락 없음 |
| React exports | 145 | 패키지 엔트리에서 배포 대상 생성 |

`components/navigation/navigation-footer.card.html`은 다른 카드처럼 destructuring으로 컴포넌트를 꺼내지 않고 namespace fallback으로 `Footer`를 참조합니다. export 누락은 아니며 원본 미리보기 대상에 포함합니다.

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
| P0 | TopBar | 기존 디자인 시스템의 상단바 구조를 기준으로 라이트/다크 대비 보정 |
| P0 | RobotStatusCard | 다크 배경에서 카드, 배지, 상태 수치 대비 보정 및 접근성 점검 |
| P0 | Footer | BackToTop 호버 상승 제거, Footer 링크/헤딩 자간 0으로 정규화 |
| P1 | Non-button typography | React 컴포넌트에 남아 있던 음수 자간을 0으로 정규화 |
| P1 | Card motion | 원본 미리보기 번들(`_ds_bundle.js`) 기준으로 Card/NewsCard/ProductCard hover motion 유지 여부 검증 |
| P1 | Coverage guard | 원본 guideline/component/template 카드가 Audit와 Legacy Preview에 모두 잡히는지 자동 검증 |
| P1 | Visual smoke | Playwright로 대표 원본 preview와 React Storybook 화면 9개를 실제 브라우저 PNG로 캡처 |
| P0 | Original previews | 원본 guideline/component/template HTML을 Storybook에서 직접 확인 가능하게 노출 |

## 남은 전수조사 보정표

| 우선순위 | 영역 | 현재 판정 | 다음 작업 |
| --- | --- | --- | --- |
| P0 | Navigation: Footer, TopBar | Fixed | 실제 소비 앱에서 높이, sticky, dark surface 재검증 |
| P0 | Navigation: SideNav, Tabs, Breadcrumb, Pagination, BottomNav, Steps, UserMenu | Watch | 자간 0 정규화 완료, 원본 카드 대비 spacing, 선택 상태, 다크 대비 검증 |
| P0 | Buttons: Button, IconButton, TextButton, SplitButton, SocialButton, CopyButton, ButtonGroup | Fixed / Watch | hover/focus/disabled 상태를 Storybook interaction 기준으로 고정 |
| P0 | Robotics: RobotStatusCard | Fixed | 라이트/다크, selected, status별 시각 회귀 테스트 추가 |
| P0 | Robotics: EquipmentStatusCard, ConnectionBadge, TopicTree, Joystick | Watch | 현장 운영 화면 기준으로 상태색, 밀도, 대비 검증 |
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
- `npm run check:coverage`가 원본 20개 guideline, 83개 component card, 4개 template card의 Audit/Legacy Preview 누락과 `@dsCard` 메타 누락을 차단합니다.
- `npm run check:visual`은 Storybook 정적 빌드 후 대표 9개 화면을 `visual-artifacts/smoke/`에 캡처합니다. 산출물은 git에 포함하지 않으며, 전체 baseline 비교는 다음 단계입니다.
- 토큰 source-of-truth는 `tokens/source.json`, CSS 토큰, generated dist가 맞물립니다. Figma Tokens 연동 전에는 수동 변경 후 `npm run check:tokens`로 계속 막아야 합니다.
- 자동 시각 회귀 테스트는 smoke 캡처 단계까지 마련했습니다. 아직 전체 원본 대비 pixel diff baseline은 없습니다.

## 다음 검증 순서

1. P0/P1 스토리를 라이트/다크 모두 열어 원본 카드와 육안 비교합니다.
2. 버튼, 내비게이션, 로보틱스 상태 컴포넌트에 interaction test를 추가합니다.
3. `npm run check:visual`의 smoke set을 전체 83개 원본 카드와 대응 React story baseline으로 확장합니다.
4. `npm run check:parity`를 유지해 React 컴포넌트의 음수 자간 재유입과 카드 motion contract 변경을 차단합니다.
5. `npm run check:coverage`를 유지해 원본 파일 추가/삭제 시 Audit와 Legacy Preview 누락을 즉시 잡습니다.
6. 소비 앱 예시 페이지에서 `@lk-robotics/design-system-core` package export와 `styles.css`만 사용해 화면을 구성합니다.
7. visual parity ledger의 Watch 항목을 Fixed 또는 Gap으로 계속 이동합니다.
