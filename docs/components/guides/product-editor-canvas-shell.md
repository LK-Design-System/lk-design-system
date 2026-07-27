# Canvas Shell

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Editor |
| Owner | `CanvasEditorShell` |
| Storybook | `LDS Product/Editor/Canvas Shell` |
| Source | `../component-content.json#product-editor-canvas-shell` |

계층·도구·뷰포트·속성 패널이 함께 작동하는 공간 편집 화면을 구성할 때 적합합니다. 단일 캔버스나 읽기 전용 뷰어에는 전체 셸 대신 필요한 Viewer 또는 개별 패널만 사용하세요.

## 사용 판단

### 사용

- headerStart is the leading header region. Use it for back navigation or a real structural-panel toggle, not decorative home/layer icons.
- CanvasEditorShell - Shared frame for canvas-based editors.

### 사용하지 않음

- layers is only for a real layer/display tree. Do not put task steps or selected-object details there.
- status is optional and passive. Do not move undo/redo or save into it.

## Anatomy

| Part | Contract |
| --- | --- |
| title | 문서/워크스페이스 제목. |
| description | 제목 아래의 짧은 상태 또는 문서 메타데이터. |
| headerStart | 제목 앞의 뒤로가기 또는 프레임 구조 제어. |
| toolbar | 헤더 오른쪽의 문서 단위 명령. |
| subheader | 헤더 아래에서 전체 편집 모드를 바꾸는 탭/필터. |
| responsiveNavigation | 좁은 화면에서 canvas/layers/panel 사이를 전환하는 전용 탐색. 편집 모드용 subheader와 구분합니다. |
| children | 중앙 캔버스 또는 워크플로우 본문. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `title` | `React.ReactNode` | No | 문서/워크스페이스 제목. |
| `description` | `React.ReactNode` | No | 제목 아래의 짧은 상태 또는 문서 메타데이터. |
| `headerStart` | `React.ReactNode` | No | 제목 앞의 뒤로가기 또는 프레임 구조 제어. |
| `toolbar` | `React.ReactNode` | No | 헤더 오른쪽의 문서 단위 명령. |
| `subheader` | `React.ReactNode` | No | 헤더 아래에서 전체 편집 모드를 바꾸는 탭/필터. |
| `responsiveNavigation` | `React.ReactNode` | No | 좁은 화면에서 canvas/layers/panel 사이를 전환하는 전용 탐색. 편집 모드용 subheader와 구분합니다. |
| `tools` | `React.ReactNode` | No | 좌측 편집 도구 레일. |
| `layers` | `React.ReactNode` | No | 실제 레이어/디스플레이 구조가 있을 때만 쓰는 좌측 패널. |
| `children` | `React.ReactNode` | No | 중앙 캔버스 또는 워크플로우 본문. |
| `panel` | `React.ReactNode` | No | 우측 속성/설정 패널. |
| `panelMode` | `'docked' \| 'drawer'` | No | drawer는 중앙 영역 위에 겹치며 열고 닫을 때 전환됩니다. @default 'docked' |
| `panelOpen` | `boolean` | No | 우측 패널 표시 여부. 생략하면 내부 상태를 사용합니다. |
| `defaultPanelOpen` | `boolean` | No | 비제어 우측 패널 초기 표시 여부. @default true |
| `onPanelOpenChange` | `(open: boolean, reason: 'toggle' \| 'escape') = void` | No | 패널 handle 또는 Escape로 표시 상태가 바뀔 때 호출됩니다. |
| `layersOpen` | `boolean` | No | 좌측 레이어 패널 표시 여부. 생략하면 내부 상태를 사용합니다. |
| `defaultLayersOpen` | `boolean` | No | 비제어 레이어 패널 초기 표시 여부. @default true |
| `onLayersOpenChange` | `(open: boolean, reason: 'toggle' \| 'escape') = void` | No | 레이어 패널 handle 또는 Escape로 표시 상태가 바뀔 때 호출됩니다. |
| `status` | `React.ReactNode` | No | 선택적인 하단 수동 상태 표시줄. |
| `panelWidth` | `number` | No | 우측 패널 폭(px). @default 280 |
| `panelMinWidth` | `number` | No | 우측 패널 최소 폭(px). @default 240 |
| `panelMaxWidth` | `number` | No | 우측 패널 최대 폭(px). @default 420 |
| `onPanelWidthChange` | `(width: number) = void` | No |  |
| `layerPanelWidth` | `number` | No | 좌측 레이어 패널 폭(px). @default 236 |
| `layerPanelMinWidth` | `number` | No | 좌측 레이어 패널 최소 폭(px). @default 200 |

## States

| State | Contract |
| --- | --- |
| panelOpen | 우측 패널 표시 여부. 생략하면 내부 상태를 사용합니다. |
| defaultPanelOpen | 비제어 우측 패널 초기 표시 여부. @default true |
| onPanelOpenChange | 패널 handle 또는 Escape로 표시 상태가 바뀔 때 호출됩니다. |
| layersOpen | 좌측 레이어 패널 표시 여부. 생략하면 내부 상태를 사용합니다. |
| defaultLayersOpen | 비제어 레이어 패널 초기 표시 여부. @default true |
| onLayersOpenChange | 레이어 패널 handle 또는 Escape로 표시 상태가 바뀔 때 호출됩니다. |
| status | 선택적인 하단 수동 상태 표시줄. |
| mobileActiveRegion | 좁은 화면에서 한 번에 표시할 주 작업 영역. drawer 패널은 기존 overlay 동작을 유지합니다. @default 'canvas' |

