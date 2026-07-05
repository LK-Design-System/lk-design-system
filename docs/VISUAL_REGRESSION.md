# LK ROBOTICS Visual Regression Smoke Check

기준일: 2026-07-05

원본 정적 HTML preview와 React Storybook 구현을 실제 브라우저에서 캡처하기 위한 smoke 검증입니다. 전체 픽셀 diff baseline은 아직 아니며, 다음 단계의 시각 회귀 테스트를 위한 실행 기반입니다.

## 실행

```powershell
npm.cmd run check:visual
```

원본 preview 전체가 Storybook 정적 빌드 안에서 실제로 선택·렌더되는지 전수 확인하려면 아래를 실행합니다.

```powershell
npm.cmd run check:legacy-render
```

처음 실행하는 환경에서 Chromium이 없으면 먼저 실행합니다.

```powershell
npx playwright install chromium
```

## 산출물

`visual-artifacts/smoke/` 아래에 PNG와 `manifest.json`이 생성됩니다. 이 폴더는 로컬 검증 산출물이므로 git에는 포함하지 않습니다.

`check:legacy-render`는 `visual-artifacts/legacy-render/manifest.json`을 생성합니다. 현재 검증 범위는 다음 107개 원본 preview입니다.

- Foundation guideline HTML 20개
- Component card HTML 83개
- Template card HTML 4개

현재 smoke set은 다음을 캡처합니다.

- 원본 preview: Card
- 원본 preview: ProductCard
- 원본 preview: TopBar
- React story: Card interactive/dark
- React story: Product/content cards
- React story: TopBar
- React story: Forms
- React story: Overlay Alert
- React story: Robotics/Viz

## 역할

- Storybook 정적 빌드가 실제 브라우저에서 열리는지 검증합니다.
- 원본 preview iframe과 React story가 최소 대표 화면에서 렌더링되는지 검증합니다.
- screenshot 파일 크기와 manifest hash를 남겨 육안 검토와 추후 baseline 비교의 출발점으로 사용합니다.
- `check:legacy-render`는 전체 원본 preview가 nested iframe 안에서 빈 화면이 아닌 실제 DOM/visible element로 렌더되는지 검증합니다.

## 아직 남은 일

- smoke 캡처를 전체 83개 component card와 대응 React story로 확장
- baseline PNG를 버전 관리할지, CI artifact로만 유지할지 결정
- pixel diff threshold와 masking 규칙 정의
- 라이트/다크 theme query를 명시한 양쪽 캡처 추가

## Full PNG visual inventory

Before enforcing pixel diff baselines, capture the complete visual inventory of the original component cards and the React implementation stories.

```powershell
npm.cmd run check:visual-inventory
```

The command writes local artifacts under `visual-artifacts/inventory/`; this directory is ignored by git. Current coverage:

- `legacy-components/`: all 83 original `components/**/*.card.html` files captured through the Storybook Legacy Preview iframe
- `react-stories/`: every React implementation story, excluding docs/Audit/Legacy Preview pages
- `manifest.json`: image path, byte size, SHA-256 hash, Storybook story id, original viewport metadata, and component-card-to-React-story pairing candidates, strict story-block primary story selection, Storybook iframe paths, and local review anchors

This is not yet a pixel diff pass. It creates the evidence set and traceability map needed to decide baseline storage, thresholds, and masking rules next.

## Paired visual review report

To review original cards beside their mapped React implementation stories, run:

```powershell
npm.cmd run check:visual-review
```

This refreshes the inventory and writes `visual-artifacts/inventory/review.html`. The report is a local QA aid: it validates that every original component card has a legacy screenshot, a primary paired React story, at least one paired React story, and screenshot files for those stories before writing the side-by-side review page. It then opens the report in Playwright, checks that all 83 pairs use strict story-block primary matches, all Storybook links are present, and all images render, then writes `visual-artifacts/inventory/review-smoke.png`.
