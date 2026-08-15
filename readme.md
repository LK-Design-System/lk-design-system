# LK 디자인 시스템 코어

## License and attribution

LDS is based on **Montage, the Wanted Design System by Wantedlab**, and adapts
its foundations, component structure, and documentation conventions for
LK ROBOTICS.

> 디자인 시스템: [Montage by Wantedlab](https://montage.wanted.co.kr/) (MIT)

Montage is used under the MIT License. LDS is an independent derivative and is
not affiliated with, endorsed by, or presented as Wantedlab. Wanted logos,
wordmarks, and other Wanted brand assets are not part of the reusable LDS
license grant.

The upstream copyright notice, MIT permission notice, modification disclosure,
and other third-party credits are recorded in
[`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md). Consumers that redistribute
LDS or substantial portions of its Montage-derived material must retain that
notice and should display the attribution above in their product documentation
or another appropriate attribution surface.

## 작업 시작 경로

컴포넌트 교체만으로 LDS 전환은 완료되지 않는다.

| 작업 | 필수 진입점 |
| --- | --- |
| 제품 UI 신규 구현·LDS 적용·전환·재스타일링 | [`LDS UI 적용·전환 워크플로`](docs/LDS_UI_ADOPTION_WORKFLOW.md) |
| LDS component·reusable pattern·icon·asset 저작 | [`컴포넌트 워크플로`](docs/COMPONENT_WORKFLOW.md) |
| shared token 추가·변경 | [`Token Governance`](docs/TOKEN_GOVERNANCE.md) |
| owner package import·CSS migration | [`Package Migration Guide`](docs/PACKAGE_MIGRATION_GUIDE.md) |
| 전체 문서 탐색 | [`Documentation index`](docs/README.md) |

AI context의 루트 진입점은 [`llms.txt`](llms.txt)입니다. LDS 전환을 시작하기 전에 human workflow 또는 이 generated bundle을 읽고, 모든 필수 비컴포넌트 facet과 `componentMapping`을 검토합니다.

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
as arbitrary screens designed beside WDS.**

### Reference models and graduation

WDS is the **bootstrap scaffold, not a permanent parity target.** LDS's identity
center is the **LK operational domain** — dense, status-first, safety- and
recovery-aware operations surfaces. WDS supplies structure and conventions to
start from; LDS graduates from WDS wherever the operational domain needs a
different answer. Parity evidence exists to make divergence **deliberate and
traceable**, not to hold LDS to a consumer-web design center.

shadcn/ui is a **second selective mirror**, not a migration target: a
developer/operational primitive system closer to LDS's domain. LDS absorbs its
structural lessons (declarative nesting, group structure) while keeping LDS
governance — enforced accessibility, API grammar ratchet, and token layering.
See [`docs/references/quality/BENCHMARK_SHADCN.md`](docs/references/quality/BENCHMARK_SHADCN.md)
and [`docs/API_OPENNESS_POLICY.md`](docs/API_OPENNESS_POLICY.md).

New work should either map to a reference-model structure, be documented as an LK
override, or live in an explicit LK extension layer. **Where the operational
domain and a reference model conflict, the operational domain wins.**

Authoritative references:

- `DESIGN.md` — LK Operations Dashboard scope, design principles, and layer ownership
- `docs/references/quality/BENCHMARK_SHADCN.md` — shadcn/ui selective-mirror benchmark
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
import { Button } from '@lk-design-system/lds-core';
import { ThemeToggle } from '@lk-design-system/lds-theme';
import { ProductCard, TopBar } from '@lk-design-system/lds-product';
import { RobotStatusCard } from '@lk-design-system/lds-robotics-ui';

import '@lk-design-system/lds-core/styles.css';
import '@lk-design-system/lds-theme/styles.css';
import '@lk-design-system/lds-product/styles.css';
import '@lk-design-system/lds-robotics-ui/styles.css';
```

새 코드는 `@lk-design-system/lds-core`, `@lk-design-system/lds-theme`,
`@lk-design-system/lds-product`, `@lk-design-system/lds-robotics-ui`의 public export를
사용합니다. 과거의 `@lk-design-system/design-system-core` compatibility facade는
migration support window가 끝나 2026-08-16에 제거됐습니다. 아직 그 패키지를 참조하는
코드가 있다면 root와 layer subpath는 해당 owner 패키지로, `components/*`는 같은 경로의
owner 패키지 deep import로 바꾸면 됩니다.

패키지 메타데이터:

- workspace root: `@lk-design-system/lds-workspace` (`private: true`; 현재 버전은 root `package.json`이 소유)
- current packages: `@lk-design-system/lds-core`, `@lk-design-system/lds-theme`,
  `@lk-design-system/lds-product`
  (각 현재 버전은 package manifest가 소유)
- external Robotics: `@lk-design-system/lds-robotics-ui`,
  `LK-Design-System/lk-design-system-robotics`
  - direct package AI entry: `@lk-design-system/lds-robotics-ui/llms.txt`
  - package documentation manifest: `@lk-design-system/lds-robotics-ui/design-system.json`
  - live Robotics docs: [Storybook](https://lk-design-system.github.io/lk-design-system-robotics/?path=/docs/lds-robotics-foundation-viewer-tokens--docs) · [llms.txt](https://lk-design-system.github.io/lk-design-system-robotics/llms.txt) · [design-system.json](https://lk-design-system.github.io/lk-design-system-robotics/design-system.json)
- private workspace bootstrap: the exact Robotics RC tarball is retained under
  `vendor/` so clean CI installs do not depend on the retired pre-move package URL;
  source ownership remains in the external Robotics repository
- 배포 정책: publishable package는 restricted GitHub Packages를 사용하며 root workspace만
  private입니다. 실제 제품 adoption과 stable promotion은 release evidence와 별도로 승인합니다.
- 런타임 peer dependency: `react`; 선택 peer dependency: `react-dom`
- legacy aggregate 진입점은 compatibility window 동안 유지하지만 신규 코드는 owner package
  public export를 사용합니다.

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
npm run check:layers
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

패키지 진입 파일은 현재 React 컴포넌트 소스 파일(`components/**/*.jsx`) 기준으로 생성됩니다. 최신 수치는 `npm run report:inventory`가 소유합니다.

```powershell
npm run generate:entry
```

`src/index.*`와 `src/{core,theme,product,robotics}.*`는 직접 수정하지 마세요.

## Storybook

Storybook은 컴포넌트를 확인하고 문서화하는 인터랙티브 표면입니다.

```powershell
npm run storybook
npm run build:storybook
```

현재 이 저장소의 public Storybook sidebar는 `LDS Core/Foundation`, `LDS Core/Components`, `LDS Theme`, `LDS Product` 아래의 컴포넌트와 패턴 표면을 다룹니다. 최신 story 수치는 `npm run report:inventory`가 소유하며, `LDS Robotics` Storybook은 `LK Design System Robotics` 저장소가 별도로 소유합니다.
WDS 원천 번호 체계(`1 Theme`, `3 Component / 2 Action` 등)는 public sidebar title이 아니라 `docs/references/wds/`의 근거 데이터에만 남깁니다.
`LDS Product`와 별도 저장소의 `LDS Robotics`는 재사용 가능한 확장 컴포넌트/패턴만 다루며, 완성된 앱 화면, 템플릿, 워크플로우, 데모 페이지를 Storybook source of truth로 올리지 않습니다.
보고/감사/보정표 UI와 운영 문서는 Storybook에 노출하지 않습니다. 원본 파일과 React 표면의 대응 데이터는 `stories/Audit.data.jsx`에 보관하고, 자동 검증 스크립트가 이 데이터를 읽습니다.
WDS 원본 및 실제 확장 컴포넌트 회귀를 비교하기 위한 `visual-parity` story는 direct iframe 검증용으로만 남기고 `!dev` 태그로 sidebar에서 숨깁니다. `npm run check:storybook-public`이 public 중복 노출과 parity story 노출을 차단합니다.
접근성, 토큰 lifecycle, 컴포넌트 상태 매트릭스, 도메인 컴포넌트 계약, 릴리즈와 ownership 같은 기준은 `docs/` 아래 Markdown 문서에서 관리합니다.
컴포넌트 선택·Anatomy·properties·states·정량 규칙·Do/Don't·접근성·token/API는 `docs/components/`의 생성 가이드와 각 공개 Storybook `개요`에서 확인합니다. `.prompt.md`, `.d.ts`, source, Storybook audit와 token source를 변경한 뒤 `npm run generate:components`와 `npm run check:components`를 실행합니다.
레포 수치가 바뀌면 `npm run report:inventory`로 현재 값을 확인하고, `npm run check:inventory`로 README/docs/story 표시 수치가 stale하지 않은지 검증합니다.

## AI 및 Figma 토큰 워크플로

AI 도구는 먼저 [`LDS UI 적용·전환 워크플로`](docs/LDS_UI_ADOPTION_WORKFLOW.md)를 따릅니다. [`AI 디자인 시스템 가이드`](docs/AI_DESIGN_SYSTEM_GUIDE.md)는 copy·data display·severity·운영 composition 같은 구현 규칙으로 연결하고, [`llms.txt`](llms.txt)는 machine-readable adoption contract를 한 번에 찾는 generated 진입점입니다.

Figma Variables export/import, token lifecycle과 deprecation은 [`Token Governance`](docs/TOKEN_GOVERNANCE.md), owner package import와 CSS 순서는 [`Package Migration Guide`](docs/PACKAGE_MIGRATION_GUIDE.md)가 소유합니다. 컴포넌트 API와 접근성은 [`Component API State Matrix`](docs/COMPONENT_API_STATE_MATRIX.md), [`Accessibility Contracts`](docs/ACCESSIBILITY_CONTRACTS.md)를 함께 봅니다.

토큰 계층:

- Primitive: 브랜드 원값, 스케일, 타이포그래피, 그림자, 모션
- Semantic: 표면, 텍스트, 액션, 상태, 테두리, 포커스 같은 제품 의미
- Component: Button, Input, Card 및 향후 컴포넌트 패밀리 계약

## CI

GitHub Actions는 `main` push, pull request, manual dispatch에서 `.github/workflows/ci.yml`을 실행합니다.
CI는 `npm ci`, 패키지 빌드, 토큰/타입 surface/contract/publish policy/소비 앱 smoke, 타입체크, 생성 파일 차이 검사, Storybook 정적 빌드, Storybook public surface guard, Storybook 접근성 guard, 패키지 dry run, 런타임 dependency audit을 확인합니다.

## 컴포넌트 범위

이 패키지는 다음 그룹에 걸쳐 React 컴포넌트 소스 파일을 export합니다. 최신 수치는 generated inventory에서 확인합니다.

- `brand`
- `buttons`
- `cards`
- `communication`
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

## 정리 정책

초기 raw export는 Git 이력에 보존되어 있습니다. 현재 `main`은 패키지 중심 구조이며 scratch preview, 업로드 참조, 스크린샷, gap analysis, 잘못 생성된 manifest 같은 export-only 파일은 제외합니다.

문서 탐색, 문서 유형, source-of-truth 순서는 `docs/README.md`를 먼저 보세요.
자세한 레포 구성은 `docs/REPOSITORY_INVENTORY.md`를 보세요.
신규 컴포넌트·재설계·icon/asset/map symbol의 공식 검토 절차와 문서화·CI 유지보수 기준은 `docs/COMPONENT_WORKFLOW.md`를 보세요.
디자인 시스템 계약 검증 기준은 `docs/COMPONENT_API_STATE_MATRIX.md`와 `npm run check:contracts`를 보세요.
