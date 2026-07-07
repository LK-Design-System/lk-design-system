# 레포 인벤토리

이 레포는 패키지 중심의 LK ROBOTICS 핵심 디자인 시스템입니다.

## 패키지 범위

- 패키지명: `@lk-robotics/design-system-core`
- React 컴포넌트 소스 파일: 150개
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
- `docs/TOKEN_GOVERNANCE.md`: 토큰 lifecycle, Figma Variables export/import, release gate
- `guidelines/`: 정적 foundation 카드
- `templates/`: 재사용 가능한 starter template
- `templates-cards/`: starter template 정적 카드

## 원본 이관 검증 기준

`stories/Audit.data.jsx` is a hidden data source for source-card mapping scripts (`check:coverage`, `check:map`, and visual inventory); it is not a Storybook page.
`check:legacy-render` renders original guideline/card/template HTML files directly through a local static server. Storybook stays limited to LDS component and pattern surfaces; visual-parity stories remain hidden with `!dev` and `visual-parity` tags.

- 원본 지침: `guidelines/*.html` 20개
- 원본 요소 카드: `components/**/*.card.html` 83개
- 템플릿 카드: `templates-cards/*.html` 4개
- 현재 React export: 150개
- Storybook 전체 story: 177개
- Storybook public story: 95개
- 숨김 visual parity story: 82개
- visual inventory React story: 170개
- 접근성 guard 검사 대상 implementation story: 169개

`stories/Audit.data.jsx` is a hidden data source for source-card mapping scripts (`check:coverage`, `check:map`, and visual inventory); it is not a Storybook page.

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
- 배포 정책은 현재 `private: true`이며 내부 Git 소비를 기본으로 합니다. 정식 npm publish로 전환할 때만 `private` 값을 바꾸고 GitHub Packages 설정과 운영 문서를 함께 갱신합니다. 그 전까지 `dist/`는 Git에 유지합니다.
- `tokens/source.json`은 `tokens/*.css`와 맞춰야 합니다. `npm run check:tokens`가 component-token 참조를 검증합니다.
- `components/` 아래에 컴포넌트를 추가하면 대응 `.d.ts`를 추가하고 `npm run build`를 실행합니다.
`stories/Audit.data.jsx` is a hidden data source for source-card mapping scripts (`check:coverage`, `check:map`, and visual inventory); it is not a Storybook page.
- 현재 최신 `npm run check:visual-diff`는 83쌍 산출물을 생성하고 strict gate를 통과합니다. 최신 수치는 mean mismatch `0.01066455849450229`, max mismatch `0.046059027777777775`입니다.
- push 전 `npm run check`, `npm run check:audit`, 필요 시 `npm run check:ops-release`를 실행합니다.
