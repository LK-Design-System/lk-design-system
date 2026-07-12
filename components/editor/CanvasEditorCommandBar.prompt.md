**CanvasEditorCommandBar** - Stable document-level command group for `CanvasEditorShell`.

Use it in the shell `toolbar` slot for history and document-lifecycle commands. Zoom, fit, camera, orbit, and other view controls stay in a viewport-local toolbar.

```jsx
<CanvasEditorCommandBar
  canUndo={undoStack.length > 0}
  canRedo={redoStack.length > 0}
  onUndo={undo}
  onRedo={redo}
  documentActions={[
    { value: 'export', label: '내보내기', icon: 'export', onClick: exportDocument },
  ]}
>
  <Button size="sm" onClick={saveDocument}>저장</Button>
</CanvasEditorCommandBar>
```

- The visual order is history → document actions → custom document work. Semantic separators divide those groups.
- A history command is enabled only when both its `can*` state and handler permit it. A document action without a handler is ignored unless it is explicitly supplied as a disabled state.
- Named action groups use toolbar semantics and Arrow/Home/End roving focus. Add `ariaKeyShortcuts` to document actions, or `undoKeyShortcuts`/`redoKeyShortcuts` to history, only when the product implements those shortcuts.
- Every built-in action group shares the same private focus engine as the editor and viewer toolbars so dynamic disabled/removed actions cannot create multiple Tab stops or lose the remembered command.
- `size="sm"` uses the 32px LDS `IconButton`; `size="md"` uses 40px.
- `viewActions`/`viewLabel` are deprecated compatibility props. They still render to avoid a breaking release, but new and migrated consumers place those actions beside the viewport.
- Selection-specific actions belong in `SelectionInspector`; destructive application workflows do not belong in this design-system primitive.

## Research basis

- [Figma: Navigating UI3](https://help.figma.com/hc/en-us/articles/23954856027159-Navigating-UI3) separates stable interface regions from contextual canvas and selection controls. LDS adapts that hierarchy by keeping document/history work in the shell header and view manipulation near the viewport.
- [WAI-ARIA APG: Toolbar Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/) defines a named toolbar, horizontal orientation, and Arrow/Home/End navigation. The built-in action groups follow that keyboard model.
- [Apple HIG: Toolbars](https://developer.apple.com/design/human-interface-guidelines/toolbars) informed the leading history/document grouping and keeping viewport actions in their own contextual region.
- [Adobe Spectrum Action Group](https://spectrum.adobe.com/page/action-group/) informed consistent small-control density and logical grouping without inventing command-specific chrome.

This is an **LK Robotics Extension**, not a WDS parity claim. Arbitrary docking, application menus, collaboration presence, and file-workflow state remain product responsibilities.
