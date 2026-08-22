**HistoryToolbar** - Undo, redo, and optional document-reset controls for editors.

```jsx
<HistoryToolbar
  canUndo={undoStack.length > 0}
  canRedo={redoStack.length > 0}
  onUndo={undo}
  onRedo={redo}
  onReset={resetDocumentChanges}
  size="sm"
/>
```

- `canUndo`/`canRedo` express history state, while a real handler guarantees operability. A missing handler always disables the corresponding command.
- Reset is rendered only when `onReset` is a function and is separated from reversible undo/redo commands.
- Arrow keys, Home, and End move the single roving tab stop. Set `undoKeyShortcuts`/`redoKeyShortcuts` only when the owning editor really implements those shortcuts globally; the values are then exposed through `aria-keyshortcuts`.
- Dynamic availability, focus memory, and Arrow/Home/End behavior use the same private roving-focus engine as `EditorToolbar`, `ViewerToolbar`, and `CanvasEditorCommandBar`; do not reimplement index-based focus state in individual toolbars. If the last available command becomes unavailable while focus is inside, focus moves to the toolbar fallback; when a command returns, it moves to the preferred command again.
- Consumer `onKeyDown` and `onFocusCapture` handlers are composed before the internal roving behavior. Calling `preventDefault()` intentionally cancels the internal key/focus update without replacing the handler itself.
- `size="sm"` uses the 32px LDS `IconButton`; `size="md"` uses 40px.
- `label` (default `편집 이력`) is the toolbar's accessible name; screen-reader users identify the group by it, so override it only with a name that still means edit history. The individual command names (`실행 취소`, `다시 실행`, `변경사항 초기화`) are fixed.
- This component owns edit history only. View reset belongs in a viewport-local viewer toolbar.

## Research basis

- [WAI-ARIA APG: Toolbar Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/) supplies the named-toolbar and roving-focus keyboard contract.
- [Adobe Spectrum Action Group](https://spectrum.adobe.com/page/action-group/) supports one density and directional focus grammar for a related action group while preserving disabled commands for layout continuity.
- [Figma: Navigating UI3](https://help.figma.com/hc/en-us/articles/23954856027159-Navigating-UI3) supports keeping global edit history in the stable editor chrome while contextual view and selection controls remain local.

Owner: **LDS Product / Workspace**. Its WDS provenance is `product-extension`. Application-specific history timelines, branching histories, autosave, and conflict recovery stay outside the LDS component contract.
