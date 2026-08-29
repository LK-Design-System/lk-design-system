# 레포 인벤토리

| Field | Value |
| --- | --- |
| Type | Current register |
| Status | Current |
| Owner | Frontend platform · Design system owner |
| Last reviewed | 2026-08-23 |
| Update | `npm run report:inventory` · `npm run check:inventory` |

Storybook의 732개 스토리 역할·공개 여부·소유 컴포넌트와 196개 페이지 판정은 [`STORYBOOK_INFORMATION_ARCHITECTURE.md`](STORYBOOK_INFORMATION_ARCHITECTURE.md) 및 `references/quality/STORYBOOK_INFORMATION_ARCHITECTURE_AUDIT.json`을 기준으로 한다.

이 레포는 Core·Theme·Product owner package를 함께 개발하고 검증하는 LDS workspace입니다. 루트는 배포 패키지가 아니라 private orchestrator이며, Robotics UI는 별도 저장소와 패키지가 소유합니다.

## 패키지 범위

- 워크스페이스 orchestrator: `@lk-design-system/lds-workspace@0.2.1` · `private: true`
- Core: `@lk-design-system/lds-core@0.2.1` · source entry 93개 · named export 94개
- Theme: `@lk-design-system/lds-theme@0.2.1` · source entry 4개 · named export 8개
- Product: `@lk-design-system/lds-product@0.2.1` · source entry 120개 · named export 128개
- 로컬 owner-package canonical unique surface: source entry 208개 · named export 221개
- Product deprecated compatibility projection: source entry 9개 · named export 9개
- 외부 Robotics: `@lk-design-system/lds-robotics-ui@0.1.0-rc.36` · source entry 23개 · named export 53개
- Robotics 정본: `LK-Design-System/lk-design-system-robotics`와 `references/package-split/ROBOTICS_EXTERNAL_SURFACE.json`. 로컬 publishable package는 Robotics를 재노출하지 않으며 consumer는 외부 패키지를 직접 설치합니다.
- 컴포넌트 소스 디렉터리 18개: `brand`, `buttons`, `cards`, `communication`, `content`, `data`, `editor`, `feedback`, `forms`, `icon`, `internal`, `layout`, `navigation`, `overlay`, `robotics`, `selection`, `status`, `viz`
- 런타임 peer dependency: `react`
- 선택 peer dependency: `react-dom`
- 지원되는 빌드 결과물: `packages/core/dist`, `packages/theme/dist`, `packages/product/dist`

## 주요 소스 영역

- `components/`: React 컴포넌트, 컴포넌트 타입 선언, 프롬프트 노트
- `tokens/`: CSS 디자인 토큰, component token, base style, machine-readable `source.json` 토큰 맵
- `assets/`: 브랜드 SVG, Pretendard 폰트 파일, 제품/산업/기술 이미지
- `styles.css`: 토큰 import용 최상위 CSS 진입점
- `packages/core/src`, `packages/theme/src`, `packages/product/src`: owner package별 생성 진입 파일과 투영된 구현
- `src/`: private workspace의 생성된 legacy build/census 투영. consumer import authority가 아님
- `docs/references/package-split/ROBOTICS_EXTERNAL_SURFACE.json`: 외부 Robotics package·revision·문서·public surface 정본
- `docs/references/architecture/OWNER_AUTHORITY_CONTRACT.json`: live package·token·Storybook owner와 cross-domain boundary authority
- `docs/references/wds/PUBLIC_EXPORT_CLASSIFICATION.json`: public export와 internal module의 historical provenance·compatibility projection
- `docs/components/`: 208개 entry, 177개 의사결정 가이드, 정적 reference·platform register, LLM bundle과 machine-readable component registry
- `scripts/`: 패키지 유지보수 스크립트
- `.storybook/`: Storybook 런타임 설정
- `stories/`: 인터랙티브 컴포넌트 문서와 시각 예시
- `.github/workflows/ci.yml`: GitHub Actions CI 게이트
- `docs/AI_DESIGN_SYSTEM_GUIDE.md`: AI 사용 규칙과 토큰 계층 가이드
- `docs/TOKEN_GOVERNANCE.md`: 토큰 lifecycle, Figma Variables export/import, release gate
- `docs/EDITOR_LAYOUT_REFERENCE_MATRIX.md`: 에디터/맵/포인트클라우드 레이아웃 판단 기준표
- `docs/EDITOR_LAYOUT_AUDIT.md`: CanvasEditorShell 코드 수정 전 IA 감사와 작업 순서

## LDS/WDS provenance 검증 기준

WDS parity의 근거는 수락된 로컬 `.fig` 스냅샷(`docs/references/wds/`)과 Storybook의 LDS 컴포넌트/패턴 표면입니다. Storybook은 LDS 컴포넌트와 패턴 표면으로 제한하고, visual parity story는 `!dev`와 `visual-parity` 태그로 숨깁니다.

- 현재 React component entry export: 208개
- 공개 named export: 221개
- Storybook 전체 story: 734개
- Storybook public story: 505개
- Storybook hidden story: 229개
- 숨김 visual parity story: 97개
- visual inventory React story: 734개
- 접근성 guard 검사 대상 implementation story: 734개

## 생성 영역

- `packages/*/dist/`: publishable owner package 빌드 결과물. 빌드에서 생성하며 Git에는 커밋하지 않습니다.
- `dist/`: private workspace의 legacy build 검증 투영. 지원되는 consumer package surface가 아닙니다.
- `storybook-static/`: Storybook 검증 빌드. 생성하며 Git에는 커밋하지 않습니다.
- `scripts/report-inventory.mjs`: 컴포넌트, owner package entry, 외부 Robotics contract, Storybook 수치를 generated source와 `storybook-static/index.json`에서 산출하고 문서 drift를 검증합니다.

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

- 루트 `src/*`와 `packages/*/src`의 생성 진입 파일은 직접 수정하지 않습니다. 각각 `npm run generate:entry`, `npm run generate:workspace-sources`를 실행하세요.
- 현재 수치는 `npm run report:inventory`로 확인하고, 문서/Storybook 표시값은 `npm run check:inventory`로 stale 여부를 검증합니다.
- 루트만 `private: true`인 orchestrator입니다. Core·Theme·Product는 `https://npm.pkg.github.com`의 restricted package로 배포하며, Robotics는 외부 owner package를 직접 소비합니다.
- `tokens/source.json`은 `tokens/*.css`와 맞춰야 합니다. `npm run check:tokens`가 component-token 참조를 검증합니다.
- `components/` 아래에 컴포넌트를 추가하면 대응 `.d.ts`를 추가하고 `npm run build`를 실행합니다.
- push 전 변경 범위에 맞춰 `npm run check:fast`, `npm run check:storybook`, `npm run check`, `npm run check:audit`, 필요 시 `npm run check:ops-release`를 실행합니다.
