# Scroll and Accessibility

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Layout |
| Owner | `ScrollArea` |
| Storybook | `LDS Core/Components/Layout/Scroll and Accessibility` |
| Source | `../component-content.json#core-components-layout-scroll-and-accessibility` |

기본 스크롤바는 OS·브라우저 설정을 존중합니다. 공간이 좁은 메뉴와 패널만 compact를 선택하고, 스크롤바가 나타나도 내용 폭이 흔들리지 않도록 기본 gutter를 확보합니다. 실제로 넘치는 영역은 키보드로 도달할 수 있어야 합니다.

## 사용 판단

### 사용

- 강제 색상 모드에서는 사용자 에이전트의 스크롤바 색상과 폭으로 돌아갑니다.

## Anatomy

| Part | Contract |
| --- | --- |
| label | 스크롤 영역의 접근 가능한 이름(aria-label). 실제로 스크롤되는 영역은 키보드 포커스를 받으므로 이름이 반드시 필요합니다. |
| labelledBy | label 대신 화면의 기존 제목을 참조할 때 쓰는 aria-labelledby id. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `ratio` | `number \| string` | No | Width / height ratio. Accepts a number or CSS aspect-ratio string. @default 16 / 9 |
| `children` | `React.ReactNode` | No |  |
| `minHeight` | `number \| string` | No | 세로 공간 확보. |
| `children` | `React.ReactNode` | No |  |
| `maxHeight` | `number \| string` | No | 최대 높이(px 또는 CSS). @default 280 |
| `label` | `string` | No | 스크롤 영역의 접근 가능한 이름(aria-label). 실제로 스크롤되는 영역은 키보드 포커스를 받으므로 이름이 반드시 필요합니다. |
| `labelledBy` | `string` | No | label 대신 화면의 기존 제목을 참조할 때 쓰는 aria-labelledby id. |
| `focusable` | `boolean \| 'auto'` | No | 키보드 포커스 가능 여부. "auto"는 내용이 실제로 넘칠 때만 tabIndex=0 + role="region"을 부여합니다(W3C scrollable-region-focusable). |
| `scrollbar` | `'auto' \| 'compact'` | No | 스크롤바 표현. "auto"는 OS/브라우저 설정을 보존하고, "compact"는 공간이 제한된 메뉴·패널에서만 표준 thin 스크롤바를 사용합니다. |
| `gutter` | `'stable' \| 'auto'` | No | 스크롤바가 나타날 자리를 미리 확보할지 여부. |
| `children` | `React.ReactNode` | No |  |
| `as` | `React.ElementType` | No | 렌더할 요소. @default "span" |
| `children` | `React.ReactNode` | No |  |

## Behavior and interaction

- gutter — "stable"(기본) · "auto". 기본값은 스크롤바 출현에 따른 내용 폭 변화를 줄입니다.
- Deque scrollable-region-focusable — 스크롤 컨테이너의 키보드 도달성 검사.
- ScrollArea — 브라우저의 네이티브 스크롤 동작에 LDS의 공간·포커스 정책을 더하는 컨테이너.
- 키보드 접근 규칙 (WCAG 2.1.1).

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 실제로 넘치는 영역은 tabIndex=0과 접근 가능한 이름을 가진 region으로 노출되어 ↑ ↓ PageUp PageDown Home End로 조작할 수 있습니다. |
| 명시 규칙 2 | CSS Scrollbars Styling Module Level 1 — 네이티브 스크롤바의 표준화된 색상·폭 속성과 사용자 설정 존중. |
| 명시 규칙 3 | CSS Color Adjustment Level 1 — 강제 색상 모드의 사용자 색상 우선. |
| 명시 규칙 4 | WCAG 2.2 SC 2.1.1 Keyboard — 포인터 없이도 기능을 사용할 수 있어야 함. |

## Responsive

- maxHeight — 상한(px/CSS). 알림 목록, 긴 메뉴, 스펙 표를 감싸세요.
- scrollbar — "auto"(기본) · "compact". 기본값은 OS·브라우저·사용자 설정을 바꾸지 않습니다. compact는 메뉴처럼 공간이 제한된 표면에서만 표준 scrollbar-width: thin을 선택합니다.

## Content and writing

- label / labelledBy — 스크롤 영역의 접근 가능한 이름. 내용이 넘칠 수 있는 영역에는 반드시 하나를 주세요.

## Accessibility

- focusable — "auto"(기본) · true · false.
- 스크롤바를 DOM 요소로 다시 만들지 않습니다. 휠, 트랙패드, 터치, 키보드, 고대비 모드 등 브라우저의 네이티브 동작을 유지합니다.
- 로컬 WDS에는 ScrollArea component-set이 없고 Scroll Bar 장식 인스턴스만 확인됩니다. 따라서 이 컴포넌트는 LDS Core / WDS-adjacent 접근성 계약이며 WDS 직접 패리티로 주장하지 않습니다.
- 넘치지 않는 컨테이너까지 탭 순서에 넣지 않도록 ResizeObserver로 오버플로를 측정합니다. 측정 없이 고정하려면 focusable을 명시하세요.
- 이름이 없으면 role="region"을 붙이지 않고 개발 모드에서 경고합니다.

## Exceptions

- 스크롤바를 숨기는 옵션은 공용 API로 제공하지 않습니다. 숨김은 대체 위치 단서와 이동 수단이 있는 특수 패턴에서만 코드 예외로 관리합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `AspectRatio` | 같은 페이지가 소유 |
| `Center` | 같은 페이지가 소유 |
| `VisuallyHidden` | 같은 페이지가 소유 |
| `Stack` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<ScrollArea maxHeight={320} label="운영 로그">{longList}</ScrollArea>
<ScrollArea maxHeight={240} label="장비 메뉴" scrollbar="compact">{menu}</ScrollArea>
<ScrollArea maxHeight={320} labelledBy="log-heading" gutter="auto">{longList}</ScrollArea>
```

## Tokens and API

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

## Sources

- ScrollArea prompt contract: `components/layout/ScrollArea.prompt.md`
- Storybook implementation evidence: `stories/LayoutScrollAccess.stories.jsx`
- [CSS Scrollbars Styling Module Level 1](https://www.w3.org/TR/css-scrollbars-1/)
- [CSS Color Adjustment Level 1](https://www.w3.org/TR/css-color-adjust-1/#forced-colors-properties)
- [WCAG 2.2 SC 2.1.1 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)
- [Deque scrollable-region-focusable](https://dequeuniversity.com/rules/axe/html/4.8/scrollable-region-focusable)
