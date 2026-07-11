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
- `size="sm"` uses the 32px LDS `IconButton`; `size="md"` uses 40px.
- This component owns edit history only. View reset belongs in a viewport-local viewer toolbar.

## Research basis

- [WAI-ARIA APG: Toolbar Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/) supplies the named-toolbar and roving-focus keyboard contract.
- [Figma: Navigating UI3](https://help.figma.com/hc/en-us/articles/23954856027159-Navigating-UI3) supports keeping global edit history in the stable editor chrome while contextual view and selection controls remain local.

This is an **LK Robotics Extension**. Application-specific history timelines, branching histories, autosave, and conflict recovery stay outside the LDS component contract.
