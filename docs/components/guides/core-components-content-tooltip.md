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

- 아이콘이나 축약된 control의 의미를 hover와 focus에서 간결하게 보충할 때 적합합니다. 계속 보여야 하는 주석이나 여러 문장의 상호작용 콘텐츠에는 Tooltip 대신 Bubble 또는 Popover를 사용하세요.
- 콘텐츠는 짧은 보조 설명으로 제한하고, 지속되는 주석에는 Bubble, 서식·동작이 있는 본문에는 Popover를 사용합니다. focusable한 단일 trigger가 ARIA prop을 DOM에 전달해야 합니다.
- - 콘텐츠는 짧은 보조 설명으로 제한하고, 지속되는 주석에는 Bubble, 서식·동작이 있는 본문에는 Popover를 사용합니다. focusable한 단일 trigger가 ARIA prop을 DOM에 전달해야 합니다. - WDS axes size, position, arrow align, shortcut은 유지합니다. Medium은 WDS r8·padX12· padY8·inverse surface·fs14를 그대로 쓰며 Popover/Menu의 밝은 surface와 합치지 않습니다. - hover와 focus가 같은 Tooltip을 열고 aria-describedb….
- Tooltip가 소유하는 Content 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.

### 사용하지 않음

- delay — 포인터 hover 에는 enter 지연(기본 { open: 250, close: 0 } ms)이 걸립니다. 다른 대상으로 지나가는 커서가 툴팁을 깜빡이게 하지 않기 위한 Fluent 2 / Material 관례입니다. 숫자는 enter 지연으로, 객체는 { open, close } 로 해석합니다. 키보드 focus 는 의도된 조작이므로 지연 없이 즉시 열립니다(APG). Escape 와 blur 도 예약된 타이머를 취소하고 즉시 닫습니다.
- - 콘텐츠는 짧은 보조 설명으로 제한하고, 지속되는 주석에는 Bubble, 서식·동작이 있는 본문에는 Popover를 사용합니다. focusable한 단일 trigger가 ARIA prop을 DOM에 전달해야 합니다. - WDS axes size, position, arrow align, shortcut은 유지합니다. Medium은 WDS r8·padX12· padY8·inverse surface·fs14를 그대로 쓰며 Popover/Menu의 밝은 surface와 합치지 않습니다. - hover와 focus가 같은 Tooltip을 열고 aria-describedb….
- Tooltip가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Tooltip의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Content | content 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `content` | `React.ReactNode` | Yes | 공개 타입 계약에 정의된 속성입니다. |
| `position` | `"top" \| "bottom" \| "left" \| "right"` | No | position axis. @default "top" |
| `placement` | `"top" \| "bottom" \| "left" \| "right"` | No | Backward-compatible alias for position. |
| `size` | `"small" \| "sm" \| "medium" \| "md"` | No | size axis. @default "medium" |
| `align` | `"leading" \| "center" \| "trailing" \| "left" \| "right" \| "top" \| "bottom"` | No | arrow alignment axis. @default "center" |
| `shortcut` | `React.ReactNode` | No | shortcut axis. |
| `arrow` | `boolean` | No | Show arrow. @default true |
| `delay` | `number \| { open?: number; close?: number }` | No | 포인터 hover 로 열고 닫을 때의 지연(ms). 숫자를 주면 enter 지연으로, 객체를 주면 { open, close } 로 적용합니다. 키보드 focus 는 항상 즉시 열립니다(APG). |
| `open` | `boolean` | No | 제어된 열림 상태. |
| `defaultOpen` | `boolean` | No | 비제어 초기 열림 상태. @default false |
| `onOpenChange` | `(open: boolean) = void` | No | 열림 상태 변경 알림. |
| `children` | `React.ReactNode` | Yes | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| delay | 포인터 hover 로 열고 닫을 때의 지연(ms). 숫자를 주면 enter 지연으로, 객체를 주면 { open, close } 로 적용합니다. 키보드 focus 는 항상 즉시 열립니다(APG). 타입 계약: number \| { open?: number; close?: number } |
| open | 제어된 열림 상태. 타입 계약: boolean |
| defaultOpen | 비제어 초기 열림 상태. @default false 타입 계약: boolean |
| onOpenChange | 열림 상태 변경 알림. 타입 계약: (open: boolean) = void |
| 상호작용 · 초점·Escape·협폭 배치 | interaction 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 상호작용 · 트리거 연결과 표시 지연 | interaction 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- 콘텐츠는 짧은 보조 설명으로 제한하고, 지속되는 주석에는 Bubble, 서식·동작이 있는 본문에는 Popover를 사용합니다. focusable한 단일 trigger가 ARIA prop을 DOM에 전달해야 합니다.
- hover와 focus가 같은 Tooltip을 열고 aria-describedby로 연결합니다. 포인터를 Tooltip 위로 옮겨도 유지되며, Escape는 trigger focus를 보존한 채 닫습니다. open · defaultOpen · onOpenChange로 상태를 제어할 수 있습니다.
- 긴 번역 문자열은 20rem/viewport 안에서 줄바꿈하고, 화면 경계에서는 placement를 flip·clamp합니다. Tooltip 콘텐츠에는 focusable 요소를 넣지 않습니다.
- delay — 포인터 hover 에는 enter 지연(기본 { open: 250, close: 0 } ms)이 걸립니다. 다른 대상으로 지나가는 커서가 툴팁을 깜빡이게 하지 않기 위한 Fluent 2 / Material 관례입니다. 숫자는 enter 지연으로, 객체는 { open, close } 로 해석합니다. 키보드 focus 는 의도된 조작이므로 지연 없이 즉시 열립니다(APG). Escape 와 blur 도 예약된 타이머를 취소하고 즉시 닫습니다.
- trigger 는 반드시 포커스 가능한 요소여야 합니다. children 이 유효한 element 가 아니면 (문자열·Fragment) 래퍼 span 은 탭 순서에 들어가지 않습니다 — 비대화형 콘텐츠를 자동으로 tabIndex=0 으로 만들면 키보드 탐색에 의미 없는 정지점이 생기고 APG 의 trigger 규칙에도 어긋납니다. 필요하면 IconButton·Button 같은 실제 control 로 감싸거나, 직접 tabIndex 를 넘겨 명시적으로 선택하세요.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 긴 번역 문자열은 20rem/viewport 안에서 줄바꿈하고, 화면 경계에서는 placement를 flip·clamp합니다. Tooltip 콘텐츠에는 focusable 요소를 넣지 않습니다. |
| 명시 규칙 2 | delay — 포인터 hover 에는 enter 지연(기본 { open: 250, close: 0 } ms)이 걸립니다. 다른 대상으로 지나가는 커서가 툴팁을 깜빡이게 하지 않기 위한 Fluent 2 / Material 관례입니다. 숫자는 enter 지연으로, 객체는 { open, close } 로 해석합니다. 키보드 focus 는 의도된 조작이므로 지연 없이 즉시 열립니다(APG). Escape 와 blur 도 예약된 타이머를 취소하고 즉시 닫습니다. |
| 명시 규칙 3 | trigger 는 반드시 포커스 가능한 요소여야 합니다. children 이 유효한 element 가 아니면 (문자열·Fragment) 래퍼 span 은 탭 순서에 들어가지 않습니다 — 비대화형 콘텐츠를 자동으로 tabIndex=0 으로 만들면 키보드 탐색에 의미 없는 정지점이 생기고 APG 의 trigger 규칙에도 어긋납니다. 필요하면 IconButton·Button 같은 실제 control 로 감싸거나, 직접 tabIndex 를 넘겨 명시적으로 선택하세요. |
| 명시 규칙 4 | WCAG 2.2 SC 1.4.13은 hover/focus 콘텐츠의 dismissible·hoverable·persistent 조건을 요구합니다. |
| --color-semantic-inverse-background | light: #1B1C1E; dark: #FFFFFF |

