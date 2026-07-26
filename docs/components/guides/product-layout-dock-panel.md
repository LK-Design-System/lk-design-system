# Dock Panel

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Layout |
| Owner | `DockPanel` |
| Storybook | `LDS Product/Layout/Dock Panel` |
| Source | `../component-content.json#product-layout-dock-panel` |

맵·에디터처럼 지속되는 작업 캔버스 가장자리에 속성이나 레이어 도구를 접어 두고 쓸 때 적합합니다. 일반 페이지의 임시 보조 작업이나 모바일 선택에는 DockPanel 대신 Drawer 또는 Sheet를 사용하세요.

## Anatomy

| Part | Contract |
| --- | --- |
| bodyPadding | 본문 padding. @default "var(--space-4)" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `side` | `'left' \| 'right'` | No |  |
| `open` | `boolean` | No |  |
| `defaultOpen` | `boolean` | No |  |
| `onOpenChange` | `(open: boolean) = void` | No |  |
| `title` | `React.ReactNode` | No |  |
| `width` | `React.CSSProperties['width']` | No | 패널 너비. 숫자는 px로 처리합니다. @default 300 |
| `minWidth` | `number` | No | 리사이즈 가능한 패널의 최소 너비(px). @default 240 |
| `maxWidth` | `number` | No | 리사이즈 가능한 패널의 최대 너비(px). @default 520 |
| `resizeStep` | `number` | No | 키보드 리사이즈 증감 단위(px). Shift와 함께 누르면 4배로 이동합니다. @default 16 |
| `resizable` | `boolean` | No | 패널 경계에 접근 가능한 resize separator를 표시합니다. 숫자 width일 때 동작합니다. @default false |
| `onWidthChange` | `(width: number) = void` | No |  |
| `closeOnEscape` | `boolean` | No | 열린 패널 내부에서 Escape를 누르면 패널을 접고 handle로 focus를 복귀합니다. @default true |
| `bodyPadding` | `React.CSSProperties['padding']` | No | 본문 padding. @default "var(--space-4)" |
| `bodyStyle` | `React.CSSProperties` | No |  |
| `footer` | `React.ReactNode` | No |  |
| `children` | `React.ReactNode` | No |  |

## Behavior and interaction

- DockPanel — 캔버스 위에서 돌출 핸들로 접고 펼치는 사이드 도킹 패널. 맵, 에디터, 로봇 뷰어 위의 속성/레이어/상태 패널에 씁니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-label-neutral | light: rgba(46, 47, 51, 0.88); dark: rgba(194, 196, 200, 0.88) |
| --color-semantic-label-strong | light: #000000; dark: #FFFFFF |
| --color-semantic-line-normal-normal | light: rgba(112, 115, 124, 0.22); dark: rgba(112, 115, 124, 0.32) |

## Responsive

- side left|right · open/defaultOpen/onOpenChange · title · width · resizable/minWidth/maxWidth/resizeStep/onWidthChange · closeOnEscape · bodyPadding/bodyStyle · footer · children.

## Accessibility

- Compare against common docked panel expectations before changing it: controlled/uncontrolled open state, persistent collapse handle, side-aware layout, optional resizable separator, keyboard resize, focus return, hidden collapsed content, and clear distinction from modal/drawer overlays.
- 새 Drawer/Modal이 아니라 캔버스 내부에 붙는 layout pattern입니다. 페이지 전체 탐색, route transition, focus trap이 필요한 오버레이에는 쓰지 않습니다.
- 접힌 상태에서도 handle은 남고, 패널 region은 aria-controls 대상 id를 유지합니다. 접힌 패널은 hidden/inert로 focus tree에서 빠집니다.
- 에디터형 패널은 resizable을 켜고 숫자 width를 사용합니다. resize separator는 role="separator"와 aria-valuenow를 가지며 드래그, ArrowLeft/ArrowRight, Home/End를 지원합니다.
- 열린 패널 내부 또는 resize separator에서 Escape를 누르면 패널을 접고 handle로 focus를 복귀합니다(separator는 의 형제라 패널 keydown이 닿지 않으므로 같은 핸들러를 직접 붙입니다). 패널 안에 열려 있던 오버레이가 Escape를 먼저 처리해 defaultPrevented가 되면 패널은 접지 않습니다. closeOnEscape로 이 동작 전체를 끌 수 있습니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ActionArea` | 대표 시나리오에서 조합 |
| `Button` | 대표 시나리오에서 조합 |
| `DescriptionList` | 대표 시나리오에서 조합 |
| `DashboardGrid` | 대표 시나리오에서 조합 |
| `DashboardShell` | 대표 시나리오에서 조합 |
| `PageHeader` | 대표 시나리오에서 조합 |
| `PrimaryDetail` | 대표 시나리오에서 조합 |

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

## Sources

- DockPanel prompt contract: `components/layout/DockPanel.prompt.md`
- Storybook implementation evidence: `stories/LayoutDockPanel.stories.jsx`
