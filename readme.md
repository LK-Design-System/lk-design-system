# LK 디자인 시스템 코어

## WDS and LDS relationship

LDS means **LK Design System**. This package is based on **Wanted Design
System (WDS) Community** as its source model, but it is not a one-to-one copy
or an unrelated custom system.

The intended relationship is:

- **WDS Core**: keep WDS foundations, generic component structure, interaction
  expectations, and documentation conventions as the baseline.
- **LK Theme Override**: replace WDS visual identity with LK ROBOTICS color,
  brand, typography, status, radius, and effect decisions.
- **LK Product Extension**: add generic LK product components only when they are
  reusable beyond a single robotics screen.
- **LK Robotics Extension**: keep robotics, viewer, map, telemetry, joystick,
  topic tree, and editor components separate from WDS core.
- **Documents**: document contracts, audits, operating rules, and WDS alignment
  evidence without treating them as product UI components.

In short: **LDS should read as WDS structure recolored and extended for LK, not
as arbitrary screens designed beside WDS.** New work should either map to WDS
Core, be documented as an LK override, or live in an explicit LK extension
layer.

Authoritative references:

- `docs/references/wds/TOKEN_MAP.json`
- `docs/references/wds/LAYER_CLASSIFICATION.json`
- `docs/references/wds/CONFLICT_AUDIT.md`
- `docs/references/wds/VISUAL_TOKEN_EXCEPTIONS.json`

Product frontend coverage references:

- `docs/PRODUCT_FRONTEND_COVERAGE.md`
- `docs/references/product-frontends/COVERAGE_AUDIT.json`
- `npm run check:product-frontends`

LK ROBOTICS 핵심 디자인 시스템 패키지입니다. 토큰, React 컴포넌트, 브랜드 자산, 템플릿, 정적 미리보기 카드를 포함합니다.

## 패키지 사용

```tsx
import { Button, ProductCard, TopBar } from '@lk-robotics/design-system-core';
import '@lk-robotics/design-system-core/styles.css';
```

패키지 메타데이터:

- 패키지명: `@lk-robotics/design-system-core`
- 배포 정책: 현재 `private: true`로 유지하며 내부 Git 소비를 기본으로 합니다. npm publish 전환 시 GitHub Packages 정책과 함께 명시적으로 변경합니다.
- 런타임 peer dependency: `react`
- 선택 peer dependency: `react-dom`
- ESM 진입점: `dist/index.js`
- CJS 진입점: `dist/index.cjs`
- 타입 진입점: `dist/index.d.ts`

## 레포 구조

| 경로 | 용도 |
| --- | --- |
| `components/` | React 컴포넌트 소스, `.d.ts` 계약, 프롬프트 노트 |
| `tokens/` | CSS 디자인 토큰과 기계가 읽을 수 있는 토큰 맵 `source.json` |
| `styles.css` | 토큰 파일을 불러오는 CSS 진입점 |
| `assets/` | 브랜드 SVG, Pretendard 폰트, 제품/산업/기술 이미지 |
| `src/` | 생성된 패키지 진입 파일 |
| `dist/` | 빌드된 ESM/CJS/타입 결과물. Git 직접 사용을 위해 커밋함 |
| `scripts/` | 진입 파일 생성과 타입 복사 스크립트 |

## 개발

```powershell
npm install
npm run build
```

CI는 npm을 기준으로 실행하지만, 패키지 스크립트 내부에서는 다시 `npm run`을 호출하지 않습니다. 로컬에 npm이 없고 pnpm만 있는 환경에서는 같은 이름의 `pnpm run <script>`를 사용해도 됩니다.

주요 검사:

```powershell
npm run check:tokens
npm run check:type-surface
npm run check:contracts
npm run check:publish-policy
npm run check:consumer
npm run report:inventory
npm run check:inventory
npm run check:fast
npm run check:storybook
npm run check:a11y
npm run check
npm run check:audit
```

릴리스 직전 운영 품질 게이트는 아래를 사용합니다.

```powershell
npm run check:ops-release
```

패키지 진입 파일은 현재 204개의 React 컴포넌트 소스 파일(`components/**/*.jsx`) 기준으로 생성됩니다.

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

