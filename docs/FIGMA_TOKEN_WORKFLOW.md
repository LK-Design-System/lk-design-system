# Figma 토큰 워크플로

이 워크플로는 현재 디자인 시스템을 손상시키지 않으면서 Figma Variables, `tokens/source.json`, 런타임 CSS를 맞추기 위한 기준입니다.

## 컬렉션

Figma Variables는 세 개의 컬렉션으로 나눕니다.

| 컬렉션 | 목적 | 예시 |
| --- | --- | --- |
| Primitive | 브랜드 원값과 스케일 | `color/brand/navy`, `space/4`, `radius/md` |
| Semantic | 제품 의미 | `surface/card`, `text/body`, `action/primary`, `status/danger` |
| Component | 컴포넌트 계약 | `button/primary/bg`, `input/border/focus`, `card/shadow/md` |

같은 컬렉션 안에서 mode를 사용합니다.

- `light`
- `dark`
- `auto`: Figma에서 OS mode를 직접 해석하기 어려울 때 문서용으로만 사용

## 네이밍 매핑

Figma 변수명은 CSS와 JSON에 예측 가능하게 대응되어야 합니다.

| Figma | JSON | CSS |
| --- | --- | --- |
| `primitive/color/brand/navy` | `primitive.color.brandNavy` | `--bw-ink` |
| `semantic/action/primary` | `semantic.action.primary` | `--color-primary` |
| `component/button/primary/bg` | `component.button.tokens.primaryBg` | `--component-button-primary-bg` |
| `component/input/border/focus` | `component.input.tokens.borderColorFocus` | `--component-input-border-color-focus` |
| `component/card/shadow/md` | `component.card.tokens.shadowMd` | `--component-card-shadow-md` |

## 내보내기 방향

권장 흐름:

1. 디자이너가 Figma Variables를 수정합니다.
2. 검토된 플러그인 또는 Figma API 스크립트로 변수를 JSON으로 export합니다.
3. export 결과를 `tokens/source.json` 구조로 정규화합니다.
4. `tokens/*.css`의 런타임 CSS를 갱신합니다.
5. `npm run check`를 실행합니다.

자동 변환이 도입되기 전까지는 `tokens/source.json`을 검토된 구조화 소스로, `styles.css`와 `tokens/*.css`를 런타임 계약으로 봅니다.

## Import 방향

토큰을 Figma로 다시 보낼 때:

1. 생성 CSS가 아니라 `tokens/source.json`에서 시작합니다.
2. Primitive, Semantic, Component 컬렉션의 경계를 유지합니다.
3. light/dark mode를 유지합니다.
4. Figma가 변수 참조를 지원하는 곳에서는 alias를 보존합니다.
5. 공유 Figma Variables를 교체하기 전에 Storybook에서 시각 변경을 검토합니다.

## 리뷰 체크리스트

- 새 색상은 primitive 토큰으로 먼저 추가합니다.
- 제품 역할은 semantic 토큰으로 표현합니다.
- 컴포넌트에만 필요한 값은 component 토큰 아래에 둡니다.
- 컴포넌트 소스에 새 hardcoded hex, rgba, shadow, radius, control height가 들어간다면 대응 토큰이 있어야 합니다.
- Storybook에서 영향받은 토큰 동작을 보여줍니다.
- `npm run check:tokens`가 통과합니다.

## 자동화 백로그

현재 레포는 AI/Figma 워크플로에 필요한 구조를 갖췄지만, full token transform pipeline은 아직 없습니다. 이후 자동화 작업에서 아래를 추가하면 됩니다.

- Figma Variables export 스크립트 또는 문서화된 플러그인 preset
- `tokens/source.json`에서 CSS를 생성하는 변환기
- 생성 CSS와 커밋된 CSS 간 drift 검사
- 리뷰어용 토큰 변경 리포트
