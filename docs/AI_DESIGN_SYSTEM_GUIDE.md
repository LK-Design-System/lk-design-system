# AI 디자인 시스템 가이드

AI 도구에게 LK ROBOTICS UI 설계나 구현을 맡길 때 가장 먼저 제공할 문서입니다. 목적은 디자인 시스템을 CSS 값 모음이 아니라 디자이너, 엔지니어, AI가 함께 쓰는 공통 언어로 만드는 것입니다.

## 기준 소스

- 런타임 CSS 진입점: `styles.css`
- 기계가 읽을 수 있는 토큰 소스: `tokens/source.json`
- 컴포넌트 토큰 런타임 레이어: `tokens/components.css`
- 컴포넌트 구현: `components/**`
- 인터랙티브 문서: `stories/**`

`styles.css`는 제품 앱이 import하는 런타임 계약입니다. `tokens/source.json`은 AI 도구, Figma 워크플로, 향후 토큰 변환 파이프라인이 읽을 구조화된 토큰 맵입니다.

## 토큰 계층

1. Primitive 토큰은 브랜드 색상, 간격 스케일, radius, 타이포그래피, 그림자, 모션 같은 원천 결정을 정의합니다.
2. Semantic 토큰은 표면, 텍스트, 액션, 상태, 테두리, 포커스, 컨트롤 크기 같은 제품 의미를 정의합니다.
3. Component 토큰은 Button, Input, Card 및 향후 컴포넌트 패밀리가 재사용할 계약을 정의합니다.

가능한 한 높은 계층의 토큰을 사용하세요.

- 제품 UI는 semantic 토큰을 우선 사용합니다.
- 컴포넌트 소스는 component 토큰을 우선 사용합니다.
- primitive 토큰은 semantic/component 토큰을 정의하거나 수정할 때만 사용합니다.

label 계열은 대비 기준으로 용도가 나뉩니다. `label-strong`·`label-normal`·`label-neutral`·`label-alternative`는 AA(4.5:1)를 충족하므로 텍스트에 사용할 수 있습니다 (`label-alternative`는 WDS의 0.61 알파가 AA에 미달해 LK retone에서 0.74로 올린 값입니다 — `tokens/source.json`의 note 참조). `label-assistive`와 `label-disable`은 AA 미달이므로 placeholder·disabled·장식적 보조 요소 전용이며, 화면 이해에 필요한 텍스트에는 쓰지 않습니다.

## AI 사용 규칙

UI 코드를 생성할 때:

- 앱 진입점에서 `@lk-robotics/design-system-core/styles.css`를 한 번 import합니다.
- 공통 UI를 새로 만들기 전에 패키지가 export하는 React 컴포넌트를 먼저 사용합니다.
- Button/Input/Card 내부 동작과 시각 값은 component 토큰을 사용합니다.
- 제품 레이아웃, 카피, 상태, surface는 semantic 토큰을 사용합니다.
- 디자인 시스템을 확장하는 작업이 아니라면 새 hex 색상, 임의 그림자, 일회성 spacing을 만들지 않습니다.
- 다른 AI 도구에게 토큰 계층을 설명할 때 `tokens/source.json`을 우회하지 않습니다.
- LK ROBOTICS 시각 톤을 유지합니다: 차가운 navy 기반, 절제된 azure signal, 차분한 상태 색상, 밀도 있지만 안정적인 운영 UI.

## 컴포넌트 토큰 계약

### Button

구현 파일: `components/buttons/Button.jsx`

주요 컴포넌트 토큰:

- `--component-button-height-sm`
- `--component-button-height-md`
- `--component-button-height-lg`
- `--component-button-radius`
- `--component-button-primary-bg`
- `--component-button-primary-bg-hover`
- `--component-button-primary-fg`
- `--component-button-secondary-bg`
- `--component-button-signal-bg`
- `--component-button-danger-bg` (LDS safety extension; not WDS parity)
- `--component-button-disabled-opacity`

### Input

구현 파일: `components/forms/Input.jsx`

주요 컴포넌트 토큰:

- `--component-input-height`
- `--component-input-padding-x`
- `--component-input-bg`
- `--component-input-border-color`
- `--component-input-border-color-focus`
- `--component-input-border-color-invalid`
- `--component-input-focus-shadow`
- `--component-input-label-font-size`

### Card

구현 파일: `components/cards/Card.jsx`

주요 컴포넌트 토큰:

