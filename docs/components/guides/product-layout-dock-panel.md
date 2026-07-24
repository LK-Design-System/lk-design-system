# Dock Panel

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Layout |
| Owner | `DockPanel` |
| Storybook | `LDS Product/Layout/Dock Panel` |
| Source | `../component-content.json#product-layout-dock-panel` |

맵·에디터처럼 지속되는 작업 캔버스 가장자리에 속성이나 레이어 도구를 접어 두고 쓸 때 적합합니다. 일반 페이지의 임시 보조 작업이나 모바일 선택에는 DockPanel 대신 Drawer 또는 Sheet를 사용하세요.

## 사용 판단

### 사용

- 맵·에디터처럼 지속되는 작업 캔버스 가장자리에 속성이나 레이어 도구를 접어 두고 쓸 때 적합합니다. 일반 페이지의 임시 보조 작업이나 모바일 선택에는 DockPanel 대신 Drawer 또는 Sheet를 사용하세요.
- 에디터형 패널은 resizable을 켜고 숫자 width를 사용합니다. resize separator는 role="separator"와 aria-valuenow를 가지며 드래그, ArrowLeft/ArrowRight, Home/End를 지원합니다.
- 아이콘은 Icon registry의 chevron을 사용하고, 선/배경은 semantic token을 따릅니다. raw SVG나 legacy border alias를 새 source of truth로 쓰지 않습니다.
- - side left|right · open/defaultOpen/onOpenChange · title · width · resizable/minWidth/maxWidth/resizeStep/onWidthChange · closeOnEscape · bodyPadding/bodyStyle · footer · children. - Compare against common docked panel expectations before changing it: controlled/uncontrolled open state, persistent collapse handle, si….

### 사용하지 않음