## Responsive

- 긴 번역 문자열은 20rem/viewport 안에서 줄바꿈하고, 화면 경계에서는 placement를 flip·clamp합니다. Tooltip 콘텐츠에는 focusable 요소를 넣지 않습니다.
- - 콘텐츠는 짧은 보조 설명으로 제한하고, 지속되는 주석에는 Bubble, 서식·동작이 있는 본문에는 Popover를 사용합니다. focusable한 단일 trigger가 ARIA prop을 DOM에 전달해야 합니다. - WDS axes size, position, arrow align, shortcut은 유지합니다. Medium은 WDS r8·padX12· padY8·inverse surface·fs14를 그대로 쓰며 Popover/Menu의 밝은 surface와 합치지 않습니다. - hover와 focus가 같은 Tooltip을 열고 aria-describedb….
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- 콘텐츠는 짧은 보조 설명으로 제한하고, 지속되는 주석에는 Bubble, 서식·동작이 있는 본문에는 Popover를 사용합니다. focusable한 단일 trigger가 ARIA prop을 DOM에 전달해야 합니다.
- Fluent 2 Tooltip과 React Spectrum Tooltip은 hover/focus 동등성, 짧은 비필수 문구, focusable trigger, target을 가리키는 배치를 공통으로 권고합니다.
- - 콘텐츠는 짧은 보조 설명으로 제한하고, 지속되는 주석에는 Bubble, 서식·동작이 있는 본문에는 Popover를 사용합니다. focusable한 단일 trigger가 ARIA prop을 DOM에 전달해야 합니다. - WDS axes size, position, arrow align, shortcut은 유지합니다. Medium은 WDS r8·padX12· padY8·inverse surface·fs14를 그대로 쓰며 Popover/Menu의 밝은 surface와 합치지 않습니다. - hover와 focus가 같은 Tooltip을 열고 aria-describedb….
- - WAI-ARIA APG Tooltip Pattern은 role="tooltip", trigger aria-describedby, focus 유지, Escape dismiss를 정의합니다. - WCAG 2.2 SC 1.4.13은 hover/focus 콘텐츠의 dismissible·hoverable·persistent 조건을 요구합니다. - Fluent 2 Tooltip과 React Spectrum Tooltip은 hover/focus 동등성, 짧은 비필수 문구, focusable trigger, target을 가리키는 배치를 공통으로 권고합니다.

