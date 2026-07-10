**CanvasEditorCommandBar** - Shared top command bar for `CanvasEditorShell`.

Use it in the `toolbar` slot to keep editor history and optional right-side viewer commands in one stable place.

```jsx
<CanvasEditorShell
  title="Map editor"
  toolbar={
    <CanvasEditorCommandBar
      canUndo={undo.length > 0}
      canRedo={redo.length > 0}
      onUndo={undo}
      onRedo={redo}
      onReset={resetChanges}
    />
  }
>
  ...
</CanvasEditorShell>
```

- Do not render decorative viewer icons. `viewActions` without `onClick` or `disabled` are ignored.
- Use `CanvasEditorShell.headerStart` for left-side frame toggles such as `LayerPanel` open/closed.
- Use `viewActions` sparingly for real right-side viewport commands. The action must reflect toggled state with `active` when applicable.
- `viewActions` render with the same 34px command button chrome as undo/redo/reset so the top-right cluster stays visually aligned.
- Keep undo, redo, and reset in the command bar instead of scattering them in the canvas, status bar, or inspector.
- Use `children` only for extra top-level commands such as save/import/export; selection-specific actions belong in `SelectionInspector`.
- `viewActions.active` is a pressed/toggled state and is exposed with `aria-pressed`.