- `--component-card-bg`
- `--component-card-bg-dark`
- `--component-card-fg`
- `--component-card-border`
- `--component-card-radius`
- `--component-card-padding`
- `--component-card-shadow-md`
- `--component-card-shadow-lg`

### ActionArea

구현 파일: `components/buttons/ActionArea.jsx`

- `--component-action-area-padding-x`
- `--component-action-area-padding-y`
- `--component-action-area-gap`
- `--component-action-area-border`

일반 persistent CTA는 기본 `Button` medium 높이 40px을 사용하고, row-local action과 toolbar command만 명시적으로 small 32px을 사용합니다.

### ConfirmDialog

구현 파일: `components/overlay/ConfirmDialog.jsx`

- `--component-dialog-radius`
- `--component-dialog-scrim`
- `--component-dialog-scrim-blur`
- `--component-confirm-dialog-max-width`

warning/danger 의미는 색상만으로 표현하지 않고 visible `StatusBadge` text와 함께 제공합니다.

## Severity surface 문법

상태(severity)를 표현하는 표면은 아래 문법을 따릅니다. 새 status·요약·목록 컴포넌트를 추가할 때 이 표에서 역할을 먼저 고르고, 다른 조합을 발명하지 않습니다.

| 역할 | 예 | 표면 처리 |
| --- | --- | --- |
| 단일 메시지 표면 | `Callout`, `Banner` | 전체 tinted surface + 같은 tone의 hairline border |
| 제출/검증 결과 요약 | `ValidationSummary` | 중립 목록 본문 + severity 구역 heading band(tone surface/border) + 최고 심각도의 외곽 hairline |
| 진행형 작업 목록 | `FileUploadQueue` | 카드 외곽·헤더는 항상 중립. 상태는 행 단위 `StatusBadge`·아이콘·텍스트로만 표현 |

- 색은 semantic `status-*` 토큰(또는 그 alias인 `component-banner/callout-*`)만 사용합니다. severity 색을 새로 정의하지 않습니다.
- severity 글리프는 `Icon` registry + `statusToneStyle` 매핑(`signal=circle-info-fill`, `positive=circle-check-fill`, `cautionary=triangle-exclamation-fill`, `negative=circle-close-fill`)으로 고정합니다. 인라인 SVG로 다시 그리지 않습니다.
- 카운트 문법: 심각도별로 그룹핑된 요약은 구역 band heading에 카운트를 표시하고, 상태가 섞인 단일 목록은 헤더의 `StatusBadge` 칩으로 요약합니다. 두 방식을 한 컴포넌트에서 함께 쓰지 않습니다.
- 색만으로 의미를 전달하지 않습니다. tint에는 항상 아이콘 또는 명시적 상태 문구가 동반되어야 합니다.

## 프롬프트 템플릿

AI 도구에 요청할 때 아래 구조를 사용하세요.

```text
You are designing with the LK ROBOTICS design system.
Read docs/AI_DESIGN_SYSTEM_GUIDE.md and tokens/source.json first.
Import @lk-robotics/design-system-core/styles.css.
Prefer exported components from @lk-robotics/design-system-core.
Use semantic tokens for product UI and component tokens for Button/Input/Card behavior.
Do not invent colors, spacing, shadows, or control dimensions unless adding a reviewed token.
Output production React code.
```

프롬프트 자체는 영어로 유지해도 됩니다. 많은 AI 도구가 코드 생성 지시를 영어로 더 안정적으로 처리하기 때문입니다.

## 확장 규칙

토큰을 추가할 때:

1. `tokens/*.css`에 런타임 CSS 토큰을 추가하거나 수정합니다.
2. `tokens/source.json`에 구조화된 토큰 항목을 추가합니다.
3. 컴포넌트 전용 토큰이면 `tokens/components.css`에 둡니다.
4. 관련 컴포넌트 구현에서 해당 토큰을 사용합니다.
5. 토큰 동작을 보여주는 Storybook 스토리를 추가하거나 수정합니다.
6. push 전에 `npm run check`를 실행합니다.

## 현재 범위

구조화된 component-token 적용 범위는 Button, ActionArea, ConfirmDialog, Input, Card와 일부 선택/피드백 primitives까지 확장되어 있습니다. 나머지 컴포넌트 라이브러리는 semantic 토큰과 필요한 layout contract를 함께 사용하며, 새 component-specific 시각 값은 같은 primitive -> semantic -> component 구조로 추가합니다.
