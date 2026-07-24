# Scroll and Accessibility

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Layout |
| Owner | `ScrollArea` |
| Storybook | `LDS Core/Components/Layout/Scroll and Accessibility` |
| Source | `../component-content.json#core-components-layout-scroll-and-accessibility` |

미디어 비율을 고정하거나 제한된 패널 안에 긴 내용을 스크롤하고, 시각적 아이콘에 접근 가능한 이름을 제공할 때 적합합니다. 페이지 전체 스크롤을 중첩하거나 필수 정보를 시각적으로 숨기지 말고, 일반 정렬은 Stack·Center 같은 단일 레이아웃 프리미티브를 사용하세요.

## 사용 판단

### 사용

- 미디어 비율을 고정하거나 제한된 패널 안에 긴 내용을 스크롤하고, 시각적 아이콘에 접근 가능한 이름을 제공할 때 적합합니다. 페이지 전체 스크롤을 중첩하거나 필수 정보를 시각적으로 숨기지 말고, 일반 정렬은 Stack·Center 같은 단일 레이아웃 프리미티브를 사용하세요.
- Scroll and Accessibility가 소유하는 Layout 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.
- 제품별 구현 대신 공개 ScrollArea API와 semantic token으로 일관성을 유지해야 할 때 사용합니다.

### 사용하지 않음

- 조건부(conditional) 방식을 택했습니다. 넘치지 않는 컨테이너까지 탭 순서에 넣으면 아무 동작도 하지 않는 정지점이 늘어 오히려 탐색을 방해하므로, 오버플로를 ResizeObserver로 측정해 넘칠 때만 포커스 대상이 됩니다. 측정 없이 항상 고정하고 싶으면 focusable 를 명시하세요.
- 이름이 없으면 role="region" 을 붙이지 않고(이름 없는 landmark 금지) 개발 모드에서 경고합니다. label 또는 labelledBy 를 주세요.
- - 스크롤 가능한 영역은 마우스 휠·드래그 외에 키보드로도 스크롤할 수 있어야 합니다. ScrollArea는 내용이 실제로 넘칠 때 tabIndex=0 + role="region" + 접근 가능한 이름을 스스로 부여해 ↑ ↓ PageUp PageDown Home End로 조작할 수 있게 합니다. - 조건부(conditional) 방식을 택했습니다. 넘치지 않는 컨테이너까지 탭 순서에 넣으면 아무 동작도 하지 않는 정지점이 늘어 오히려 탐색을 방해하므로, 오버플로를 ResizeObserver로 측정해 넘칠 때만 포커스 대상이 됩니다. 측정 없이 항상 고정하고 싶으면….
- Scroll and Accessibility가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | ScrollArea의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Label | 스크롤 영역의 접근 가능한 이름(aria-label). 실제로 스크롤되는 영역은 키보드 포커스를 받으므로 이름이 반드시 필요합니다. |
| Labelled By | label 대신 화면의 기존 제목을 참조할 때 쓰는 aria-labelledby id. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `ratio` | `number \| string` | No | Width / height ratio. Accepts a number or CSS aspect-ratio string. @default 16 / 9 |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `minHeight` | `number \| string` | No | 세로 공간 확보. |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `maxHeight` | `number \| string` | No | 최대 높이(px 또는 CSS). @default 280 |
| `label` | `string` | No | 스크롤 영역의 접근 가능한 이름(aria-label). 실제로 스크롤되는 영역은 키보드 포커스를 받으므로 이름이 반드시 필요합니다. |
| `labelledBy` | `string` | No | label 대신 화면의 기존 제목을 참조할 때 쓰는 aria-labelledby id. |
| `focusable` | `boolean \| 'auto'` | No | 키보드 포커스 가능 여부. "auto"는 내용이 실제로 넘칠 때만 tabIndex=0 + role="region"을 부여합니다(W3C scrollable-region-focusable). |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `as` | `React.ElementType` | No | 렌더할 요소. @default "span" |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| Default | 별도 상태 머신을 만들지 않으며 전달된 콘텐츠와 semantic token으로 기본 표현을 구성합니다. |

