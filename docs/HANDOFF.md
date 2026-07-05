# LK ROBOTICS Design System Handoff

기준일: 2026-07-06  
작업 레포: `C:\Users\seoul\Downloads\LK Design System`  
원격: `https://github.com/LK-ROBOTICS/lk-design-system-core.git`  
브랜치: `main`

> 주의: `C:\Users\seoul\OneDrive\사진\문서\LK Design System` 경로도 존재하지만, 실제 원격 푸시 기준 레포는 `Downloads` 쪽입니다.

## 현재 상태

- 문서 작성 직전 최신 구현 커밋: `d8ea937 Improve overlay visual parity captures`
- `origin/main` 푸시 완료
- 작업 트리에는 `.omx/`만 untracked로 남아 있으며 커밋 대상이 아닙니다.
- PowerShell에서는 실행 정책 이슈를 피하기 위해 `npm.cmd`를 사용합니다.

## 최근 완료된 작업

### 시각 검증 체계

- 원본 정적 component card 83개와 React Storybook primary story 83개를 비교하는 visual inventory / review / pixel diff 흐름을 구축했습니다.
- `npm.cmd run check:visual-diff`는 다음 산출물을 갱신합니다.
  - `visual-artifacts/inventory/manifest.json`
  - `visual-artifacts/inventory/review.html`
  - `visual-artifacts/inventory/diffs/manifest.json`
  - `visual-artifacts/inventory/diffs/report.html`
  - diff PNG 및 smoke screenshot
- React primary 캡처는 원본 카드 viewport 기준 crop으로 비교하도록 개선했습니다.
- `ToastStack`처럼 `position: fixed`를 사용하는 컴포넌트는 원본 viewport 크기로 리사이즈 후 캡처합니다.
- card-specific parity story가 broad/open story보다 우선 선택되도록 story specificity 점수를 보정했습니다.

### targeted parity story 추가

최근 추가/보정된 전용 parity story:

- Forms/status/navigation/viz/layout/cards/selection
  - `AutoComplete`
  - `DatePicker`
  - `SearchField`
  - `Slider`
  - `Skeleton`
  - `Spinner`
  - `ProgressBar`
  - `Breadcrumb`
  - `Scene3DFrame`
  - `TelemetryGauge`
  - `Map2DCanvas`
  - `Stack`
  - `ChecklistItem`
  - `Stat`
  - `Stepper`
- Overlay
  - `Lightbox`
  - `Sheet`
  - `Dimmer`
  - `Popover`
  - `Alert`
  - `Alert/Toast`
  - `HoverCard`
  - `CommandPalette`
  - `ToastStack`
  - `Modal`

### 문서

- `docs/VISUAL_PARITY_LEDGER.md`와 `stories/VisualParityLedger.stories.jsx`에 visual diff / targeted parity 현황을 반영했습니다.
- Storybook 문서 경로: `문서/보정표 > 현재 보정표`

## 최근 검증 결과

마지막 통과 명령:

- `npm.cmd run check`
- `npm.cmd run check:audit`
- `npm.cmd run check:visual-diff`
- `git diff --check`

마지막 visual diff 수치:

- legacy component cards: `83`
- primary React cards: `83`
- React stories: `73`
- compared pairs: `83`
- mean mismatch ratio: `0.1844532777057383`
- max mismatch ratio: `0.6973362741771293`

현재 top mismatch:

1. `components/cards/cards-productcard.card.html` — `0.6973362741771293`
2. `components/navigation/navigation-footer.card.html` — `0.6644259874492433`
3. `components/viz/viz-video.card.html` — `0.6318487759865385`
4. `components/cards/cards-newscard.card.html` — `0.5416176014874496`
5. `components/cards/cards-specrow.card.html` — `0.4472264460799221`
6. `components/brand/brand.card.html` — `0.41033449342614076`
7. `components/overlay/overlay-dimmer.card.html` — `0.40826604334891625`
8. `components/buttons/buttons.card.html` — `0.38757327700026406`

## 다음 작업 권장 순서

1. `ProductCard`, `NewsCard`, `SpecRow` 원본 카드와 React primary story 비교
   - 이미지, 카드 width, 배경, border radius, CTA/metadata spacing 차이를 먼저 확인합니다.
   - 카드 hover motion은 원본 기준을 해치지 않는지 재판정이 필요합니다.
2. `Footer` 전용 visual parity story 또는 primary story 매칭 개선
   - 현재 broad navigation story로 잡히는지 확인하고, 원본 `navigation-footer.card.html`과 같은 viewport에서 비교합니다.
3. `VideoStreamTile` / viz video 카드 전용 parity story 보강
   - 실제 원본 카드와 같은 frame, status overlay, control 위치를 맞춥니다.
4. `brand.card.html` / 버튼 카드 잔여 mismatch 확인
   - 캡처 crop 기준 문제인지 실제 spacing/토큰 차이인지 분리합니다.
5. `overlay-dimmer` 잔여 mismatch 확인
   - 원본과 React story의 overlay content, blur, surface 차이를 확인합니다.

## 운영 메모

- Storybook 로컬 서버가 필요하면:
  - `npm.cmd run storybook`
  - 기본 URL: `http://127.0.0.1:6006`
- 전체 release-like 검증:
  - `npm.cmd run check`
  - `npm.cmd run check:audit`
- 시각 검증:
  - `npm.cmd run check:visual-diff`
- Browser DOM snapshot API에서 `incrementalAriaSnapshot` 오류가 난 적이 있으나 앱 오류는 아니었습니다. 필요 시 Playwright `evaluate`와 screenshot 기반으로 검증합니다.
- 공개 레포가 아니므로 라이선스/공개 가능 여부 검토는 우선순위가 아닙니다.
- PR 없이 `main`에 직접 반영하는 흐름을 선호합니다.
- 브랜드 표기는 `LK Robotics`가 아니라 `LK ROBOTICS`를 사용합니다.