## Behavior and interaction

- Keep selected-object Apply, Delete, or clear-selection actions with the owning inspector. Keep document save in the header.
- Arbitrary docking graphs, saved workspace layouts, detached windows, and domain workflows are intentionally excluded from this DS shell.
- MapEditScreen: header commands + objects/pgm tabs + left tool rail + map canvas + persistent right properties/settings panel.
- PcdMap3DPanel: optional split panel inside the map editor's viewport region, not an independent point-cloud workspace.
- The shell owns stable regions only: document header, optional mode tabs, edit-tool rail, optional structural panel, dominant viewport, optional properties panel, and optional passive status. Product workflows own the content and decide which regions exist.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | Panel widths are px numbers: panelWidth (default 280, clamped to panelMinWidth 240 / panelMaxWidth 420) and layerPanelWidth (default 236, clamped to layerPanelMinWidth 200 / layerPanelMaxWidth 360). |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-background-normal-alternative | light: #F7F7F8; dark: #0F0F10 |

## Responsive

- responsiveNavigation owns narrow-screen region switching only. Do not reuse subheader for canvas/layers/properties navigation.
- tools owns mutually exclusive edit modes. Viewport-local zoom/orbit controls stay inside the viewport.
- children is the dominant center viewport — the canvas or workflow body itself. The shell renders it as a landmark section named by canvasLabel; it never scrolls the shell, so the canvas owns its own overflow.
- 좁은 화면에서는 mobileActiveRegion="canvas" | "layers" | "panel"로 주 영역 하나만 노출합니다. 제품은 responsiveNavigation에 LDS Tabs/SegmentedControl을 조합합니다. 기본값은 캔버스입니다.

## Content and writing

- Region landmarks are named by toolsLabel (편집 도구), layersLabel (레이어), canvasLabel (편집 캔버스), panelLabel (속성 패널), and statusLabel (편집 상태). The defaults are sensible for generic editors; override them when the product domain has better names (e.g. 지도 캔버스), not to inject workflow instructions.
- Storybook state names may describe the state being reviewed. Do not render review labels, storyboard step names, or audit annotations inside the product frame.

## Accessibility

- Desktop layer and property panels compose the existing DockPanel: they can collapse/restore and, by default, resize by pointer or keyboard. layersOpen/panelOpen may be controlled; the corresponding defaultOpen props provide uncontrolled defaults.
- Use a docked panel for repeated property editing. Use panelMode="drawer" only for lightweight contextual inspection over the viewport. Escape closes a focused panel and returns focus to its restore handle.
- WAI-ARIA Window Splitter informs keyboard-resizable panel boundaries; Tabs informs narrow-screen region navigation.

## Related components

| Component | Relationship |
| --- | --- |
| `CanvasEditorCommandBar` | 대표 시나리오에서 조합 |
| `EditorToolbar` | 대표 시나리오에서 조합 |
| `HistoryToolbar` | 대표 시나리오에서 조합 |
| `LayerPanel` | 대표 시나리오에서 조합 |
| `SelectionInspector` | 대표 시나리오에서 조합 |
| `ViewportStatusBar` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<CanvasEditorShell
  title="floor_1.pgm"
  description="3 zones · 2 lines · 4 landmarks"
  headerStart={<BackButton />}
  toolbar={
    <CanvasEditorCommandBar canUndo={canUndo} canRedo={canRedo} onUndo={undo} onRedo={redo}>
      <Button size="sm" disabled={!dirty}>오브젝트 저장</Button>
    </CanvasEditorCommandBar>
  }
  subheader={<Tabs items={modes} value={mode} onChange={setMode} size="small" />}
  responsiveNavigation={<Tabs items={regions} value={region} onChange={setRegion} size="small" />}
  tools={<EditorToolbar items={tools} value={tool} onChange={setTool} />}
  layers={<LayerPanel layers={layers} activeLayerId={layerId} />}
  panel={<ObjectProperties selection={selection} />}
  defaultLayersOpen
  defaultPanelOpen
  resizablePanels
>
  <Map2DCanvas>...</Map2DCanvas>
</CanvasEditorShell>
```

## Tokens and API

### Tokens

- `--caption1-line`
- `--caption1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-background-normal-alternative`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-label-strong`
- `--color-semantic-line-normal-normal`
- `--font-sans`
- `--fw-bold`
- `--fw-medium`
- `--headline2-line`
- `--headline2-size`
- `--radius-lg`
- `--space-1`
- `--space-2`
- `--space-3`
- `--space-4`

### Source contracts

- `components/editor/CanvasEditorShell.jsx`
- `components/editor/CanvasEditorShell.d.ts`
- `components/editor/CanvasEditorShell.prompt.md`
- `stories/EditorShell.stories.jsx`

## Sources

- CanvasEditorShell prompt contract: `components/editor/CanvasEditorShell.prompt.md`
- Storybook implementation evidence: `stories/EditorShell.stories.jsx`
- [Figma UI3 navigation](https://help.figma.com/hc/en-us/articles/23954856027159-Navigating-UI3)
- [Figma Layers panel](https://help.figma.com/hc/en-us/articles/360039831974-View-layers-and-assets-in-the-Layers-Panel)
- [Unity interface](https://docs.unity3d.com/kr/530/Manual/LearningtheInterface.html)
- [Blender regions](https://docs.blender.org/manual/en/4.0/interface/window_system/regions.html)
- [WAI-ARIA Window Splitter](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/)
- [Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