## Behavior and interaction

- focusable — "auto"(기본) · true · false.
- 스크롤 가능한 영역은 마우스 휠·드래그 외에 키보드로도 스크롤할 수 있어야 합니다. ScrollArea는 내용이 실제로 넘칠 때 tabIndex=0 + role="region" + 접근 가능한 이름을 스스로 부여해 ↑ ↓ PageUp PageDown Home End로 조작할 수 있게 합니다.
- 조건부(conditional) 방식을 택했습니다. 넘치지 않는 컨테이너까지 탭 순서에 넣으면 아무 동작도 하지 않는 정지점이 늘어 오히려 탐색을 방해하므로, 오버플로를 ResizeObserver로 측정해 넘칠 때만 포커스 대상이 됩니다. 측정 없이 항상 고정하고 싶으면 focusable 를 명시하세요.
- 내부에 이미 포커스 가능한 요소만 들어 있고 그 요소들로 스크롤이 전부 도달 가능하다면 focusable={false} 로 중복 정지점을 끌 수 있습니다.
- W3C / Deque scrollable-region-focusable — 스크롤 컨테이너는 키보드로 접근 가능해야 합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 스크롤 가능한 영역은 마우스 휠·드래그 외에 키보드로도 스크롤할 수 있어야 합니다. ScrollArea는 내용이 실제로 넘칠 때 tabIndex=0 + role="region" + 접근 가능한 이름을 스스로 부여해 ↑ ↓ PageUp PageDown Home End로 조작할 수 있게 합니다. |
| 명시 규칙 2 | WCAG 2.2 SC 2.1.1 Keyboard |
| 명시 규칙 3 | 키보드 접근 규칙 (WCAG 2.1.1) |
| 명시 규칙 4 | - 스크롤 가능한 영역은 마우스 휠·드래그 외에 키보드로도 스크롤할 수 있어야 합니다. ScrollArea는 내용이 실제로 넘칠 때 tabIndex=0 + role="region" + 접근 가능한 이름을 스스로 부여해 ↑ ↓ PageUp PageDown Home End로 조작할 수 있게 합니다. - 조건부(conditional) 방식을 택했습니다. 넘치지 않는 컨테이너까지 탭 순서에 넣으면 아무 동작도 하지 않는 정지점이 늘어 오히려 탐색을 방해하므로, 오버플로를 ResizeObserver로 측정해 넘칠 때만 포커스 대상이 됩니다. 측정 없이 항상 고정하고 싶으면… |
| --color-semantic-focus-indicator | light: #2F6FB0; dark: #7FB0DE |

## Responsive

- maxHeight — 상한(px/CSS). 알림 목록, 긴 메뉴, 스펙 표를 감싸세요.
- - maxHeight — 상한(px/CSS). 알림 목록, 긴 메뉴, 스펙 표를 감싸세요. - label / labelledBy — 스크롤 영역의 접근 가능한 이름. 내용이 넘칠 수 있는 영역에는 반드시 하나를 주세요. - focusable — "auto"(기본) · true · false.
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- label / labelledBy — 스크롤 영역의 접근 가능한 이름. 내용이 넘칠 수 있는 영역에는 반드시 하나를 주세요.
- 스크롤 가능한 영역은 마우스 휠·드래그 외에 키보드로도 스크롤할 수 있어야 합니다. ScrollArea는 내용이 실제로 넘칠 때 tabIndex=0 + role="region" + 접근 가능한 이름을 스스로 부여해 ↑ ↓ PageUp PageDown Home End로 조작할 수 있게 합니다.
- 이름이 없으면 role="region" 을 붙이지 않고(이름 없는 landmark 금지) 개발 모드에서 경고합니다. label 또는 labelledBy 를 주세요.
- - maxHeight — 상한(px/CSS). 알림 목록, 긴 메뉴, 스펙 표를 감싸세요. - label / labelledBy — 스크롤 영역의 접근 가능한 이름. 내용이 넘칠 수 있는 영역에는 반드시 하나를 주세요. - focusable — "auto"(기본) · true · false.

