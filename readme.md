# LK 디자인 시스템 코어

LK ROBOTICS 핵심 디자인 시스템 패키지입니다. 토큰, React 컴포넌트, 브랜드 자산, 템플릿, 정적 미리보기 카드를 포함합니다.

## 패키지 사용

```tsx
import { Button, ProductCard, TopBar } from '@lk-robotics/design-system-core';
import '@lk-robotics/design-system-core/styles.css';
```

패키지 메타데이터:

- 패키지명: `@lk-robotics/design-system-core`
- 런타임 peer dependency: `react`
- 선택 peer dependency: `react-dom`
- ESM 진입점: `dist/index.js`
- CJS 진입점: `dist/index.cjs`
- 타입 진입점: `dist/index.d.ts`

## 레포 구조

| 경로 | 용도 |
| --- | --- |
| `components/` | React 컴포넌트 소스, `.d.ts` 계약, 프롬프트 노트, 정적 컴포넌트 카드 |
| `tokens/` | CSS 디자인 토큰과 기계가 읽을 수 있는 토큰 맵 `source.json` |
| `styles.css` | 토큰 파일을 불러오는 CSS 진입점 |
| `assets/` | 브랜드 SVG, Pretendard 폰트, 제품/산업/기술 이미지 |
| `src/` | 생성된 패키지 진입 파일 |
| `dist/` | 빌드된 ESM/CJS/타입 결과물. Git 직접 사용을 위해 커밋함 |
| `scripts/` | 진입 파일 생성과 타입 복사 스크립트 |
| `guidelines/` | 정적 파운데이션 미리보기 카드 |
| `templates/` | 로그인, 목록-테이블, 마스터-디테일, 폼-설정 화면 스타터 템플릿 |
| `templates-cards/` | 스타터 템플릿 정적 미리보기 카드 |
| `_ds_bundle.js` | 정적 카드와 템플릿에서 사용하는 레거시 브라우저 번들 |

## 개발

```powershell
npm install
npm run build
```

주요 검사:

```powershell
npm run check:tokens
npm run check
npm run check:audit
```

패키지 진입 파일은 `components/**/*.jsx` 기준으로 생성됩니다.

```powershell
npm run generate:entry
```

`src/index.js`와 `src/index.d.ts`는 직접 수정하지 마세요.

## Storybook

Storybook은 컴포넌트를 확인하고 문서화하는 인터랙티브 표면입니다.

```powershell
npm run storybook
npm run build:storybook
```

현재 Storybook은 파운데이션, 토큰 전략, 버튼, 카드, 폼 컨트롤, 데이터/상태 예시, 로보틱스 상태 카드, 아이콘, 내비게이션을 다룹니다.

## AI 및 Figma 토큰 워크플로

AI 도구로 LK Robotics UI를 생성할 때는 `docs/AI_DESIGN_SYSTEM_GUIDE.md`를 먼저 사용하세요.
Figma Variables를 내보내거나 가져올 때는 `docs/FIGMA_TOKEN_WORKFLOW.md`를 기준으로 삼으세요.

토큰 계층:

- Primitive: 브랜드 원값, 스케일, 타이포그래피, 그림자, 모션
- Semantic: 표면, 텍스트, 액션, 상태, 테두리, 포커스 같은 제품 의미
- Component: Button, Input, Card 및 향후 컴포넌트 패밀리 계약

## CI

GitHub Actions는 `main` push, pull request, manual dispatch에서 `.github/workflows/ci.yml`을 실행합니다.
CI는 `npm ci`, 패키지 빌드, 타입체크, 생성 파일 차이 검사, Storybook 정적 빌드, 패키지 dry run, 런타임 dependency audit을 확인합니다.

## 컴포넌트 범위

이 패키지는 다음 그룹에 걸쳐 145개의 React 컴포넌트 소스 파일을 export합니다.

- `brand`
- `buttons`
- `cards`
- `content`
- `data`
- `editor`
- `feedback`
- `forms`
- `icon`
- `layout`
- `navigation`
- `overlay`
- `robotics`
- `selection`
- `status`
- `viz`

## 정적 미리보기

`guidelines/`, `components/**`, `templates-cards/` 아래 `.html` 파일은 브라우저에서 직접 열 수 있습니다. 이 미리보기들은 상대 경로로 `_ds_bundle.js`, `styles.css`, `tokens/`, `assets/`를 불러오므로 현재 위치를 유지해야 합니다.

## 정리 정책

초기 raw export는 Git 이력에 보존되어 있습니다. 현재 `main`은 패키지 중심 구조이며 scratch preview, 업로드 참조, 스크린샷, gap analysis, 잘못 생성된 manifest 같은 export-only 파일은 제외합니다.

자세한 레포 구성은 `docs/REPOSITORY_INVENTORY.md`를 보세요.
컴포넌트 문서화와 CI 유지보수 기준은 `docs/COMPONENT_WORKFLOW.md`를 보세요.
