# Token governance

토큰은 Figma, Storybook, React 컴포넌트, 정적 HTML 미리보기, AI 작업 지시가 함께 참조하는 source of truth입니다. `tokens/source.json`은 사람이 읽는 문서가 아니라 변경 가능한 제품 계약으로 취급합니다.

## Token layers

| Layer | 역할 | 제품 코드 사용 |
| --- | --- | --- |
| Primitive | 브랜드 원값, scale, raw effect 값 | 직접 사용 금지. semantic/component 토큰 정의에만 사용 |
| Semantic | surface, text, border, action, status 같은 의미 | 일반 제품 UI에서 우선 사용 |
| Component | Button, Input, Card 같은 구현 계약 | 컴포넌트 내부에서 우선 사용 |
| Runtime CSS | 실제 앱 import 산출물 | `styles.css` 또는 필요한 CSS entry |

## Lifecycle

| 상태 | 의미 | 허용 작업 |
| --- | --- | --- |
| proposed | 실험 또는 후보 토큰 | Storybook prototype에서만 사용 |
| active | 제품 사용 가능 | public component와 template에서 사용 |
| deprecated | 대체 토큰이 있는 이전 이름 | migration guide와 함께 1 minor 이상 유지 |
| removed | 런타임에서 제거 | major 또는 명시된 breaking release에서만 제거 |

## Naming rules

- Primitive token은 값의 정체성을 말한다. 예: `primitive.color.signalSteelAzure`.
- Semantic token은 UI 의도를 말한다. 예: `semantic.action.primary`.
- Component token은 컴포넌트와 슬롯을 말한다. 예: `component.button.tokens.primaryBg`.
- 이름은 시각값보다 역할을 우선한다. `blue500`보다 `action.primary`를 선호한다.
- density나 theme 차이는 같은 의미 토큰의 mode로 표현한다.

## Figma sync contract

Figma 변수와 code token은 같은 계층을 유지해야 합니다.

1. Figma에서 primitive, semantic, component collection을 분리한다.
2. semantic/component token은 primitive alias를 참조한다.
3. Figma export는 `tokens/source.json`에 반영한다.
4. CSS runtime은 `tokens/source.json`에서 생성되거나 수동 변경 시 같은 commit에 근거를 남긴다.
5. token change PR은 affected component list를 포함한다.

## Change impact levels

| Level | 예시 | 요구 사항 |
| --- | --- | --- |
| Patch | description, alias metadata 수정 | token check 통과 |
| Minor | 새 semantic/component token 추가 | Storybook 사용 예시 추가 |
| Minor with migration | token deprecation | 대체 토큰과 migration note |
| Major | active token 제거, 의미 변경 | migration guide와 visual diff |

## Release gate

- `pnpm run check:tokens`가 통과해야 한다.
- component token 변경은 관련 Storybook story를 확인한다.
- color/status token 변경은 light/dark 또는 surface contrast를 검토한다.
- removed token은 deprecation 기간과 migration 문서를 가진다.
- `docs/FIGMA_TOKEN_WORKFLOW.md`와 이 문서가 충돌하면 이 governance 문서를 우선하고 workflow 문서를 갱신한다.