현재 public Storybook sidebar는 `LDS Core/Foundation`, `LDS Core/Components`, `LDS Theme`, `LDS Product`, `LDS Robotics` 아래의 컴포넌트와 패턴 표면 442개 story를 다룹니다.
WDS 원천 번호 체계(`1 Theme`, `3 Component / 2 Action` 등)는 public sidebar title이 아니라 `docs/references/wds/`의 근거 데이터에만 남깁니다.
`LDS Product`와 `LDS Robotics`는 재사용 가능한 확장 컴포넌트/패턴만 다루며, 완성된 앱 화면, 템플릿, 워크플로우, 데모 페이지를 Storybook source of truth로 올리지 않습니다.
보고/감사/보정표 UI와 운영 문서는 Storybook에 노출하지 않습니다. 원본 파일과 React 표면의 대응 데이터는 `stories/Audit.data.jsx`에 보관하고, 자동 검증 스크립트가 이 데이터를 읽습니다.
WDS 원본 및 실제 확장 컴포넌트 회귀를 비교하기 위한 89개 `visual-parity` story는 direct iframe 검증용으로만 남기고 `!dev` 태그로 sidebar에서 숨깁니다. `npm run check:storybook-public`이 public 중복 노출과 parity story 노출을 차단합니다.
접근성, 토큰 lifecycle, 컴포넌트 상태 매트릭스, 도메인 컴포넌트 계약, 릴리즈와 ownership 같은 기준은 `docs/` 아래 Markdown 문서에서 관리합니다.
레포 수치가 바뀌면 `npm run report:inventory`로 현재 값을 확인하고, `npm run check:inventory`로 README/docs/story 표시 수치가 stale하지 않은지 검증합니다.

## AI 및 Figma 토큰 워크플로

AI 도구로 LK ROBOTICS UI를 생성할 때는 `docs/AI_DESIGN_SYSTEM_GUIDE.md`를 먼저 사용하세요.
Figma Variables export/import, 토큰 lifecycle, deprecation은 `docs/TOKEN_GOVERNANCE.md`를 기준으로 삼으세요.
컴포넌트 API와 접근성 계약은 `docs/COMPONENT_API_STATE_MATRIX.md`, `docs/ACCESSIBILITY_CONTRACTS.md`를 함께 봅니다.
도메인 컴포넌트 계약은 `docs/ROBOTICS_PATTERNS.md`에 정리합니다.
채팅·로보틱스 내비게이션·가상 입력의 완료된 확장 결정과 구현 순서는 `docs/DOMAIN_COMPONENT_EXPANSION_PLAN.md`에 보존되어 있습니다. 현재 후속 검토는 `docs/COMPONENT_WORKFLOW.md`를 따릅니다.
에디터/맵/포인트클라우드 레이아웃 판단 기준은 `docs/EDITOR_LAYOUT_REFERENCE_MATRIX.md`를 먼저 봅니다.
현재 CanvasEditorShell 수정 전 감사와 작업 순서는 `docs/EDITOR_LAYOUT_AUDIT.md`를 봅니다.

토큰 계층:

- Primitive: 브랜드 원값, 스케일, 타이포그래피, 그림자, 모션
- Semantic: 표면, 텍스트, 액션, 상태, 테두리, 포커스 같은 제품 의미
- Component: Button, Input, Card 및 향후 컴포넌트 패밀리 계약

## CI

GitHub Actions는 `main` push, pull request, manual dispatch에서 `.github/workflows/ci.yml`을 실행합니다.
CI는 `npm ci`, 패키지 빌드, 토큰/타입 surface/contract/publish policy/소비 앱 smoke, 타입체크, 생성 파일 차이 검사, Storybook 정적 빌드, Storybook public surface guard, Storybook 접근성 guard, 패키지 dry run, 런타임 dependency audit을 확인합니다.

## 컴포넌트 범위

이 패키지는 다음 그룹에 걸쳐 180개의 React 컴포넌트 소스 파일을 export합니다.

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
- `mlops`
- `navigation`
- `operations`
- `overlay`
- `robotics`
- `selection`
- `status`
- `viz`

## 정리 정책

초기 raw export는 Git 이력에 보존되어 있습니다. 현재 `main`은 패키지 중심 구조이며 scratch preview, 업로드 참조, 스크린샷, gap analysis, 잘못 생성된 manifest 같은 export-only 파일은 제외합니다.

문서 탐색, 문서 유형, source-of-truth 순서는 `docs/README.md`를 먼저 보세요.
자세한 레포 구성은 `docs/REPOSITORY_INVENTORY.md`를 보세요.
신규 컴포넌트·재설계·icon/asset/map symbol의 공식 검토 절차와 문서화·CI 유지보수 기준은 `docs/COMPONENT_WORKFLOW.md`를 보세요.
디자인 시스템 계약 검증 기준은 `docs/COMPONENT_API_STATE_MATRIX.md`와 `npm run check:contracts`를 보세요.
