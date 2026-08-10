# Tooltip

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Content |
| Owner | `Tooltip` |
| Storybook | `LDS Core/Components/Content/Tooltip` |
| Source | `../component-content.json#core-components-content-tooltip` |

아이콘이나 축약된 control의 의미를 hover와 focus에서 간결하게 보충할 때 적합합니다. 계속 보여야 하는 주석이나 여러 문장의 상호작용 콘텐츠에는 Tooltip 대신 Bubble 또는 Popover를 사용하세요.

## 사용 판단

### 사용

- 가까운 sibling인 Bubble은 지속형 callout이라 더 큰 padding/radius를 사용하고, Popover는 상호작용 본문을 담는 밝은 panel이라 Tooltip 형상에 합치지 않습니다. Tooltip은 기존 r8, padX12/padY8, inverse fill, shadow-md 계층을 그대로 유지합니다.

### 사용하지 않음

- Floating UI arrow middleware는 최종 placement/shift 이후 포인터의 한 축 좌표를 계산하고, 둥근 모서리와 충돌하지 않도록 padding을 두도록 안내합니다. FloatingArrow troubleshooting는 별도 화살표와 본체 사이의 틈이 브라우저 줌·OS 환경에서 발생할 수 있음을 명시합니다. LDS는 좌표·corner clamp 원칙은 따르되, 불투명 단색 surface를 단일 path로 합쳐 이음새 자체를 제거합니다.
- 제품 workflow 검토: LK Web Viz, LK Control Full Daedeok, LK Portal 모두 not applicable. 이번 변경은 Tooltip의 내부 배경 geometry만 보정하며, 제품 route·데이터·상태·action·공개 API나 조합 seam을 바꾸지 않으므로 제품 frontend 지원 여부를 새로 주장하지 않습니다.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `content` | `React.ReactNode` | Yes |  |
| `position` | `"top" \| "bottom" \| "left" \| "right"` | No | position axis. @default "top" |
| `placement` | `"top" \| "bottom" \| "left" \| "right"` | No |  |
| `size` | `"small" \| "sm" \| "medium" \| "md"` | No | size axis. @default "medium" |
| `align` | `"leading" \| "center" \| "trailing" \| "left" \| "right" \| "top" \| "bottom"` | No | arrow alignment axis. @default "center" |
| `shortcut` | `React.ReactNode` | No | shortcut axis. |
| `arrow` | `boolean` | No | Show arrow. @default true |
| `delay` | `number \| { open?: number; close?: number }` | No | 포인터 hover 로 열고 닫을 때의 지연(ms). 숫자를 주면 enter 지연으로, 객체를 주면 { open, close } 로 적용합니다. 키보드 focus 는 항상 즉시 열립니다(APG). |
| `open` | `boolean` | No | 제어된 열림 상태. |
| `defaultOpen` | `boolean` | No | 비제어 초기 열림 상태. @default false |
| `onOpenChange` | `(open: boolean) = void` | No | 열림 상태 변경 알림. |
| `children` | `React.ReactNode` | Yes |  |
| `withinPortal` | `boolean` | No | Escape clipping ancestors through the owner-document Portal. @default true |
| `portalTarget` | `HTMLElement \| null` | No |  |
| `zIndex` | `number` | No |  |
| `classNames` | `LdsClassNames` | No |  |
| `styles` | `LdsStyles` | No |  |
| `vars` | `LdsVars` | No |  |

## States

| State | Contract |
| --- | --- |
| delay | 포인터 hover 로 열고 닫을 때의 지연(ms). 숫자를 주면 enter 지연으로, 객체를 주면 { open, close } 로 적용합니다. 키보드 focus 는 항상 즉시 열립니다(APG). |
| open | 제어된 열림 상태. |
| defaultOpen | 비제어 초기 열림 상태. @default false |
| onOpenChange | 열림 상태 변경 알림. |

## Behavior and interaction

- Tooltip - WDS hover/focus hint with arrow and optional shortcut.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 긴 번역 문자열은 20rem/viewport 안에서 줄바꿈하고, 화면 경계에서는 placement를 flip·clamp합니다. Tooltip 콘텐츠에는 focusable 요소를 넣지 않습니다. |
| 명시 규칙 2 | delay — 포인터 hover 에는 enter 지연(기본 { open: 250, close: 0 } ms)이 걸립니다. 다른 대상으로 지나가는 커서가 툴팁을 깜빡이게 하지 않기 위한 Fluent 2 / Material 관례입니다. 숫자는 enter 지연으로, 객체는 { open, close } 로 해석합니다. 키보드 focus 는 의도된 조작이므로 지연 없이 즉시 열립니다(APG). Escape 와 blur 도 예약된 타이머를 취소하고 즉시 닫습니다. |
| 명시 규칙 3 | trigger 는 반드시 포커스 가능한 요소여야 합니다. children 이 유효한 element 가 아니면 (문자열·Fragment) 래퍼 span 은 탭 순서에 들어가지 않습니다 — 비대화형 콘텐츠를 자동으로 tabIndex=0 으로 만들면 키보드 탐색에 의미 없는 정지점이 생기고 APG 의 trigger 규칙에도 어긋납니다. 필요하면 IconButton·Button 같은 실제 control 로 감싸거나, 직접 tabIndex 를 넘겨 명시적으로 선택하세요. |
| 명시 규칙 4 | WCAG 2.2 SC 1.4.13은 hover/focus 콘텐츠의 dismissible·hoverable·persistent 조건을 요구합니다. |
| --color-semantic-inverse-background | light: #1B1C1E; dark: #FFFFFF |

