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

첫 번째 구조화된 component-token 적용 범위는 Button, Input, Card입니다. 나머지 컴포넌트 라이브러리는 아직 semantic 토큰과 로컬 값을 함께 사용합니다. 이후 작업에서는 각 컴포넌트 패밀리를 같은 primitive -> semantic -> component 구조로 옮기면 됩니다.
