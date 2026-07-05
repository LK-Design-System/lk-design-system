# LK ROBOTICS Visual Regression Smoke Check

기준일: 2026-07-05

원본 정적 HTML preview와 React Storybook 구현을 실제 브라우저에서 캡처하기 위한 smoke 검증입니다. 전체 픽셀 diff baseline은 아직 아니며, 다음 단계의 시각 회귀 테스트를 위한 실행 기반입니다.

## 실행

```powershell
npm.cmd run check:visual
```

처음 실행하는 환경에서 Chromium이 없으면 먼저 실행합니다.

```powershell
npx playwright install chromium
```

## 산출물

`visual-artifacts/smoke/` 아래에 PNG와 `manifest.json`이 생성됩니다. 이 폴더는 로컬 검증 산출물이므로 git에는 포함하지 않습니다.

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

## 아직 남은 일

- smoke 캡처를 전체 83개 component card와 대응 React story로 확장
- baseline PNG를 버전 관리할지, CI artifact로만 유지할지 결정
- pixel diff threshold와 masking 규칙 정의
- 라이트/다크 theme query를 명시한 양쪽 캡처 추가