- Dock Panel가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.
- 표현이 비슷하다는 이유만으로 상태 의미가 다른 sibling 컴포넌트를 서로 대체하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | DockPanel의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Title | title 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Body Padding | 본문 padding. @default "var(--space-4)" |
| Body Style | bodyStyle 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Footer | footer 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `side` | `'left' \| 'right'` | No | 공개 타입 계약에 정의된 속성입니다. |
| `open` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `defaultOpen` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onOpenChange` | `(open: boolean) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `title` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `width` | `React.CSSProperties['width']` | No | 패널 너비. 숫자는 px로 처리합니다. @default 300 |
| `minWidth` | `number` | No | 리사이즈 가능한 패널의 최소 너비(px). @default 240 |
| `maxWidth` | `number` | No | 리사이즈 가능한 패널의 최대 너비(px). @default 520 |
| `resizeStep` | `number` | No | 키보드 리사이즈 증감 단위(px). Shift와 함께 누르면 4배로 이동합니다. @default 16 |
| `resizable` | `boolean` | No | 패널 경계에 접근 가능한 resize separator를 표시합니다. 숫자 width일 때 동작합니다. @default false |
| `onWidthChange` | `(width: number) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `closeOnEscape` | `boolean` | No | 열린 패널 내부에서 Escape를 누르면 패널을 접고 handle로 focus를 복귀합니다. @default true |
| `bodyPadding` | `React.CSSProperties['padding']` | No | 본문 padding. @default "var(--space-4)" |
| `bodyStyle` | `React.CSSProperties` | No | 공개 타입 계약에 정의된 속성입니다. |
| `footer` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| open | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| defaultOpen | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| onOpenChange | 공개 타입 계약에 정의된 속성입니다. 타입 계약: (open: boolean) = void |
| 상호작용 · 외부 제어 상태 | interaction 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- side left|right · open/defaultOpen/onOpenChange · title · width · resizable/minWidth/maxWidth/resizeStep/onWidthChange · closeOnEscape · bodyPadding/bodyStyle · footer · children.
- Compare against common docked panel expectations before changing it: controlled/uncontrolled open state, persistent collapse handle, side-aware layout, optional resizable separator, keyboard resize, focus return, hidden collapsed content, and clear distinction from modal/drawer overlays.
- 새 Drawer/Modal이 아니라 캔버스 내부에 붙는 layout pattern입니다. 페이지 전체 탐색, route transition, focus trap이 필요한 오버레이에는 쓰지 않습니다.
- 접힌 상태에서도 handle은 남고, 패널 region은 aria-controls 대상 id를 유지합니다. 접힌 패널은 hidden/inert로 focus tree에서 빠집니다.
- 열린 패널 내부 또는 resize separator에서 Escape를 누르면 패널을 접고 handle로 focus를 복귀합니다(separator는 의 형제라 패널 keydown이 닿지 않으므로 같은 핸들러를 직접 붙입니다). 패널 안에 열려 있던 오버레이가 Escape를 먼저 처리해 defaultPrevented가 되면 패널은 접지 않습니다. closeOnEscape로 이 동작 전체를 끌 수 있습니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-label-neutral | light: rgba(46, 47, 51, 0.88); dark: rgba(194, 196, 200, 0.88) |
| --color-semantic-label-strong | light: #000000; dark: #FFFFFF |
| --color-semantic-line-normal-normal | light: rgba(112, 115, 124, 0.22); dark: rgba(112, 115, 124, 0.32) |

## Responsive

- side left|right · open/defaultOpen/onOpenChange · title · width · resizable/minWidth/maxWidth/resizeStep/onWidthChange · closeOnEscape · bodyPadding/bodyStyle · footer · children.
- 에디터형 패널은 resizable을 켜고 숫자 width를 사용합니다. resize separator는 role="separator"와 aria-valuenow를 가지며 드래그, ArrowLeft/ArrowRight, Home/End를 지원합니다.
- - side left|right · open/defaultOpen/onOpenChange · title · width · resizable/minWidth/maxWidth/resizeStep/onWidthChange · closeOnEscape · bodyPadding/bodyStyle · footer · children. - Compare against common docked panel expectations before changing it: controlled/uncontrolled open state, persistent collapse handle, si….
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.

## Content and writing

- side left|right · open/defaultOpen/onOpenChange · title · width · resizable/minWidth/maxWidth/resizeStep/onWidthChange · closeOnEscape · bodyPadding/bodyStyle · footer · children.
- - side left|right · open/defaultOpen/onOpenChange · title · width · resizable/minWidth/maxWidth/resizeStep/onWidthChange · closeOnEscape · bodyPadding/bodyStyle · footer · children. - Compare against common docked panel expectations before changing it: controlled/uncontrolled open state, persistent collapse handle, si….
- 사용자에게 보이는 Dock Panel 문자열은 제품 번역 계층에서 제공하고 행동 또는 상태를 구체적으로 설명합니다.
- 아이콘이나 색상만으로 의미를 대신하지 않고 필요한 label, title 또는 status text를 함께 제공합니다.

## Accessibility

- Compare against common docked panel expectations before changing it: controlled/uncontrolled open state, persistent collapse handle, side-aware layout, optional resizable separator, keyboard resize, focus return, hidden collapsed content, and clear distinction from modal/drawer overlays.
- 새 Drawer/Modal이 아니라 캔버스 내부에 붙는 layout pattern입니다. 페이지 전체 탐색, route transition, focus trap이 필요한 오버레이에는 쓰지 않습니다.
- 접힌 상태에서도 handle은 남고, 패널 region은 aria-controls 대상 id를 유지합니다. 접힌 패널은 hidden/inert로 focus tree에서 빠집니다.
- 에디터형 패널은 resizable을 켜고 숫자 width를 사용합니다. resize separator는 role="separator"와 aria-valuenow를 가지며 드래그, ArrowLeft/ArrowRight, Home/End를 지원합니다.
- 열린 패널 내부 또는 resize separator에서 Escape를 누르면 패널을 접고 handle로 focus를 복귀합니다(separator는 의 형제라 패널 keydown이 닿지 않으므로 같은 핸들러를 직접 붙입니다). 패널 안에 열려 있던 오버레이가 Escape를 먼저 처리해 defaultPrevented가 되면 패널은 접지 않습니다. closeOnEscape로 이 동작 전체를 끌 수 있습니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | 에디터형 패널은 resizable을 켜고 숫자 width를 사용합니다. resize separator는 role="separator"와 aria-valuenow를 가지며 드래그, ArrowLeft/ArrowRight, Home/End를 지원합니다. |
| Don't | Dock Panel가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다. |
| Do | 아이콘은 Icon registry의 chevron을 사용하고, 선/배경은 semantic token을 따릅니다. raw SVG나 legacy border alias를 새 source of truth로 쓰지 않습니다. |
| Don't | 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 DockPanel의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DescriptionList` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DashboardGrid` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DashboardShell` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `PageHeader` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `PrimaryDetail` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<DockPanel side="right" title="속성" defaultOpen>
  <PropertyField ... />
</DockPanel>
```

## Tokens and API

### Tokens

- `--color-semantic-background-elevated-normal`
- `--color-semantic-label-neutral`
- `--color-semantic-label-strong`
- `--color-semantic-line-normal-normal`
- `--color-semantic-primary-normal`
- `--dur-fast`
- `--dur-normal`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--label1-line`
- `--label1-size`
- `--radius-sm`
- `--shadow-md`
- `--shadow-sm`
- `--space-2`
- `--space-3`
- `--space-4`

### Source contracts

- `components/layout/DockPanel.jsx`
- `components/layout/DockPanel.d.ts`
- `components/layout/DockPanel.prompt.md`
- `stories/LayoutDockPanel.stories.jsx`

## Migration

- 아이콘은 Icon registry의 chevron을 사용하고, 선/배경은 semantic token을 따릅니다. raw SVG나 legacy border alias를 새 source of truth로 쓰지 않습니다.
- - side left|right · open/defaultOpen/onOpenChange · title · width · resizable/minWidth/maxWidth/resizeStep/onWidthChange · closeOnEscape · bodyPadding/bodyStyle · footer · children. - Compare against common docked panel expectations before changing it: controlled/uncontrolled open state, persistent collapse handle, si….
- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- DockPanel prompt contract: `components/layout/DockPanel.prompt.md`
- Storybook implementation evidence: `stories/LayoutDockPanel.stories.jsx`
