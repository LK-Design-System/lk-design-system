# 레포 인벤토리

이 레포는 패키지 중심의 LK ROBOTICS 핵심 디자인 시스템입니다.

## 패키지 범위

- 패키지명: `@lk-robotics/design-system-core`
- React 컴포넌트 소스 파일: 145개
- 컴포넌트 그룹: `brand`, `buttons`, `cards`, `content`, `data`, `editor`, `feedback`, `forms`, `icon`, `layout`, `navigation`, `overlay`, `robotics`, `selection`, `status`, `viz`
- 런타임 peer dependency: `react`
- 선택 peer dependency: `react-dom`
- 빌드 결과물: `dist/index.js`, `dist/index.cjs`, `dist/index.d.ts`

## 주요 소스 영역

- `components/`: React 컴포넌트, 컴포넌트 타입 선언, 프롬프트 노트, 정적 컴포넌트 카드
- `tokens/`: CSS 디자인 토큰, component token, base style, machine-readable `source.json` 토큰 맵
- `assets/`: 브랜드 SVG, Pretendard 폰트 파일, 제품/산업/기술 이미지
- `styles.css`: 토큰 import용 최상위 CSS 진입점
- `src/`: 생성된 패키지 진입 파일
- `scripts/`: 패키지 유지보수 스크립트
- `.storybook/`: Storybook 런타임 설정
- `stories/`: 인터랙티브 컴포넌트 문서와 시각 예시
- `.github/workflows/ci.yml`: GitHub Actions CI 게이트
- `docs/AI_DESIGN_SYSTEM_GUIDE.md`: AI 사용 규칙과 토큰 계층 가이드
- `docs/FIGMA_TOKEN_WORKFLOW.md`: Figma Variables export/import 전략
- `guidelines/`: 정적 foundation 카드
- `templates/`: 재사용 가능한 starter template
- `templates-cards/`: starter template 정적 카드

## 생성 영역

- `dist/`: 패키지 빌드 결과물. 내부 Git 소비자가 별도 publish 없이 import할 수 있도록 커밋합니다.
- `_ds_bundle.js`: 정적 HTML 미리보기 카드와 starter template에서 사용하는 레거시 브라우저 번들

## 현재 head에서 제거된 항목

초기 raw export는 레포 이력에 남아 있습니다. 현재 `main`은 디자인 시스템 패키지에 필요 없는 export-only 파일을 제거한 상태입니다.

- `scratch/`
- `screenshots/`
- `uploads/`
- 루트 audit, gap-analysis, direction HTML 문서
- 깨진/export-only Markdown 문서
- 유효하지 않은 `_ds_manifest.json`
- 생성된 adherence config
- 임시 equipment-detail demo 파일

## 유지보수 메모

- `src/index.js`와 `src/index.d.ts`는 직접 수정하지 않습니다. `npm run generate:entry`를 실행하세요.
- 정적 preview card와 template이 직접 불러오므로 `_ds_bundle.js`는 유지합니다.
- 정식 package publishing workflow로 전환하기 전까지 `dist/`는 Git에 유지합니다.
- `tokens/source.json`은 `tokens/*.css`와 맞춰야 합니다. `npm run check:tokens`가 component-token 참조를 검증합니다.
- `components/` 아래에 컴포넌트를 추가하면 대응 `.d.ts`를 추가하고 `npm run build`를 실행합니다.
- 사용자에게 노출되는 컴포넌트는 Storybook 스토리를 추가하거나 수정합니다.
- push 전 `npm run check`와 `npm run check:audit`를 실행합니다.
