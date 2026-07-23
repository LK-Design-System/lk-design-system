# 레포 인벤토리

| Field | Value |
| --- | --- |
| Type | Current register |
| Status | Current |
| Owner | Frontend platform · Design system owner |
| Last reviewed | 2026-07-20 |
| Update | `npm run report:inventory` · `npm run check:inventory` |

Storybook의 579개 스토리 역할·공개 여부·소유 컴포넌트와 190개 페이지 판정은 [`STORYBOOK_INFORMATION_ARCHITECTURE.md`](STORYBOOK_INFORMATION_ARCHITECTURE.md) 및 `references/quality/STORYBOOK_INFORMATION_ARCHITECTURE_AUDIT.json`을 기준으로 한다.

이 레포는 패키지 중심의 LK ROBOTICS 핵심 디자인 시스템입니다.

## 패키지 범위

- 패키지명: `@lk-robotics/design-system-core`
- React 컴포넌트 소스 파일: 173개
- 공개 named export: 176개
- 루트 aggregate export: Core 82개 · Theme 2개 · Product 92개 = 176개
- Robotics compatibility entry: `./robotics`가 별도 `@lk-robotics/lds-robotics-ui`의 34개 export를 재노출하며, 위 aggregate 수치에는 포함하지 않음
- 컴포넌트 소스 디렉터리 18개: `brand`, `buttons`, `cards`, `communication`, `content`, `data`, `editor`, `feedback`, `forms`, `icon`, `internal`, `layout`, `navigation`, `overlay`, `robotics`, `selection`, `status`, `viz`
- 런타임 peer dependency: `react`
- 선택 peer dependency: `react-dom`
- 빌드 결과물: aggregate `dist/index.*`, 계층별 `dist/core.*` · `dist/theme.*` · `dist/product.*`, Robotics compatibility shim `dist/robotics.*`

## 주요 소스 영역

- `components/`: React 컴포넌트, 컴포넌트 타입 선언, 프롬프트 노트
- `tokens/`: CSS 디자인 토큰, component token, base style, machine-readable `source.json` 토큰 맵
- `assets/`: 브랜드 SVG, Pretendard 폰트 파일, 제품/산업/기술 이미지
- `styles.css`: 토큰 import용 최상위 CSS 진입점
- `src/`: aggregate root와 Core·Theme·Product·Robotics의 생성된 패키지 진입 파일
- `docs/references/wds/PUBLIC_EXPORT_CLASSIFICATION.json`: public export와 internal module의 owner layer/provenance authority
- `scripts/`: 패키지 유지보수 스크립트
- `.storybook/`: Storybook 런타임 설정
- `stories/`: 인터랙티브 컴포넌트 문서와 시각 예시
- `.github/workflows/ci.yml`: GitHub Actions CI 게이트
- `docs/AI_DESIGN_SYSTEM_GUIDE.md`: AI 사용 규칙과 토큰 계층 가이드
- `docs/TOKEN_GOVERNANCE.md`: 토큰 lifecycle, Figma Variables export/import, release gate
- `docs/EDITOR_LAYOUT_REFERENCE_MATRIX.md`: 에디터/맵/포인트클라우드 레이아웃 판단 기준표
- `docs/EDITOR_LAYOUT_AUDIT.md`: CanvasEditorShell 코드 수정 전 IA 감사와 작업 순서

## WDS parity 검증 기준

WDS parity의 근거는 수락된 로컬 `.fig` 스냅샷(`docs/references/wds/`)과 Storybook의 LDS 컴포넌트/패턴 표면입니다. Storybook은 LDS 컴포넌트와 패턴 표면으로 제한하고, visual parity story는 `!dev`와 `visual-parity` 태그로 숨깁니다.

- 현재 React component entry export: 173개
- 공개 named export: 176개
- Storybook 전체 story: 432개
- Storybook public story: 328개
- Storybook hidden story: 102개
- 숨김 visual parity story: 73개
- visual inventory React story: 432개
- 접근성 guard 검사 대상 implementation story: 432개

## 생성 영역

- `dist/`: 패키지 빌드 결과물. 내부 Git 소비자가 별도 publish 없이 import할 수 있도록 커밋합니다.
- `scripts/report-inventory.mjs`: 컴포넌트, export, Storybook 수치를 현재 파일 시스템과 `storybook-static/index.json`에서 산출하고 문서 drift를 검증합니다.

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
- 현재 수치는 `npm run report:inventory`로 확인하고, 문서/Storybook 표시값은 `npm run check:inventory`로 stale 여부를 검증합니다.
- 배포 정책은 현재 `private: true`이며 내부 Git 소비를 기본으로 합니다. 정식 npm publish로 전환할 때만 `private` 값을 바꾸고 GitHub Packages 설정과 운영 문서를 함께 갱신합니다. 그 전까지 `dist/`는 Git에 유지합니다.
- `tokens/source.json`은 `tokens/*.css`와 맞춰야 합니다. `npm run check:tokens`가 component-token 참조를 검증합니다.
- `components/` 아래에 컴포넌트를 추가하면 대응 `.d.ts`를 추가하고 `npm run build`를 실행합니다.
- push 전 변경 범위에 맞춰 `npm run check:fast`, `npm run check:storybook`, `npm run check`, `npm run check:audit`, 필요 시 `npm run check:ops-release`를 실행합니다.
