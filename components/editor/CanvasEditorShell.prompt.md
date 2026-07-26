**CanvasEditorShell** - Shared frame for canvas-based editors.

The shell owns stable regions only: document header, optional mode tabs, edit-tool rail, optional structural panel, dominant viewport, optional properties panel, and optional passive status. Product workflows own the content and decide which regions exist.

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

- `headerStart` is the leading header region. Use it for back navigation or a real structural-panel toggle, not decorative home/layer icons.
- `toolbar` owns document-scoped commands such as undo, redo, save, import, and export.
- `subheader` owns modes that replace tools, canvas behavior, save behavior, or the properties panel together.
- `responsiveNavigation` owns narrow-screen region switching only. Do not reuse `subheader` for canvas/layers/properties navigation.
- `tools` owns mutually exclusive edit modes. Viewport-local zoom/orbit controls stay inside the viewport.
- `layers` is only for a real layer/display tree. Do not put task steps or selected-object details there.
- `children` is the dominant center viewport — the canvas or workflow body itself. The shell renders it as a landmark `section` named by `canvasLabel`; it never scrolls the shell, so the canvas owns its own overflow.
- Desktop layer and property panels compose the existing `DockPanel`: they can collapse/restore and, by default, resize by pointer or keyboard. `layersOpen`/`panelOpen` may be controlled; the corresponding `default*Open` props provide uncontrolled defaults. `onLayersOpenChange`/`onPanelOpenChange` fire with `(open, reason)` where `reason` is `'toggle'` for the handle and `'escape'` for the keyboard dismissal — required when controlling, useful for persistence when uncontrolled.
- Panel widths are px numbers: `panelWidth` (default 280, clamped to `panelMinWidth` 240 / `panelMaxWidth` 420) and `layerPanelWidth` (default 236, clamped to `layerPanelMinWidth` 200 / `layerPanelMaxWidth` 360). With `resizablePanels` these are starting widths — the user owns the width afterwards, and `onPanelWidthChange`/`onLayerPanelWidthChange` report each clamped result so products can persist layout. Widen the max bounds only when panel content genuinely needs it; the viewport stays dominant.
- Region landmarks are named by `toolsLabel` (`편집 도구`), `layersLabel` (`레이어`), `canvasLabel` (`편집 캔버스`), `panelLabel` (`속성 패널`), and `statusLabel` (`편집 상태`). The defaults are sensible for generic editors; override them when the product domain has better names (e.g. `지도 캔버스`), not to inject workflow instructions.
- Use a docked `panel` for repeated property editing. Use `panelMode="drawer"` only for lightweight contextual inspection over the viewport. Escape closes a focused panel and returns focus to its restore handle.
- Keep selected-object `Apply`, `Delete`, or clear-selection actions with the owning inspector. Keep document save in the header.
- `status` is optional and passive. Do not move undo/redo or save into it.
- 좁은 화면에서는 `mobileActiveRegion="canvas" | "layers" | "panel"`로 주 영역 하나만 노출합니다. 제품은 `responsiveNavigation`에 LDS Tabs/SegmentedControl을 조합합니다. 기본값은 캔버스입니다.

Research basis (LK Robotics extension, not WDS parity):

- [Figma UI3 navigation](https://help.figma.com/hc/en-us/articles/23954856027159-Navigating-UI3), [Figma Layers panel](https://help.figma.com/hc/en-us/articles/360039831974-View-layers-and-assets-in-the-Layers-Panel), and [Unity interface](https://docs.unity3d.com/kr/530/Manual/LearningtheInterface.html) converge on a dominant center viewport, structural hierarchy at left, and contextual properties at right.
- [Blender regions](https://docs.blender.org/manual/en/4.0/interface/window_system/regions.html) supports keeping high-frequency viewport regions local to the main editor area.
- [WAI-ARIA Window Splitter](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/) informs keyboard-resizable panel boundaries; [Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) informs narrow-screen region navigation.
- Arbitrary docking graphs, saved workspace layouts, detached windows, and domain workflows are intentionally excluded from this DS shell.

Pinned product workflow coverage mapping (not design evidence):

- `TaskCreateScreen`: header + left task form/step sequence + right topology/map picker. It does not need a tool rail, layer tree, inspector, or bottom status bar.
- `MapEditScreen`: header commands + `objects`/`pgm` tabs + left tool rail + map canvas + persistent right properties/settings panel.
- `PcdMap3DPanel`: optional split panel inside the map editor's viewport region, not an independent point-cloud workspace.

Storybook state names may describe the state being reviewed. Do not render review labels, storyboard step names, or audit annotations inside the product frame.
