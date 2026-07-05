# 컴포넌트 워크플로

이 레포는 네 단계 검증을 기준으로 관리합니다.

1. 패키지 빌드: `npm run build`
2. 정적 문서 빌드: `npm run build:storybook`
3. 토큰 소스 검증: `npm run check:tokens`
4. CI 게이트: `.github/workflows/ci.yml`

## 로컬 개발

의존성은 한 번 설치합니다.

```powershell
npm install
```

Storybook 실행:

```powershell
npm run storybook
```

CI가 확인하는 전체 검사를 로컬에서 실행:

```powershell
npm run check
npm run check:audit
```

## 컴포넌트 추가

1. React 컴포넌트를 알맞은 `components/<group>/` 디렉터리에 추가합니다.
2. 대응하는 `.d.ts` 계약을 추가하거나 수정합니다.
3. 재사용 가능한 시각 결정이 있으면 `tokens/components.css`에 컴포넌트 전용 토큰을 추가합니다.
4. `tokens/source.json`에 구조화된 토큰 항목을 추가합니다.
5. `npm run build`로 `src/`와 `dist/`를 재생성합니다.
6. `stories/` 아래에 대표 Storybook 스토리를 추가합니다.
7. push 전에 `npm run check`를 실행합니다.

## 토큰 소스 범위

AI/Figma가 읽는 토큰 맵은 `tokens/source.json`에 있습니다.
런타임 component token layer는 `tokens/components.css`에 있습니다.
AI 도구로 UI를 생성하기 전에는 `docs/AI_DESIGN_SYSTEM_GUIDE.md`를, Figma Variables를 export/import하기 전에는 `docs/FIGMA_TOKEN_WORKFLOW.md`를 읽습니다.

## Storybook 범위

Storybook은 모든 구현 세부사항이 아니라 실제로 필요한 컴포넌트 상태를 문서화합니다.
우선순위:

- 기본 상태
- disabled 또는 error 상태
- 밀도 높은 dashboard 상태
- 관련 있는 경우 inverse/dark 상태
- 로보틱스 운영에 특화된 상태

## CI 범위

GitHub Actions workflow는 `main` push, pull request, manual dispatch에서 실행됩니다.
검증 항목:

- `npm ci`로 의존성 설치
- 패키지 빌드
- 기계가 읽을 수 있는 토큰 소스 검증
- TypeScript typecheck
- 생성된 source와 `dist/` drift 검사
- Storybook 정적 빌드
- package dry run
- 런타임 dependency audit
