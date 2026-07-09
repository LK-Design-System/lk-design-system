# 컴포넌트 워크플로

이 레포는 운영 품질 게이트를 기준으로 관리합니다.

1. 패키지 빌드: `npm run build`
2. 토큰/타입 surface/contract/publish policy 검증: `npm run check:tokens`, `npm run check:type-surface`, `npm run check:contracts`, `npm run check:publish-policy`
3. 소비 앱 smoke: `npm run check:consumer`
4. 인벤토리/문서 수치 drift guard: `npm run report:inventory`, `npm run check:inventory`
5. 정적 문서 빌드와 접근성 guard: `npm run build:storybook`, `npm run check:a11y`
6. CI 게이트: `.github/workflows/ci.yml`

## 로컬 개발

의존성은 한 번 설치합니다.

```powershell
npm install
```

CI는 npm과 `package-lock.json`을 기준으로 합니다. 다만 로컬에 npm이 없고 pnpm만 있는 환경에서는 같은 이름의 `pnpm run <script>`를 사용할 수 있습니다. 패키지 스크립트는 내부에서 특정 package manager를 재호출하지 않도록 구성합니다.

Storybook 실행:

```powershell
npm run storybook
```

일상 개발 중 빠른 검사를 실행:

```powershell
npm run check:fast
```

Storybook 빌드와 public/accessibility/inventory guard를 실행:

```powershell
npm run check:storybook
```

CI가 확인하는 전체 검사를 로컬에서 실행:

```powershell
npm run check
npm run check:audit
```

시각 diff와 원본 preview 전수 렌더까지 포함한 릴리스 직전 운영 품질 검사는 아래를 실행합니다.

```powershell
npm run check:ops-release
```

## 설계 원칙

WDS Makers' Principle 중 코드로 이식 가능한 항목 (근거:
`docs/references/wds/WDS_NONCOMPONENT_RECONCILIATION.md`):

- **최소 기능 우선**: 처음에는 최소 기능/최소 prop 표면으로 만들고 필요에 따라
  넓힙니다. Variant·prop이 너무 많으면 어떤 옵션이 무슨 의미인지 파악이 어렵습니다.
- **이름 규칙 일관성**: React export는 PascalCase, 파일은 `components/<group>/`에
  그룹으로 둡니다. 유사 컴포넌트의 prop/state 이름을 계승해
  `COMPONENT_API_STATE_MATRIX.md`와 일치시킵니다 (예: `disabled`/`size`/`variant`).

## 컴포넌트 추가

1. React 컴포넌트를 알맞은 `components/<group>/` 디렉터리에 추가합니다.
2. 대응하는 `.d.ts` 계약을 추가하거나 수정합니다.
3. 재사용 가능한 시각 결정이 있으면 `tokens/components.css`에 컴포넌트 전용 토큰을 추가합니다.
4. `tokens/source.json`에 구조화된 토큰 항목을 추가합니다.
5. `npm run build`로 `src/`와 `dist/`를 재생성합니다.
6. `stories/` 아래에 대표 Storybook 스토리를 추가합니다.
7. `docs/COMPONENT_API_STATE_MATRIX.md` 기준으로 API, state, token, accessibility 계약을 갱신합니다.
8. `docs/ACCESSIBILITY_CONTRACTS.md` 기준으로 keyboard/focus/screen reader 근거를 확인합니다.
9. 원본 카드와 대응되면 `stories/Audit.data.jsx`에 숨김 매핑 데이터를 갱신합니다.
10. public export, Storybook story, 문서 수치가 바뀌면 `npm run report:inventory`로 값을 확인하고 관련 문서를 갱신합니다.
11. push 전에 변경 범위에 맞춰 `npm run check:fast`, `npm run check:storybook`, 또는 `npm run check`를 실행합니다.

## 토큰 소스 범위

AI/Figma가 읽는 토큰 맵은 `tokens/source.json`에 있습니다.
런타임 component token layer는 `tokens/components.css`에 있습니다.
AI 도구로 UI를 생성하기 전에는 `docs/AI_DESIGN_SYSTEM_GUIDE.md`를 읽습니다.
Figma Variables export/import, 토큰 lifecycle, deprecation, breaking change 기준은 `docs/TOKEN_GOVERNANCE.md`를 우선합니다.

## Storybook 범위

Storybook은 모든 구현 세부사항이 아니라 실제로 필요한 컴포넌트 상태를 문서화합니다. 원본 카드와 1:1 비교하기 위한 `visual-parity` story는 `!dev` 태그로 sidebar에서 숨기고, public story에는 대표 상태만 남깁니다.
Public Storybook title은 사용자 탐색 기준입니다. `LDS Core/Foundation`, `LDS Core/Components/<family>`, `LDS Theme/...`, `LDS Product/...`, `LDS Robotics/...`를 사용하고, `1 Theme`, `2 Element`, `3 Component / 2 Action` 같은 WDS 원천 번호 체계는 `docs/references/wds/`의 근거 데이터에만 남깁니다.
`LDS Product`와 `LDS Robotics` story는 재사용 가능한 확장 컴포넌트나 패턴이어야 합니다. 완성 앱 화면, 템플릿, 워크플로우, 데모 페이지는 Storybook public surface로 추가하지 않습니다.
디자인 시스템 계약은 Storybook 문서 페이지가 아니라 `docs/` 아래 Markdown 문서와 검증 스크립트에 둡니다. 도메인별 기준은 별도 결과 화면을 만들지 않고 관련 컴포넌트 story와 `docs/ROBOTICS_PATTERNS.md` 같은 문서 계약에 반영합니다.
우선순위:

- 기본 상태
- disabled 또는 error 상태
- 밀도 높은 dashboard 상태
- 관련 있는 경우 inverse/dark 상태
- 도메인 운영에 특화된 상태

## CI 범위

GitHub Actions workflow는 `main` push, pull request, manual dispatch에서 실행됩니다.
검증 항목:

- `npm ci`로 의존성 설치
- 패키지 빌드
- 기계가 읽을 수 있는 토큰 소스 검증
- public `.d.ts` surface와 `any` 누출 검증
- 디자인 시스템 계약 문서와 자동 contract 검증
- `private: true` 내부 Git 소비 / GitHub Packages 전환 정책 검증
- 실제 소비 앱 Vite production smoke
- TypeScript typecheck
- 생성된 source와 `dist/` drift 검사
- Storybook 정적 빌드
- 인벤토리/문서 수치 drift 검사
- Storybook public surface 중복/숨김 guard
- Storybook 구현 story 접근성 guard
- package dry run
- 런타임 dependency audit


## Publish policy

현재 패키지는 `private: true` 상태로 유지합니다. 기본 운영 모델은 내부 Git 소비이며, npm publish가 필요해지는 시점에만 GitHub Packages registry 설정과 함께 `package.json`, 문서, CI 정책을 명시적으로 변경합니다. `npm run check:pack`은 사용 가능한 package manager로 pack dry run을 실행해 패키지 파일 구성이 깨지지 않는지 확인합니다.