## Accessibility

- focusable — "auto"(기본) · true · false.
- 스크롤 가능한 영역은 마우스 휠·드래그 외에 키보드로도 스크롤할 수 있어야 합니다. ScrollArea는 내용이 실제로 넘칠 때 tabIndex=0 + role="region" + 접근 가능한 이름을 스스로 부여해 ↑ ↓ PageUp PageDown Home End로 조작할 수 있게 합니다.
- 조건부(conditional) 방식을 택했습니다. 넘치지 않는 컨테이너까지 탭 순서에 넣으면 아무 동작도 하지 않는 정지점이 늘어 오히려 탐색을 방해하므로, 오버플로를 ResizeObserver로 측정해 넘칠 때만 포커스 대상이 됩니다. 측정 없이 항상 고정하고 싶으면 focusable 를 명시하세요.
- 이름이 없으면 role="region" 을 붙이지 않고(이름 없는 landmark 금지) 개발 모드에서 경고합니다. label 또는 labelledBy 를 주세요.
- 내부에 이미 포커스 가능한 요소만 들어 있고 그 요소들로 스크롤이 전부 도달 가능하다면 focusable={false} 로 중복 정지점을 끌 수 있습니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Scroll and Accessibility가 소유하는 Layout 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다. |
| Don't | 조건부(conditional) 방식을 택했습니다. 넘치지 않는 컨테이너까지 탭 순서에 넣으면 아무 동작도 하지 않는 정지점이 늘어 오히려 탐색을 방해하므로, 오버플로를 ResizeObserver로 측정해 넘칠 때만 포커스 대상이 됩니다. 측정 없이 항상 고정하고 싶으면 focusable 를 명시하세요. |
| Do | 제품별 구현 대신 공개 ScrollArea API와 semantic token으로 일관성을 유지해야 할 때 사용합니다. |
| Don't | 이름이 없으면 role="region" 을 붙이지 않고(이름 없는 landmark 금지) 개발 모드에서 경고합니다. label 또는 labelledBy 를 주세요. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 ScrollArea의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `AspectRatio` | 같은 페이지가 소유하는 공개 primitive 또는 조합 요소입니다. |
| `Center` | 같은 페이지가 소유하는 공개 primitive 또는 조합 요소입니다. |
| `VisuallyHidden` | 같은 페이지가 소유하는 공개 primitive 또는 조합 요소입니다. |
| `Stack` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Cluster` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Col` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Columns` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Container` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<ScrollArea maxHeight={320} label="운영 로그">{longList}</ScrollArea>
<ScrollArea maxHeight={320} labelledBy="log-heading">{longList}</ScrollArea>
<ScrollArea maxHeight={320} focusable={false}>{shortList}</ScrollArea>
```

## Tokens and API

### Tokens

- `--color-semantic-focus-indicator`
- `--color-semantic-interaction-inactive`
- `--color-semantic-label-alternative`

### Source contracts

- `components/layout/AspectRatio.jsx`
- `components/layout/AspectRatio.d.ts`
- `components/layout/AspectRatio.prompt.md`
- `components/layout/Center.jsx`
- `components/layout/Center.d.ts`
- `components/layout/Center.prompt.md`
- `components/layout/ScrollArea.jsx`
- `components/layout/ScrollArea.d.ts`
- `components/layout/ScrollArea.prompt.md`
- `components/layout/VisuallyHidden.jsx`
- `components/layout/VisuallyHidden.d.ts`
- `components/layout/VisuallyHidden.prompt.md`
- `stories/LayoutScrollAccess.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- ScrollArea prompt contract: `components/layout/ScrollArea.prompt.md`
- Storybook implementation evidence: `stories/LayoutScrollAccess.stories.jsx`
- [W3C / Deque scrollable-region-focusable](https://dequeuniversity.com/rules/axe/html/4.8/scrollable-region-focusable)
- [WCAG 2.2 SC 2.1.1 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)