## Responsive

- ref, className, and style target the trigger wrapper. Stable parts are root, bubble, surface, content, and shortcut; geometry is limited to --lds-tooltip-padding and --lds-tooltip-max-width.
- The bubble defaults to the common owner-document Portal, inherits the nearest explicit theme and dir, flips/clamps at viewport edges, and is removed from the DOM while closed. placement is deprecated; use position.
- 둥근 본체와 포인터는 하나의 SVG path로 그립니다. 별도 clip-path 삼각형을 본체에 1px 겹치는 방식은 브라우저 줌·DPR·fractional transform에서 이음새가 드러나므로 사용하지 않습니다. Medium 포인터는 12×6px, Small은 10×5px로 유지해 36px 안팎의 Tooltip 높이와 비례시킵니다.

## Accessibility

- 콘텐츠는 짧은 보조 설명으로 제한하고, 지속되는 주석에는 Bubble, 서식·동작이 있는 본문에는 Popover를 사용합니다. focusable한 단일 trigger가 ARIA prop을 DOM에 전달해야 합니다.
- hover와 focus가 같은 Tooltip을 열고 aria-describedby로 연결합니다. 포인터를 Tooltip 위로 옮겨도 유지되며, Escape는 trigger focus를 보존한 채 닫습니다. open · defaultOpen · onOpenChange로 상태를 제어할 수 있습니다.
- Tooltip remains non-interactive and pointer-transparent. Consumers provide a focusable trigger when keyboard users need the description; LDS owns aria-describedby, delay, Escape, and positioning.
- WAI-ARIA APG Tooltip Pattern은 role="tooltip", trigger aria-describedby, focus 유지, Escape dismiss를 정의합니다.
- Fluent 2 Tooltip과 React Spectrum Tooltip은 hover/focus 동등성, 짧은 비필수 문구, focusable trigger, target을 가리키는 배치를 공통으로 권고합니다.

## Exceptions

- Fluent 2의 “포인터는 target을 가리켜야 한다”는 원칙을 유지합니다. 다만 edge align에서 target 중심과 둥근 모서리 회피를 동시에 만족할 수 없으면, 포인터가 분리되지 않도록 flat edge 안에서 target 방향으로 가장 가까운 위치에 clamp합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `Icon` | 대표 시나리오에서 조합 |
| `IconButton` | 대표 시나리오에서 조합 |
| `Accordion` | 대표 시나리오에서 조합 |
| `Blockquote` | 대표 시나리오에서 조합 |
| `Code` | 대표 시나리오에서 조합 |
| `Collapsible` | 대표 시나리오에서 조합 |
| `ContentBadge` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Tooltip content="More info" position="top"><IconButton label="Info">...</IconButton></Tooltip>
<Tooltip content="Save" shortcut="⌘S" size="small" position="right" />
```

## Tokens and API

### Tokens

- `--color-semantic-inverse-background`
- `--color-semantic-inverse-label`
- `--color-semantic-inverse-label-alternative-soft`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--fw-semibold`
- `--label1-line`
- `--label1-size`
- `--lds-tooltip-max-width`
- `--lds-tooltip-padding`
- `--shadow-md`
- `--space-8`

### Source contracts

- `components/content/Tooltip.jsx`
- `components/content/Tooltip.d.ts`
- `components/content/Tooltip.prompt.md`
- `stories/ContentTooltip.stories.jsx`

## Sources

- Tooltip prompt contract: `components/content/Tooltip.prompt.md`
- Storybook implementation evidence: `stories/ContentTooltip.stories.jsx`
- [WAI-ARIA APG Tooltip Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)
- [WCAG 2.2 SC 1.4.13](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)
- [Fluent 2 Tooltip](https://fluent2.microsoft.design/components/web/react/core/tooltip/usage)
- [React Spectrum Tooltip](https://react-spectrum.adobe.com/Tooltip)
- [Floating UI arrow middleware](https://floating-ui.com/docs/arrow)
- [FloatingArrow troubleshooting](https://floating-ui.com/docs/floatingarrow)