## Accessibility

- 콘텐츠는 짧은 보조 설명으로 제한하고, 지속되는 주석에는 Bubble, 서식·동작이 있는 본문에는 Popover를 사용합니다. focusable한 단일 trigger가 ARIA prop을 DOM에 전달해야 합니다.
- hover와 focus가 같은 Tooltip을 열고 aria-describedby로 연결합니다. 포인터를 Tooltip 위로 옮겨도 유지되며, Escape는 trigger focus를 보존한 채 닫습니다. open · defaultOpen · onOpenChange로 상태를 제어할 수 있습니다.
- 긴 번역 문자열은 20rem/viewport 안에서 줄바꿈하고, 화면 경계에서는 placement를 flip·clamp합니다. Tooltip 콘텐츠에는 focusable 요소를 넣지 않습니다.
- delay — 포인터 hover 에는 enter 지연(기본 { open: 250, close: 0 } ms)이 걸립니다. 다른 대상으로 지나가는 커서가 툴팁을 깜빡이게 하지 않기 위한 Fluent 2 / Material 관례입니다. 숫자는 enter 지연으로, 객체는 { open, close } 로 해석합니다. 키보드 focus 는 의도된 조작이므로 지연 없이 즉시 열립니다(APG). Escape 와 blur 도 예약된 타이머를 취소하고 즉시 닫습니다.
- trigger 는 반드시 포커스 가능한 요소여야 합니다. children 이 유효한 element 가 아니면 (문자열·Fragment) 래퍼 span 은 탭 순서에 들어가지 않습니다 — 비대화형 콘텐츠를 자동으로 tabIndex=0 으로 만들면 키보드 탐색에 의미 없는 정지점이 생기고 APG 의 trigger 규칙에도 어긋납니다. 필요하면 IconButton·Button 같은 실제 control 로 감싸거나, 직접 tabIndex 를 넘겨 명시적으로 선택하세요.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | 콘텐츠는 짧은 보조 설명으로 제한하고, 지속되는 주석에는 Bubble, 서식·동작이 있는 본문에는 Popover를 사용합니다. focusable한 단일 trigger가 ARIA prop을 DOM에 전달해야 합니다. |
| Don't | delay — 포인터 hover 에는 enter 지연(기본 { open: 250, close: 0 } ms)이 걸립니다. 다른 대상으로 지나가는 커서가 툴팁을 깜빡이게 하지 않기 위한 Fluent 2 / Material 관례입니다. 숫자는 enter 지연으로, 객체는 { open, close } 로 해석합니다. 키보드 focus 는 의도된 조작이므로 지연 없이 즉시 열립니다(APG). Escape 와 blur 도 예약된 타이머를 취소하고 즉시 닫습니다. |
| Do | - 콘텐츠는 짧은 보조 설명으로 제한하고, 지속되는 주석에는 Bubble, 서식·동작이 있는 본문에는 Popover를 사용합니다. focusable한 단일 trigger가 ARIA prop을 DOM에 전달해야 합니다. - WDS axes size, position, arrow align, shortcut은 유지합니다. Medium은 WDS r8·padX12· padY8·inverse surface·fs14를 그대로 쓰며 Popover/Menu의 밝은 surface와 합치지 않습니다. - hover와 focus가 같은 Tooltip을 열고 aria-describedb…. |
| Don't | - 콘텐츠는 짧은 보조 설명으로 제한하고, 지속되는 주석에는 Bubble, 서식·동작이 있는 본문에는 Popover를 사용합니다. focusable한 단일 trigger가 ARIA prop을 DOM에 전달해야 합니다. - WDS axes size, position, arrow align, shortcut은 유지합니다. Medium은 WDS r8·padX12· padY8·inverse surface·fs14를 그대로 쓰며 Popover/Menu의 밝은 surface와 합치지 않습니다. - hover와 focus가 같은 Tooltip을 열고 aria-describedb…. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Tooltip의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Icon` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `IconButton` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Accordion` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Blockquote` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Code` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Collapsible` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ContentBadge` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Kbd` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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
- `--shadow-md`
- `--space-8`

### Source contracts

- `components/content/Tooltip.jsx`
- `components/content/Tooltip.d.ts`
- `components/content/Tooltip.prompt.md`
- `stories/ContentTooltip.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Tooltip prompt contract: `components/content/Tooltip.prompt.md`
- Storybook implementation evidence: `stories/ContentTooltip.stories.jsx`
- [WAI-ARIA APG Tooltip Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)
- [WCAG 2.2 SC 1.4.13](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)
- [Fluent 2 Tooltip](https://fluent2.microsoft.design/components/web/react/core/tooltip/usage)
- [React Spectrum Tooltip](https://react-spectrum.adobe.com/Tooltip)
