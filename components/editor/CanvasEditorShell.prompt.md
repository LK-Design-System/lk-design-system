**CanvasEditorShell** - Shared frame for canvas-based editors.

The shell owns stable regions only: document header, optional mode tabs, edit-tool rail, optional structural panel, viewport, optional properties panel, and optional passive status. Product workflows own the content and decide which regions exist.

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
  tools={<EditorToolbar items={tools} value={tool} onChange={setTool} />}
  panel={<ObjectProperties selection={selection} />}
>
  <Map2DCanvas>...</Map2DCanvas>
</CanvasEditorShell>
```

- `headerStart` is the leading header region. Use it for back navigation or a real structural-panel toggle, not decorative home/layer icons.
- `toolbar` owns document-scoped commands such as undo, redo, save, import, and export.
- `subheader` owns modes that replace tools, canvas behavior, save behavior, or the properties panel together.
- `tools` owns mutually exclusive edit modes. Viewport-local zoom/orbit controls stay inside the viewport.
- `layers` is only for a real layer/display tree. Do not put task steps or selected-object details there.
- Use a docked `panel` for repeated property editing. Use `panelMode="drawer"` only for lightweight contextual inspection; the drawer animates, becomes inert while closed, and reports Escape through `onPanelOpenChange`.
- Keep selected-object `Apply`, `Delete`, or clear-selection actions with the owning inspector. Keep document save in the header.
- `status` is optional and passive. Do not move undo/redo or save into it.

Original `lk_web_viz` workflow mapping:

- `TaskCreateScreen`: header + left task form/step sequence + right topology/map picker. It does not need a tool rail, layer tree, inspector, or bottom status bar.
- `MapEditScreen`: header commands + `objects`/`pgm` tabs + left tool rail + map canvas + persistent right properties/settings panel.
- `PcdMap3DPanel`: optional split panel inside the map editor's viewport region, not an independent point-cloud workspace.

Storybook state names may describe the state being reviewed. Do not render review labels, storyboard step names, or audit annotations inside the product frame.
